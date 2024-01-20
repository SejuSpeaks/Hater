import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeleteAlbum, fetchUserAlbums } from "../../../store/albums";
import ConfirmDelete from "../../ConfirmDelete";
import { useModal } from "../../../context/Modal";
import OpenModalButton from "../../OpenModalButton";



const Albums = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const { closeModal } = useModal();
    const albums = useSelector(state => state.albums);

    useEffect(() => {
        dispatch(fetchUserAlbums())
            .then(() => setIsLoaded(true))
    }, [isDeleted])


    const deleteAlbum = (id) => {
        dispatch(fetchDeleteAlbum(id))
            .then(closeModal)
            .then(setIsDeleted(true))
    }


    const userAlbums = Object.values(albums).map(album => {
        return (
            <>
                <p>{album.title}</p>
                <button>UPDATE</button>
                <OpenModalButton buttonText={"DELETE"} modalComponent={<ConfirmDelete deleteAlbum={deleteAlbum} albumId={album.id} />} />
            </>
        );
    })


    return (
        <div>
            {isLoaded && userAlbums}
        </div>
    );

}

export default Albums;
