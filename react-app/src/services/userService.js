import { doc, setDoc, getDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore"; // Import necessary functions
import { db } from "../firebase/firebase.config";

// Function to save or update user data
const saveUserData = async (userId, userData) => {
    try {
        // Update user data in users collection
        await setDoc(doc(db, "users", userId), userData, { merge: true });
        console.log("User data saved successfully!");

        // If the username is updated, update it in chatrooms as well
        if (userData.username) {
            await updateUsernameInChatrooms(userId, userData.username);
        }
    } catch (error) {
        console.error("Error saving user data:", error);
    }
};


const updateUsernameInChatrooms = async (uid, newUsername) => {
    const roomsRef = collection(db, 'rooms'); // Use 'rooms' collection

    try {
        // Query to get all rooms the user is a part of
        const roomsSnapshot = await getDocs(roomsRef);
        const batch = writeBatch(db); // Create a batch for updating documents

        if (roomsSnapshot.empty) {
            console.log("No rooms found.");
            return;
        }

        let roomsUpdated = 0; // Counter for updated rooms

        roomsSnapshot.forEach(roomDoc => {
            const roomRef = doc(db, "rooms", roomDoc.id); // Updated 'rooms' collection here
            const users = roomDoc.data().users || []; // Ensure users array is defined

            // Check if the user exists in the users array and update their username
            const userIndex = users.findIndex(user => user.uid === uid);            
            if (userIndex !== -1) {
                console.log(`Updating username for user ID: ${uid} in room: ${roomDoc.id}`);
                
                // Update the username of the user
                users[userIndex].username = newUsername;

                // Set the updated users array
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

export { saveUserData, getUserData };
