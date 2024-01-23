import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAlbum, updateAlbum } from "../../store/albums";
import * as moment from 'moment';
import './AlbumForm.css'

const AlbumForm = ({ album, formType}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState({})
    const [title, setTitle] = useState(album?.title);
    const [genre, setGenre] = useState(album?.genre);
    const [description, setDescription] = useState(album?.description);
    let [release_date, setRelease_date] = useState(album?.release_date);
    const [image_url, setImage_url] = useState(album?.image_url)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        album = { ...album, title, genre, description, release_date, image_url}
        // album.release_date = moment(release_date).format('YYYY-MM-DD')
        let newAlbum;

        if (formType === "Create Album") {
            newAlbum = await dispatch((createAlbum(album)))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            })
        console.log("newAlbum0", newAlbum)
        } else if (formType === "Update Album") {
            release_date = moment(release_date).format('YYYY-MM-DD')
            newAlbum = await dispatch(updateAlbum(album))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors)
                }
            });
        }
        if (newAlbum) {
            console.log("newAlbum", newAlbum)
            history.push(`/albums/${newAlbum.album.id}`)
        }
    }

    const header = formType === "Create Album" ? "Create a Album" : "Update your Album"

    return (
        <form onSubmit={handleSubmit} className="album-form">
            <h1>{header}</h1>
            <h2 className="form-titles">Name of Album</h2>
            <label>
                Title
                <input
                    type="text"
                    id="title"
                    placeholder="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
            <div className="errors">{errors.title}</div>
            </label>
            <label>
                Genre
                <input
                    type="text"
                    id="genre"
                    placeholder="genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    />
            <div className="errors">{errors.genre}</div>
            </label>
            <label>
                Description
                <input
                    type="text"
                    id="description"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
            <div className="errors">{errors.description}</div>
            </label>
            <label>
                Release Date
                <input
                    type="text"
                    id="release_date"
                    placeholder="YYYY-MM-DD"
                    value={release_date}
                    onChange={(e) => setRelease_date(e.target.value)}
                    />
            <div className="errors">{errors.release_date}</div>
            </label>
            <label htmlFor="image_url">
                Album Image
                <input
                    type="url"
                    id="image_url"
                    placeholder="Image URL"
                    value={image_url}
                    onChange={(e) => setImage_url(e.target.value)}
                    />
            </label>
            <div className="btn">
            <button type="submit" className="submit-btn">{formType}</button>
            </div>
        </form>
    )
}

export default AlbumForm
