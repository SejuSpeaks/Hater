

import { useModal } from "../../context/Modal";
import './index.css';

const ConfirmDelete = ({ albumId, deleteAlbum }) => {
    const { closeModal } = useModal();

    return (
        <div className="delete-album-container">
            <b id="delete-album-confirm-delete">Delete Album</b>
            <p>Confirm album removal</p>

            <div className="delete-album-buttons-container">
                <button className="delete-album-buttons-delete" onClick={() => deleteAlbum(albumId)}>Yes (Delete Album)</button>
                <button className="delete-album-buttons" onClick={closeModal}>No (Keep Album)</button>
            </div>
        </div>
    )
}

export default ConfirmDelete;
