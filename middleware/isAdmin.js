const User = require("../model/User");
const {
    Roles
} = require("../util/enum");

module.exports = (req, res, next) => {
    req.userId && User.findById(req.userId).then(user => {
        if (user && user.UserRole == Roles.Admin) {
            next();
        } else {
            const error = new Error("User does Not Authorized");
            error.statusCode = 401;
            throw error;
        }
    })
}