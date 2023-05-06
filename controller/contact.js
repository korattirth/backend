const Contact = require("../model/Contact");
const User = require("../model/User");
const Event = require("../model/Event");
const SuggestedStudents = require("../model/SuggestedStudents");
const {
  Roles
} = require("../util/enum");
const UserDto = require("../dto/UserDto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.PASSWORD,
  },
});

exports.postQuestion = async (req, res, next) => {
  try {
    const contact = new Contact({
        question : req.body.question,
        questionType : req.body.questionType,
        userId : req.userId
    });

    await contact.save();
    res.status(200).json({
        message: 'Question submit successfully'
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.postAnswer = async (req, res, next) => {
  try {
    const question = await Contact.findById(req.params.questionId);
    question.answer = req.body.answer;
    await question.save();
    res.status(200).json({
        message: 'Answer submit successfully'
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.getQuestion = async (req, res, next) => {
  try {
    const contact = await Contact.find({userId: req.userId}); 
    res.status(200).json(contact);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getQuestionForAdmin = async (req, res, next) => {
  try {
    const contact = await Contact.find(); 
    res.status(200).json(contact);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.getAllStudentList = async (req, res, next) => {
  try {
    const students = await User.find({role: Roles.Customer}); 
    let userListDto = [];
    students.forEach(user => {
        userListDto.push(new UserDto(user))
      });
    res.status(200).json(userListDto);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.getAllEventList = async (req, res, next) => {
  try {
    const eventList = await Event.find(); 
    res.status(200).json(eventList);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.postSuggestedStudents = async (req, res, next) => {
  try {
    const suggestedEvent = await Event.findById(req.body.event);
    const suggestedStudent = await User.findById(req.body.suggestedStudents);
    const currentUser = await User.findById(req.userId);

    var mailOptions = {
      from: process.env.EMAIL_FROM,
      to: suggestedStudent.email,
      subject: 'You are Suggested!!',
      html: `Dear User ${suggestedStudent.fName} ${suggestedStudent.lName} You had suggest by <b>${currentUser.fName} ${currentUser.lName}</b> for <b>${suggestedEvent.topic}</b> event
              If you are interested In this event then hurry up...<br/>
              GO AND BOOK YOUR EVENT!!!<br/>
              You can check details about event on our website ${process.env.BASE_URL}`
    };
    transporter.sendMail(mailOptions);

    const suggested = new SuggestedStudents({
      userId : currentUser._id,
      suggestedEvent : suggestedEvent._id,
      suggestedUser : suggestedStudent._id
    });
    await suggested.save();
    res.status(200).json({
      message: "Thank you for suggesting students",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


