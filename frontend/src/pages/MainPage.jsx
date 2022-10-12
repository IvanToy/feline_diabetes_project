import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import PetsForm from "../components/petsComponents/PetsForm";
import PetsProfile from "../components/petsComponents/PetsProfile";

const MainPage = () => {
  const { isCreated, toUpdate } = useSelector((state) => state.pet);

  return <>{isCreated && !toUpdate ? <PetsProfile /> : <PetsForm />}</>;
};

export default MainPage;
