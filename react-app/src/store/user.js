import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { updateUsernameInChatrooms } from "../services/userService";

const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

// Action creators
export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

// Thunk to update user info in Firebase and state
export const editUserThunk = (userId, updatedData) => async (dispatch) => {
  try {
    // Update user data in Firestore
    await setDoc(doc(db, "users", userId), updatedData, { merge: true });
    console.log("User data saved successfully!");

    // If username is updated, update it in chatrooms
    if (updatedData.username) {
      await updateUsernameInChatrooms(userId, updatedData.username);
    }

    // Dispatch Redux action to update state
    dispatch(setUser(updatedData));
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// Initial state
const initialState = {
  user: null,
};

// Reducer
export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}
