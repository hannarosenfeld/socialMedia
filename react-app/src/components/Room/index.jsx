import { useEffect, useState, useRef } from 'react';
import {
  TextField,
  Button,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addMessage,
  listenForMessages,
  fetchRoomUsers,
} from '../../services/roomService';
import { enterRoomAction, leaveRoomAction } from '../../store/room.js';

const ChatContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  height: '90vh',
  width: '100%',
}));

const MessagesSection = styled(Box)({
  flex: 3,
  display: 'flex',
  flexDirection: 'column',
});

const MessageList = styled(List)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

const MessageInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: '1px solid #ccc',
}));

const MessageInput = styled(TextField)(({ theme }) => ({
  flex: 1,
  marginRight: theme.spacing(2),
}));

const UsersSection = styled(Box)(({ theme }) => ({
  flex: 1,
  borderLeft: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

export default function Room() {
  const dispatch = useDispatch();
  const { roomName } = useParams();
  const history = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const sessionUser = useSelector((state) => state.session.user);
  const [loading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const currentRoom = useSelector((state) => state.room.currentRoom);

  useEffect(() => {
    try {
      dispatch(enterRoomAction(roomName, sessionUser));
    } catch (error) {
      console.log(error);
    }
  }, [roomName, dispatch, sessionUser]);

  useEffect(() => {
    let unsubscribeMessages = null;
  
    const fetchData = async () => {
      if (currentRoom && currentRoom.id) {
        try {
          const users = await fetchRoomUsers(currentRoom.id);
          if (users) setActiveUsers(users);
  
          unsubscribeMessages = listenForMessages(currentRoom.id, (newMessages) => {
            setMessages(newMessages);
  
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          });
  
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching users or setting up messages:", error);
        }
      }
    };
  
    fetchData();
  
    return () => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, [currentRoom, sessionUser]);

  const handleSendMessage = async () => {
    console.log("🐱 in handle send message")
    if (input.trim() && currentRoom && !loading) {
      const message = {
        content: input,
        sender: {
          uid: sessionUser.uid,
          username: sessionUser.username,
          color: sessionUser.color,
        },
        timestamp: new Date().toISOString(),
      };

      try {
        await addMessage(currentRoom.id, message);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleLeaveRoom = () => {
    dispatch(leaveRoomAction(currentRoom.id, sessionUser.uid));
    history('/');
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      {activeUsers.length > 0 && (
        <ChatContainer>
          <MessagesSection>
            <MessageList>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={message?.content}
                    secondary={
                      <span>
                        <span style={{ color: message?.sender?.color || "black" }}>
                          {message?.sender?.username}
                        </span>
                        {' - '}
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    }
                  />
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </MessageList>
            <MessageInputContainer>
              <MessageInput
                label="Type your message..."
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </MessageInputContainer>
          </MessagesSection>

          <UsersSection className='flex-col justify-between'>
            <div className="flex-col">
            <Typography variant="h6">Active Users</Typography>
            <List>
              {activeUsers.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
            </List>
            </div>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLeaveRoom}
            >
              Leave Room
            </Button>
          </UsersSection>
        </ChatContainer>
      )}
    </Container>
  );
}
