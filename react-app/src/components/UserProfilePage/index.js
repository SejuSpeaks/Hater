import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { fetchDeleteAlbum } from "../../store/albums";
import Reviews from "./tabs/reviews";
import Likes from "./tabs/likes";
import Albums from "./tabs/albums";
import { Redirect } from "react-router-dom";

import './index.css';

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
            <div className="profile-page-user-container">

                <div>
                    <img id="profile-page-user-img" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="user-profile-pic" />
                </div>

                <div className="profile-page-user-info-container">
                    <p id="profile-page-username">{user.username}</p>
                    <p id="profile-page-reviews">{userReviews}: Reviews</p>
                </div>

            </div>

            <div className="profile-page-tabs-container">

                <ul className="profile-page-tabs-ul">
                    <li className="profile-page-tab-item" onClick={() => setTab('reviews')}>Reviews</li>
                    <li className="profile-page-tab-item" onClick={() => setTab('likes')}>Likes</li>
                    <li className="profile-page-tab-item" onClick={() => setTab('albums')}>Albums</li>
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
