import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikes } from "../../../store/likes";


const Likes = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const likes = useSelector(state => state.likes);

    useEffect(() => {
        dispatch(fetchLikes())
            .then(() => {
                setIsLoaded(true)
            })
    }, [dispatch])

    const userLikes = Object.values(likes).map(like => {
        return (
            <div>
                <img src={like.image_url} alt="album cover" />
                <p>{like.title}</p>
                <p>{like.artist}</p>
                <p>{like.release_date}</p>
            </div>
        );
    })

    return (
        <div className="profile-page-content-container">
            {isLoaded && userLikes}
        </div>
    )
}

export default Likes;
