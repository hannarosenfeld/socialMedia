import { useEffect, useState, useRef } from 'react';
import { TextField, Button, Container, Paper, List, ListItem, ListItemText, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addMessage, listenForMessages, fetchRoomUsers } from '../../services/roomService';
import { enterRoomAction, leaveRoomAction } from '../../store/room.js';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

const ChatContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  height: '100vh', // Set to full viewport height
  width: '100%',
}));

const MessagesSection = styled(Box)({
  flex: 3,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto', // Allow scrolling for messages
});

const MessageList = styled(List)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1), // Adjust padding for compactness
  overflowY: 'auto',
}));

const MessageInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
  borderTop: '1px solid #ccc',
}));

const MessageInput = styled(TextField)(({ theme }) => ({
  flex: 1,
  marginRight: theme.spacing(1),
  fontSize: '0.875rem', // Smaller text for mobile
}));

const UsersSection = styled(Box)(({ theme }) => ({
  flex: 1,
  borderLeft: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  overflowY: 'auto', // Allow scrolling for active users
  justifyContent: 'space-between', // Add spacing between items
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
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudioURL = async () => {
      const storage = getStorage(); // Initialize Firebase Storage
      const soundRef = ref(storage, 'gs://relay--social.appspot.com/message-13716.mp3'); // Reference to your file

      try {
        // Get the download URL for the audio file
        const url = await getDownloadURL(soundRef);
        audioRef.current = new Audio(url); // Set the URL for the audio element
        audioRef.current.load(); // Preload the sound
      } catch (error) {
        console.error("Error fetching audio URL:", error);
      }
    };

    fetchAudioURL();
  }, []); // Empty array ensures this only runs once on component mount

  useEffect(() => {
    dispatch(enterRoomAction(roomName, sessionUser));
  }, [roomName, dispatch, sessionUser]);

  useEffect(() => {
    let unsubscribeMessages = null;

    const fetchData = async () => {
      if (currentRoom && currentRoom.id) {
        try {
          const users = await fetchRoomUsers(currentRoom.id);
          if (users) setActiveUsers(users);

          unsubscribeMessages = listenForMessages(currentRoom.id, (newMessages) => {
            setMessages((prevMessages) => {
              // Check if the length of messages has increased
              if (prevMessages.length < newMessages.length && audioRef.current) {
                audioRef.current.play().catch(error => {
                  console.error("Audio playback failed:", error);
                }); // Play sound on new message
              }
              return newMessages; // Update messages state
            });
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

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
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
        
        // Play sound when sending a message
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.error("Audio playback failed:", error);
          });
        }
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
                        <span style={{ color: message?.sender?.color || "black", fontSize: '0.75rem' }}>
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
                autoComplete="off"
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                InputProps={{
                  style: { fontSize: '0.875rem' }, // Adjust input font size for mobile
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                style={{ fontSize: '0.875rem' }} // Adjust button font size for mobile
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
