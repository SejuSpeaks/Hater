import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAlbums } from "../../../store/albums";
import { isOverflown } from "../../../utils/scrollArrows";
import ConfirmDelete from "../../ConfirmDelete";
import OpenModalButton from "../../OpenModalButton";
import { useHistory } from "react-router-dom";
import '../index.css';

const Albums = ({ deleteAlbum, isDeleted }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollArrows, setScrollArrows] = useState(false)
    const albums = useSelector(state => state.albums);


    useEffect(() => {
        dispatch(fetchUserAlbums())
            .then(() => setIsLoaded(true))
    }, [isDeleted, dispatch])

    const redirectToUpdate = (id) => {
        history.push(`albums/${id}/edit`)
    }

    //map through fetched album data returning jsx for each elemenet
    const userAlbums = Object.values(albums).map(album => {
        let title = album.title
        const widthOfContainer = 20;
        if (title && title.length > widthOfContainer) {
            title = `${title.substring(0, widthOfContainer - 3)}...`
        }

        return (
            <div className="user-albums-whole-outer" key={album.id}>
                <div className="profile-page-albums-container" onClick={() => history.push(`/albums/${album.id}`)}>
                    <img src={album.image_url} alt="album cover" className="profile-page-album-image" />
                    <div className="profile-page-album-data-container">
                        <p className="album-title-user-page">{title}</p>
                    </div>
                </div>
                <div className="profile-page-album-buttons-container">
                    <button className="profile-page-album-buttons" onClick={() => redirectToUpdate(album.id)}>UPDATE</button>
                    <OpenModalButton className={'profile-page-album-buttons'} buttonText={"DELETE"} modalComponent={<ConfirmDelete deleteAlbum={deleteAlbum} albumId={album.id} />} />
                </div>

            </div>
        );
    })

    useEffect(() => {
        const albumsContainer = document.querySelector('.profile-page-album-container-whole')
        const childrenOfAlbumsContainer = document.getElementsByClassName('profile-page-albums-container')

        isOverflown(albumsContainer, childrenOfAlbumsContainer, setScrollArrows)


        window.addEventListener('resize', () => isOverflown(albumsContainer, childrenOfAlbumsContainer, setScrollArrows));

        return () => {
            window.removeEventListener('resize', () => isOverflown(albumsContainer, childrenOfAlbumsContainer, setScrollArrows));
        };

    }, [isLoaded])

    return (
        <div className="profile-page-content-container">
            <div>
                {scrollArrows && (<>
                    <svg
                        className="scroll-arrow-user-page"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </>)}

            </div>
            {isLoaded && userAlbums}
            <div>
                {scrollArrows && (
                    <>
                        <svg
                            className="scroll-arrow-user-page"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </>
                )}
            </div>
        </div>
    );

}

export default Albums;
