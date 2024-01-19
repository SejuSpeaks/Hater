

import { useModal } from "../../context/Modal";
import { fetchDeleteAlbum, fetchUserAlbums } from "../../store/albums";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const ConfirmDelete = ({ album, deleteAlbum }) => {
    const dispatch = useDispatch();
    const history = useHistory()
    const { closeModal } = useModal();



    return (
        <div>
            <b>Confirm Delete</b>
            <p>Are you sure you want to remove this Album?</p>

            <div>
                <button onClick={() => deleteAlbum(album.id)}>Yes (Delete Album)</button>
                <button onClick={closeModal}>No (Keep Album)</button>
            </div>
        </div>
    )
}

export default ConfirmDelete
