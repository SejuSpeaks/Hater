import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../ReviewForms/ReviewForm";
import "./displayAlbumReviews.css";

export const DisplayAlbumReviews = (props) => {
    const dispatch = useDispatch();
    const { albumId, userId } = props;

    const reviews = useSelector((state) => {
        return state.reviews.albumReviews;
    });

    const [usernames, setUsernames] = useState({});

    const getUsername = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}`)
            const data = await response.json();
            return data.username;

        } catch (error) {
            console.error(error);
            return "";
        }
    }

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

    useEffect(() => {
        const fetchUsernames = async () => {
          const usernamesObj = {};
          const reviewArray = Object.values(reviews);

          for (const review of reviewArray) {
            const username = await getUsername(review.user_id);
            usernamesObj[review.id] = username;
          }
          setUsernames(usernamesObj);
        };

        if (reviews && Object.keys(reviews).length > 0) {
            fetchUsernames();
        }
      }, [albumId, reviews]);

    let renderedReviews;
    if (reviews && Object.keys(reviews).length > 0) {
        const reviewArray = Object.values(reviews);
        const reviewArrayIds = Object.keys(reviewArray);

        renderedReviews = reviewArrayIds.reverse().map((id) => {
            const review = reviewArray[id];
            const showButtons = (review.user_id === userId);
            const username = usernames[review.id];

            return (
            <div key={id}>
                <p>{review["created_at"]}</p>
                <p>{username}</p>
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
