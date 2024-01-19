


const GET_USER_CREATED_ALBUMS = 'ALBUMS/GET_USER_CREATED_ALBUMS'

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




const albums = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case GET_USER_CREATED_ALBUMS:
            newState = { ...state }
            action.albums.map(album => newState[album.id] = album)
            return newState;

        default:
            return state;
    }
}

export default albums;
