import React from "react";
import { useSelector } from "react-redux";
import PetsForm from "../components/petsComponents/PetsForm";
import PetsProfile from "../components/petsComponents/PetsProfile";

const MainPage = () => {
  const { petsProfileExists, updatePetsProfile } = useSelector(
    (state) => state.pet
  );

  return (
    <>
      {petsProfileExists && !updatePetsProfile ? <PetsProfile /> : <PetsForm />}
    </>
  );
};

export default MainPage;
