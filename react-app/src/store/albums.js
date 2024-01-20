const GET_ALBUMS = "albums/GET_ALBUMS";


export const getAlbumsAction = (albums) => ({
    type: GET_ALBUMS,
    albums: albums.albums
});

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

const albumsReducer = (state = {}, action) => {
    switch(action.type) {
        case GET_ALBUMS: {
            const albums = action.albums.reduce((obj, album) => {
                obj[album.id] = album;
                return obj
            }, {});
            return { ...albums, albumsByRating: action.albums }
        }
        default: {
            return state;
        }
    }
}

export default albumsReducer
export const ALBUM_DETAILS = 'albums/ALBUM_DETAILS';


export const albumDetails = (album) => ({
    type: ALBUM_DETAILS,
    album
})

export const getAlbumDetails = (albumId) => async (dispatch) => {
    const res = await fetch(`/api/albums/${albumId}`)

    if (res.ok) {
        const data = await res.json();
        dispatch(albumDetails(data));
        return data
    }
    return res;
}

const albumsReducer = (state = {}, action) => {
    switch(action.type) {
        case ALBUM_DETAILS:
            return { ...state, [action.album.id]: action.album}
        default:
            return state;
    }
}

export default albumsReducer
