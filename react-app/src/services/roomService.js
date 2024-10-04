import { doc, onSnapshot, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, firestore } from '../firebase/firebase.config'; // Adjust the path as necessary
 
// This function listens for changes to a specific user's document
export const listenForUserUpdates = (userId, callback) => {
    const userDocRef = doc(firestore, 'users', userId);
    return onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            console.log("No such user!");
        }
    });
};
 

// Function to remove a user from the room
export const removeUserFromRoom = async (roomId, user) => {
  if (!roomId || !user) {
    console.error("Invalid room ID or user data.");
    return;
  }

  try {
    const roomDocRef = doc(db, "rooms", roomId);
    await updateDoc(roomDocRef, {
      users: arrayRemove({
        uid: user.uid,
        username: user.username
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

  console.log("🧚🏿‍♂️", roomId, user);

  if (!roomId || !user) {
    console.error("Invalid room ID or user data.");
    return;
  }

  try {
    const roomDocRef = doc(db, "rooms", roomId);
    await updateDoc(roomDocRef, {
      users: arrayUnion({
        uid: user.uid,
        username: user.username
      })
    });
    console.log('User added to room successfully');
  } catch (error) {
    console.error('Error adding user to room: ', error);
  }
};

export const sendMessageToRoom = async (roomId, message) => {
  console.log("Sending message to room:", roomId, message);

  if (!roomId || !message) {
    console.error("Invalid room ID or message data.");
    return;
  }

  // Filter out any undefined values in the message object
  const sanitizedMessage = {
    content: message.content,
    sender: {
      uid: message.sender.uid,
      username: message.sender.username,
      color: message.sender.color || null, // Fallback to null if color is undefined
    },
    timestamp: message.timestamp
  };

  console.log("🍉", sanitizedMessage)

  try {
    const roomDocRef = doc(db, "rooms", roomId);
    await updateDoc(roomDocRef, {
      messages: arrayUnion(sanitizedMessage)
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message to room: ', error);
  }
};


export const addMessage = async (roomId, message) => {
  console.log("Sending message to room:", roomId, message);

  if (!roomId || !message) {
    console.error("Invalid room ID or message data.");
    return;
  }

  // Sanitize the message object to ensure no undefined values are passed
  const sanitizedMessage = {
    content: message.content || "", // Fallback to empty string if undefined
    sender: {
      uid: message.sender?.uid || "", // Ensure uid is defined
      username: message.sender?.username || "Anonymous", // Fallback if username is undefined
      color: message.sender?.color || "defaultColor" // Fallback to a default color if undefined
    },
    timestamp: message.timestamp || new Date().toISOString() // Ensure timestamp is valid
  };

  try {
    const roomDocRef = doc(db, "rooms", roomId);
    await updateDoc(roomDocRef, {
      messages: arrayUnion(sanitizedMessage)
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message to room: ', error);
  }
};

export const listenForMessages = (roomId, callback) => {
  const roomDocRef = doc(db, 'rooms', roomId);
  return onSnapshot(roomDocRef, (doc) => {
    const data = doc.data();
    if (data && data.messages) {
      callback(data.messages);
    }
  });
};