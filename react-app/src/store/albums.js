const GET_ALBUMS = "albums/GET_ALBUMS";

const GET_USER_CREATED_ALBUMS = 'ALBUMS/GET_USER_CREATED_ALBUMS'
const DELETE_USER_ALBUM = 'ALBUMS/DELETE_USER_ALBUM';
const ALBUM_DETAILS = 'albums/ALBUM_DETAILS';
const ADD_ALBUM = 'albums/ADD_ALBUM';
const UPDATE_ALBUM = 'albums/UPDATE_ALBUM';


export const getAlbumsAction = (albums) => ({
    type: GET_ALBUMS,
    albums: albums.albums
});

export const albumDetails = (album) => ({
    type: ALBUM_DETAILS,
    album: album
})

export const addAlbum = (album) => ({
    type: ADD_ALBUM,
    payload: album
})

export const editAlbum = (album) => ({
    type: UPDATE_ALBUM,
    album
})

export const getAlbums = search => async dispatch => {
    let query = '';
    if (search) {
        query = `?search=${search}`;
    }

    try {
        const res = await fetch(`/api/albums${query}`);
        const albums = await res.json();
        dispatch(getAlbumsAction(albums));
        return albums;
    } catch (err) {
        return err;
    }
};




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


export const getAlbumDetails = (albumId) => async dispatch => {
    const res = await fetch(`/api/albums/${albumId}`)

    if (res.ok) {
        const data = await res.json();
        dispatch(albumDetails(data));
        return data;
    }
    return res;
}

export const createAlbum = (payload) => async (dispatch) => {
    const res = await fetch('/api/albums', {
        method: 'POST',
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addAlbum(data))
        return data;
    }
    return res
}

export const updateAlbum = (payload) => async (dispatch) => {
    const res = await fetch(`/api/albums/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(editAlbum(data));
        return data
    }
    return res;
}

const albumsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALBUMS: {
            const albums = action.albums.reduce((obj, album) => {
                obj[album.id] = album;
                return obj
            }, {});
            return { ...albums, albumsByRating: action.albums }
        }

        case GET_USER_CREATED_ALBUMS:
            const albums = action.albums.reduce((obj, album) => {
                obj[album.id] = album;
                return obj
            }, {});
            return { ...state, ...albums }

        case DELETE_USER_ALBUM:
            let newState = { ...state }
            delete newState[action.id]
            return newState;

        case ALBUM_DETAILS:
            return { ...action.album}

        case ADD_ALBUM:
            return { ...state, [action.payload.id]: action.payload };
        case UPDATE_ALBUM:
            // const reducer = { ...state, [action.album.id]: action.album}
            // console.log("reducer", state)
            return { ...state, [action.album.id]: action.album}

        default: {
            return state;
        }

    }
}

export default albumsReducer









/*------------------------------------------------------------------------------------- */
