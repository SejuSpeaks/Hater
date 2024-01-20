import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import { getAlbums } from '../../store/albums';

const GetAlbums = () => {
    const dispatch = useDispatch();
    const albums = useSelector(state => state.albums.albumsByRating);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAlbums()).then(() => {
            setIsLoaded(true);
        })
    }, [dispatch])

    return (
        <div className="albums-grid">
            {isLoaded &&
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
            }
        </div>
    )
}

export default GetAlbums;
