const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'Please tell us your name!']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please provide your email'],
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        photo: String,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm password'],
            validate: {
                validator: function(e){
                    return e === this.password
                },
                message: 'Your confirm passord is not correct'
            }
        },
        passordChangedAt: {
            type: Date
        }
    }
)

userSchema.pre('save', async function(next) {

    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;