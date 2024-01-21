

import { useModal } from "../../context/Modal";


const ConfirmDelete = ({ albumId, deleteAlbum }) => {
    const { closeModal } = useModal();




    return (
        <div>
            <b>Confirm Delete</b>
            <p>Are you sure you want to remove this Album?</p>

            <div>
                <button onClick={() => deleteAlbum(albumId)}>Yes (Delete Album)</button>
                <button onClick={closeModal}>No (Keep Album)</button>
            </div>
        </div>
    )
}

export default ConfirmDelete;
