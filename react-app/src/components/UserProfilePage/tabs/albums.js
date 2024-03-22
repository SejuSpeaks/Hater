import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAlbums } from "../../../store/albums";
import ConfirmDelete from "../../ConfirmDelete";
import OpenModalButton from "../../OpenModalButton";
import { useHistory } from "react-router-dom";
import '../index.css';

const Albums = ({ deleteAlbum, isDeleted }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    const albums = useSelector(state => state.albums);


    useEffect(() => {
        dispatch(fetchUserAlbums())
            .then(() => setIsLoaded(true))
    }, [isDeleted, dispatch])

    const redirectToUpdate = (id) => {
        history.push(`albums/${id}/edit`)
    }

    const userAlbums = Object.values(albums).map(album => {
        let title = album.title
        const widthOfContainer = 20;
        if (title.length > widthOfContainer) {
            title = `${title.substring(0, widthOfContainer - 3)}...`
        }

        return (
            <div className="user-albums-whole-outer" key={album.id}>
                <div className="profile-page-albums-container" onClick={() => history.push(`/albums/${album.id}`)}>
                    <img src={album.image_url} alt="album cover" className="profile-page-album-image" />
                    <div className="profile-page-album-data-container">
                        <p className="album-title-user-page">{title}</p>
                    </div>
                    <div className="profile-page-album-buttons-container">
                        <button className="profile-page-album-buttons" onClick={() => redirectToUpdate(album.id)}>UPDATE</button>
                        <OpenModalButton className={'profile-page-album-buttons'} buttonText={"DELETE"} modalComponent={<ConfirmDelete deleteAlbum={deleteAlbum} albumId={album.id} />} />
                    </div>
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
