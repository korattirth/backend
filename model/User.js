const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  homeAddress: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  cart: {
    events: [{
      eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
});

userSchema.methods.addToCart = function(event){
  const cartEventIndex = this.cart.events.findIndex(ev => {
      return ev.eventId.toString() === event._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.events]
  if(cartEventIndex >= 0){
      newQuantity = this.cart.events[cartEventIndex].quantity + 1;
      updatedCartItems[cartEventIndex].quantity = newQuantity;
  }
  else{
      updatedCartItems.push({
          eventId : event._id,
          quantity : newQuantity
      });
  }
  const updatedCart = {
      events : updatedCartItems
  }
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.removeFromCart = function(eventId) {
  const updateCartItem = this.cart.events.filter(event => {
      return event.eventId.toString() !== eventId.toString();
  })

  console.log(updateCartItem)

  this.cart.events = updateCartItem;
  return this.save();
}

userSchema.methods.clearCart = function(){
  this.cart = {events : []}
  return this.save();
}

module.exports = mongoose.model("User", userSchema);