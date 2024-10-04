import { doc, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

// Function to remove a user from the room
export const removeUserFromRoom = async (roomId, user) => {
  console.log("🤾🏼‍♂️ in remove user from room")
  console.log("🧘🏾‍♂️", roomId, user)
  if (!roomId || !user) {
    console.error("Invalid room ID or user data.");
    return;
  }

  try {
    const roomDocRef = doc(db, "rooms", roomId);
    await updateDoc(roomDocRef, {
      users: arrayRemove({
        uid: user.uid,
        name: user.displayName
      })
    });
    console.log('User removed from room successfully');
  } catch (error) {
    console.error('Error removing user from room: ', error);
  }
};

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

export const addUserToRoom = async (roomId, user) => {
    console.log("Room ID:", roomId); // Debugging line
    console.log("User Object:", user); // Debugging line

    console.log("🧚🏿‍♂️", roomId, user)

    if (!roomId || !user) {
        console.error("Invalid room ID or user data.");
        return;
    }

    try {
        const roomDocRef = doc(db, "rooms", roomId);
        await updateDoc(roomDocRef, {
            users: arrayUnion({
                uid: user.uid,
                name: user.displayName
            })
        });
        console.log('User added to room successfully');
    } catch (error) {
        console.error('Error adding user to room: ', error);
    }
};
