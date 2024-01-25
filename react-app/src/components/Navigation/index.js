import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<header>
			<div className="header__logo"><NavLink exact to="/">HATER</NavLink></div>
			<div className="header__profile">
				{isLoaded && sessionUser && (
					<>
					<Link to={'/albums/new'} className="header__post-album">POST AN ALBUM</Link>
					<Link to={'/albums/new'} className="header__post-album-plus">+</Link>
					</>
				)}
				{isLoaded && (
					<div>
						<ProfileButton user={sessionUser} />
					</div>
				)}
			</div>
		</header>
	);
}

export default Navigation;
