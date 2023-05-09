const User = require('./../models/usersModel');
const catchAsync = require('./../utils/catchAsync')

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
})

