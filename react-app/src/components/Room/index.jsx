import { useEffect, useState, useRef } from 'react';
import { TextField, Button, Container, Paper, List, ListItem, ListItemText, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addUserToRoom, fetchRoomByName, removeUserFromRoom, addMessage, listenForMessages } from '../../services/roomService';

// Styled components using MUI's styled utility
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

  console.log("🤦🏻‍♀️", sessionUser)

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        // Fetch the room data
        const fetchedRoom = await fetchRoomByName(roomName.split("-").join(" "));
        setRoom(fetchedRoom);
        roomIdRef.current = fetchedRoom.id; // Store the room ID in the ref

        // Add user to the room and then fetch updated users
        await addUserToRoom(fetchedRoom.id, sessionUser);
        await setActiveUsers(fetchedRoom.users);

        // Set up real-time message listener
        const unsubscribe = listenForMessages(fetchedRoom.id, (newMessages) => {
          setMessages(newMessages);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
      } catch (err) {
        console.error("Error fetching room: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();

    // Cleanup function to remove user from the room when the component unmounts
    return () => {
      if (sessionUser?.uid && roomIdRef.current) {
        removeUserFromRoom(roomIdRef.current, sessionUser)
          .then(() => console.log("User removed from room"))
          .catch((err) => {
            console.error("Error removing user from room: ", err);
          });
      }
    };
  }, [dispatch, roomName, sessionUser]);

  const handleSendMessage = async () => {
    if (input.trim() && roomIdRef.current) {
      const message = {
        content: input,
        sender: {
          uid: sessionUser.uid,
          username: sessionUser.displayName,
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
      <ChatContainer>
        <MessagesSection>
          <MessageList>
            {messages.map((message, index) => (
              <ListItem key={index}>
              <ListItemText
                primary={message?.content}
                secondary={
                  <span>
                    <span style={{ color: sessionUser.color }}>
                      {message?.sender?.username}
                    </span>
                    {' - '}
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                }
              />
            </ListItem>

            ))}
          </MessageList>
          <MessageInputContainer>
            <MessageInput
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </MessageInputContainer>
        </MessagesSection>
        <UsersSection>
          <Typography variant="h6">Users</Typography>
          <List>
            {activeUsers?.map((user, index) => (
              <ListItem key={index}>
                <ListItemText primary={user?.name} />
              </ListItem>
            ))}
          </List>
        </UsersSection>
      </ChatContainer>
    </Container>
  );
}
