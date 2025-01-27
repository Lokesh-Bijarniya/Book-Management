import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUser = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).send({ status: false, message: "Data is mandatory" });
    }

    const { title, username, password, phone, email, address, role } = req.body;

    // Check for required fields, ensuring they are strings
    if ([title, username, password, phone, email].some((field) => typeof field !== 'string' || field.trim() === "")) {
      return res.status(400).send({ status: false, message: "All fields are required" });
    }

    // Validate role
    const validRoles = ["admin", "user"]; // Add other valid roles if needed
    if (!validRoles.includes(role)) {
      return res.status(400).send({ status: false, message: "Invalid role. Valid roles are 'admin', 'user', 'manager'." });
    }

    const existedUser = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existedUser) {
      return res.status(400).send({ status: false, message: "User with email or username already exists" });
    }

    // Handle password validation explicitly
    const passwordValid = /[A-Za-z]/.test(password) && /\d/.test(password); // Password must contain both letters and digits
    if (!passwordValid) {
      return res.status(400).send({ status: false, message: "Password must contain at least one letter and one number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      title,
      username,
      password: hashedPassword,
      phone,
      email,
      address,
      role
    });

    const createdUser = await userModel.findById(user._id).select("-password");

    return res.status(200).send({ status: true, message: "User created successfully", data: createdUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errorMessages = [];
      for (const field in err.errors) {
        const error = err.errors[field];
        errorMessages.push(error.message);
      }
      return res.status(400).send({ status: false, message: errorMessages.join(", ") });
    } else if (err.name === 'CastError') {
      return res.status(400).send({ status: false, message: `Invalid value for field: ${err.path}` });
    } else if (err.code === 11000) {
      const duplicateField = err.message.match(/index: ([^ ]+)/);
      if (duplicateField) {
        const field = duplicateField[1].split('_')[0];
        return res.status(400).send({
          status: false,
          message: `${field} already exists. Please choose another one.`
        });
      }
    } else {
      return res.status(500).send({ status: false, message: "Server Error", error: err.message });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email) {
      return res.status(400).send({ status: false, message: "username or email is required" });
    }

    const user = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (!user) {
      return res.status(400).send({ status: false, message: "User does not exist" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).send({ status: false, message: "Invalid user credentials" });
    }

    const accessToken = await jwt.sign(
      { _id: user._id, role: user.role }, // Include role in the JWT payload
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const loggedInUser = await userModel.findById(user._id).select("-password");

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 3600000 // 1 hour
    };

    return res.status(200).cookie("accessToken", accessToken, options).send({
      status: true,
      message: "User logged in successfully",
      data: loggedInUser,
      accessToken
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

export { createUser, loginUser };












// Custom Validaions :-
//import validator from "validator"; // A popular third-party library for validation

// Custom validation controller
// export const registerUser = async (req, res) => {
//   try {
//     const { title, username, password, phone, email, address } = req.body;

    // Custom Validation 1: Title validation
    // if (!['Mr', 'Mrs', 'Miss'].includes(title)) {
    //   return res.status(400).json({ message: `${title} is not a valid title` });
    // }

    // Custom Validation 2: Username Validation (Length check, allowed characters)
    // if (!username || username.length < 4 || username.length > 20) {
    //   return res.status(400).json({ message: "Username must be between 4 and 20 characters" });
//     }
//     if (!/^[a-z0-9_]+$/.test(username)) {
//       return res.status(400).json({ message: "Username must contain only lowercase letters, numbers, and underscores" });
//     }

//     // Custom Validation 3: Password Validation (Password must contain letters and digits)
//     if (!password || password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters long" });
//     }
//     if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
//       return res.status(400).json({ message: "Password must contain at least one letter and one number" });
//     }

//     // Custom Validation 4: Phone Validation (Phone should be exactly 10 digits)
//     if (!phone || !/^[0-9]{10}$/.test(phone)) {
//       return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
//     }

//     // Custom Validation 5: Email Validation
//     if (!email || !validator.isEmail(email)) {
//       return res.status(400).json({ message: "Invalid email address" });
//     }

//     // Custom Validation 6: Address Validation (Pincode validation)
//     if (address.pincode && !/^[0-9]{6}$/.test(address.pincode)) {
//       return res.status(400).json({ message: "Pincode must be exactly 6 digits long" });
//     }

//     // Check if username or email already exists (Uniqueness check)
//     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username or email already taken" });
//     }

//     // If all validations pass, create the user
//     const newUser = new User({
//       title,
//       username,
//       password,
//       phone,
//       email,
//       address,
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };