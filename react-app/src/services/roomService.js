import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

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
      const docRef = await addDoc(roomsCollectionRef, roomData);
      return { id: docRef.id, ...roomData }; // Return the new room data
    } catch (error) {
      console.error("Error adding room: ", error);
    }
};
