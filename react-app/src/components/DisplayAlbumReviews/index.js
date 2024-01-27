import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumReviews, fetchDeleteReview } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../ReviewForms/ReviewForm";
import ConfirmReviewDelete from "./ConfirmReviewDelete";
import "./displayAlbumReviews.css";

export const DisplayAlbumReviews = (props) => {
    const dispatch = useDispatch();
    const { albumId, userId } = props;

    const reviews = useSelector((state) => {
        return state.reviews.albumReviews;
    });

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                await dispatch(fetchAlbumReviews(albumId))
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
            const showButtons = (review.user_id === userId);

            return (
            <div key={id}>
                <p>{review["created_at"]}</p>
                <p>{review["username"]}</p>
                <p>{review["rating"]} stars</p>
                <p>{review["review_text"]}</p>
                {showButtons ? (
                    <div className="modalButtons">
                        <OpenModalButton
                            className="edit-review-button clickable"
                            buttonText="EDIT"
                            modalComponent={<ReviewForm review={review} formType="Update Review"/>}
                        />
                        <OpenModalButton
                            className="delete-review-button clickable"
                            buttonText="DELETE"
                            modalComponent={<ConfirmReviewDelete reviewId={review.id} deleteReview={fetchDeleteReview}/>}
                        />
                    </div>
                ) : (
                <></>)}
            </div>
            )
            });
    }

    return (
        <div>
            {(reviews && Object.keys(reviews).length > 0) ? (
                <div>{renderedReviews}</div>
                ) : (
                <p>Be the first to post a review!</p>
            )}
        </div>
    )
}
