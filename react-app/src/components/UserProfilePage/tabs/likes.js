import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikes } from "../../../store/likes";
import { isOverflown } from "../../../utils/scrollArrows";
import { useHistory } from "react-router-dom";


const Likes = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollArrows, setScrollArrows] = useState(false);
    const likes = useSelector(state => state.likes);

    useEffect(() => {
        dispatch(fetchLikes())
            .then(() => {
                setIsLoaded(true)
            })
    }, [dispatch])

    const userLikes = Object.values(likes).map(like => {
        let title = like.title
        const widthOfContainer = 20;
        if (title && title.length > widthOfContainer) {
            title = `${title.substring(0, widthOfContainer - 3)}...`
        }
        return (
            <div className="profile-page-albums-container" onClick={() => history.push(`/albums/${like.id}`)} key={like.id} >
                <div className="profile-page-album-data-container">
                    <img src={like.image_url} alt="album cover" className="profile-page-album-image" />
                    <p className="profile-page-album-artist">{like.artist}</p>
                    <p className="profile-page-album-title">{title}</p>
                    <p>{like.release_date}</p>
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
            {isLoaded && userLikes}
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
    )
}

export default Likes;
