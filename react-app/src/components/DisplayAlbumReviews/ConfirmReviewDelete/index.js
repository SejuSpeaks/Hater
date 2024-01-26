import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import "./ConfirmReviewDelete.css";

const ConfirmReviewDelete = (props) => {
    const { reviewId, deleteReview } = props;
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    return (
        <div className="delete-review-container">
            <b id="delete-review-confirm-delete">Delete Review</b>
            <p>Confirm review deletion</p>

            <div className="delete-review-buttons-container">
                <button className="delete-review-buttons-delete" onClick={async () => dispatch(deleteReview(reviewId))
                    .then(() => closeModal())}>
                    Yes (Delete Review)
                </button>
                <button className="delete-review-buttons" onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default ConfirmReviewDelete;
