const asnycHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const bcrypt = require('bcryptjs');

const registerUser = asnycHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }
    const userExists = await User.findOne({ email }) // this is to check whether the enters email exists already in our database or not
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

// const authUser = asnycHandler(async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (user && (await user.matchPassword(password))) {
//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             pic: user.pic,
//             token: generateToken(user._id),
//         });
//     }
//     else {
//         res.status(401);
//         throw new Error("Invalid Email or Password");
//     }
// });


// const authUser = asnycHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       pic: user.pic,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid Email or Password");
//   }
// });
const authUser = asnycHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    // if (!user) {
    //     res.json({ message: "email not found" });
    // }
    // else {
    //     res.json({ message: "user email found" });
    // }
    // if (!isMatch) {
    //     res.json({ message: "password incorrect" });
    // }
    // else {
    //     res.json({ message: "password is correct" });
    // }
  if (user && isMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
// /api/user
const allUsers = asnycHandler(async (req,res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ]
  } : {};
  // console.log(keyword);
  const users = await User.find(keyword);
  res.send(users);
})

module.exports = {registerUser,authUser,allUsers}