


const GET_USER_CREATED_ALBUMS = 'ALBUMS/GET_USER_CREATED_ALBUMS'
const DELETE_USER_ALBUM = 'ALBUMS/DELETE_USER_ALBUM';


/*------------------GET USER ALBUMS------------------------------------- */
const getUserAlbums = (albums) => {
    return {
        type: GET_USER_CREATED_ALBUMS,
        albums
    }
}


export const fetchUserAlbums = () => async dispatch => {
    const response = await fetch('/api/albums/current');

    if (response.ok) {
        const data = await response.json();
        dispatch(getUserAlbums(data['user albums']));
        return data['user albums'];
    }
}

/*---------------------------------DELETE ALBUM----------------------------------------- */


const deleteUserAlbum = (album, id) => {
    return {
        type: DELETE_USER_ALBUM,
        album,
        id
    }
}


export const fetchDeleteAlbum = (id) => async dispatch => {
    const response = await fetch(`/api/albums/${id}`, {
        method: "DELETE"
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(deleteUserAlbum(data, id))
        return data;
    }


}


/*------------------------------------------------------------------------------------- */





const albums = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_USER_CREATED_ALBUMS:
            newState = { ...state }
            action.albums.map(album => newState[album.id] = album)
            return newState;

        case DELETE_USER_ALBUM:
            newState = { ...state }
            delete newState[action.id]
            return newState;

        default:
            return state;
    }
}

export default albums;
