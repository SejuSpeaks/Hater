import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLikes } from '../../../store/likes';
import { fetchUserAlbums, fetchDeleteAlbum } from '../../../store/albums';
import OpenModalButton from '../../OpenModalButton';
import { useModal } from '../../../context/Modal';
import ConfirmDelete from '../../ConfirmDelete';
import './index.css';
import { Link, NavLink, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';


//USER'S REVIEWD ALBUMS
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

//USER LIKES
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

//USER CREATED ALBUMS
const Albums = () => {
    const dispatch = useDispatch();
    const albums = useSelector(state => state.albums);
    const [isDeleted, setIsDeleted] = useState(false)
    const { closeModal } = useModal()


    useEffect(() => {
        dispatch(fetchUserAlbums())
            .then()
    }, [isDeleted])


    const deleteAlbum = (id) => {
        dispatch(fetchDeleteAlbum(id))
            .then(closeModal)
            .then(() => setIsDeleted(true))
    }



    return Object.values(albums).map(album => {
        return (
            <>
                <img src={album.image_url} />
                <p>{album.title}</p>
                <p>{album.release_date}</p>
                <div>
                    <button>UPDATE</button>
                    <OpenModalButton buttonText={"DELETE"} modalComponent={<ConfirmDelete album={album} deleteAlbum={deleteAlbum} />} />
                </div>
            </>
        )
    })
}

//PARENT COMPONENET GETTING RENDERED
const UserData = () => {
    const [route, setRoute] = useState('reviews')


    return (
        <div>
            <div>
                <ul className='user-profile-nav-links'>
                    <NavLink to='/current/reviews' >All Reviews</NavLink>
                    <NavLink to='/current/likes' >Likes</NavLink>
                    <NavLink to='/current/albums' >All Albums</NavLink>
                </ul>
            </div>
            <div>
                <Switch>
                    <Route path='/current/reviews'>
                        <Reviews />
                    </Route>
                    <Route path='/current/albums'>
                        <Albums />
                    </Route>
                    <Route path='/current/likes'>
                        <Likes />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};


export default UserData
