import TabsComponent from "./TabsComponent";
import ProfileHeader from "./ProfileHeader";

const UserProfilePage = () => {


    const changeTab = () => {
        //if tab changes then trigger a state change or somemthing on this page

    }


    return (
        <div>
            <div>
                <ProfileHeader />
            </div>

            <div>
                <TabsComponent />
            </div>
        </div>
    );
}

export default UserProfilePage;
