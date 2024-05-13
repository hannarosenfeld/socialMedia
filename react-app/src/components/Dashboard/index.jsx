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
      console.log("🇲🇽", Object.values(chatRooms).map(room => console.log("🍅", room)))
     chatRoomsArr = Object.values(chatRooms)
     setLoading(false)
    } catch(err) {
      console.log("🇲🇽", err)
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
      <div style={{border: "2px solid blue", height: "23em", width: "20em", float: "right", display: "flex", flexDirection: "column"}}>
        {Object.values(chatRooms).map(chatroom => (
          <Card key={chatroom.id}>
            <CardContent>
              <Typography variant="h5" component="h3" gutterBottom>
                {chatroom.name}
              </Typography>
            </CardContent>
          </Card>
        ))}   
      <Button variant="text" color="secondary" onClick={handleAddRoom} style={{alignSelf: "flex-end"}}>
        <span class="material-symbols-outlined">add</span>Add Room
      </Button>     
      </div>
    </Container>
    )}
    </>
  );
};

export default Dashboard;
