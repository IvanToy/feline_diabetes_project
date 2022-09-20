import React, { useEffect, useState } from "react";
import PetsGeneralInfo from "./PetsGeneralInfo";
import PetsChart from "./PetsChart";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { getPetsProfile } from "../store/actions/pet-action";

const PetsProfile = () => {
  const { loading, error } = useSelector((state) => state.ui);
  const petsInfo = useSelector((state) => state.pet.petsInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPetsProfile("petsProfile"));
  }, []);

  let content;

  if (loading) {
    content = <Loader />;
  } else if (!loading && petsInfo) {
    content = (
      <>
        <PetsGeneralInfo pet={petsInfo} />
        <PetsChart />
      </>
    );
  } else {
    content = <span>{error}</span>;
  }

  return content;
};

export default PetsProfile;
