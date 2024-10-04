import { useEffect, useState } from 'react';
import { TextField, Button, Container, Paper, List, ListItem, ListItemText, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
// import roomReducer, leaveRoomAction from '../../store/room';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addUserToRoom,fetchRoomByName } from '../../services/roomService';

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
  const currentRoom = useSelector(state => state.room.currentRoom);
  const sessionUser = useSelector((state) => state.session.user);
  const [loading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]); // Initialize to an empty array

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        // Fetch the room data
        const room = await fetchRoomByName(roomName.split("-").join(" "));
         
        // Dispatch the action to enter the room
        const entrance = await addUserToRoom(room.id, sessionUser)
        await entrance; // Wait for entrance action to complete
        
        setActiveUsers(room.users); // Set active users to room.users
        setIsLoading(false); // Set loading to false once data is ready
        console.log("🔫 Room Data: ", activeUsers); // Log the actual room users

        if (currentRoom?.room?.uid) {
          dispatch(leaveRoomAction(currentRoom.room.id, sessionUser.uid));
        }
      } catch (err) {
        console.error("Error fetching room: ", err);
        setIsLoading(false); // Ensure loading state is updated even on error
      }
    };

    fetchRoomData(); // Call the async function
  }, [dispatch, roomName, sessionUser.id, currentRoom?.room?.id]);

  if (loading || !sessionUser || !currentRoom) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  return (
    <>
      <Container maxWidth={false} disableGutters>
        <ChatContainer>
          <MessagesSection>
            <MessageList>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={message.content}
                    secondary={`${message.sender.username} - ${new Date(message.timestamp).toLocaleString()}`}
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
              {/* Uncomment the button to enable sending messages */}
              {/* <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
              </Button> */}
            </MessageInputContainer>
          </MessagesSection>
          <UsersSection>
            <Typography variant="h6">Users</Typography>
            <List>
              {activeUsers?.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user?.name} /> {/* Assuming user has a username property */}
                </ListItem>
              ))}
            </List>
          </UsersSection>
        </ChatContainer>
      </Container>
    </>
  );
}
