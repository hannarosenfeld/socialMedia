import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, Modal, Box, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addRoomThunk } from '../../store/room';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const chatRoomsObj = useSelector((state) => state.room.allRooms);
  const chatRooms = Object.values(chatRoomsObj);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomData, setRoomData] = useState({ name: '', description: '' });

  const handleAddRoom = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(addRoomThunk(roomData));
    setIsModalOpen(false);
    setLoading(false);
    setRoomData({ name: '', description: '' });
  };

  return (
    <>
      {!loading  ? (
        <Container maxWidth="lg" className='page-wrapper'>
          {/* <iframe src="https://www.crazygames.com/embed/polytrack" style={{width: '100%', height: '100%'}} frameBorder="0" allow="gamepad *;"></iframe> */}
          <div className="room-container" style={{ float: "right", display: "flex", flexDirection: "column", padding: "1em", gap: "0.3em" }}>
            {chatRooms.map(chatroom => (
              <Link key={chatroom.id} to={`/rooms/${chatroom?.name ? chatroom.name.split(' ').join('-').toLowerCase() : ''}`}>
                <Card className="room-card" style={{ width: "25em" }}>
                  <CardContent style={{ display: "flex", gap: "1em" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "2.5em", alignSelf: "center" }}>
                      diversity_3
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <div style={{ display: "flex", width: "fit-content", flexDirection: "column", alignSelf: "center" }}>
                      <Typography component="h5">
                          {chatroom.name}
                      </Typography>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignContent: "center", margin: "0 1em" }}>
                        <span style={{ alignSelf: 'center', fontSize: "28px" }}>{chatroom.users?.length || 0}</span>
                        <span style={{ fontSize: "12px", width: "3em" }}>people chatting</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Button variant="text" color="secondary" onClick={handleAddRoom} style={{ alignSelf: "flex-end", marginTop: "0.5em" }}>
              <span className="material-symbols-outlined">add</span>Add Room
            </Button>
          </div>
        </Container>
      ) : (
        <Container maxWidth="lg" className='page-wrapper'>
          <Typography variant="h6" align="center">Loading rooms...</Typography>
        </Container>
      )}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-room-modal"
        aria-describedby="modal-for-adding-a-new-room"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Add Room
          </Typography>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            name="name"
            value={roomData?.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add
          </Button>
          <Button onClick={handleCloseModal} variant="contained" color="secondary" sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Dashboard;
