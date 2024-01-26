import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../ReviewForms/ReviewForm";
import "./displayAlbumReviews.css";

// currently showing: <DisplayAlbumReviews userId={user.id} albumId={albumId}/>

export const DisplayAlbumReviews = (props) => {
    const dispatch = useDispatch();
    const { albumId, userId } = props;

    const reviews = useSelector((state) => {
        return state.reviews.albumReviews;
    });

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                dispatch(fetchAlbumReviews(albumId))
            } catch (error) {
                console.error("error fetching review data")
            }
        }
        fetchReviewData()
    }, [dispatch, albumId]);

    let renderedReviews;
    if (reviews && Object.keys(reviews).length > 0) {
        const reviewArray = Object.values(reviews);
        const reviewArrayIds = Object.keys(reviewArray);

        renderedReviews = reviewArrayIds.reverse().map((id) => {
            const review = reviewArray[id];
            const showButtons = (review.user_id == userId);
            return (
            <div key={id}>
                <p>{review["created_at"]}</p>
                <p>user_id, will be username: {review["user_id"]}</p>
                <p>{review["rating"]} stars</p>
                <p>{review["review_text"]}</p>
                {showButtons ? (
                    <div className="modalButtons">
                        <OpenModalButton
                        className="edit-review-button clickable"
                        buttonText="EDIT"
                        modalComponent={<ReviewForm review={review} formType="Update Review"/>}
                    />
                    </div>
                ) : (
                <h1>show buttons false</h1>)}
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
