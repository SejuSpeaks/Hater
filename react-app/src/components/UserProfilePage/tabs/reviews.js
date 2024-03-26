import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserReviews } from "../../../store/reviews"
import { isOverflown } from "../../../utils/scrollArrows";
import { useHistory } from "react-router-dom";


const Reviews = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollArrows, setScrollArrows] = useState(false);
    const reviews = useSelector(state => state.reviews)

    useEffect(() => {
        dispatch(fetchUserReviews())
            .then(() => setIsLoaded(true))
    }, [dispatch])

    const userReviews = Object.values(reviews).map(review => {
        let title = review.title
        const widthOfContainer = 20;
        if (title && title.length > widthOfContainer) {
            title = `${title.substring(0, widthOfContainer - 3)}...`
        }
        return (
            <div className="profile-page-albums-container" onClick={() => history.push(`/albums/${review.album_id}`)} key={review.id}>
                <img src={review.image_url} alt="album cover" className="profile-page-album-image" />
                <p className="profile-page-album-artist">{review.artist}</p>
                <p>{title}</p>
                <p>{review.release_date}</p>
                <div className="profile-page-albums-rating-container">
                    <svg clip-rule="evenodd" height={20} fill="#F1C232" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z" fill-rule="nonzero" /></svg>
                    <p>{review.rating}</p>
                </div>
            </div>
        )
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
            {isLoaded && userReviews}
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


export default Reviews
