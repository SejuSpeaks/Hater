import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikes } from "../../../store/likes";
import { useHistory } from "react-router-dom";


const Likes = () => {
    const dispatch = useDispatch();
    const history = useHistory();
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
            <div className="profile-page-albums-container" onClick={() => history.push(`/albums/${like.id}`)} key={like.id} >
                <img src={like.image_url} alt="album cover" className="profile-page-album-image" />
                <div className="profile-page-album-data-container">
                    <p className="profile-page-album-title">{like.title}</p>
                    <p className="profile-page-album-artist">{like.artist}</p>
                </div>
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
