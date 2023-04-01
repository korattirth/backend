const express = require("express");
const {
    body
} = require("express-validator");

const {
createEvent,getEventList,getHighlightedEventList,getSingleEvent,addToCartEvent,removeToCartEvent,makePayment,afterPayment
} = require("../controller/event");
const isAuthenticated = require("../middleware/auth");
const upload = require('../util/uploader')
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.post("/create-event", upload.single('file'), [
    body('topic').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
    body('date').trim().not().isEmpty(),
    body('type').trim().not().isEmpty(),    
    body('price').isDecimal().not().isEmpty(),
], isAuthenticated,isAdmin,createEvent);

router.get('/highlighted-event-list', getHighlightedEventList);
router.get('/event-list', getEventList);
router.get('/get-event/:eventId', getSingleEvent);
router.post('/add-event-cart/:eventId', isAuthenticated,addToCartEvent);
router.post('/remove-event-cart/:eventId', isAuthenticated,removeToCartEvent);
router.post('/create-checkout-session',isAuthenticated,makePayment);
router.post('/webhook',afterPayment);

module.exports = router;