import { useState } from 'react';
import { TbSearch } from "react-icons/tb";
import './GetAlbumsSearch.css';

const GetAlbumSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = e => {
        const value = e.target.value;
        setSearchTerm(value)
        onSearch(value);
    }

    return (
        <div className="albums-search">
            <TbSearch/>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for music"
            />
        </div>
    )
}

export default GetAlbumSearch;
