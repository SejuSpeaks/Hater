
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
    let newState;

    switch (action.type) {
        case GET_USER_REVIEWS:
            newState = { ...state };
            action.reviews.map(review => newState[review.id] = review)
            return newState

        default:
            return state;
    }
}

export default reviews;
