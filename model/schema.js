const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cuongtran:emsignouc@cluster0.mmq8m4z.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));

// Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    product_image: {
        type: Buffer,
        contentType: String
    },
    category: {
        type: String,
        required: true,
        enum: ["Electronics", "Fashion and Apparel", "Home and Kitchen", "Beauty and Personal Care", "Sports and Outdoors", "Toys and Games"]
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
});

// Vendor Schema
const vendorSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: Buffer,
        contentType: String
    },
    business_name: {
        type: String,
        required: true,
        unique: true
    },
    business_address: {
        type: String,
        required: true
    },
});

// Customer Schema
const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: Buffer,
        contentType: String
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

// Shipper Schema
const shipperSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: Buffer,
        contentType: String
    },
    name: {
        type: String,
        required: true
    },
    distribution_hub: {
        type: String,
        required: true,
        unique: true,
        enum: ["Tan Son Nhat Cargo Terminal", "Cat Lai Terminal", "Saigon Newport Corporation", "Long Binh Logistics Center"]
    }
});

// Distribution Hub Schema
const distributionHubSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

// Order Schema
const orderSchema = new mongoose({
    invoice_id: {
        type: String,
        unique: true,
        required: true
    },
    distribution_hub: {
        type: String,
        required: true
    }
})

// Define a model based on the schema
const Product = mongoose.model('Product', productSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Shipper = mongoose.model('Shipper', shipperSchema);
const DistributionHub = mongoose.model('DistributionHub', distributionHubSchema);

// The module exports the "Product" model so that it can be used by other parts of the application.
module.exports = Product;
module.exports = Vendor;
module.exports = Customer;
module.exports = Shipper;
module.exports = DistributionHub;