import { useState } from 'react';

const GetAlbumSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = e => {
        const value = e.target.value;
        setSearchTerm(value)
        onSearch(value);
    }

    return (
        <div className="albums-search">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search Albums"
            />
        </div>
    )
}

export default GetAlbumSearch;
