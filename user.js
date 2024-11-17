const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    email: String,
    username: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'editor'], // Only 'admin' or 'editor' roles allowed
        default: 'editor', // Default role is 'editor'
    },
    failedLoginAttempts: { type: Number, default: 0 }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;