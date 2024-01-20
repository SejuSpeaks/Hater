import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../../store/reviews";
import { fetchDeleteAlbum } from "../../store/albums";
import Reviews from "./tabs/reviews";
import Likes from "./tabs/likes";
import Albums from "./tabs/albums";


const UserProfilePage = () => {
    const user = useSelector(state => state.session.user);
    const reviewState = useSelector(state => state.reviews);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [tab, setTab] = useState('reviews');

    useEffect(() => {
        dispatch(fetchUserReviews())
            .then(() => setIsLoaded(true))
    }, [])


    const userReviews = Object.values(reviewState).length

    return (
        <div>
            <div>
                <img src="example" />
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
                {tab == 'reviews' && <Reviews />}
                {tab == 'likes' && <Likes />}
                {tab == 'albums' && <Albums />}
            </div>

        </div>


    );
}

export default UserProfilePage;
