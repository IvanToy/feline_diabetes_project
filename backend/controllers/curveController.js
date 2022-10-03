const asyncHandler = require("express-async-handler");
const checkTime = require("../utils/checkTime.js");
const Curve = require("../models/curveModel.js");
const Pet = require("../models/petModel.js");
const { json, response } = require("express");

const addCurve = asyncHandler(async (req, res) => {
  const { date, time, glucose, units } = req.body;
  const curve = {
    date: "",
    units: { amUnits: "", pmUnits: "" },
    glucoseLevels: [],
  };
  const checkedTime = checkTime(time);

  const isCurve = await Curve.findOne({ userId: req.user._id });

  if (!isCurve) {
    curve.date = date;
    checkedTime === "PM"
      ? (curve.units.pmUnits = units)
      : (curve.units.amUnits = units);
    curve.glucoseLevels.push({ time, level: glucose });

    const pet = await Pet.findOne({ userId: req.user._id });

    const curveCreated = await Curve.create({
      userId: req.user._id,
      petId: pet._id,
      curves: [curve],
    });

    curveCreated.curvesLength = curveCreated.curves.length;

    if (curveCreated) {
      res.status(200).json({
        message: "curve has been added",
      });
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  } else {
    const curves = isCurve.curves;
    let flag = false;

    for (let cur of curves) {
      let savedDate = new Date(cur.date.toString()).toISOString().split("T")[0];
      if (savedDate === date) {
        checkedTime === "PM"
          ? (cur.units.pmUnits = units)
          : (cur.units.amUnits = units);
        cur.glucoseLevels.push({ time, level: glucose });
        flag = true;
      }
    }

    if (!flag) {
      curve.date = date;
      checkedTime === "PM"
        ? (curve.units.pmUnits = units)
        : (curve.units.amUnits = units);
      curve.glucoseLevels.push({ time, level: glucose });
      curves.push(curve);
    }

    isCurve.curvesLength = curves.length;
    isCurve.save();

    res.status(200).json({
      message: "curve has been added",
    });
  }
});

const getCurve = asyncHandler(async (req, res) => {
  const index = req.params.id;
  const isCurve = await Curve.findOne({ userId: req.user._id });

  if (isCurve) {
    const curves = isCurve.curves;
    if (index < 0) {
      res.status(200).json({
        curve: curves[curves.length - 1],
        id: curves.length - 1,
        curveLength: curves.length,
      });
    } else {
      res.status(200).json({
        curve: curves[index],
        id: index,
        curveLength: curves.length,
      });
    }
  }
});

module.exports = {
  addCurve,
  getCurve,
};
