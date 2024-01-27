import React from 'react';
import { FaStar } from 'react-icons/fa';
import "./displayStars.css";

const DisplayStars = ({ rating }) => {
    let starArray = [1, 2, 3, 4, 5]

  return (
    <div>
      {starArray.map((starIdx) => (
        <FaStar key={starIdx - 1} className={starIdx - 1 < rating ? 'filled-star-displayed' : 'star-displayed'} />
      ))}
    </div>
  );
};

export default DisplayStars;
