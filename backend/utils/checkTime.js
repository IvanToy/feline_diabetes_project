const checkTime = (time) => {
  const hour = time.split(":")[0];

  return hour >= 12 && hour <= 23 ? "PM" : "AM";
};

module.exports = checkTime;
