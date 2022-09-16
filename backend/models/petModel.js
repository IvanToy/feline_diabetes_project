const mongoose = require("mongoose");

const petSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String },
    sex: { type: String },
    age: { type: Number },
    breed: { type: String },
    diagnosed: { type: Date },
    dosingMethod: { type: String },
    dosingDate: { type: Date },
    currentInsulin: { type: String },
    meter: { type: String },
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
