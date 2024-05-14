import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addRoomThunk, getAllRoomsThunk } from '../../store/room'
import NavBar from '../NavBar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const chatRooms = useSelector((state) => state.room)
  const [loading, setLoading] = useState(true);
  let chatRoomsArr;

  useEffect(() => {
    try {
     chatRoomsArr = Object.values(chatRooms)
     setLoading(false)
    } catch(err) {
      console.log("🚨", err)
    }
  }, [chatRooms])

  useEffect(() => {
    const getRooms = dispatch(getAllRoomsThunk());
  }, [])

  const handleAddRoom = () => {
    return
    // Dispatch the addRoomThunk action
   // dispatch(addRoomThunk(/* pass any necessary parameters */));
  };

  return (
    <>
    <NavBar/>
    {!loading && (
    <Container maxWidth="lg" className='page-wrapper'>
      <div style={{height: "23em", width: "20em", float: "right", display: "flex", flexDirection: "column", padding: "1em"}}>
        {Object.values(chatRooms).map(chatroom => (
          <Card key={chatroom.id}>
            <CardContent style={{display: "flex", gap: "1em" }}>
            <span class="material-symbols-outlined" style={{fontSize: "2.5em", alignSelf: "center"}}>
                diversity_3
              </span>
            <div style={{display: "flex", width: "fit-content", flexDirection: "column"}}>
                <Typography component="h5">
                  {chatroom.name}
                </Typography>
                <Typography component="subtitle" style={{fontSize: "0.8em"}}>
                  {chatroom.description}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}   
      <Button variant="text" color="secondary" onClick={handleAddRoom} style={{alignSelf: "flex-end", marginTop: "0.5em"}}>
        <span class="material-symbols-outlined">add</span>Add Room
      </Button>     
      </div>
    </Container>
    )}
    </>
  );
};

export default Dashboard;
