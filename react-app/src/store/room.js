import { fetchRooms, addRoom,fetchRoomUsers, addUserToRoom, removeUserFromRoom } from "../services/roomService.js";

const ADD_ROOM = "room/ADD_ROOM";
const GET_ALL_ROOMS = "room/GET_ALL_ROOMS";
const ENTER_ROOM = "room/ENTER_ROOM";
const LEAVE_ROOM = "room/LEAVE_ROOM";

const getAllRoomsAction = (rooms) => ({
    type: GET_ALL_ROOMS,
    rooms,
});

export const enterRoomAction = (roomName, user) => ({
    type: ENTER_ROOM,
    roomName,
    user
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


export const leaveRoomThunk = ({ roomId, userId }) => async (dispatch) => {
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

const roomReducer = (state = initialState, action) => {
    let room;
    switch (action.type) {
        case ENTER_ROOM:
            console.log("🐹", action)
            const user = action.user
            const roomName = action.roomName.split("-").join(" ")
            const roomsArray = Object.values(state.allRooms)
            const room = roomsArray.find(room => room.name === roomName)
            const userAlreadyInRoom = room.users ? Object.values(room.users).find(e => e === user.uid) : false
            
            if (!userAlreadyInRoom) {
                addUserToRoom(room.id, user);
                room.users.push(user.uid)
            }
        
            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [room.id]: room
                },
                currentRoom: {
                    ...room
                }                
            };
        
         case LEAVE_ROOM:
            room = state.allRooms[action.roomId];
            if (room) {
                const currentUsers = { ...room.users };
                console.log("💖 current users in reducer: ", currentUsers)
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
            const rooms = action.rooms
            const allRooms = {};

            rooms.forEach((room) => {
                const roomUsers = room.users
                const roomUsersUIDArray = roomUsers.map(user => user.uid)

                room.users = roomUsersUIDArray
            });

            action.rooms.forEach((room) => {
                allRooms[room.id] = {
                    ...room,
                };
            });

            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    ...allRooms
                }
            }

            
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
