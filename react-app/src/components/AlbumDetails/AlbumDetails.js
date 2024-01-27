import { useParams } from "react-router-dom";
import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumDetails } from "../../store/albums";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../ReviewForms/ReviewForm";
import { DisplayAlbumReviews } from "../DisplayAlbumReviews";
// import { fetchAlbumReviews } from "../../store/reviews"
import { postAlbumLike, deleteAlbumLike } from "../../store/likes";
import { FaHeart } from "react-icons/fa";
import "./AlbumDetails.css"

const AlbumDetails = () => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { albumId } = useParams();

    const album = useSelector((state) => {
        return state.albums.album
    })

    const sessionUser = useSelector((state) => {
        return state.session.user
    })

    const [isLoading, setIsLoading] = useState(true)
    const [userLiked, setUserLiked] = useState(null)

    useEffect(() => {
        const fetchAlbumAndReviewData = async () => {
            try {
                // await dispatch(fetchAlbumReviews(albumId));
                await dispatch(getAlbumDetails(albumId));
                setIsLoading(false);
            } catch (error) {
                console.error("error fetching album and review data");
            }
        }
        fetchAlbumAndReviewData()
    }, [dispatch, albumId, setIsLoading, userLiked]);

    // set user liked if album is available
    useEffect(() => {
        setUserLiked(album?.user_liked);
    }, [album?.user_liked]);

    if (isLoading) return <h1>Loading...</h1>

    if (!album) return <h1>Album not found</h1>

    const handleLike = async () => {
        console.log('/////////////handleLike before', userLiked);
        if (!userLiked) {
            dispatch(postAlbumLike(albumId)).then(() => setUserLiked(true));
        }
        else {
            dispatch(deleteAlbumLike(albumId)).then(() => setUserLiked(false));
        }
    }

    const {
        title,
        artist,
        genre,
        description,
        release_date,
        image_url,
        avg_rating,
        total_likes
    } = album


    return  (
        <section className='page'>
            <div className="top-half">
            <div className="left">
                <img className="image" alt='album_image' src={image_url}/>
                <div hidden={sessionUser == null} className={`review-button`} id="reviewBtn">
                    <OpenModalButton
                    className="post-review-button clickable"
                    buttonText="+ POST A REVIEW"
                    modalComponent={<ReviewForm/>}
                    />
                </div>
            </div>
            <div className="center">
            <h2 className="h2">{title}</h2>
            <h3 className="h3">{artist}</h3>
            <h4 className="h4">{release_date}</h4>
            <h4 className="h4">{genre}</h4>
            <p>{description ? description : `Lorem ipsum dolor sit amet, consectetur adipiscing elit
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Eu ultrices vitae auctor eu augue ut lectus. Elit at imperdiet dui accumsan sit
                amet nulla facilisi morbi. Porttitor eget dolor morbi non arcu.
                Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt.`}
            </p>
            </div>
            <div className="right">
                <div className="rating-container">
                    <div className="rating">{avg_rating === "" ? "new album" : avg_rating}</div>
                </div>
                <div className="likes"><FaHeart className="heart" /> {total_likes === "" ? "0 likes" : total_likes === 1 ? "1 like" : `${total_likes} likes`}</div>
            {album && user && user.username !== album.artist && <button className="likeBtn" onClick={handleLike}>{!userLiked ? 'Like' : 'Unlike'}</button>}
                </div>
            </div>
            <div className="review-header">
            <p className="review-bar">POPULAR REVIEWS</p>
            <p className="review-bar">MORE</p>
            </div>
            <div className="display-reviews">
                <DisplayAlbumReviews userId={(user && user.id) ? user.id : null} albumId={albumId}/>
            </div>
        </section>
    )
}

export default AlbumDetails
