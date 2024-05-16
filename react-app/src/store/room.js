const ADD_ROOM = "room/ADD_ROOM";
const GET_ALL_ROOMS = "room/GET_ALL_ROOMS";
const ENTER_ROOM = "room/ENTER_ROOM";
const LEAVE_ROOM = "room/LEAVE_ROOM";

const enterRoomAction = (payload) => ({
    type: ENTER_ROOM,
    payload
});

const getAllRoomsAction = (rooms) => ({
    type: GET_ALL_ROOMS,
    rooms
});

export const leaveRoomAction = (roomId, userId) => ({
    type: LEAVE_ROOM,
    roomId,
    userId
});


export const addRoomThunk = (roomData) => async (dispatch) => {
    const res = await fetch("/api/rooms/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllRoomsAction(data));
        return data;
    } else {
        const err = await res.json();
        return err;
    }
};

export const getAllRoomsThunk = () => async (dispatch) => {
    const res = await fetch("/api/rooms");
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllRoomsAction(data));
        return data;
    } else {
        const err = await res.json();
        return err;
    }
};

export const enterRoomThunk = (userId, roomName) => async (dispatch) => {
    const entrance = {
        "user_id": userId,
        "room_name": roomName.split("-").join(" ")
    };
    const res = await fetch(`/api/rooms/${roomName}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(entrance)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(enterRoomAction(data));
        return data;
    } else {
        const err = await res.json();
        return err;
    }
};

const initialState = {
    allRooms: {},
    currentRoom: {
        room: {},
        users: []
    }
};

const roomReducer = (state = initialState, action) => {
    let room;
    switch (action.type) {
        case ENTER_ROOM:
            room = action.payload.room;
            let user = action.payload.user;
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
                    ...state.currentRoom,
                    room: action.payload.room,
                    users: [...state.currentRoom.users, user.username]
                }
            };
            case LEAVE_ROOM:
                console.log("🌰", action)
                let roomId = action.roomId;
                let userId = action.userId;
                room = state.allRooms[roomId];
                if (room) {
                    console.log("⚾️", room.activeUsers)
                    const updatedUsers = room.activeUsers - 1;
                    return {
                        ...state,
                        allRooms: {
                            ...state.allRooms,
                            [roomId]: {
                                ...room,
                                activeUsers: updatedUsers
                            }
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
                allRooms: allRooms
            };
        case ADD_ROOM:
            return {
                ...state,
                allRooms: {
                    ...state.allRooms,
                    [action.room.roomId]: {
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
