import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAlbum, updateAlbum } from "../../store/albums";
import './AlbumForm.css'

const AlbumForm = ({ album, formType}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState({})
    const [title, setTitle] = useState(album?.title);
    const [genre, setGenre] = useState(album?.genre);
    const [description, setDescription] = useState(album?.description);
    const [release_date, setRelease_date] = useState(album?.release_date);
    const [image_url, setImage_url] = useState(album?.image_url)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        album = { ...album, title, genre, description, release_date, image_url}

        let newAlbum;

        if (formType === "Create Album") {
            newAlbum = await dispatch((createAlbum(album)))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
        } else if (formType === "Update Album") {
            newAlbum = await dispatch(updateAlbum(album))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            });
        }
        if (newAlbum) {
            history.push(`/albums/${newAlbum.id}`)
        }
    }

    const header = formType === "Create Album" ? "Create a Album" : "Update your Album"

    return (
        <form onSubmit={handleSubmit} className="album-form">
            <h1>{header}</h1>
            <h2 className="form-titles">Name of Album</h2>


        </form>
    )
}
