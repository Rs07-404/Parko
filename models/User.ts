import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDocument extends mongoose.Document {
  _id: string;
  email: string;
  userName: string;
  profile: {
    firstName: string;
    lastName: string;
    image: string;
  }
  password: string;
  roles: string[];
  mobile: string;
  gender: string;
  vehicles: mongoose.Types.ObjectId[];
  reservations: mongoose.Types.ObjectId[];
  currentReservation: mongoose.Types.ObjectId;
  qrcode: string;
  parkingArea: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


const UserSchema = new mongoose.Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  roles: {
    type: [String],
    enum: ["User", "LandOwner", "Admin", "EntryOperator", "ExitOperator"],
    default: ["User"],
    required: true,
    validate: {
      validator: function (roles) {
        return Array.isArray(roles) && new Set(roles).size === roles.length;
      },
      message: "Roles must be unique.",
    },
  },
  mobile: {
    type: String,
    required: true
  },
  // gender: {
  //   type: String,
  //   required: true,
  //   enum: ["male", "female"]
  // },
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: [],
  }],
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: [],
  }],
  currentReservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: null
  },
  qrcode: {
    type: String,
    default: '',
  },
  
  // For Operators only
  parkingArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingArea',
    required: function() {
      return this.roles?.includes("EntryOperator") || this.roles?.includes("ExitOperator");
    },
    default: null
  }
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof mongoose.Error) {
      console.error("Error hashing password:", err.message);
      next(err);
    }
    next(new Error("Error hashing password"));
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;