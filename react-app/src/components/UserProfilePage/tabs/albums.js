import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAlbums } from "../../../store/albums";
import ConfirmDelete from "../../ConfirmDelete";
import OpenModalButton from "../../OpenModalButton";



const Albums = ({ deleteAlbum, isDeleted }) => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const albums = useSelector(state => state.albums);

    useEffect(() => {
        dispatch(fetchUserAlbums())
            .then(() => setIsLoaded(true))
    }, [isDeleted, dispatch])


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
