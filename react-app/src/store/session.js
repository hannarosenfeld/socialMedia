const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

// Initial state
const initialState = {
    user: null, // Default state for user
};

// Action creators
export const setUser = (user) => ({
    type: SET_USER,
    payload: {
        uid: user.uid, // Store only the UID
        email: user.email, // Store other fields you need
        username: user.username, // Example: Store display name if available
        color: user.color
        // Add more fields as needed
    },
});

export const removeUser = () => ({
    type: REMOVE_USER,
});

// Reducer
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload }; // Only serializable data is stored
        case REMOVE_USER:
            return { ...state, user: null }; // Clear user on removal
        default:
            return state; // Return current state for unrecognized actions
    }
}
