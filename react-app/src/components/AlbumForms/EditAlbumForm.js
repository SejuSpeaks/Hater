import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAlbumDetails } from "../../store/albums";
import { useEffect } from "react";
import AlbumForm from './AlbumForm';


const EditAlbumForm = () => {
    const { albumId } = useParams();
    const album = useSelector((state) => state.albums.undefined)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAlbumDetails(albumId));
    }, [dispatch, albumId])


    if (!album) return <></>

    return (
        Object.keys(album).length > 1 && (
            <>
                <AlbumForm album={album} formType="Update Album" />
            </>
        )
    );
};

export default EditAlbumForm
