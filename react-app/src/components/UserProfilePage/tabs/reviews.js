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
            <>
                <p>{review.title}</p>
            </>
        )
    })

    return (
        <div>
            {isLoaded && userReviews}
        </div>
    );

}


export default Reviews
