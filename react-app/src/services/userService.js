import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

// Function to save or update user data
const saveUserData = async (userId, userData) => {
    try {
        // Using setDoc with { merge: true } to update only specific fields
        await setDoc(doc(db, "users", userId), userData, { merge: true });
        console.log("User data saved successfully!");
    } catch (error) {
        console.error("Error saving user data:", error);
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
