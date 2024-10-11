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

export const leaveRoomAction = (userId, roomId) => ({
    type: LEAVE_ROOM,
    userId,
    roomId
});

export const enterRoomThunk = (roomName, user) => async (dispatch, getState) => {
  const state = getState();
  const roomsArray = Object.values(state.room.allRooms);

  if (!roomsArray.length) {
    console.error("Rooms not loaded yet");
    return;
  }

  const roomNameFormatted = roomName.split("-").join(" ");
  const room = roomsArray.find(room => room.name.toLowerCase() === roomNameFormatted);

  if (!room) {
    console.error("Room not found!");
    return;
  }

  const roomUsersArray = Object.values(room.users);
  const userAlreadyInRoom = roomUsersArray.find(e => e === user.uid);

  if (!userAlreadyInRoom) {
    try {
      await addUserToRoom(room.id, user);
    } catch (error) {
      console.error("Error adding user to room:", error);
    }
  }

  dispatch(enterRoomAction(room, user));
};


export const leaveRoomThunk = (userId) => async (dispatch, getState) => {
    const state = getState();
    const chatroom = state.room.currentRoom;

    if (chatroom) {
        try {
            await removeUserFromRoom(chatroom.id, userId).then(dispatch(leaveRoomAction(userId, chatroom.id)));
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
            const leavingUser = action.userId;
            const updatedChatroom = state.allRooms[action.roomId];
            const usersObj = {}
            
            if (updatedChatroom) {
                updatedChatroom.users.map(user => {
                    usersObj[user] = user   
                })

            delete usersObj[leavingUser];
            const currentUsers = Object.keys(usersObj)

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
            const roomsObj = {}
            
            rooms.map((room) => {
                roomsObj[room.id] = {
                    name: room.name,
                    users: room.users ? room.users.map(user => user.uid) : [],
                    messages: room.messages,
                    id: room.id
                };
            });

            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    ...roomsObj
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
