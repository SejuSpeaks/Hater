
import { useSelector } from "react-redux";
import ProfileHeader from "./ProfileHeader";
import UserData from "./UserData";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";


const Profile = () => {
    const user = useSelector(state => state.session.user)

    if (!user) {
        return Redirect('/')
    }

    return (
        <div>
            <ProfileHeader />
            <UserData />
        </div>
    );
}

export default Profile;
