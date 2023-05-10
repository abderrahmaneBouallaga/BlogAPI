const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/usersModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

/* generate a JSON Web Token (JWT) for a given id 
using a secret key and expiration time specified 
in environment variables (config.env) */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SIGN UP CONTROLLER //
exports.signup = catchAsync(async (req, res, next) => {
    // Create a new user based on the data received in the request body
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    // Generate a JWT token for the newly created user
    const token = signToken(newUser._id)

    // Send a response with the token and user data
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

// LOGIN CONTROLLER //
exports.login = catchAsync(async (req, res, next) => {
    const { email, password} = req.body;

    // Check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password!', 400)) // bad request
    }
    // Check if user exist and the provided password is correct
    const user = await User.findOne({ email }).select('+password');
     
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401)) // unauthorized
    }
    // If everything is okay, send token to the client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // Getting token and check of it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('Your are not logged in! Please log in to get access.', 401))
    }
    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belonging to  this token does no longer exist.', 401))
    }
    // Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again', 401))
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next()
})
