import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import './AboutPage.css';

const AboutPage = () => {
    const [userData, setUserData] = useState([]);
    const userNames = ['SejuSpeaks', 'KatharineArburn', 'triplegdev', 'h-guertler'];
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const promises = userNames.map(async (username) => {
                const response = await fetch(`https://api.github.com/users/${username}`);
                if (!response.ok) {
                  throw new Error(`Error fetching data for ${username}: ${response.status}`);
                }
                const data = await response.json();
                return data;
              });
              const allUserData = await Promise.all(promises);
              setUserData(allUserData);
            } catch (error) {
              console.error("Error:", error);
            }
        };

        fetchData();
        // eslint-disable-next-line
    }, []);

    const handleMouseEnter = userId => {
        setHovered(userId);
    }

    const handleMouseLeave = () => {
        setHovered(null);
    }

    !userData.length && <h1>Loading..</h1>;

    console.log(userData)

    return (
        <div id="team">
            {
                userData.map(user => (
                    <div key={user.id} className="team__member">
                        <a href={user.html_url} target="_blank" rel="noreferrer">
                            <div onMouseEnter={() => handleMouseEnter(user.id)} onMouseLeave={handleMouseLeave}>
                                <img className={`team__avatar ${hovered === user.id ? 'animated' : ''}`} src={user.avatar_url} alt={user.login} />
                            </div>
                            <div className="team__text">
                                <FaGithub/><h3 className="team__link">{user.login}</h3>
                            </div>
                        </a>
                    </div>
                ))
            }
        </div>
    )
}

export default AboutPage;
