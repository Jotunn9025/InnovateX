const Turf = require("../models/Turf");
const User = require("../models/User");

function generatePrices() {
  // 7 days, 24 slots (hourly, 0-23)
  const prices = [];
  for (let day = 0; day < 7; day++) {
    const isWeekend = day === 0 || day === 6; // Sunday=0, Saturday=6
    const dayPrices = [];
    for (let slot = 0; slot < 24; slot++) {
      let price = 1000;
      if (slot >= 17 && slot <= 20) price = 1300;
      if (isWeekend) price = slot >= 17 && slot <= 20 ? 1500 : 1200;
      dayPrices.push(price);
    }
    prices.push(dayPrices);
  }
  return prices;
}

exports.listTurfs = async (req, res) => {
  try {
    const { owner } = req.query;
    let query = {};
    if (owner) {
      query.owner = owner;
    }
    const turfs = await Turf.find(query);
    // Attach lowestPrice for each turf
    const turfsWithLowest = turfs.map((turf) => {
      const lowestPrice = turf.prices ? Math.min(...turf.prices.flat()) : 0;
      return { ...turf.toObject(), lowestPrice };
    });
    res.json({ turfs: turfsWithLowest });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTurf = async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: "Turf not found" });
  res.json({ turf });
};

exports.addTurf = async (req, res) => {
  try {
    const { owner, ...turfData } = req.body;
    if (!owner) {
      return res.status(400).json({ message: "Owner userId is required" });
    }
    const user = await User.findById(owner);
    if (!user || user.userType !== "admin") {
      return res
        .status(400)
        .json({ message: "Owner must be a valid admin user" });
    }
    // Auto-generate prices
    const prices = generatePrices();
    const turf = new Turf({ ...turfData, owner, prices });
    await turf.save();
    res.status(201).json({ turf });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
