import { fetchRooms, addRoom,fetchRoomUsers, addUserToRoom, removeUserFromRoom } from "../services/roomService.js";

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
    try {
        // Add user to the room
        await addUserToRoom(roomId, user);
        
        // Fetch all users in the room from Firebase
        const users = await fetchRoomUsers(roomId);

        const roomData = {
            roomId,
            users,
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
    console.log("👛 leave room thunk");
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
            room = state.allRooms[action.payload.roomId];
            const users = action.payload.users;
        
            // Convert room.users array to an object with uid as the key
            const usersObj = users.reduce((acc, user) => {
                acc[user.uid] = user; // Set uid as the key and user object as the value
                return acc;
            }, {});
        
            const convertedRoom = {
                id: room.id,
                name: room.name,
                messages: room.messages,
                users: usersObj // Assign the newly created users object here
            };
        
            // Return the new state with the updated room
            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [room.id]: convertedRoom // Update the room with the new user object
                },
                currentRoom: {
                    ...state.currentRoom,
                    users: usersObj
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
                            users: currentUsers,
                        },
                    },
                    currentRoom: state.currentRoom?.id === action.roomId ? null : state.currentRoom,
                };
            }
            return state;

            case GET_ALL_ROOMS:
                console.log("💁‍♀️ all rooms", action.rooms);
                const allRooms = {};
                
                action.rooms.forEach((room) => {
                    allRooms[room.id] = {
                        ...room,
                    };
                });
                console.log("🐅", {
                    ...state,
                    allRooms,
                }
            );

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
