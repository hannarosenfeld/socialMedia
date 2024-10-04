import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export const fetchRoomByName = async (roomName) => {
  const roomsCollectionRef = collection(db, 'rooms');
  const q = query(roomsCollectionRef, where('name', '==', roomName.toLowerCase()));
  const roomSnapshot = await getDocs(q);
  if (!roomSnapshot.empty) {
    return { id: roomSnapshot.docs[0].id, ...roomSnapshot.docs[0].data() };
  } else {
    console.log("Room not found");
    return null;
  }
};
export const fetchRooms = async () => {
  const roomsCollectionRef = collection(db, 'rooms');
  const roomsSnapshot = await getDocs(roomsCollectionRef);
  const roomsList = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log("😎", roomsList)
  return roomsList;
};

export const addRoom = async (roomData) => {
  try {
    const roomsCollectionRef = collection(db, 'rooms');
    // Ensure room name is lowercase
    const normalizedRoomData = { ...roomData, name: roomData.name.toLowerCase() };
    const docRef = await addDoc(roomsCollectionRef, normalizedRoomData);
    return { id: docRef.id, ...normalizedRoomData }; // Return the new room data
  } catch (error) {
    console.error("Error adding room: ", error);
  }
};

export const updateRoom = async (roomId, updatedData) => {
  const roomDocRef = doc(db, 'rooms', roomId);
  try {
    await updateDoc(roomDocRef, updatedData);
    console.log("Room updated successfully");
  } catch (error) {
    console.error("Error updating room: ", error);
  }
};