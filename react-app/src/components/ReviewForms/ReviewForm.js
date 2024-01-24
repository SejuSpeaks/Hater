import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createReview, fetchEditReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import './ReviewForm.css';

const ReviewForm = (props) => {
    const dispatch = useDispatch();
    const { review, formType } = props
    const albumId = useSelector((state) => state.albums.album.id);

    const [errors, setErrors] = useState({})
    const [rating, setRating] = useState(review?.rating)
    const [reviewText, setReviewText] = useState(review?.reviewText);
    // const [isDisabled, setIsDisabled] = useState(true)
    const [hoveredStarNum, setHoveredStarNum] = useState(null);

    const { closeModal } = useModal();

    // useEffect(() => {
    //     setErrors({});

    //     if (!reviewText
    //         || !rating) {
    //             setIsDisabled(true)
    //         } else {
    //             setIsDisabled(false)
    //         }

    // }, [reviewText, rating])

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

        if (!reviewText) {
            setErrors(prevErrors => ({ ...prevErrors, "reviewText": "Please add your review" }));
        }

        if (!rating || rating < 1 || rating > 5) {
            setErrors(prevErrors => ({ ...prevErrors, "rating": "Please select a star rating" }));
        }

        let reviewData = {};
        let newReview = {};
        reviewData.rating = rating;
        reviewData.review_text = reviewText;
        reviewData.album_id = albumId;

        if (!review) {
            newReview = await dispatch((createReview(reviewData)))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors)
                    }
                })
        } else if (formType === "Update Review") {
            newReview = await dispatch(fetchEditReview(review))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors)
                    }
                });
        }
        if (newReview) {
            closeModal();
        }
    }

    const header = review ? "Update Your Review" : "Create a Review"

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h1>{header}</h1>
            {Object.keys(errors).length !== 0 && <p>{`Errors: ${Object.values(errors)}`}</p>}
            <h2>How was this album?</h2>
            <textarea
                type="textarea"
                id="review-text-input"
                placeholder="Leave your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <div className="star-container">
                {
                    starArray.map((starVal) => (
                        <i key={starVal}
                            className={`fa-solid fa-star star ${starVal <= (hoveredStarNum || rating ? "active" : "")}`}
                            onMouseEnter={() => handleStarHover(starVal)}
                            onMouseLeave={() => handleStarHover(null)}
                            onClick={handleStarClick}
                        ></i>
                    ))
                }
            </div>
            <button
                type="submit"
                className={`clickable`}
                id="submit-review-button"
            >
                Submit
            </button>
        </form>
    )
}

export default ReviewForm
