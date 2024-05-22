import React from "react";
import Modal from "react-modal";
import { CategoriesPieChart } from "./categoriesPieChart";

const AdminModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div>
        <h2>User Profile</h2>
        <h3>Username: {user.username}</h3>
        <h3>Email: {user.email}</h3>
        <img src="./images/profile-default.svg" alt="" />

        <h2>Spendings</h2>
        <>
          <CategoriesPieChart userID={user.userID} />
        </>
      </div>
    </Modal>
  );
};

export default AdminModal;
