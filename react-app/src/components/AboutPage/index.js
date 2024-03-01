import { useState, useEffect } from "react";
import './AboutPage.css';

const AboutPage = () => {
    const [userData, setUserData] = useState([]);
    const userNames = ['SejuSpeaks', 'KatharineArburn', 'triplegdev', 'h-guertler'];

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

    !userData.length && <h1>Loading..</h1>;

    console.log(userData)

    return (
        <div id="team">
            {
                userData.map(user => (
                    <a href={user.html_url} target="_blank">
                        <div key={user.id} className="team__member">
                            <img className="team__avatar" src={user.avatar_url} alt={user.login} />
                            <h2>{user.login}</h2>
                        </div>
                    </a>
                ))
            }
        </div>
    )
}

export default AboutPage;
