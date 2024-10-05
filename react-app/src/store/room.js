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
        console.log("😍", rooms)
        dispatch(getAllRoomsAction(rooms));
    } catch (error) {
        console.log("Error fetching rooms:", error);
    }
};

// When a user enters a room, add them to the active user list
export const enterRoomThunk = (roomId, userId) => async (dispatch) => {
    try {
        await addUserToRoom(roomId, userId);
        const roomData = {
            roomId,
            userId
        };
        dispatch({
            type: ENTER_ROOM,
            payload: roomData,
        });
    } catch (error) {
        console.error("Error entering room:", error);
    }
};

// When a user leaves the room, remove them from the active user list
export const leaveRoomThunk = (roomId, user) => async (dispatch) => {
    try {
        await removeUserFromRoom(roomId, user);
        dispatch(leaveRoomAction(roomId, user.uid));
    } catch (error) {
        console.error("Error leaving room:", error);
    }
};

// Initial State
const initialState = {
    allRooms: {},
    currentRoom: {},
};

// Reducer
const roomReducer = (state = initialState, action) => {
    let room;
    switch (action.type) {
        case ENTER_ROOM:
            
            room = state.allRooms[action.payload.roomId];
            console.log("🔥", room)
            const newUser = action.payload.userId;
            const currentUsers = state.currentRoom.users || [];

            // Check if user is already in the room
            if (currentUsers.includes(newUser)) {
                return state;
            }

            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [action.payload.roomId]: {
                        ...room,
                    },
                },
                currentRoom: state.allRooms[action.payload.roomId]
            };

        case LEAVE_ROOM:
            room = state.allRooms[action.roomId];
            if (room) {
                const updatedRoomUsers = state.currentRoom.users.filter(
                    (user) => user.uid !== action.userId
                );

                return {
                    ...state,
                    allRooms: {
                        ...state.allRooms,
                        [action.roomId]: {
                            ...room,
                        },
                    },
                    currentRoom: {
                        room: {},
                        users: updatedRoomUsers,
                    },
                };
            }
            return state;

        case GET_ALL_ROOMS:
            const allRooms = {};
            action.rooms.forEach((room) => {
                allRooms[room.id] = {
                    roomInfo: room,
                };
            });
            return {
                ...state,
                allRooms,
            };

        case ADD_ROOM:
            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [action.room.id]: {
                        roomInfo: action.room,
                    },
                },
            };

        default:
            return state;
    }
};

export default roomReducer;
