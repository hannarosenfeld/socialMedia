import { useState } from 'react';
import NavBar from "../NavBar";
import { TextField, Button, Container, Paper, List, ListItem, ListItemText, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import 'tailwindcss/tailwind.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    height: '91vh',
    width: '100%',
  },
  messagesSection: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
  },
  messageList: {
    flex: 1,
    overflowY: 'hidden', // Disable scrolling for message list
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
}));

export default function Room() {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState(['User1', 'User2', 'User3']); // Example user list

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth={false} disableGutters className={classes.root}>
        <Paper className={classes.chatContainer}>
          <div className={classes.messagesSection}>
            <List className={classes.messageList}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText primary={message} />
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
