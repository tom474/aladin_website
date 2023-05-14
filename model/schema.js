const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose
    .connect(
        "mongodb+srv://cuongtran:emsignouc@cluster0.mmq8m4z.mongodb.net/Aladin?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.log(error.message));

// Define user schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 8,
            maxLength: 15,
            match: /^[a-zA-Z0-9]+$/,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/,
        },
        profilePicture: {
            type: Buffer,
            default: Buffer.from('RGVmYXVsdF9wZnAuc3Zn')
        },
        email: {
            type: String,
            required: true,
            minLength: 5,
        },
        terms: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Define vendor schema
const vendorSchema = new Schema(
    {
        businessName: {
            type: String,
            required: true,
            unique: true,
        },
        businessAddress: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

// Define customer schema
const customerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 5,
        },
        address: {
            type: String,
            required: true,
            minLength: 5,
        },
    },
    { timestamps: true }
);

// Define shipper schema
const shipperSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 5,
        },
        distributionHub: {
            type: String,
            required: true,
            enum: [
                "Tan Son Nhat Cargo Terminal",
                "Cat Lai Terminal",
                "Saigon Newport Corporation",
                "Long Binh Logistics Center",
            ],
        },
    },
    { timestamps: true }
);

// Define product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: Buffer,
        required: true
    },
    description: {
        type: String,
        maxLength: 500
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ["Beauty Cosmetic", "Fashion", "Sports & Outdoors", "Health & Household", "Home & Kitchen", "Electronics"] 
    },
    vendorUsername: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 15,
        match: /^[a-zA-Z0-9]+$/
    }
});


// Create user model with sub-models
const User = mongoose.model("User", userSchema);
const Vendor = User.discriminator("Vendor", vendorSchema);
const Customer = User.discriminator("Customer", customerSchema);
const Shipper = User.discriminator("Shipper", shipperSchema);

// Create product model 
const Product = mongoose.model("Product",productSchema);

// The module exports the "Product" model so that it can be used by other parts of the application.
module.exports = {
    User,
    Vendor,
    Customer,
    Shipper,
    Product,
};


