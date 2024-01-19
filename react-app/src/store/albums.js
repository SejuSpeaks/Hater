import { csrfFetch } from "./csrf"

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
