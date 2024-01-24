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

    useEffect(() => {
        dispatch(getAlbumDetails(albumId));
    }, [dispatch, albumId])


    if (!album) return <></>

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
