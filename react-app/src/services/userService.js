import { doc, setDoc,onSnapshot,  getDoc, collection, getDocs, writeBatch } from "firebase/firestore"; // Import necessary functions
import { db } from "../firebase/firebase.config";
 
// Function to listen for user updates in a room
export const listenForUserUpdates = (roomId, callback) => {
  const roomRef = doc(db, "rooms", roomId);
  
  return onSnapshot(roomRef, (doc) => {
    const roomData = doc.data();
    callback(roomData.users); // Call the callback with the updated users array
  });
};

// Function to get user data (if you still want to keep it)
const getRoomUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    try {
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data(); // Return user data for further use if needed
        } else {
            return null; // Return null if user not found
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return null; // Return null on error
    }
};


// Function to get user data
const getUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    try {
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
            return docSnap.data(); // Return user data for further use if needed
        } else {
            console.log("No such user!");
            return null; // Return null if user not found
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return null; // Return null on error
    }
};

// New function to update username in chatrooms
const updateUsernameInChatrooms = async (uid, newUsername) => {
    const roomsRef = collection(db, 'rooms'); // Reference to the rooms collection

    try {
        // Get all rooms
        const roomsSnapshot = await getDocs(roomsRef);
        const batch = writeBatch(db); // Create a batch for efficient updates

        let roomsUpdated = 0; // Counter for updated rooms

        roomsSnapshot.forEach(roomDoc => {
            const roomRef = doc(db, "rooms", roomDoc.id); // Reference to the specific room
            const users = roomDoc.data().users || []; // Get users array

            // Find user in the users array
            const userIndex = users.findIndex(user => user.uid === uid);            
            if (userIndex !== -1) {
                console.log(`Updating username for user ID: ${uid} in room: ${roomDoc.id}`);
                
                // Update the username of the user
                users[userIndex].username = newUsername;

                // Update the users array in Firestore
                batch.update(roomRef, { users });
                roomsUpdated++;
            }
        });

        // Commit the batch update only if there were updates
        if (roomsUpdated > 0) {
            await batch.commit();
            console.log(`${roomsUpdated} usernames updated successfully in rooms.`);
        } else {
            console.log("No usernames were updated in rooms.");
        }
    } catch (error) {
        console.error("Error updating usernames in rooms:", error);
    }
};

export { getRoomUserData ,getUserData, updateUsernameInChatrooms };
