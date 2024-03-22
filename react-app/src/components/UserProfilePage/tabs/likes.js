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
        let title = like.title
        const widthOfContainer = 20;
        if (title.length > widthOfContainer) {
            title = `${title.substring(0, widthOfContainer - 3)}...`
        }
        return (
            <div className="profile-page-albums-container" onClick={() => history.push(`/albums/${like.id}`)} key={like.id} >
                <div className="profile-page-album-data-container">
                    <img src={like.image_url} alt="album cover" className="profile-page-album-image" />
                    <p className="profile-page-album-artist">{like.artist}</p>
                    <p className="profile-page-album-title">{title}</p>
                    <p>{like.release_date}</p>
                </div>
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
