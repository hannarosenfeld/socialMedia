import { fetchRooms, addRoom } from '../services/roomService';

// Action Types
const ADD_ROOM = "room/ADD_ROOM";
const GET_ALL_ROOMS = "room/GET_ALL_ROOMS";
const ENTER_ROOM = "room/ENTER_ROOM";
const LEAVE_ROOM = "room/LEAVE_ROOM";

// Action Creators
const enterRoomAction = (payload) => ({ type: ENTER_ROOM, payload });
const getAllRoomsAction = (rooms) => ({ type: GET_ALL_ROOMS, rooms });
export const leaveRoomAction = (roomId, userId) => ({ type: LEAVE_ROOM, roomId, userId });

// Thunks
export const addRoomThunk = (roomData) => async (dispatch) => {
    try {
        const newRoom = await addRoom(roomData);
        dispatch({ type: ADD_ROOM, room: newRoom });
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

export const enterRoomThunk = (user, room) => async (dispatch) => {
    console.log("🐩 in thunk", user, room);
    const entrance = {
        "user": user,
        "room": room
    };
    const data = dispatch(enterRoomAction(entrance));
    return data
};

// Initial State
const initialState = {
    allRooms: {},
    currentRoom: {
        room: {},
        users: [] // Adding users to track who is in the current room
    }
};

// Reducer
const roomReducer = (state = initialState, action) => {
    let room;
    switch (action.type) {
        case ENTER_ROOM:
            console.log("🔥", action)            
            room = action.payload.room;
            const user = action.payload.user.username;
            const currentUsers = state.currentRoom.users || [];

            // If the user is already in the room, don't re-add them
            if (currentUsers.includes(user)) {
                return state;
            }

            // Updated logic to handle `currentRoom` properly
            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [room.id]: {
                        ...state.allRooms[room.id],
                        activeUsers: (state.allRooms[room.id]?.activeUsers || 0) + 1
                    }
                },
                currentRoom: {
                    room: action.payload.room, // Setting the room details
                    users: [...currentUsers, user] // Adding the new user to the room
                }
            };
        case LEAVE_ROOM:
            room = state.allRooms[action.roomId];
            if (room) {
                const updatedUsers = room.activeUsers - 1;
                return {
                    ...state,
                    allRooms: {
                        ...state.allRooms,
                        [action.roomId]: {
                            ...room,
                            activeUsers: updatedUsers
                        }
                    },
                    // Clear currentRoom when leaving
                    currentRoom: {
                        room: {},
                        users: [] 
                    }
                };
            }
            return state;
        case GET_ALL_ROOMS:
            const allRooms = {};
            action.rooms.forEach(room => {
                allRooms[room.id] = {
                    roomInfo: room,
                    activeUsers: 0
                };
            });
            return {
                ...state,
                allRooms
            };
        case ADD_ROOM:
            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [action.room.id]: {
                        roomInfo: action.room,
                        activeUsers: 0
                    }
                }
            };
        default:
            return state;
    }
};

export default roomReducer;
