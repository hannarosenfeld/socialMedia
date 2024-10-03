import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebase.config";

const saveUserData = async (userId, userData) => {
    try {
        await setDoc(doc(db, "users", userId), userData);
        console.log("User data saved successfully!");
    } catch (error) {
        console.error("Error saving user data:", error);
    }
};

const getUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    try {
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
        } else {
            console.log("No such user!");
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
    }
};

const userId = "uniqueUserId";
const userData = {
    username: "JohnDoe",
    email: "johndoe@example.com",
};

const run = async () => {
    await saveUserData(userId, userData);
    await getUserData(userId);
};

run();
