const User = require("../model/User");
const {
  Roles
} = require("../util/enum");
const UserDto = require("../dto/UserDto");

exports.userList = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.role == Roles.Admin) {
      const userList = await User.find();
      let userListDto = [];
      userList.forEach(user => {
        userListDto.push(new UserDto(user))
      });
      res.status(200).json(userListDto);
    } else {
      const error = new Error("User does Not Authorized");
      error.statusCode = 401;
      throw error;
    }

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.editActiveStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      const error = new Error("somthing went wrong!!");
      error.statusCode = 400;
      throw error;
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({
      message: 'Status change successfully'
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}