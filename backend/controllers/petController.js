const asyncHandler = require("express-async-handler");

const Pet = require("../models/petModel.js");

const createPetsProfile = asyncHandler(async (req, res) => {
  const {
    name,
    sex,
    age,
    breed,
    diagnosed,
    dosingMethod,
    dosingDate,
    currentInsulin,
    meter,
  } = req.body;

  console.log(req.body);
  const pet = Pet.create({
    userId: req.user._id,
    name,
    sex,
    age,
    breed,
    diagnosed,
    dosingMethod,
    dosingDate,
    currentInsulin,
    meter,
  });

  if (pet) {
    res.status(200).json({
      isCreated: true,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong, please try again.");
  }
});

const getPetsProfile = asyncHandler(async (req, res) => {
  const pet = await Pet.findOne({ userId: req.user._id });

  if (pet) {
    res.status(200).json({
      id: pet._id,
      name: pet.name,
      sex: pet.sex,
      age: pet.age,
      breed: pet.breed,
      diagnosed: new Date(pet.diagnosed.toString()).toISOString().split("T")[0],
      dosingMethod: pet.dosingMethod,
      dosingDate: new Date(pet.dosingDate.toString())
        .toISOString()
        .split("T")[0],
      currentInsulin: pet.currentInsulin,
      meter: pet.meter,
    });
  } else {
    res.status(404);
    throw new Error("Pet's information is not found");
  }
});

const updatePetsProfile = asyncHandler(async (req, res) => {});

module.exports = { createPetsProfile, getPetsProfile, updatePetsProfile };
