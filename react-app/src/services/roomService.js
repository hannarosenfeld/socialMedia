import { doc, onSnapshot, collection, query, where, getDocs, addDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, firestore } from '../firebase/firebase.config'; // Adjust the path as necessary

export const listenForUserUpdates = (roomId, callback) => {
    return firestore
       .collection('rooms')
       .doc(roomId)
       .onSnapshot((snapshot) => {
          console.log("Snapshot received:", snapshot.data()); // Debugging log
          const roomData = snapshot.data();
          callback(roomData?.users || []); // Check for null or undefined roomData
       });
 };
 

export const removeUserFromRoom = async (roomId, userId) => {
    if (!roomId || !userId) {
        console.error("Invalid room ID or user data.");
        return;
    }

    try {
        const roomDocRef = doc(db, "rooms", roomId);
        const roomDoc = await getDoc(roomDocRef); // Fetch current room state
        const currentUsers = roomDoc.data().users;

        const userToRemove = currentUsers.find(user => user.uid === userId);
        if (!userToRemove) {
            console.error("User not found in room:", userId);
            return;
        }

        await updateDoc(roomDocRef, {
            users: arrayRemove(userToRemove)
        });    

        console.log('User removed from room successfully');

        const updatedRoomDoc = await getDoc(roomDocRef);
        console.log("Updated users after removal:", updatedRoomDoc.data().users);
    } catch (error) {
        console.error('Error removing user from room: ', error);
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
    if (!roomId || !user) {
        console.error("Invalid room ID or user.");
        return;
    }

    try {
        const roomDocRef = doc(db, "rooms", roomId);
        await updateDoc(roomDocRef, {
            users: arrayUnion(user)
        });
        console.log('User added to room successfully');
    } catch (error) {
        console.error('Error adding user to room: ', error);
    }
};

export const sendMessageToRoom = async (roomId, message) => {
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
        
        // Fetch current room data
        const roomSnapshot = await getDoc(roomDocRef);
        const roomData = roomSnapshot.data();

        // Check if messages exist and filter out those older than 24 hours
        if (roomData.messages) {
            const currentTime = new Date();
            const updatedMessages = roomData.messages.filter(msg => {
                const msgTime = new Date(msg.timestamp);
                // Retain messages that are less than 24 hours old
                return (currentTime - msgTime) < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            });

            // Update the messages in the Firestore document
            await updateDoc(roomDocRef, {
                messages: updatedMessages // Set the filtered messages back
            });
        }

        // Add the new message
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

export const fetchRoomUsers = async (roomId) => {
    if (!roomId) {
        console.error("Invalid room ID.");
        return null;
    }

    try {
        const roomDocRef = doc(db, 'rooms', roomId);
        const roomSnapshot = await getDoc(roomDocRef);
        
        if (roomSnapshot.exists()) {
            const roomData = await roomSnapshot.data();
            return roomData.users || [];
        } else {
            console.log("No such room!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching room users:", error);
        return null;
    }
};
