const PortfolioSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [String],
    timestamps: {
        createdAt: { type: Date, default: Date.now },
        updatedAt: Date,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Task', TaskSchema);
