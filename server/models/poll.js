const mongoose = require('mongoose');
const _ = require('lodash');

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

PollSchema.methods.toJSON = function() {
    let poll = this;
    let pollObject = poll.toObject();

    return _.pick(pollObject, ['_id', 'question', 'options']);
}

const Poll = mongoose.model('Poll', PollSchema);

module.exports = {Poll};