
const GET_USER_REVIEWS = 'reviews/GETREVIEWS';
const ADD_REVIEW = "reviews/ADD_REVIEW";
const GET_ALBUM_REVIEWS = 'reviews/GET_ALBUM_REVIEWS';
const EDIT_REVIEW = "reviews/EDIT_REVIEW";

/*---------------------------------------------------------------------------------------------- */

const getReviews = (reviews) => {
    return {
        type: GET_USER_REVIEWS,
        reviews
    }
}

const addReview = (review) => ({
	type: ADD_REVIEW,
	payload: review,
});

const getReviewsByAlbum = (reviews) => {
    return {
        type: GET_ALBUM_REVIEWS,
        reviews
    }
}

const editReview = (review) => ({
    type: EDIT_REVIEW,
    review
})

export const fetchUserReviews = () => async dispatch => {
    const response = await fetch('api/reviews/current');

    if (response.ok) {
        const data = await response.json()
        dispatch(getReviews(data["user reviewed albums"]))
        return data["user reviewed albums"];
    }
}

export const createReview = (review) => async (dispatch) => {
    const { album_id, rating, review_text} = review;

    try {
	const response = await fetch(`/api/albums/${album_id}/reviews`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
            rating,
            review_text
		}),
	})

	if (response.ok) {
		const data = await response.json();
		dispatch(addReview(data));
		return data;
	} else if (response.status < 500) {
		    const data = await response.json();
            return data;
	} else {
		return ["An error occurred. Please try again."];
	}
    } catch (error) {
        return error
    }
};

export const fetchEditReview = (review) => async (dispatch) => {
    const { id, rating, review_text} = review;
	const response = await fetch(`/api/reviews/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
            rating,
            review_text
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(editReview(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const fetchAlbumReviews = (albumId) => async(dispatch) => {
    const response = await fetch(`/api/albums/${albumId}/reviews`);

    if (response.ok) {
        const data = await response.json();
        dispatch(getReviewsByAlbum(data.reviews));
    } else {
        console.error("error in fetchAlbumReviews")
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
        case ADD_REVIEW:
            return { ...state, [action.payload.id]: action.payload };
        case EDIT_REVIEW:
            if (action.review) {
                const updatedAlbumReviews = { ...state.albumReviews, [action.review.id]: action.review };
                return { ...state, albumReviews: updatedAlbumReviews }
            } else {
                return state;
            }
        case GET_ALBUM_REVIEWS:
            if (action.reviews) {
                const albumReviews = action.reviews.reduce((obj, review) => {
                obj[review.id] = review;
                return obj;
            }, {});
            return { ...state, albumReviews: albumReviews}
            } else {
                return state;
            }
        default:
            return state;
    }
}

export default reviews;
