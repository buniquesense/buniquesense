const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { authenticate, authorizeRole } = require('../middleware/auth');
const axios = require('axios');

// GLOBAL MIDDLEWARE → all admin routes protected
router.use(authenticate, authorizeRole('admin'));


// ------------------------------
// LIST ORDERS
// ------------------------------
router.get('/orders', async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'fullName email')
    .populate('product', 'name price')
    .populate('assignedGuide', 'fullName email phoneNumber');
  res.json(orders);
});


// ------------------------------
// ASSIGN GUIDE
// ------------------------------
router.post('/orders/:id/assign-guide', async (req, res) => {
  const { guideId } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.assignedGuide = guideId;
  await order.save();
  res.json(order);
});


// ------------------------------
// REAL SHIPROCKET DISPATCH
// ------------------------------
router.post('/orders/:id/dispatch', async (req, res) => {
  const { method, trackingNumber, courierName } = req.body;
  const order = await Order.findById(req.params.id).populate('user product');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  // -------------------------------------
  // MANUAL DISPATCH
  // -------------------------------------
  if (method === 'manual') {
    order.shipment = {
      method: 'manual',
      status: 'dispatched',
      trackingNumber,
      courierName,
      history: [{ status: 'dispatched', message: `Manual dispatch`, at: new Date() }]
    };

    order.status = 'dispatched';
    await order.save();
    return res.json(order);
  }

  // -------------------------------------
  // SHIPROCKET DISPATCH
  // -------------------------------------
  
if (method === 'shiprocket') {
  try {
    const token = await getShiprocketToken();

    // -------------------------------
    // 1️⃣ Correct Shiprocket Payload
    // -------------------------------
    const payload = {
      order_id: `ORD_${order._id}`,
      order_date: new Date().toISOString(),
      pickup_location: process.env.SR_PICKUP_LOCATION_ID || process.env.SR_PICKUP_LOCATION,

      billing_customer_name: order.user.fullName,
      billing_last_name: "",
      billing_address: order.user.address,
      billing_city: order.user.city,
      billing_pincode: order.user.pincode || "500001",
      billing_state: order.user.state,
      billing_country: "India",
      billing_email: order.user.email,
      billing_phone: order.user.phoneNumber,

      shipping_is_billing: true,
      payment_method: "Prepaid",

      order_items: [
        {
          name: order.product.name || "Product",
          sku: order.product.sku || "KIT-001",
          units: order.quantity || 1,
          selling_price: order.amount,
          discount: 0,
          tax: 0
        }
      ],

      sub_total: order.amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    // -------------------------------
    // 2️⃣ Create Shiprocket Order
    // -------------------------------
    // 1️⃣ Create Order
      const createOrder = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("SR Order Response:", createOrder.data);

      // Extract proper values
      const srOrderId =
        createOrder.data.order_id ||
        createOrder.data.data?.order_id;

      const shipmentId =
        createOrder.data.shipment_id ||
        createOrder.data.data?.shipment_id;

      if (!srOrderId || !shipmentId) {
        console.error("Shiprocket Order Creation Failed:", createOrder.data);
        return res.status(500).json({
          message: "Shiprocket order creation failed",
          details: createOrder.data
        });
      }

      console.log("SR ORDER ID:", srOrderId);
      console.log("SHIPMENT ID:", shipmentId);


      // 2️⃣ Generate AWB
      const awbRes = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
        { shipment_id: shipmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("AWB RESPONSE:", awbRes.data);

      const awb = awbRes.data.response.data.awb_code;


    // -------------------------------
    // 4️⃣ Generate Label
    // -------------------------------
    const labelRes = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/generate/label?shipment_id=${shipmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const labelUrl = labelRes.data.label_url;

    // -------------------------------
    // 5️⃣ Save to Database
    // -------------------------------
    order.shipment = {
      method: "shiprocket",
      status: "dispatched",
      trackingNumber: awb,
      courierName: "Shiprocket",
      labelUrl,
      shipmentId,
      history: [
        { status: "dispatched", message: "Shipped via Shiprocket", at: new Date() }
      ]
    };

    order.status = "dispatched";
    await order.save();

    return res.json({
      ok: true,
      message: "Shiprocket Dispatch Success",
      order
    });

  } catch (err) {
    console.error("Shiprocket ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Shiprocket error",
      details: err.response?.data || err.message
    });
  }
}
  res.status(400).json({ message: "Invalid dispatch method" });
});

router.get("/orders/:id/label", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || !order.shipment?.labelUrl)
    return res.status(404).json({ message: "Label not available" });

  res.json({ labelUrl: order.shipment.labelUrl });
});


// mock DISPATCH ORDER disable it in live
// router.post('/orders/:id/dispatch', async (req, res) => {
//   const { method, trackingNumber, courierName } = req.body;
//   const order = await Order.findById(req.params.id).populate('user product');
//   if (!order) return res.status(404).json({ message: 'Order not found' });

//   // -------------------------------------
//   // MANUAL DISPATCH
//   // -------------------------------------
//   if (method === 'manual') {
//     order.shipment = {
//       method: 'manual',
//       status: 'dispatched',
//       trackingNumber,
//       courierName,
//       history: [
//         { status: 'dispatched', message: `Manually dispatched`, at: new Date() }
//       ]
//     };

//     order.status = 'dispatched';
//     await order.save();
//     return res.json(order);
//   }

//   // -------------------------------------
//   // MOCK SHIPROCKET DISPATCH (no API call)
//   // -------------------------------------
//   if (method === 'shiprocket') {
//     // Generate fake tracking info
//     const fakeTracking = "MOCK-SR-" + Math.floor(Math.random() * 99999999);
//     const fakeCourier = "Shiprocket Demo Courier";

//     order.shipment = {
//       method: 'shiprocket',
//       status: 'dispatched',
//       trackingNumber: fakeTracking,
//       courierName: fakeCourier,
//       history: [
//         {
//           status: "dispatched",
//           message: "Shipment created (Mock Shiprocket Mode)",
//           at: new Date()
//         }
//       ]
//     };

//     order.status = "dispatched";
//     await order.save();

//     return res.json({
//       ok: true,
//       message: "Mock Shiprocket dispatch successful",
//       order
//     });
//   }

//   // -------------------------------------
//   // INVALID METHOD
//   // -------------------------------------
//   res.status(400).json({ message: 'Invalid dispatch method' });
// });


// ------------------------------
// SHIPROCKET TOKEN
// ------------------------------
async function getShiprocketToken() {
  try {
    const email = (process.env.SR_EMAIL || "").trim();
    const password = process.env.SR_PASSWORD;   // DO NOT ENCODE

    console.log("Shiprocket Login Attempt:", { email });
    console.log("Raw Password Length:", password.length);

    const resp = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: email,
        password: password  // RAW password, same as Postman
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Shiprocket Token OK");
    console.log("FINAL PASSWORD SENT TO SR:", JSON.stringify(process.env.SR_PASSWORD));
    return resp.data.token;

  } catch (err) {
    console.error("Shiprocket Login FAILED:", err?.response?.data || err.message);
    throw new Error("Shiprocket Authentication Failed");
  }
}



// ------------------------------
// CREATE GUIDE (FIXED)
// ------------------------------
router.post('/guides', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // AUTO PASSWORD GENERATION
    // const password = Math.random().toString(36).slice(-8);

    const u = new User({ fullName, email, phoneNumber, role: 'guide' });

    await u.setPassword(password);
    await u.save();

    res.json({
      message: "Guide created successfully",
      guide: u,
      tempPassword: password
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create guide" });
  }
});

// ------------------------------
// LIST GUIDES
// ------------------------------
router.get('/guides', async (req, res) => {
  const guides = await User.find({ role: 'guide' }, '-passwordHash');
  res.json(guides);
});

// DELETE GUIDE
router.delete('/guides/:id', async (req, res) => {
  try {
    const guide = await User.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });

    // CHECK IF ANY STUDENT IS ASSIGNED
    const assignedCount = await Order.countDocuments({ assignedGuide: guide._id });
    if (assignedCount > 0) {
      return res.status(400).json({
        message: "This guide has assigned students. Cannot delete."
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Guide deleted successfully" });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete guide" });
  }
});

// ------------------------------
// MAKE ADMIN
// ------------------------------
router.post('/users/:userId/make-admin', async (req, res) => {
  const u = await User.findById(req.params.userId);
  u.role = 'admin';
  await u.save();
  res.json(u);
});

// make guide

router.post('/users/:id/make-guide', async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ message: "User not found" });

  u.role = 'guide';
  await u.save();
  res.json({ message: "Role updated to guide", user: u });
});



// ------------------------------
// LIST USERS
// ------------------------------
router.get('/users', async (req, res) => {
  const users = await User.find({}, '-passwordHash');
  res.json(users);
});


// ------------------------------
// LIST PRODUCTS
// ------------------------------
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ------------------------------
// ADMIN CREATE STUDENT + ORDER
// ------------------------------
router.post('/students/create', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      address,
      city,
      state,
      productId,
      status
    } = req.body;

    // 1. CREATE USER
    const user = new User({
      fullName,
      email,
      phoneNumber,
      address,
      city,
      state,
      role: "student"
    });

    await user.setPassword(password);
    await user.save();

    // 2. GET PRODUCT
    const product =
      productId ?
      await Product.findById(productId) :
      await Product.findOne();

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 3. CREATE ORDER (NO PAYMENT)
    const ord = new Order({
      user: user._id,
      product: product._id,
      quantity: 1,
      amount: product.price,
      status: status, // pending, paid, yet_to_be_paid
      payment: {
        provider: "admin",
        orderId: "ADMIN_" + Date.now()
      }
    });

    await ord.save();

    res.json({
      ok: true,
      message: "Student and order created successfully",
      user,
      order: ord
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create student" });
  }
});

// ADMIN: List all guides WITH their assigned students
router.get('/guides-with-students', async (req, res) => {
  try {
    const guides = await User.find({ role: 'guide' }, '-passwordHash');

    const result = [];

    for (const guide of guides) {
      const students = await Order.find({ assignedGuide: guide._id })
        .populate('user', 'fullName email phoneNumber')
        .populate('product', 'name price');

      result.push({
        ...guide.toObject(),
        students
      });
    }

    res.json(result);

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load guide-student data" });
  }
});

// CHANGE GUIDE PASSWORD
router.post('/guides/:id/change-password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password required" });

    const guide = await User.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });

    await guide.setPassword(password);
    await guide.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

// CHANGE GUIDE FOR A STUDENT ORDER
router.post('/guides/change-student-guide', async (req, res) => {
  try {
    const { orderId, newGuideId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.assignedGuide = newGuideId;
    await order.save();

    res.json({ message: "Guide reassigned", order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reassign guide" });
  }
});

// ------------------------------
// CREATE ADMIN / GUIDE (ADMIN ONLY)
// POST /admin/users
// body: { fullName, email, phoneNumber, password, role } role = 'admin'|'guide'
// ------------------------------
router.post('/users', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    if (!['admin','guide'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(422).json({ message: 'Email already exists' });

    const u = new User({ fullName, email, phoneNumber, role });
    await u.setPassword(password);
    await u.save();

    res.json({ ok: true, user: { id: u._id, fullName: u.fullName, email: u.email, role: u.role }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// ------------------------------
// UPDATE ROLE (toggle or set)
// POST /admin/users/:id/role
// body: { role } role = 'admin'|'guide'
// ------------------------------
router.post('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['admin','guide'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });

    u.role = role;
    await u.save();
    res.json({ ok: true, user: u });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// ------------------------------
// LIST STUDENTS
// GET /admin/students
// returns users with role=student (no passwordHash)
// ------------------------------
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }, '-passwordHash');
    res.json(students);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load students' });
  }
});

// ------------------------------
// ASSIGN GUIDE TO STUDENT
// POST /admin/students/:userId/assign-guide
// body: { guideId }
// This will find the latest order for the student and set assignedGuide
// ------------------------------
router.post('/students/:userId/assign-guide', async (req, res) => {
  try {
    const { guideId } = req.body;
    const { userId } = req.params;

    const guide = await User.findById(guideId);
    if (!guide || guide.role !== 'guide') return res.status(400).json({ message: 'Invalid guide' });

    // find the most recent order for this student
    const order = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
    if (!order) return res.status(404).json({ message: 'Student order not found' });

    order.assignedGuide = guideId;
    await order.save();

    res.json({ ok: true, order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to assign guide' });
  }
});

// ADMIN: change any user's password (admin only)
router.post('/users/:id/change-password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });

    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });

    await u.setPassword(password);
    await u.save();

    res.json({ ok: true, message: 'Password updated' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to change password' });
  }
});




module.exports = router;
