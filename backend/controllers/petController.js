const asyncHandler = require("express-async-handler");

const Pet = require("../models/petModel.js");
const User = require("../models/userModel.js");

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

  const user = await User.findById(req.user._id);

  user.isPetsProfileCreated = true;

  await user.save();

  if (pet) {
    res.status(200).json({
      isPetsProfileCreated: user.isPetsProfileCreated,
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

const updatePetsProfile = asyncHandler(async (req, res) => {
  const isUpdated = await Pet.updateOne(
    { userId: req.user._id },
    { $set: req.body }
  );

  if (isUpdated) {
    res.status(200).json({
      isProfileUpdated: true,
    });
  } else {
    res.status(500);
    throw new Error("Profile couldn't be update");
  }
});

const deletePetsProfile = asyncHandler(async (req, res) => {
  const isDeleted = await Pet.deleteOne({ userId: req.user._id });
  const user = await User.findById(req.user._id);

  user.isPetsProfileCreated = false;

  await user.save();

  if (isDeleted) {
    res.status(200).json({
      petsInfo: null,
      isProfileCreated: user.isPetsProfileCreated,
    });
  } else {
    res.status(410);
    throw new Error("Profile couldn't be found");
  }
});

module.exports = {
  createPetsProfile,
  getPetsProfile,
  updatePetsProfile,
  deletePetsProfile,
};
