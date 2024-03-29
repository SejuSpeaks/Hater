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

export const postAlbumLike = (albumId) => async dispatch => {
    try {
        await fetch(`/api/albums/${albumId}/likes`, {
            method: 'POST'
        })
    }
    catch (err) {
        return err
    }

}

export const deleteAlbumLike = (albumId) => async dispatch => {
    try {
        await fetch(`/api/albums/${albumId}/likes`, {
            method: 'DELETE'
        })
    }
    catch (err) {
        return err
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
