import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumReviews, fetchDeleteReview } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../ReviewForms/ReviewForm";
import ConfirmReviewDelete from "./ConfirmReviewDelete";
import DisplayStars from "./DisplayStars";
import "./displayAlbumReviews.css";

export const DisplayAlbumReviews = (props) => {
    const dispatch = useDispatch();
    const { albumId, userId } = props;

    const reviews = useSelector((state) => {
        return state.reviews.albumReviews;
    });

    const user = useSelector((state) => {
        return state.session.user;
    });

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                await dispatch(fetchAlbumReviews(albumId));
            } catch (error) {
                console.error("error fetching review data");
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
            <div className="single-review-container" key={id}>
            <div className="single-review">
                <p className="user-name">@{review["username"] ? review["username"] : user.username}</p>
                <div className="rating-and-star">
                    <DisplayStars rating={review["rating"]}/>
                </div>
                <p className="review-text">{review["review_text"]}</p>
                {showButtons ? (
                    <div className="modal-buttons">
                        <OpenModalButton
                            className="edit-review-button clickable review-buttons"
                            buttonText="EDIT"
                            modalComponent={<ReviewForm review={review} formType="Update Review"/>}
                        />
                        <OpenModalButton
                            className="delete-review-button clickable review-buttons"
                            buttonText="DELETE"
                            modalComponent={<ConfirmReviewDelete reviewId={review.id} deleteReview={fetchDeleteReview} albumId={albumId}/>}
                        />
                    </div>
                ) : (
                <></>)}
            </div>
            </div>
            )
        });
    }

    return (
        <div>
            {(reviews && Object.keys(reviews).length > 0) ? (
                <div className="reviews-list">
                    {renderedReviews}
                </div>
                ) : (
                <></>
            )}
        </div>
    )
}
