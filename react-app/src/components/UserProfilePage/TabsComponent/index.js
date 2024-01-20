import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import './index.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReviews } from '../../../store/reviews';

const TabsComponent = () => {
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        switch (tab) {
            case 'reviews':
                dispatch(fetchUserReviews());


            default:
                break;
        }
    }, [tab])

    const reviewData = useSelector(state => state.reviews);

    return (
        <div>
            <ul className="user-profile-tabs-container">
                <li onClick={() => setTab('reviews')}>All Reviews</li>
                <li>Likes</li>
                <li>Albums</li>
            </ul>

            <div>

            </div>
        </div>
    );
}

export default TabsComponent;
