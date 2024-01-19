const GET_USER_LIKES = 'LIKES/GETLIKES'

/*-------------------------------------------------------------------------------------- */

const getLikes = (likes) => {
    return {
        type: GET_USER_LIKES,
        likes
    }
}


export const fetchLikes = () => async dispatch => {
    const response = await fetch('/api/likes/current');

    if (response.ok) {
        const data = await response.json();
        dispatch(getLikes(data['user likes']));
        return data['user likes'];
    }
}


/*-------------------------------------------------------------------------------------- */




const likes = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_USER_LIKES:
            newState = { ...state }
            action.likes.map(like => newState[like.id] = like)
            return newState;

        default:
            return state;
    }
}

export default likes;
