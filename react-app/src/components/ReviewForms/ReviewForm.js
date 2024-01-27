import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview, fetchEditReview } from "../../store/reviews";
import { getAlbumDetails } from "../../store/albums";
import { useModal } from "../../context/Modal";
import './ReviewForm.css';

const ReviewForm = (props) => {
    const dispatch = useDispatch();
    const { review } = props
    const albumId = useSelector((state) => state.albums.album.id);

    const [errors, setErrors] = useState({})
    const [rating, setRating] = useState(review ? review.rating : "")
    const [reviewText, setReviewText] = useState(review ? review.review_text : "");
    const [isDisabled, setIsDisabled] = useState(true);
    const [hoveredStarNum, setHoveredStarNum] = useState(null);

    const { closeModal } = useModal();

    useEffect(() => {
        if (reviewText.length < 10
            || !rating) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }

    }, [reviewText, rating]);

    const handleStarHover = (num) => {
        setHoveredStarNum(num);
    };

    const handleStarClick = () => {
        setRating(hoveredStarNum);
    };

    let starArray = [1, 2, 3, 4, 5]

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let reviewData = {};
        reviewData.rating = rating;
        reviewData.review_text = reviewText;
        reviewData.album_id = albumId;

        if (!review) {
            try {
                await dispatch((createReview(reviewData)));
                await dispatch(getAlbumDetails(albumId));
            }
            catch (error) {
                console.error("Error: ", error);
            }
        }

        else {
            try {
                review.review_text = reviewText;
                review.rating = rating;
                await dispatch(fetchEditReview(review));
                await dispatch(getAlbumDetails(albumId));
            } catch (error) {
                console.error("Error: ", error);
            }
        }
        closeModal();
    }

    const header = review ? "UPDATE YOUR REVIEW" : "CREATE A REVIEW"

    return (
        <div className="review-form-modal">
            <form className="review-form"
                onSubmit={handleSubmit}>
                <h1>{header}</h1>
                {Object.keys(errors).length !== 0 && <p>{`Errors: ${Object.values(errors)}`}</p>}
                <label htmlFor="review-text-input" id="review-text-input-label">How was this album?</label>
                <textarea
                    type="textarea"
                    id="review-text-input"
                    placeholder="Love it or hate it?"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                <div className="star-container">
                    {
                        starArray.map((starVal) => (
                            <i key={starVal}
                                className={`far fa-star star ${starVal <= (hoveredStarNum || rating) ? "active fas" : ""}`}
                                onMouseEnter={() => handleStarHover(starVal)}
                                onMouseLeave={() => handleStarHover(null)}
                                onClick={handleStarClick}
                            ></i>
                        ))
                    }
                </div>
                <button
                    type="submit"
                    isdisabled={isDisabled.toString()}
                    className={`${isDisabled.toString()} ${!isDisabled ? " clickable" : ""}`}
                    id="submit-review-button"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ReviewForm
