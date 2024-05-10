import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addRoomThunk, getAllRoomsThunk } from '../../store/room'


const Dashboard = () => {
  const dispatch = useDispatch();
  const [chatrooms, setChatrooms] = useState([]);

  const handleAddRoom = () => {
    return
    // Dispatch the addRoomThunk action
   // dispatch(addRoomThunk(/* pass any necessary parameters */));
  };

  return (
    <Container maxWidth="md">
      <div className="grid grid-cols-1 gap-4">
        {chatrooms.map(chatroom => (
          <Card key={chatroom.id}>
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                {chatroom.name}
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {chatroom.description}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Created by: {chatroom.creator}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button variant="text" color="secondary" onClick={handleAddRoom}>
      <span class="material-symbols-outlined">add</span>Add Room
      </Button>
    </Container>
  );
};

export default Dashboard;
