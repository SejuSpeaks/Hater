import AlbumForm from "./AlbumForm";

const CreateAlbumForm = () => {
    const album = {
        title: "",
        genre: "",
        description: "",
        release_date: "",
        image_url: ""
    };

    return <AlbumForm album={album} formType="Create Album"/>
}

export default CreateAlbumForm
