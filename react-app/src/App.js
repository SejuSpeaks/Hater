import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import GetAlbums from "./components/GetAlbums";
import UserProfilePage from "./components/UserProfilePage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import AlbumDetails from "./components/AlbumDetails/AlbumDetails";
import CreateAlbumForm from "./components/AlbumForms/CreateAlbumForm";
import EditAlbumForm from "./components/AlbumForms/EditAlbumForm";
import ReviewForm from "./components/ReviewForms/ReviewForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <main className="main__content">
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={GetAlbums} />
          <Route path="/login" component={LoginFormPage} />
          <Route path="/signup" component={SignupFormPage} />
          <Route path='/current' component={UserProfilePage} />
          <Route path="/albums/new" component={CreateAlbumForm} />
          <Route path="/albums/:albumId/edit" component={EditAlbumForm} />
          <Route path="/albums/:albumId" component={AlbumDetails} />
          <Route><h1>Page Not Found</h1></Route>
        </Switch>
      )}
      </main>

    </>
  );
}

export default App;
