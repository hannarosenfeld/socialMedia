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

export { getRoomUserData ,getUserData  };
