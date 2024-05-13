const ADD_ROOM = "room/ADD_ROOM";
const GET_ALL_ROOMS = "room/GET_ALL_ROOMS";

const getAllRoomsAction = (rooms) => ({
    type: GET_ALL_ROOMS,
    rooms
})
// const addRoomAction = (room) = ({
//     type: ADD_ROOM,
//     payload
// })

export const addRoomThunk = (roomData) => async (dispatch) => {
}

export const getAllRoomsThunk = () => async (dispatch) => {
    const res = await fetch("/api/rooms");
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

const initialState = {};

const roomReducer = (state = initialState, action) => {
    console.log("🥚", action)
    let newState = {...state}
    switch (action.type) {
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