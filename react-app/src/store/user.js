import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

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
export const editUserThunk = (sessionUser, updatedData) => async (dispatch) => {
      const user = {
        uid: sessionUser.uid,
        email: sessionUser.email,
        username: updatedData.username,
        color: updatedData.color,
      };
  try {
    // Update user data in Firestore
    await setDoc(doc(db, "users", sessionUser.uid), user, { merge: true });
    console.log("User data saved successfully!");

    // Dispatch Redux action to update state
    dispatch(setUser(user));
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
