// import User from "../models/userModel.js";

export const createUser = (req, res) => {
    res.send("hello")
    // await console.log(req.body)
//   const email = req.body.email;
//   const findUser = await User.findOne({email: email});
//   if (!findUser) {
//     const newUser = await User.create(req.body);
//     res.json(newUser);
//   } else {
//     res.json({
//       msg: "User already exists",
//       success: false,
//     });
//   }
};

export default createUser;
