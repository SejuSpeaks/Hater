import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import { getAlbums } from '../../store/albums';
import GetAlbumSearch from '../GetAlbumsSearch';

const GetAlbums = () => {
    const dispatch = useDispatch();
    const albums = useSelector(state => state.albums.albumsByRating);
    const [isLoaded, setIsLoaded] = useState(false);
    const [noResultsMessage, setNoResultsMessage] = useState('');
    const [delayedSearchTimeout, setDelayedSearchTimeout] = useState(null);
    console.log("albums", albums)
    useEffect(() => {
        dispatch(getAlbums()).then(() => {
            setIsLoaded(true);
        })
    }, [dispatch])

    const handleSearchQuery = query => {
        setIsLoaded(false);

        if (delayedSearchTimeout) {
            clearTimeout(delayedSearchTimeout);
        }

        // add delay to prevent response flashing while typing
        const timeoutId = setTimeout(() => {
            dispatch(getAlbums(query)).then((response) => {
                setIsLoaded(true);

                // set message to "No Results Found" if nothing comes back
                if (response && !response.albums.length) {
                    setNoResultsMessage('No Results Found');
                } else {
                // clear the message if results are found
                    setNoResultsMessage('');
                }
            });
        }, 500);

        setDelayedSearchTimeout(timeoutId);
    }

    return (
        <div className="album__search-grid">
            <GetAlbumSearch onSearch={handleSearchQuery}/>
            <div className="albums-grid">
                {isLoaded && albums.length ?
                albums.map(album => (
                    <ul key={album.id} className="album">
                        <li>{album.image_url}</li>
                        <li>{album.title}</li>
                        <li>{album.artist}</li>
                        <li>{album.genre}</li>
                        <li>{album.release_date}</li>
                        <li>{album.avg_rating || 'No Rating'}</li>
                    </ul>
                ))
                : <div>{noResultsMessage}</div>}
            </div>
        </div>

    )
}

export default GetAlbums;
