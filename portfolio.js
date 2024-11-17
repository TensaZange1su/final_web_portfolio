const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String], // Ссылки на изображения
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ссылка на пользователя
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
