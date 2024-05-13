import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addRoomThunk, getAllRoomsThunk } from '../../store/room'
import NavBar from '../NavBar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const chatrooms = useSelector(state => state.rooms)

  useEffect(() => {
    console.log("🇲🇽", chatrooms)
  }, [chatrooms])

  useEffect(() => {
    dispatch(getAllRoomsThunk());
  }, [])



  const handleAddRoom = () => {
    return
    // Dispatch the addRoomThunk action
   // dispatch(addRoomThunk(/* pass any necessary parameters */));
  };

  return (
    <>
    <NavBar/>
    <Container maxWidth="lg" className='page-wrapper'>
      <div style={{border: "2px solid blue", height: "23em", width: "20em", float: "right", display: "flex"}}>
        {chatrooms?.map(chatroom => (
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
      <Button variant="text" color="secondary" onClick={handleAddRoom} style={{alignSelf: "flex-end"}}>
        <span class="material-symbols-outlined">add</span>Add Room
      </Button>     
      </div>
    </Container>
    </>
  );
};

export default Dashboard;
