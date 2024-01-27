import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAlbum, updateAlbum } from "../../store/albums";
// import * as moment from 'moment';
import './AlbumForm.css'

const AlbumForm = ({ album, formType}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([])
    const [title, setTitle] = useState(album?.title);
    const [genre, setGenre] = useState(album?.genre);
    const [description, setDescription] = useState(album?.description);
    let [release_date, setRelease_date] = useState(album?.release_date);
    const [image_url, setImage_url] = useState(album?.image_url)



    const handleSubmit = async (e) => {
        e.preventDefault();
        // setErrors({});
        album = { ...album, title, genre, description, release_date, image_url}

        let newAlbum;

        if (formType === "Create Album") {
            try {
                newAlbum = await dispatch((createAlbum(album)))
                history.push(`/albums/${newAlbum.album.id}`)
            } catch (res) {
                // console.log("RES", newAlbum)
                if (newAlbum && newAlbum.errors) {
                    setErrors(newAlbum.errors)
                }
            }
        } else if (formType === "Update Album") {
            try {
                newAlbum = await dispatch(updateAlbum(album))
                history.push(`/albums/${newAlbum.album.id}`)
            } catch(res){
                    // const data = await res.json();
                    if (newAlbum && newAlbum.errors) {
                        setErrors(newAlbum.errors)
                    }
                };
        }
    }

    if (formType === "Update Album") {
        const dateObj = new Date(release_date)
        release_date = dateObj.toISOString().split('T')[0];
        // release_date = moment(release_date).format('YYYY-MM-DD')
    }

    const albumImage = image_url ? image_url : 'https://hub.yamaha.com/wp-content/uploads/2021/09/How-vinyl-made-Fig.-2.jpg'


    return (
        <form onSubmit={handleSubmit} className="album-form">
            <ul>
                {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
            ))}
        </ul>
            <div className="container">
            <label className="title">
                <input
                    type="text"
                    id="title"
                    placeholder="TITLE"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
            <div className="errors">{errors.title}</div>
            </label>
            <label className="genre">
                <input
                    type="text"
                    id="genre"
                    placeholder="GENRE"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    />
            <div className="errors">{errors.genre}</div>
            </label>
            <label className="description">
                <textarea
                    id="description"
                    rows='10'
                    cols='33'
                    placeholder="DESCRIPTION"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
            <div className="errors">{errors.description}</div>
            </label>
            <label className="date">
                <input
                    type="date"
                    id="release_date"
                    placeholder="YYYY-MM-DD"
                    value={release_date}
                    onChange={(e) => setRelease_date(e.target.value)}
                    />
            <div className="errors">{errors.release_date}</div>
            </label>
            <img className="image" id="image" alt='album_image' src={albumImage}/>
            <label htmlFor="image_url" className="url">
                <input
                    type="url"
                    id="image_url"
                    placeholder="IMAGE URL"
                    value={image_url}
                    onChange={(e) => setImage_url(e.target.value)}
                    />
            </label>
            <div className="btn">
            <button type="submit" className="submit-btn">{formType}</button>
            </div>
            </div>
        </form>
    )
}

export default AlbumForm
