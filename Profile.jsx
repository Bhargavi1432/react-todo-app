function Profile() {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>This is your profile</p>
    </div>
  );
}

export default Profile;


//
import React from "react";

const Profile = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile</h2>

      <h3>Bhargavi</h3>
      <p>React learner building Todo App 🚀</p>

      <hr />

      <h4>Todo Stats</h4>
      <p>Total Tasks: {tasks.length}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {pending}</p>
    </div>
  );
};

export default Profile;
