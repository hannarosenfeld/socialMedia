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
  const [room, setRoom] = useState(null);
  const roomIdRef = useRef(null); // Create a ref for the room ID
  const messagesEndRef = useRef(null); // Ref for the last message
  const currentRoom = useSelector((state) => state.room.currentRoom);

  // Effect to fetch room data and set listeners
  useEffect(() => {
    const unsubscribeUserListener = listenForUserUpdates(sessionUser.uid, (updatedUser) => {
      setActiveUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === updatedUser.uid ? updatedUser : user
        )
      );
    });

    const fetchRoomData = async () => {
      try {
        const fetchedRoom = await fetchRoomByName(roomName.split('-').join(' '));
        setRoom(fetchedRoom);
        roomIdRef.current = fetchedRoom.id;

        // Enter room via thunk
        await dispatch(enterRoomThunk(fetchedRoom.id, sessionUser));

        // Listen for new messages
        const unsubscribeMessages = listenForMessages(fetchedRoom.id, (newMessages) => {
          setMessages(newMessages);
        });

        return () => {
          unsubscribeMessages(); // Clean up message listener on unmount
        };
      } catch (err) {
        console.error('Error fetching room: ', err);
      } finally {
        setIsLoading(false); // Stop loading once room data is fetched
      }
    };

    fetchRoomData();

    // Cleanup on component unmount
    return () => {
      unsubscribeUserListener(); // Clean up user listener
      if (sessionUser?.uid && roomIdRef.current) {
        removeUserFromRoom(roomIdRef.current, sessionUser)
          .then(() => {
            dispatch(leaveRoomThunk({ roomId: roomIdRef.current, userId: sessionUser.uid }));
          })
          .catch((err) => {
            console.error('Error removing user from room: ', err);
          });
      }
    };
  }, [dispatch, roomName, sessionUser]);

  // Effect to set active users when `currentRoom` changes
  useEffect(() => {
    if (currentRoom && Object.values(currentRoom.users).length) {
      const userArray = Object.values(currentRoom?.users);
      setActiveUsers(userArray);
    }
  }, [currentRoom]);

  // Effect to scroll to the bottom when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
        setInput(''); // Clear the input field after sending
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
            {/* Dummy div to track the end of messages */}
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
              {activeUsers?.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user.username || 'Loading...'} />
                </ListItem>
              ))}
            </List>
          </UsersSection>
        </ChatContainer>
      )}
    </Container>
  );
}
