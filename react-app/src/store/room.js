import { fetchRooms, addRoom, addUserToRoom, removeUserFromRoom } from "../services/roomService.js";

const ADD_ROOM = "room/ADD_ROOM";
const GET_ALL_ROOMS = "room/GET_ALL_ROOMS";
const ENTER_ROOM = "room/ENTER_ROOM";
const LEAVE_ROOM = "room/LEAVE_ROOM";

const getAllRoomsAction = (rooms) => ({
    type: GET_ALL_ROOMS,
    rooms,
});

export const leaveRoomAction = (roomId, userId) => ({
    type: LEAVE_ROOM,
    roomId,
    userId,
});

export const addRoomThunk = (roomData) => async (dispatch) => {
    try {
        const newRoom = await addRoom(roomData);
        dispatch({
            type: ADD_ROOM,
            room: newRoom,
        });
    } catch (error) {
        console.log("Error adding room:", error);
    }
};

export const getAllRoomsThunk = () => async (dispatch) => {
    try {
        const rooms = await fetchRooms();
        dispatch(getAllRoomsAction(rooms));
    } catch (error) {
        console.log("Error fetching rooms:", error);
    }
};

export const enterRoomThunk = (roomId, user) => async (dispatch) => {
    console.log("💘 in thunk", roomId, user)
    try {
        await addUserToRoom(roomId, user);
        const roomData = {
            roomId,
            user
        };
        dispatch({
            type: ENTER_ROOM,
            payload: roomData,
        });
    } catch (error) {
        console.error("Error entering room:", error);
    }
};

export const leaveRoomThunk = ({ roomId, userId }) => async (dispatch) => {
    console.log("🧤", roomId, userId)
    try {
        await removeUserFromRoom(roomId, userId);
        dispatch(leaveRoomAction(roomId, userId));
    } catch (error) {
        console.error("Error leaving room:", error);
    }
};

// Initial State
const initialState = {
    allRooms: {},
    currentRoom: null,
};

// Reducer
const roomReducer = (state = initialState, action) => {
    let room;
    switch (action.type) {
        case ENTER_ROOM:
            console.log("❤️‍🔥 we are in the reducer", action.payload);

            // Get the current room based on the room ID from the action payload
            room = state.allRooms[action.payload.roomId];
            const newUser = action.payload.user;
            const currentUsers = state.currentRoom?.users || {};

            // Check if the new user ID exists in the currentUsers object
            if (newUser && newUser.uid in currentUsers) {
                return state; // User already in room, return current state
            }

            // Ensure users object exists
            const updatedUsers = {
                ...room?.users || {}, // Spread the existing users or an empty object
                [newUser.uid]: newUser
            };

            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [action.payload.roomId]: {
                        ...room,
                        users: updatedUsers,
                    },
                },
                currentRoom: {
                    ...room, 
                    users: updatedUsers,
                }
            };

        case LEAVE_ROOM:
            room = state.allRooms[action.roomId];
            if (room) {
                // Clone the current room's users object
                const currentUsers = { ...room.users };

                // Remove the user from the users object
                delete currentUsers[action.userId];

                // Handle if current room was left by all users
                return {
                    ...state,
                    allRooms: {
                        ...state.allRooms,
                        [action.roomId]: {
                            ...room,
                            users: currentUsers
                        },
                    },
                    currentRoom: state.currentRoom?.id === action.roomId ? null : state.currentRoom,
                };
            }
            return state;

        case GET_ALL_ROOMS:
            const allRooms = {};
            action.rooms.forEach((room) => {
                allRooms[room.id] = room;
            });
            console.log("👚", allRooms)
            return {
                ...state,
                allRooms,
            };

        case ADD_ROOM:
            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [action.room.id]: action.room,
                },
            };

        default:
            return state;
    }
};

export default roomReducer;
