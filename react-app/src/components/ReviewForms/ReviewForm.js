import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createReview, updateReview } from "../../store/review";
import { useModal } from "../../context/Modal";
import './ReviewForm.css';

const ReviewForm = (props) => {
    const dispatch = useDispatch();
    // const { albumId } = useParams();
    const { review, formType } = props

    const [errors, setErrors] = useState({})
    const [rating, setRating] = useState(review?.rating)
    const [reviewText, setReviewText] = useState(review?.reviewText);
    const [isDisabled, setIsDisabled] = useState(true)
    const [hoveredStarNum, setHoveredStarNum] = useState(null);

    const { closeModal } = useModal();

    useEffect(() => {
        if (!reviewText
            || ! rating) {
                setIsDisabled(true)
            } else {
                setIsDisabled(false)
            }
    }, [reviewText, rating])

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

        review = { rating, reviewText }

        let newReview;

        if (formType === "Create Review") {
            newReview = await dispatch((createReview(review)))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
        } else if (formType === "Update Review") {
            newReview = await dispatch(updateReview(review))
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
            {Object.keys(errors).length !== 0 && <p>{`Errors: ${Object.keys(errors)}`}</p>}
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
            disabled={isDisabled}
            className={`${isDisabled.toString()} clickable`}
            id="submit-review-button"
            >
            Submit
            </button>
        </form>
    )
}

export default ReviewForm
