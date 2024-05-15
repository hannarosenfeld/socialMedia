const ADD_ROOM = "room/ADD_ROOM";
const GET_ALL_ROOMS = "room/GET_ALL_ROOMS";
const GET_ROOM_USERS = "room/GET_ROOM_USERS";
const ENTER_ROOM = "room/ENTER_ROOM";

const getRoomUsersAction = (roomId, users) => ({
    type: GET_ROOM_USERS,
    roomId,
    users
});

const enterRoomAction = (payload) => ({
    type: ENTER_ROOM,
    payload
})


const getAllRoomsAction = (rooms) => ({
    type: GET_ALL_ROOMS,
    rooms
})
// const addRoomAction = (room) = ({
//     type: ADD_ROOM,
//     payload
// })

export const addRoomThunk = (roomData) => async (dispatch) => {
    console.log("💄", roomData)
    const res = await fetch("/api/rooms/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(roomData)
    });
    console.log("🥞", res)
    if (res.ok) {
        const data = await res.json();
        await dispatch(getAllRoomsAction(data))
        return data
    } else {
        const err = (await res).json
        return err
    }
}

export const getAllRoomsThunk = () => async (dispatch) => {
    const res = await fetch("/api/rooms");
    if (res.ok) {
        const data = await res.json();
        await dispatch(getAllRoomsAction(data))
        return data
    } else {
        const err = (await res).json
        return err
    }
}

export const getRoomUsersThunk = (roomId) => async (dispatch) => {
    const res = await fetch("/api/rooms");
    if (res.ok) {
        const data = await res.json();
        await dispatch(getAllRoomsAction(data))
        return data
    } else {
        const err = (await res).json
        return err
    }
}

export const enterRoomThunk = (userId, roomName) => async (dispatch) => {
    const entrance = {
        "user_id" : userId, 
        "room_name" : roomName.split("-").join(" ")
    }
    const res = await fetch(`/api/rooms/${roomName}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(entrance)
    });
    if (res.ok) {
        const data = await res.json();
        await dispatch(enterRoomAction(data))
        return data
    } else {
        const err = (await res).json
        return err
    }
}


const initialState = {};

const roomReducer = (state = initialState, action) => {
    let newState = {...state}
    switch (action.type) {
        case ENTER_ROOM:
            const room = action.payload.room;
            const user = action.payload.user;
            const existingRoom = state[room.id];

            return {
                ...state,
                currentRoom: {
                    room,
                    users: existingRoom && existingRoom.users ? [...existingRoom.users, user.username] : [user.username]    
                }                 
            };
        case GET_ALL_ROOMS:
            const rooms = action.rooms
            rooms.map(room => {
                newState[room.id] = room
            })
            return newState;
        case ADD_ROOM:
            return {
                ...state,
                [action.room.id] : action.room
            }
        default:
            return state;
    }
}

export default roomReducer;