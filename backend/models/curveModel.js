const mongoose = require("mongoose");

const curve = mongoose.Schema(
  {
    date: { type: Date },
    units: {
      amUnits: { type: Number, default: 0 },
      pmUnits: { type: Number, default: 0 },
    },
    glucoseLevels: [
      {
        time: { type: String },
        level: { type: Number },
      },
    ],
  },
  { _id: false }
);

const curveSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    petId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Pet",
    },

    curves: [curve],
    curvesLength: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Curve = mongoose.model("Curve", curveSchema);

module.exports = Curve;
