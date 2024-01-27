import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import { getAlbumDetails } from "../../../store/albums";
import "./ConfirmReviewDelete.css";

const ConfirmReviewDelete = (props) => {
    const { reviewId, deleteReview, albumId } = props;
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    return (
        <div className="delete-review-container">
            <b id="delete-review-confirm-delete">Delete Review</b>
            <p>Confirm review deletion</p>

            <div className="delete-review-buttons-container">
                <button
                    className="delete-review-buttons-delete clickable"
                    onClick={async () => dispatch(deleteReview(reviewId))
                    .then(() => closeModal())
                    .then(async () => dispatch(getAlbumDetails(albumId)))}>
                    Yes (Delete Review)
                </button>
                <button
                    className="delete-review-buttons clickable"
                    onClick={closeModal}>
                    No (Keep Review)
                </button>
            </div>
        </div>
    )
}

export default ConfirmReviewDelete;
