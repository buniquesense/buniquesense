const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const { authenticate } = require("../middleware/auth");

// STUDENT DASHBOARD DATA
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");

    const order = await Order.findOne({ user: req.user._id })
      .populate("product")
      .populate("assignedGuide", "fullName email phoneNumber");

    res.json({
      user,
      order,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard fetch error" });
  }
});

module.exports = router;
