import { fetchUserReviews } from "../../../store/reviews";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfileHeader = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => state.reviews)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserReviews())
            .then(() => setIsLoaded(true))
    }, [])


    const reviewArray = Object.values(reviews)
    const pluralForWordReview = reviewArray.length > 1 ? "REVIEWS" : "REVIEW";
    console.log(reviewArray);

    return (
        <div>
            <div>
                <p>{user.username}</p>
                <p>{reviewArray.length} {pluralForWordReview}</p>
            </div>
        </div>
    );
}

export default ProfileHeader;
