const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcryptjs");
const schema = require("./model/schema");
const User = schema.User;
const Customer = schema.Customer;
const Vendor = schema.Vendor;
const Shipper = schema.Shipper;
const Product = schema.Product;
const Order = schema.Order;

app.set("view engine", "ejs");
app.use(express.static("public"));

// Use the `express.urlencoded` middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Route for login page. Users have to log in to use the website
app.get("/", (req, res) => {
    res.render("login-page");
});

// Route for Vendor registration page
app.get("/vendor/register", (req, res) => {
    res.render("register-vendor");
});

// Route for Customer registration page
app.get("/customer/register", (req, res) => {
    res.render("register-customer");
});

// Route for Shipper registration page
app.get("/shipper/register", (req, res) => {
    res.render("register-shipper");
});

// Route for Vendor homepage
app.get("/vendor/homepage", (req, res) => {
    Product.find({})
        .then((products) => res.render("homepage-vendor", { products }))
        .catch((error) => res.send(error));
});
// done

// Route for adding new products
app.post("vendor/products/add", (req, res) => {});

// Route for Customer homepage
app.get("/customer/homepage", (req, res) => {
    const products = Product.find();

    // Retrieve all categories from the database
    const categories = Product.distinct("category");

    // Wait for both promises to resolve before rendering the homepage
    Promise.all([products, categories])
        .then(([products, categories]) => {
            res.render("homepage-customer", { products, categories });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        });
});

// Route for category page
app.get("/customer/category-page", (req, res) => {
    res.render("category-page");
});

// Route for product detail page
app.get("/customer/product-detail-page", (req, res) => {
    res.render("product-detail-page");
});

// Route for shopping cart page
app.get("/customer/shopping-cart-page", (req, res) => {
    res.render("shopping-cart-page");
});

// Route for Shipper homepage
app.get("/shipper/homepage", (req, res) => {
    Order.find()
    .then((orders) => {
        res.render('homepage-shipper', {orders: orders});
    })
    .catch((error) => console.log(error.message));
});

// Route for handling Vendor registration form submission
app.post("/vendor/register", async (req, res) => {
    try {
        const {
            username,
            password,
            profilePicture,
            email,
            terms,
            businessName,
            businessAddress,
        } = req.body;

        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                error: "Username is already taken",
                message:
                    "You should go back to the register page and sign up with a different Username",
            });
        }

        const existingBusinessName = await Vendor.findOne({ businessName });
        if (existingBusinessName) {
            return res.status(409).json({
                error: "Business Name is already taken",
                message:
                    "You should go back to the register page and sign up with a different Business Name",
            });
        }

        const existingBusinessAddress = await Vendor.findOne({
            businessAddress,
        });
        if (existingBusinessAddress) {
            return res.status(409).json({
                error: "Business Address is already taken",
                message:
                    "You should go back to the register page and sign up with a different Business Address",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Vendor document and save to database
        const newVendor = new Vendor({
            username,
            password: hashedPassword,
            profilePicture,
            email,
            terms,
            businessName,
            businessAddress,
        });
        await newVendor.save();

        // Redirect to Vendor homepage
        res.redirect("/vendor/homepage");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route for handling Customer registration form submission
app.post("/customer/register", async (req, res) => {
    try {
        const {
            username,
            password,
            profilePicture,
            email,
            terms,
            name,
            address,
        } = req.body;

        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                error: "Username is already taken",
                message:
                    "You should go back to the register page and sign up with a different Username",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Customer document and save to database
        const newCustomer = new Customer({
            username,
            password: hashedPassword,
            profilePicture,
            email,
            terms,
            name,
            address,
        });
        await newCustomer.save();

        // Redirect to Customer homepage
        res.redirect("/customer/homepage");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route for handling Shipper registration form submission
app.post("/shipper/register", async (req, res) => {
    try {
        const {
            username,
            password,
            profilePicture,
            name,
            email,
            terms,
            distributionHub,
        } = req.body;

        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                error: "Username is already taken",
                message:
                    "You should go back to the register page and sign up with a different Username",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Shipper document and save to database
        const newShipper = new Shipper({
            username,
            password: hashedPassword,
            profilePicture,
            name,
            email,
            terms,
            distributionHub,
        });
        await newShipper.save();

        // Redirect to Shipper homepage
        res.redirect("/shipper/homepage"); // replace with your Shipper homepage URL
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user with the given username
        const user = await User.findOne({ username });

        // If user not found, show error message
        if (!user) {
            return res.render("login-page", {
                error: "Invalid username or password",
            });
        }

        // Compare the hashed password with the input password
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match, show error message
        if (!passwordMatch) {
            return res.render("login-page", {
                error: "Invalid username or password",
            });
        }

        // If login successful, redirect to the user's respective homepage
        if (user.__t === "Vendor") {
            res.redirect("/vendor/homepage");
        } else if (user.__t === "Customer") {
            res.redirect("/customer/homepage");
        } else if (user.__t === "Shipper") {
            res.redirect("/shipper/homepage");
        } else {
            res.status(500).json({ error: "Invalid user role" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
