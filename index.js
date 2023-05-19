//   RMIT University Vietnam
//   Course: COSC2430 Web Programming
//   Semester: 2023A
//   Assessment: Assignment 2
//   Author:
//     1. Tran Manh Cuong (s3974735)
//     2. Truong Quang Bao Loc (s3965528)
//     3. Nguyen Van Khai (s3979259)
//     4. Truong Tuong Hao (s3979259)
//     5. Huynh Nguyen Thien Minh (s3978742)
const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcryptjs");
const fileUpload = require("express-fileupload");
const schema = require("./model/schema");
const User = schema.User;
const Customer = schema.Customer;
const Vendor = schema.Vendor;
const Shipper = schema.Shipper;
const Product = schema.Product;
const Order = schema.Order;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());

// Use the `express.urlencoded` middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Route for login page. Users have to log in to use the website
app.get("/", (req, res) => {
    res.render("login-page");
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
            const id = user._id;
            res.redirect(`/vendor/homepage/${id}#product-page`);
        } else if (user.__t === "Customer") {
            const id = user._id;
            res.redirect(`/customer/homepage/${id}`);
        } else if (user.__t === "Shipper") {
            const id = user._id;
            res.redirect(`/shipper/homepage/${id}`);
        } else {
            res.status(500).json({ error: "Invalid user role" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route for Vendor homepage
app.get("/vendor/homepage/:id", (req, res) => {
    const products = Product.find();
    const orders = Order.find();
    const user = User.findById(req.params.id);
    Promise.all([products, user, orders])
        .then(([products, user, orders]) =>
            res.render("homepage-vendor", { products, orders, user })
        )
        .catch((error) => res.send(error));
});

// Route for Product form
// Route for adding new products
app.post("/vendor/products/add/", (req, res) => {
    const vendorId = req.body.vendorId;
    delete req.body.vendorId;
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: {
            data: req.files.image.data,
            mimeType: req.files.image.mimetype,
        },
        description: req.body.description,
        amount: req.body.amount,
        category: req.body.category,
        vendorUsername: req.body.vendorUsername,
    });
    product
        .save()
        .then(() => res.redirect(`/vendor/homepage/${vendorId}`))
        .catch((error) => res.send(error));
});

// Route for delete product
app.get("/vendor/products/delete/:pid/:id", (req, res) => {
    Product.findByIdAndDelete(req.params.pid)
        .then(() => {
            res.redirect(`/vendor/homepage/${req.params.id}`);
        })
        .catch((error) => res.send(error));
});

// Route for Customer homepage
app.get("/customer/homepage/:id", (req, res) => {
    let minPrice = parseInt(req.query.min);
    let maxPrice = parseInt(req.query.max);
    // Validate and fallback for minPrice
    if (isNaN(minPrice)) {
        minPrice = Number.NEGATIVE_INFINITY;
    }
    // Validate and fallback for maxPrice
    if (isNaN(maxPrice)) {
        maxPrice = Number.POSITIVE_INFINITY;
    }
    const user = User.findById(req.params.id);
    const products = Product.find({
        price: { $gte: minPrice, $lte: maxPrice },
    });
    const categories = Product.distinct("category");
    Promise.all([products, categories, user])
        .then(([products, categories, user]) => {
            res.render("homepage-customer", { products, categories, user });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        });
});

// Route to category page
app.get("/customer/:id/category/:category", async (req, res) => {
    const category = req.params.category;
    const user = User.findById(req.params.id);
    const products = await Product.find({ category: category });
    Promise.all([products, category, user])
        .then(([products, category, user]) => {
            res.render("category-page", { products, category, user });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        });
});

// Route to detail product page
app.get("/customer/:id/products/:pid", async (req, res) => {
    const user = User.findById(req.params.id);
    const product = await Product.findById(req.params.pid);
    Promise.all([product, user])
        .then(([product, user]) => {
            res.render("product-detail-page", { product, user });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        });
});

// Route to search page
app.get("/customer/:id/search/results", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).exec();
        const query = req.query.query;
        const results = await Product.find({ $text: { $search: query } });
        res.render("search-page", { results, user });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route to shopping list page
let cart = {
    products: [],
    totalPrice: 0,
};

app.get("/customer/:id/shopping-cart", (req, res) => {
    const user = User.findById(req.params.id);
    Promise.all([cart, user])
        .then(([cart, user]) => {
            res.render("shopping-cart-page", { cart, user });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        });
});

// Add product to shopping cart
app.post("/customer/:id/shopping-cart/add", (req, res) => {
    const user = User.findById(req.params.id);
    const product = Product.findById(req.body.id);
    Promise.all([cart, user, product])
        .then(([cart, user, product]) => {
            cart.products.push(product);
            cart.totalPrice += product.price;
            res.render("shopping-cart-page", { cart, user });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/customer/:id/shopping-cart", async (req, res) => {
    const distributionHub = req.body.distributionHub;
    const date = req.body.date;
    const status = req.body.status;
    const receiver = req.body.receiver;
    const address = req.body.address;
    const payment = req.body.payment;
    const total = req.body.total;
    const products = JSON.parse(req.body.products);
    const newOrder = new Order({
        distributionHub,
        date,
        status,
        receiver,
        address,
        payment,
        products,
        total
    });
    try {
        // Save the new order to the database
        await newOrder.save();

        // Clear the cart after the order is placed
        cart.products = [];
        cart.totalPrice = 0;
        // Order created successfully, redirect to the customer homepage or perform any other desired actions
        res.redirect(`/customer/homepage/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Send error response
    }
});

// Route for Shipper homepage
app.get("/shipper/homepage/:id", (req, res) => {
    const products = Product.find();
    const orders = Order.find();
    const user = User.findById(req.params.id);
    Promise.all([products, user, orders])
        .then(([products, user, orders]) =>
            res.render("homepage-shipper", { products, orders, user })
        )
        .catch((error) => res.send(error));
});

app.post("/shipper/homepage/update/", (req, res) => {
    Order.findOneAndUpdate(
        { _id: req.body.oid },
        { status: req.body.status },
        { new: true }
    )
        .then(() => {
            console.log("The order is updated");
            res.redirect(`/shipper/homepage/${req.body.uid}`);
        })
        .catch((error) => console.log(error.message));
});

// Route for Vendor registration page
app.get("/vendor/register", (req, res) => {
    res.render("register-vendor");
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
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
            email,
            terms,
            businessName,
            businessAddress,
        });
        await newVendor.save();

        // Redirect to Vendor homepage
        const id = newVendor._id;
        res.redirect(`/vendor/homepage/${id}#product-page`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route for Customer registration page
app.get("/customer/register", (req, res) => {
    res.render("register-customer");
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
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
            email,
            terms,
            name,
            address,
        });
        await newCustomer.save();

        // Redirect to Customer homepage
        const id = newCustomer._id;
        res.redirect(`/customer/homepage/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route for Shipper registration page
app.get("/shipper/register", (req, res) => {
    res.render("register-shipper");
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
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
            name,
            email,
            terms,
            distributionHub,
        });
        await newShipper.save();

        // Redirect to Shipper homepage
        const id = newShipper._id;
        res.redirect(`/shipper/homepage/${id}`); // replace with your Shipper homepage URL
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Route to account detail page
app.get("/customer/account-detail/:id", (req, res) => {
    User.findById(req.params.id).then((user) => {
        if (!user) {
            return res.send("Can not find that user");
        }
        res.render("account-detail-page-customer", { user });
    });
});
app.post("/customer/account-detail/:id", (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.id },
        {
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
        },
        { new: true }
    )
        .then(() => {
            console.log("User information is updated");
            res.redirect(`/customer/homepage/${req.params.id}`);
        })
        .catch((error) => console.log(error.message));
});

app.get("/vendor/account-detail/:id", (req, res) => {
    User.findById(req.params.id).then((user) => {
        if (!user) {
            return res.send("Can not find that user");
        }
        res.render("account-detail-page-vendor", { user });
    });
});
app.post("/vendor/account-detail/:id", (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.id },
        {
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
            username: req.body.username,
            businessName: req.body.businessName,
            email: req.body.email,
            businessAddress: req.body.businessAddress,
        },
        { new: true }
    )
        .then(() => {
            console.log("User information is updated");
            res.redirect(`/vendor/homepage/${req.params.id}`);
        })
        .catch((error) => console.log(error.message));
});

app.get("/shipper/account-detail/:id", (req, res) => {
    User.findById(req.params.id).then((user) => {
        if (!user) {
            return res.send("Can not find that user");
        }
        res.render("account-detail-page-shipper", { user });
    });
});
app.post("/shipper/account-detail/:id", (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.id },
        {
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            distributionHub: req.body.distributionHub,
        },
        { new: true }
    )
        .then(() => {
            console.log("User information is updated");
            res.redirect(`/shipper/homepage/${req.params.id}`);
        })
        .catch((error) => console.log(error.message));
});

app.get("/about-us", (req, res) => {
    res.render("about-us");
});

app.get("/privacy", (req, res) => {
    res.render("privacy");
});

app.get("/refund", (req, res) => {
    res.render("refund");
});

app.get("/terms-of-use", (req, res) => {
    res.render("terms-of-use");
});

app.get("/support", (req, res) => {
    res.render("support");
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
