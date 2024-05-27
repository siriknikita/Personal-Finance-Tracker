import React, { useContext } from "react";
import { UserContext } from "../../App";
import { Header } from "../../components";

function Profile() {
  const { user } = useContext(UserContext);
  return (
    <>
      <Header title="Profile" subtitle="User profile" />
      <h1>Profile for {user.username}</h1>
      <h2>Working in progress...</h2>
    </>
  );
}

export default Profile;
