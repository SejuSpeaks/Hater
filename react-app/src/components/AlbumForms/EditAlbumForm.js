import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAlbumDetails } from "../../store/albums";
import { useEffect } from "react";
import AlbumForm from './AlbumForm';


const EditAlbumForm = () => {
    const dispatch = useDispatch();
    const { albumId } = useParams();
    const album = useSelector((state) => {
        return state.albums.album
    })

    const sessionUser = useSelector((state) => {
        return state.session
    })

    useEffect(() => {
        dispatch(getAlbumDetails(albumId));
    }, [dispatch, albumId])


    if (!album) return <></>

    if (sessionUser.user.id !== album.user_id) return <h1>You are not authorized to edit this album</h1>

    const existingAlbum = album
    return (
        Object.keys(existingAlbum).length > 1 && (
            <>
                <AlbumForm album={existingAlbum} formType="Update Album" />
            </>
        )
    );
};

export default EditAlbumForm
