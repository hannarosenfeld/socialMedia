import { useEffect, useState, useRef } from 'react';
import { TextField, Button, Container, Paper, List, ListItem, ListItemText, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addMessage, listenForMessages, fetchRoomUsers } from '../../services/roomService';
import { enterRoomAction, leaveRoomAction } from '../../store/room.js';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery for responsive design

const ChatContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  height: '91vh', // Set to full viewport height
  width: '100%',
}));

const MessagesSection = styled(Box)({
  flex: 0.7, // Adjust to take 70% of the space
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
  flex: 0.15, // Takes 15% of the width
  borderLeft: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  overflowY: 'auto',
  justifyContent: 'space-between',
}));

const LeftTabSection = styled(Box)(({ theme }) => ({
  flex: 0.15, // Same size as UsersSection
  borderRight: '1px solid #ccc', // Border on the right for symmetry
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  overflowY: 'auto',
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

  const isMobile = useMediaQuery('(max-width: 768px)'); // Detect if the screen width is less than 768px (mobile)

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
          {/* Left Tab Section - Only show on larger screens */}
          {!isMobile && (
            <LeftTabSection>
              <Typography variant="h6" gutterBottom>
                Chatrooms
              </Typography>
              {/* Add content here */}
              <List>
                <ListItem>
                  <ListItemText primary=".... coming soon!! 👩🏻‍🔧" />
                </ListItem>
              </List>
            </LeftTabSection>
          )}

          {/* Messages Section */}
          <MessagesSection>
            <MessageList>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <span className="text-sm md:text-base"> {/* Smaller text for mobile */}
                        {message?.content}
                      </span>
                    }
                    secondary={
                      <span className="text-xs md:text-sm"> {/* Smaller text for mobile */}
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
                label={<span className="text-sm md:text-sm">Type your message...</span>} // Adjust label size
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
                className="text-sm md:text-base" // Adjust button font size for mobile
              >
                Send
              </Button>
            </MessageInputContainer>
          </MessagesSection>
  
          {/* Users Section */}
          <UsersSection>
            <div className="flex-col">
              <List>
                {activeUsers.map((user, index) => (
                  <ListItem key={index}>
                      <ListItemText primary={user.username} style={{ color: user.color }} />
                  </ListItem>
                ))}
              </List>
            </div>
            <Button variant="contained" color="secondary" onClick={handleLeaveRoom}>
              Leave Room
            </Button>
          </UsersSection>
        </ChatContainer>
      )}
    </Container>
  );
}
