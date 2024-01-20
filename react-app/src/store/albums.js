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
