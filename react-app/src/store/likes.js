const GET_USER_LIKES = 'LIKES/GETLIKES'

/*-------------------------------------------------------------------------------------- */

const getLikes = (likes) => {
    return {
        type: GET_USER_LIKES,
        likes
    }
}


export const fetchLikes = () => async dispatch => {
    console.log('we are fetching likes')
    const response = await fetch('/api/likes/current');

    if (response.ok) {
        console.log('response worked for likes')
        const data = await response.json();
        console.log(data, 'this is the data');
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
