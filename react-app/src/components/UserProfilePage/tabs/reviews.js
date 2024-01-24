import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserReviews } from "../../../store/reviews"



const Reviews = () => {
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false);
    const reviews = useSelector(state => state.reviews)

    useEffect(() => {
        dispatch(fetchUserReviews())
            .then(() => setIsLoaded(true))
    }, [dispatch])

    const userReviews = Object.values(reviews).map(review => {
        return (
            <div>
                <img src={review.image_url} alt="album cover" />
                <p>{review.title}</p>
                <p>{review.artist}</p>
                <p>{review.release_date}</p>
                <p>{review.rating}</p>
            </div>
        )
    })

    return (
        <div className="profile-page-content-container">
            {isLoaded && userReviews}
        </div>
    );

}


export default Reviews
