const {
    validationResult
} = require("express-validator");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Event = require("../model/Event");
const User = require("../model/User");
const Order = require("../model/Orders");
const {
    uploadToCloudinary
} = require('../util/imageUpload');
const Paginate = require('../dto/Paginate');
require("dotenv").config();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_END_POINT_KEY;


exports.createEvent = async (req, res, next) => {
    try {
        const image = req.file;
        const topic = req.body.topic;
        const description = req.body.description;
        const date = req.body.date;
        const type = req.body.type;
        const price = req.body.price;
        const errors = validationResult(req);
        if (!errors.isEmpty() || !image) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        let imagePath = await uploadToCloudinary(image.path);
        if (!imagePath) {
            const error = new Error('An error occurred while uploading the image');
            throw error
        }
        const event = new Event({
            topic: topic,
            description: description,
            image: imagePath.secure_url,
            userId: req.userId,
            date: date,
            type: type,
            price: price
        })
        await event.save();
        res.status(200).json({
            message: 'Post created successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getHighlightedEventList = async (req, res, next) => {
    try {
        const eventList = await Event.find().populate({
            path: 'userId',
            select: 'fName lName role image'
        });

        res.status(200).json(eventList)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEventList = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 3;

        const totalItems = await Event.count();
        const totalPages = Math.ceil(totalItems / pageSize);

        const events = await Event.find().sort('date').populate({
            path: 'userId',
            select: 'fName lName role'
        }).limit(pageSize * currentPage);

        res.status(200).json(new Paginate(events, currentPage, pageSize, totalPages))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSingleEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.eventId).populate({
            path: 'userId',
            select: 'fName lName role image'
        })
        res.status(200).json(event)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addToCartEvent = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        const user = await User.findById(req.userId);
        await user.addToCart(event);
        res.status(200).json({
            message: "Add Event To Cart Successfully!!"
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.removeToCartEvent = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        const user = await User.findById(req.userId);
        await user.removeFromCart(event);
        res.status(200).json({
            message: "Remove Event To Cart Successfully!!"
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.makePayment = async (req, res, next) => {
    try {
        const customer = await stripe.customers.create({
            metadata: {
                userId: req.userId,
            }
        });

        const line_items = req.body.map(event => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: event.eventId.topic,
                        images: [event.eventId.image],
                        metadata: {
                            id: event.eventId._id
                        }
                    },
                    unit_amount: event.eventId.price * 100
                },
                quantity: event.quantity
            }
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            customer: customer.id,
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `http://localhost:3000/orders`,
            cancel_url: `http://localhost:3000/my-cart`,
        });
        res.send({
            url: session.url
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.afterPayment = async (req, res, next) => {
    try {
        const sig = req.headers['stripe-signature'];
        let data;
        let eventType;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        } catch (err) {
            const error = new Error(`Webhook Error: ${err.message}`)
            throw error
        }

        data = event.data.object;
        eventType = event.type;

        // Handle the event
        if (eventType === "checkout.session.completed") {
            const customer = await stripe.customers.retrieve(data.customer);
            const user = await User.findById(customer.metadata.userId);

            user.cart.events.map(async(event) => {
                const orders = new Order();
                orders.userId = user._id;
                orders.eventId = event.eventId;
                orders.quantity = event.quantity;
                await orders.save();
            });
            user.cart = [];
            await user.save();
            res.status(200);
        }
        res.send();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}