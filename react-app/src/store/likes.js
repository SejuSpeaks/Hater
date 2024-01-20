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
        const data = await response.json();
        dispatch(getLikes(data['user likes']));
        return data['user likes'];
    }
}


/*-------------------------------------------------------------------------------------- */




const likes = (state = {}, action) => {
    switch (action.type) {
        case GET_USER_LIKES:
            const likes = action.likes.reduce((obj, like) => {
                obj[like.id] = like;
                return obj
            }, {});
            return { ...likes }

        default:
            return state;
    }
}

export default likes;
