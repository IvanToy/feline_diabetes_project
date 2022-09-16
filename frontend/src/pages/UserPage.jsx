import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import PetsForm from "../components/PetsForm";
import PetsProfile from "../components/PetsProfile";

const update = localStorage.getItem("toUpdate")
  ? JSON.parse(localStorage.getItem("toUpdate"))
  : false;

const UserPage = () => {
  const isCreated = useSelector((state) => state.pet.isCreated);
  const [toUpdate, setToUpdate] = useState(update);

  const toUpdateHandler = () => {
    setToUpdate((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (toUpdate) {
      localStorage.setItem("toUpdate", JSON.stringify(toUpdate));
    }
  }, [toUpdate]);

  let content;

  if (isCreated && toUpdate) {
    content = <PetsForm />;
  } else if (isCreated && !toUpdate) {
    content = <PetsProfile toUpdateHandler={toUpdateHandler} />;
  } else {
    content = <PetsForm />;
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
};

export default UserPage;
