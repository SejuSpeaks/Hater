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
import { FaRegHeart } from "react-icons/fa";
import { FaMusic } from "react-icons/fa";
import { IoMdMusicalNote } from "react-icons/io";
import formatAvgRating from '../../utils/formatAvgRating.js';
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


    if (isLoading) return <h1><FaMusic /> <IoMdMusicalNote /> <FaMusic /> <IoMdMusicalNote /></h1>

    if (!album) return <h1>Album not found</h1>

    let hiddenBtn;

    if (sessionUser === null) {
        hiddenBtn = true
    } else if (sessionUser.id === album.user_id) {
        hiddenBtn = true
    } else {
        hiddenBtn = false
    }

    const handleLike = async () => {
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
                <div className="left-center">
                    <div className="left">
                        <img className="image" alt='album_image' src={image_url}/>
                        <div hidden={hiddenBtn} className={`review-button`} id="reviewBtn">
                            <OpenModalButton
                            className="post-review-button clickable"
                            buttonText="+ POST A REVIEW"
                            modalComponent={<ReviewForm/>}
                            />
                        </div>
                    </div>
                    <div className="center">
                        <h2 className="h2 title">{title}</h2>
                        <h3 className="h3 artist">{artist}</h3>
                        <h4 className="h4 release_date">{release_date}</h4>
                        <h4 className="h4 genre">{genre}</h4>
                        <p className="description">{description ? description : `Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Eu ultrices vitae auctor eu augue ut lectus. Elit at imperdiet dui accumsan sit
                            amet nulla facilisi morbi. Porttitor eget dolor morbi non arcu.
                            Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt.`}
                        </p>
                    </div>
                </div>

                <div className="right">
                    <div className="rating-container">
                        <div className="rating">{avg_rating === "" ? "new album" : formatAvgRating(avg_rating)}</div>
                    </div>
                    <div className="likes">
                        <div className={`heart-container ${user && user.username !== album.artist && 'heart-click'} ${user && user.username === album.artist && 'disabled'}`} onClick={handleLike} >
                            {!user ? <FaRegHeart className="empty-heart" />  : userLiked ? <FaHeart className="heart" /> : <FaRegHeart className="empty-heart" />}
                        </div>
                        <span>{total_likes === "" ? "0 likes" : total_likes === 1 ? "1 like" : `${total_likes} likes`}</span>
                    </div>
                    {/* {album && user && user.username !== album.artist && <button className="likeBtn" onClick={handleLike}>{!userLiked ? 'Like' : 'Unlike'}</button>} */}
                </div>
            </div>
            <div className="review-header">
                <p className="review-bar">POPULAR REVIEWS</p>
                <p className="review-bar">MORE</p>
            </div>
            <div className="display-reviews">
                <DisplayAlbumReviews userId={(user && user.id) ? user.id : null} albumId={albumId} artistId={album.user_id}/>
            </div>
        </section>
    )
}

export default AlbumDetails
