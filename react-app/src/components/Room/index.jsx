import { useEffect, useState, useRef } from 'react';
import NavBar from "../NavBar";
import { TextField, Button, Container, Paper, List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/system';
import 'tailwindcss/tailwind.css';
import { enterRoomThunk, leaveRoomAction } from '../../store/room';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    height: '90vh',
    width: '100%',
  },
  messagesSection: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  messageInputContainer: {
    display: 'flex',
    padding: theme.spacing(2),
    borderTop: '1px solid #ccc',
  },
  messageInput: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  usersSection: {
    flex: 1,
    borderLeft: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
}));

export default function Room() {
  const dispatch = useDispatch();
  const { roomName } = useParams();
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const currentRoom = useSelector(state => state.room.currentRoom);
  const sessionUser = useSelector((state) => state.session.user);
  const [loading, setIsLoading] = useState(true);
  const users = currentRoom?.users;

  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to websocket server');
      socketRef.current.emit('join_room', { room: roomName });
    });

    socketRef.current.on('receive_message', (data) => {
      const messageWithUsername = {
        ...data.message,
        username: data.message.sender.username || 'Unknown User',
      };
      setMessages(prevMessages => [...prevMessages, messageWithUsername]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomName]);


  useEffect(() => {
    const entrance = dispatch(enterRoomThunk(sessionUser.id, roomName));

    Promise.all([entrance])
      .then(() => setIsLoading(false))
      .catch((err) => console.log("🚨", err));

    return () => {
      dispatch(leaveRoomAction(currentRoom?.room?.id, sessionUser.id));
    };
  }, [dispatch, roomName, sessionUser.id, currentRoom?.room?.id]);


  const handleSendMessage = () => {
    if (input.trim()) {
      socketRef.current.emit('send_message', {
        roomName,
        content: input,
        senderId: sessionUser.id,
        roomId: currentRoom?.room?.id
      });
      setInput('');
    }
  };


  if (loading || !sessionUser || !currentRoom) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth={false} disableGutters className={classes.root}>
        <Paper className={classes.chatContainer}>
          <div className={classes.messagesSection}>
          <List className={classes.messageList}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={message.content}
                    secondary={`${message.sender.username} - ${new Date(message.timestamp).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
            <div className={classes.messageInputContainer}>
              <TextField
                className={classes.messageInput}
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
          <div className={classes.usersSection}>
            <Typography variant="h6">Users</Typography>
            <List>
              {users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </div>
        </Paper>
      </Container>
    </>
  );
}
