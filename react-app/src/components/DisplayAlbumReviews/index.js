import React from react;
import { useDispatch, useParams } from "react-redux";
import { fetchAlbumReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewForms from "../ReviewForms/ReviewForm";
import "./displayAlbumReviews.css";

export const DisplayAlbumReviews = () => {
    const dispatch = useDispatch;

    const { albumId, userId } = useParams();

    const reviews = useSelector((state) => {
        return state.reviews.albumReviews
    });

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                dispatch(fetchAlbumReviews(albumId))
            } catch (error) {
                console.error("error fetching album and review data")
            }
        }
        fetchReviewData()
    }, [dispatch, albumId]);

    let renderedReviews;
    if (reviews && Object.keys(reviews).length > 0) {
        const reviewArray = Object.values(reviews);
        const reviewArrayIds = Object.keys(reviewArray);

        renderedReviews = reviewArrayIds.reverse().map((id) => {
            const review = reviewArray[id]
            return (
            <div key={id}>
                <p>{review["created_at"]}</p>
                <p>user_id, will be username: {review["user_id"]}</p>
                <p>{review["rating"]} stars</p>
                <p>{review["review_text"]}</p>
                {/*if review.user_id == userId, show open modal buttons*/}
            </div>
            )
            });
    }


    return (
        <div>
            {renderedReviews}
        </div>
    )
}
