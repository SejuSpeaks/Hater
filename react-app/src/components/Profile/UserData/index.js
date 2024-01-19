import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLikes } from '../../../store/likes';
import { fetchUserAlbums } from '../../../store/albums';
import './index.css';


const Reviews = () => {
    const reviews = useSelector(state => state.reviews)

    return Object.values(reviews).map(review => {
        return (
            <>
                <img src={review.image_url} />
                <p>{review.title}</p>
                <p>{review.release_date}</p>
            </>
        )
    })
}


const Likes = () => {
    const dispatch = useDispatch();
    const likes = useSelector(state => state.likes);


    useEffect(() => {
        dispatch(fetchLikes())
            .then()
    }, [])

    return Object.values(likes).map(like => {
        return (
            <>
                <img src={like.image_url} />
                <p>{like.title}</p>
                <p>{like.release_date}</p>
            </>
        )
    })


}

const Albums = () => {
    const dispatch = useDispatch();
    const albums = useSelector(state => state.albums);


    useEffect(() => {
        dispatch(fetchUserAlbums())
            .then()
    }, [])

    return Object.values(albums).map(album => {
        return (
            <>
                <img src={album.image_url} />
                <p>{album.title}</p>
                <p>{album.release_date}</p>
            </>
        )
    })
}


const UserData = () => {
    const [route, setRoute] = useState('reviews')


    return (
        <div>
            <div>
                <ul className='user-profile-nav-links'>
                    <li onClick={() => setRoute('reviews')}>All Reviews</li>
                    <li onClick={() => setRoute('likes')}>Likes</li>
                    <li onClick={() => setRoute('albums')}>All Albums</li>
                </ul>
            </div>
            <div>
                {route == 'reviews' && <Reviews />}
                {route == 'likes' && <Likes />}
                {route == 'albums' && <Albums />}
            </div>
        </div>
    );
};


export default UserData
