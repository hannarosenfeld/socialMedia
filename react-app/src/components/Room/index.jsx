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
import { useParams } from 'react-router-dom';
import {
  listenForUserUpdates,
  fetchRoomByName,
  removeUserFromRoom,
  addMessage,
  listenForMessages,
} from '../../services/roomService';
import { enterRoomThunk, leaveRoomThunk } from '../../store/room.js';
import { getRoomUserData } from '../../services/userService';

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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const sessionUser = useSelector((state) => state.session.user);
  const [loading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const roomIdRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentRoom = useSelector((state) => state.room.currentRoom);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // New state for first load

  // Listen for user updates
  useEffect(() => {
    if (currentRoom && currentRoom.id) {
      const unsubscribeUserUpdates = listenForUserUpdates(currentRoom.id, (updatedUsers) => {
        console.log("Updated users:", updatedUsers); // Check if this is triggered correctly
        setActiveUsers(updatedUsers);
      });
    
      return () => {
        unsubscribeUserUpdates();
      };
    }
  }, [currentRoom]);

  // Fetch room data
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const fetchedRoom = await fetchRoomByName(roomName.split('-').join(' '));
        roomIdRef.current = fetchedRoom.id;

        await dispatch(enterRoomThunk(fetchedRoom, sessionUser));

        const unsubscribeMessages = listenForMessages(fetchedRoom.id, (newMessages) => {
          setMessages(newMessages);
          // Scroll down on the first load
          if (isFirstLoad && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            setIsFirstLoad(false); // Set first load to false after scrolling
          }
        });

        return () => {
          unsubscribeMessages();
        };
      } catch (err) {
        console.error('Error fetching room: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();

    return () => {
      if (roomIdRef.current) {
        dispatch(leaveRoomThunk({ roomId: roomIdRef.current, userId: sessionUser.uid }));
      }
    };
  }, [dispatch, roomName, sessionUser, isFirstLoad]); // Add isFirstLoad to dependencies

  // Fetch active users when currentRoom changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentRoom && currentRoom.users.length) {
        console.log("🐳 we are fetching the users", currentRoom.users);
        const usersDataPromises = currentRoom.users.map(async (user) => {
          const userData = await getRoomUserData(user);
          console.log("🦓", { user, userData });
          return { user, ...userData };
        });

        const usersData = await Promise.all(usersDataPromises);
        setActiveUsers(usersData);
      }
    };

    fetchUserData();
  }, [currentRoom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isFirstLoad && messagesEndRef.current) { // Skip scrolling on first load
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isFirstLoad]);

  // Send message handler
  const handleSendMessage = async () => {
    if (input.trim() && roomIdRef.current) {
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
        await addMessage(roomIdRef.current, message);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
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

          <UsersSection>
            <Typography variant="h6">Active Users</Typography>
            <List>
              {activeUsers.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
            </List>
          </UsersSection>
        </ChatContainer>
      )}
    </Container>
  );
}
