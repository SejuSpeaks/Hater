
const GET_USER_REVIEWS = 'reviews/GETREVIEWS';



/*---------------------------------------------------------------------------------------------- */

const getReviews = (reviews) => {
    return {
        type: GET_USER_REVIEWS,
        reviews
    }
}


export const fetchUserReviews = () => async dispatch => {
    const response = await fetch('api/reviews/current');

    if (response.ok) {
        const data = await response.json()
        dispatch(getReviews(data["user reviewed albums"]))
        return data["user reviewed albums"];
    }
}




/*---------------------------------------------------------------------------------------------- */


const reviews = (state = {}, action) => {

    switch (action.type) {
        case GET_USER_REVIEWS:
            const reviews = action.reviews.reduce((obj, review) => {
                obj[review.id] = review;
                return obj
            }, {});
            return { ...reviews }

        default:
            return state;
    }
}

export default reviews;
