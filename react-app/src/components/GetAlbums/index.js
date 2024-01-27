import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlbums } from '../../store/albums';
import GetAlbumSearch from '../GetAlbumsSearch';
import { TbStarFilled } from "react-icons/tb";
import './GetAlbums.css'

const GetAlbums = () => {
    const dispatch = useDispatch();
    const albums = useSelector(state => state.albums.albumsByRating);
    const [isLoaded, setIsLoaded] = useState(false);
    const [noResultsMessage, setNoResultsMessage] = useState('');
    const [delayedSearchTimeout, setDelayedSearchTimeout] = useState(null);

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
        <div className="albums__search-grid">
            <GetAlbumSearch onSearch={handleSearchQuery}/>
            <div className="albums__grid">
                {isLoaded && albums.length ?
                albums.map(album => (
                    <Link key={album.id} to={`/albums/${album.id}`}>
                        <div className="albums__container">
                            <img className="albums__cover" src={album.image_url} alt={`${album.title} cover`} />
                            <p>{album.title}</p>
                            <p>{album.artist}</p>
                            <p>{album.genre}</p>
                            <p>{album.release_date}</p>
                            <div className="albums__rating"><TbStarFilled/> <span>{album.avg_rating || 'No Rating'}</span></div>
                        </div>
                    </Link>
                ))
                : <div>{noResultsMessage}</div>}
            </div>
        </div>

    )
}

export default GetAlbums;
