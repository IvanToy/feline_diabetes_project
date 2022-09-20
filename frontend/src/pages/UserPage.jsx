import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import PetsForm from "../components/PetsForm";
import PetsProfile from "../components/PetsProfile";

const UserPage = () => {
  const { isCreated, toUpdate } = useSelector((state) => state.pet);

  return (
    <>
      <Header />
      {isCreated && !toUpdate ? <PetsProfile /> : <PetsForm />}
    </>
  );
};

export default UserPage;
