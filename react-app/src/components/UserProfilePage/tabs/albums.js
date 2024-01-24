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
            <div className="profile-page-albums-container">
                <img src={album.image_url} alt="album picture" id="profile-page-album-image" />
                <div id="profile-page-album-data-container">
                    <p id="profile-page-album-title">{album.title}</p>
                    <p id="profile-page-album-artist">{album.artist}</p>
                </div>

                <div className="profile-page-album-buttons-container">
                    <button className="profile-page-album-buttons">UPDATE</button>
                    <OpenModalButton className={'profile-page-album-buttons'} buttonText={"DELETE"} modalComponent={<ConfirmDelete deleteAlbum={deleteAlbum} albumId={album.id} />} />
                </div>
            </div>
        );
    })


    return (
        <div className="profile-page-content-container">
            {isLoaded && userAlbums}
        </div>
    );

}

export default Albums;
