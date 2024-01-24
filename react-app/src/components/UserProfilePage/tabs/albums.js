import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAlbums } from "../../../store/albums";
import ConfirmDelete from "../../ConfirmDelete";
import OpenModalButton from "../../OpenModalButton";

import '../index.css';

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
            <div>
                <img src={album.image_url} alt="album picture" id="profile-page-album-image" />

                <div id="profile-page-album-data-container">
                    <p id="profile-page-album-artist">{album.artist}</p>
                    <p id="profile-page-album-title">{album.title}</p>
                </div>

                <button id="profile-page-album-button">UPDATE</button>
                <OpenModalButton buttonText={"DELETE"} modalComponent={<ConfirmDelete deleteAlbum={deleteAlbum} albumId={album.id} />} />
            </div>
        );
    })


    return (
        <div id="profile-page-all-albums-container">
            {isLoaded && userAlbums}
        </div>
    );

}

export default Albums;
