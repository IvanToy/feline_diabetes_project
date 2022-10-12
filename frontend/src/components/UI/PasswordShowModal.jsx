import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import ModalOverlay from "./ModalOverlay";

const PasswordShowModal = ({ showPassword, togglePassword }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          togglePassword={togglePassword}
          showPassword={showPassword}
        />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default PasswordShowModal;
