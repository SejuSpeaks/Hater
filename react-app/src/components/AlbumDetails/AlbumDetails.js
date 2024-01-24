import { useParams } from "react-router-dom";
import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumDetails } from "../../store/albums";
import OpenModalButton from "../OpenModalButton";
import ReviewForm from "../ReviewForms/ReviewForm";
import { fetchAlbumReviews } from "../../store/reviews"
// import { IoHeart } from "react-icons/fa";
import "./AlbumDetails.css"

const AlbumDetails = () => {
    const dispatch = useDispatch();
    const { albumId } = useParams();

    const album = useSelector((state) => {
        return state.albums.undefined
    })

    const reviews = useSelector((state) => {
        return state.reviews.albumReviews
    });

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchAlbumAndReviewData = async () => {
            try {
                dispatch(getAlbumDetails(albumId));
                dispatch(fetchAlbumReviews(albumId));
                setIsLoading(true);
            } catch (error) {
                console.error("error fetching album and review data")
            }
        }
        fetchAlbumAndReviewData()
    }, [dispatch, albumId, setIsLoading]);

    if (!isLoading) return <h1>Loading...</h1>

    if (!album) return <h1>Album not found</h1>

    let renderedReviews;
    if (reviews) {
        const reviewArray = Object.values(reviews);
        const reviewArrayIds = Object.keys(reviewArray)

        renderedReviews = reviewArrayIds.reverse().map((id) => {
            const review = reviewArray[id]
            return (
            <div key={id}>
                <p>{review["created_at"]}</p>
                <p>user_id, will be username: {review["user_id"]}</p>
                <p>{review["rating"]} stars</p>
                <p>{review["review_text"]}</p>
            </div>
            )
            });
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
    } = album.album

    // console.log("albums: " + albums)

    return (
        <section className='page'>
            <h2>{title}</h2>
            <h3>{artist}</h3>
            <div>
                <img className="image" alt='album_image' src={image_url}/>
                <div className={`review-button`}>
                    <OpenModalButton
                    className="post-review-button clickable"
                    buttonText="+POST A REVIEW"
                    modalComponent={<ReviewForm/>}
                    />
                </div>
            </div>
            <h4>{release_date}</h4>
            <h4>{genre}</h4>
            <p>{description ? description : `Lorem ipsum dolor sit amet, consectetur adipiscing elit
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Eu ultrices vitae auctor eu augue ut lectus. Elit at imperdiet dui accumsan sit
                amet nulla facilisi morbi. Porttitor eget dolor morbi non arcu.
                Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt.`}
            </p>
            <div className="review_like_box">
            <div className="one">{avg_rating}</div>
            <div className="two">{total_likes}</div>
            </div>
            <div className="display-reviews">
            {(reviews && Object.keys(reviews).length) > 0 ? (
                renderedReviews
                ) : (
                <p>Be the first to post a review!</p>
            )}
            </div>
        </section>
    )
}

export default AlbumDetails


/* <div className="two"><IoHeart /> {total_likes}</div> */
