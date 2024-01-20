import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { fetchDeleteAlbum } from "../../store/albums";
import Reviews from "./tabs/reviews";
import Likes from "./tabs/likes";
import Albums from "./tabs/albums";
import { Redirect } from "react-router-dom";


const UserProfilePage = () => {
    const user = useSelector(state => state.session.user);
    const reviewState = useSelector(state => state.reviews);
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [isDeleted, setIsDeleted] = useState(false);
    const [tab, setTab] = useState('reviews');


    useEffect(() => {
        dispatch(fetchUserReviews())
    }, [isDeleted, dispatch])

    if (!user) {
        return <Redirect to='/' />
    }

    console.log('this is the user when logged in', user);



    const deleteAlbum = (id) => {
        dispatch(fetchDeleteAlbum(id))
            .then(closeModal)
            .then(() => setIsDeleted(true))
    }



    const userReviews = Object.values(reviewState).length

    return (
        <div>
            <div>
                <img src="example" alt="user-profile-pic" />
                <p>{user.username}</p>
                <p>{userReviews}: Reviews</p>
            </div>

            <div>

                <ul>
                    <li onClick={() => setTab('reviews')}>Reviews</li>
                    <li onClick={() => setTab('likes')}>Likes</li>
                    <li onClick={() => setTab('albums')}>Albums</li>
                </ul>
            </div>

            <div>
                {tab === 'reviews' && <Reviews />}
                {tab === 'likes' && <Likes />}
                {tab === 'albums' && <Albums deleteAlbum={deleteAlbum} isDeleted={isDeleted} />}
            </div>

        </div>


    );
}

export default UserProfilePage;
