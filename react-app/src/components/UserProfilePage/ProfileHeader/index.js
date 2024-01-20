import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserReviews } from "../../../store/reviews";

//DISPLAY USERNAME AND AMOUNT OF REVIEWS

const ProfileHeader = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user)
    const reviewState = useSelector(state => state.reviews);

    useEffect(() => {
        dispatch(fetchUserReviews());
    }, [])

    const reviewsMade = Object.values(reviewState).length

    return (
        <div>
            <div>
                <img src={"placeholder"} />
                <p>{currentUser.username}</p>
            </div>

            <p>{reviewsMade}: Reviews </p>
        </div>
    );
}

export default ProfileHeader;
