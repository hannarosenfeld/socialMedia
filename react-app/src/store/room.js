import { fetchRooms, addRoom, fetchRoomUsers, addUserToRoom, removeUserFromRoom } from "../services/roomService.js";

const ADD_ROOM = "room/ADD_ROOM";
const GET_ALL_ROOMS = "room/GET_ALL_ROOMS";
const ENTER_ROOM = "room/ENTER_ROOM";
const LEAVE_ROOM = "room/LEAVE_ROOM";

const getAllRoomsAction = (rooms) => ({
    type: GET_ALL_ROOMS,
    rooms,
});

export const enterRoomAction = (room, user) => ({
    type: ENTER_ROOM,
    room,
    user,
});

export const leaveRoomAction = (userId) => ({
    type: LEAVE_ROOM,
    userId,
});

export const enterRoomThunk = (roomName, user) => async (dispatch, getState) => {
    const state = getState();
    const roomsArray = Object.values(state.room.allRooms);
    const roomNameFormatted = roomName.split("-").join(" ");
    const room = roomsArray.find(room => room.name === roomNameFormatted);

    if (room) {
        const roomUsersArray = Object.values(room.users);
        const userAlreadyInRoom = roomUsersArray.find(e => e === user.uid);

        if (!userAlreadyInRoom) {
            try {
                await addUserToRoom(room.id, user);
                dispatch(enterRoomAction(room, user));
            } catch (error) {
                console.error("Error adding user to room:", error);
            }
        } else {
            dispatch(enterRoomAction(room, user));
        }
    }
};

export const leaveRoomThunk = (userId) => async (dispatch, getState) => {
    const state = getState();
    const chatroom = state.room.currentRoom;


    if (chatroom) {
        try {
            await removeUserFromRoom(chatroom.id, userId).then(dispatch(leaveRoomAction(chatroom.id, userId)));
        } catch (error) {
            console.error("Error removing user from room:", error);
        }
    }
};

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

const initialState = {
    allRooms: {},
    currentRoom: null,
};

const roomReducer = (state = initialState, action) => {
    let room;
    switch (action.type) {
        case ENTER_ROOM:
            console.log("🫎 in enter room", action)
            const user = action.user;
            room = action.room;

            if (room) {
                const roomUsersArray = Object.values(room.users);
                const userAlreadyInRoom = roomUsersArray.find(e => e === user.uid);

                let updatedUsers = [...roomUsersArray];

                if (!userAlreadyInRoom) {
                    updatedUsers.push(user.uid);
                }

                return {
                    ...state,
                    allRooms: {
                        ...state.allRooms,
                        [room.id]: {
                            ...room,
                            users: updatedUsers
                        }
                    },
                    currentRoom: {
                        ...room,
                        users: updatedUsers
                    }
                };
            }
            return state;

        case LEAVE_ROOM:
            console.log("🐸 in leave room", action)
            const leavingUser = action.userId;
            const updatedChatroom = state.allRooms[action.roomId];
            

            if (updatedChatroom) {
                const currentUsers = { ...updatedChatroom.users };
                delete currentUsers[leavingUser];

                return {
                    ...state,
                    allRooms: {
                        ...state.allRooms,
                        [updatedChatroom.id]: {
                            ...updatedChatroom,
                            users: currentUsers,
                        },
                    },
                    currentRoom: null
                };
            }
            return state;

        case GET_ALL_ROOMS:
            const rooms = action.rooms;
            const allRooms = {};

            rooms.forEach((room) => {
                const roomUsers = room.users;
                const roomUsersUIDArray = roomUsers.map(user => user.uid);

                room.users = roomUsersUIDArray;
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
