const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        minlength: 1
    },
    options: [{
        option: {
            type: String,
            required: true,
            minlength: 1,
        },
        votes: Number
    }],
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = {Poll};