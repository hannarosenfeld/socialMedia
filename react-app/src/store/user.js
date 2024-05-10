export const GET_USER = "user/GET_USER"
const GET_USERS = "user/GET_USERS"

const getUserAction = (user) => ({
    type: GET_USER,
    user
})

const getUsersAction = (users) => ({
    type: GET_USERS,
    users
})


export const getUsersThunk = () => async (dispatch) => {
    const res = await fetch(`/api/users/`)
    if (res.ok) {
        const data = await res.json()
        await dispatch(getUsersAction(data))
        return data
    } else {
        const err = await res.json()
        return err
    }
}

export const getUserThunk = (userId) => async (dispatch) => {
    // 🚨 How can I always fetch from port 5000 in development??
    const res = await fetch(`http://localhost:5000/api/users/${userId}`); 
    if (res.ok) {
        const data = await res.json();
        console.log("🏛️", data); // Log the data after it's resolved
        dispatch(getUserAction(data));
        return data;
    } else {
        const err = await res.json();
        return err;
    }
}


const initialState = {};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS:
        case GET_USER:
        default:
            return state;
    }
}

export default userReducer;