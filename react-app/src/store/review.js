// constants
const UPDATE_REVIEW = "reviews/UPDATE_REVIEW"

const updateAReview = (review) => ({
	type: UPDATE_REVIEW,
	payload: review,
});

const initialState = { reviews: null };

export const updateReview = (albumId, reviewText, rating) => async (dispatch) => {
	const response = await fetch(`/api/albums/${albumId}/reviews`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			reviewText,
            rating
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(updateAReview(data));
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

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case UPDATE_REVIEW:
			return { updatedReview: action.payload };
		default:
			return state;
	}
}
