import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikes } from "../../../store/likes";


const Likes = ({ changedState }) => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const likes = useSelector(state => state.likes);

    useEffect(() => {
        console.log('state in likes componenet', changedState)
        dispatch(fetchLikes())
            .then(() => {
                setIsLoaded(true)
            })
    }, [])

    const userLikes = Object.values(likes).map(like => {
        return (
            <>
                <p>{like.title}</p>
            </>
        );
    })

    return (
        <div>
            {isLoaded && userLikes}
        </div>
    )
}

export default Likes;
