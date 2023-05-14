const products = [
    {
        name: "Womens Sleeve Shirts",
        price: 8.99,
        image: "product1.jpg",
        description:
            "Women's cute casual short sleeve tops, women's summer-fall tee shirt easily pair with others. For example: shorts,long pants, jeans, dress, leggings, boots and etc. Such a beautiful and graceful tee shirt will make you be more fashionable and attractive! The perfect top for spring, summer, autumn, and winter.",
        amount: 120,
        category: "Fashion",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Flannel Shirt",
        price: 13.93,
        image: "product2.jpg",
        description:
            "Let loose in our timeless flannel, featuring a classic design with chambray lined collar and cuffs. Made of soft brushed mid-weight cotton flannel, this yarn-dyed shirt is just right and very comfortable. Wear it alone or layer up during those brisk fall days. Pairs perfectly with our Womens Quilted Vest.",
        amount: 122,
        category: "Fashion",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Hooded Sweatshirt",
        price: 14.5,
        image: "product3.jpg",
        description:
            "it will hold its shape thanks to ribbed cuffs and hem. Double-needle stitching at the neck and armhole seams further enhance quality and durability. In classic hoodie style, there's also a front kangaroo pocket. Here's a soft, warm, fleece hooded sweatshirt to wear well and with pride",
        amount: 300,
        category: "Fashion",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Men's Dress Shirt",
        price: 19.99,
        image: "product4.jpg",
        description:
            "A generous cut through the shoulders, chest and waist for total comfort and a classic fit Button-Down Collar: More relaxed & casual collar; appears neat with or without neckwear so you can dress it up or down.",
        amount: 230,
        category: "Fashion",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Apple AirPods Pro",
        price: 129,
        image: "product5.jpg",
        description:
            "Now with four pairs of silicone tips (XS, S, M, L) to fit a wider range of ears and provide all-day comfort. The tips create an acoustic seal to help keep out noise and secure AirPods Pro in place.",
        amount: 333,
        category: "Electronics",
        vendorUsername: "nguyenvana",
    },
    {
        name: "48-Pack AA Batteries",
        price: 16.49,
        image: "product6.jpg",
        description:
            "48-pack of 1.5 volt AA alkaline batteries for reliable performance across a wide range of devices",
        amount: 333,
        category: "Electronics",
        vendorUsername: "nguyenvana",
    },
    {
        name: "CeraVe Cream",
        price: 17.78,
        image: "product7.jpg",
        description:
            "With hyaluronic acid, ceramides and MVE technology for 24 hour hydration. Rich, velvety texture that leaves skin feeling smooth, it is absorbed quickly for softened skin without greasy, sticky, feel",
        amount: 123,
        category: "Beauty Cosmetic",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Dove Body Wash",
        price: 8.27,
        image: "product8.jpg",
        description:
            "Dove Deep Moisture Body Wash gently cleanses and deeply moisturizes the skin, leaving it renewed and healthy-looking for 24 hours",
        amount: 90,
        category: "Beauty Cosmetic",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Camping Chair",
        price: 39,
        image: "product9.jpg",
        description:
            "Camping chair combines a cozy design with a convenient armrest cooler and Built in 4 can cooler pouch keeps cold drinks within reach",
        amount: 92,
        category: "Sports & Outdoors",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Outdoor Basketballs",
        price: 13.99,
        image: "product10.jpg",
        description:
            "Street ball will never die. Built for summer tournaments and Saturdays at the park, the Spalding Street outdoor basketball holds to the official size and weight. It has a deep channel design to give you proper grip and a durable rubber cover that stands up to asphalt or concrete.",
        amount: 80,
        category: "Sports & Outdoors",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Cookware Set",
        price: 299.9,
        image: "product11.jpg",
        description:
            "Anolon Advanced Home cookware features ultra-durable nonstick release so your creations glide off the pan easily for years to come and Engineered for fast, perfectly uniform heating. Hard-anodized construction is twice as hard as stainless steel for maximum durability.",
        amount: 180,
        category: "Home & Kitchen",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Wine Fridge",
        price: 317.23,
        image: "product12.jpg",
        description:
            "Dual Zone Cooling: Separately controlled temperature zones let you customize your ideal wine storage environment for up to 8 bottles in the upper zone and 10 bottles in the lower zone",
        amount: 180,
        category: "Home & Kitchen",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Non-Scratch Sponges",
        price: 3.23,
        image: "product13.jpg",
        description: "Amazon Basics Non Scratch Scrub Sponges",
        amount: 999,
        category: "Health & Household",
        vendorUsername: "nguyenvana",
    },
    {
        name: "Fitness Tracker",
        price: 99.95,
        image: "product14.jpg",
        description:
            "Inspire 3 is the tracker that helps you find your energy, do what you love and feel your best. All you have to do is wear it",
        amount: 192,
        category: "Health & Household",
        vendorUsername: "nguyenvana",
    },
];

const schema = require("./schema");
const Product = schema.Product;

Product.insertMany(products)
    .then(() => console.log("many products are inserted"))
    .catch((error) => console.log(error));


