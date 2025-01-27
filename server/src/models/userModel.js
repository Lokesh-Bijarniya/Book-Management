import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      enum: {
        values: ["Mr", "Mrs", "Miss"],
        message: "{VALUE} is not a valid title",
      },
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      lowercase: true,
      minlength: [4, "Username must be at least 4 characters long"],
      maxlength: [20, "Username cannot be more than 20 characters long"],
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-z0-9_]+$/.test(value); // Only alphanumeric and underscores allowed
        },
        message: props=>
          `${props.value} is not a valid username. Only lowercase letters, numbers, and underscores are allowed.`,
      },

    // we can also handle multiple custom validation
    //   validate: [
    //     {
    //       validator: function (value) {
    //         // Only alphanumeric and underscores allowed
    //         return /^[a-z0-9_]+$/.test(value);
    //       },
    //       message: (props) =>
    //         `${props.value} is not a valid username. Only lowercase letters, numbers, and underscores are allowed.`,
    //     },
    //     {
    //       // Custom validation: Username should not contain "admin"
    //       validator: function (value) {
    //         return !/admin/i.test(value);
    //       },
    //       message: (props) => `Username cannot contain "admin"`,
    //     },
    //   ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: function (value) {
          return /[A-Za-z]/.test(value) && /\d/.test(value); // Password must contain both letters and digits
        },
        message: "Password must contain at least one letter and one number",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true,"Phone number already exist"],
      trim: true,
      validate: {
        validator: function (value) {
          return /^[0-9]{10}$/.test(value); // Phone number must be exactly 10 digits
        },
        message:
          "{VALUE} is not a valid phone number. It must be 10 digits long.",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
            // const customDomainCheck = /@example\.com$/; 
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value); // Email regex validation
        },
        message: "{VALUE} is not a valid email address",
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
        match: [
            /^[0-9]{6}$/, // Pincode should be exactly 6 digits
            "{VALUE} is not a valid pincode. It must be 6 digits long.",
          ],
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Only allow these two roles
      default: "user", // Default role is "user"
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
