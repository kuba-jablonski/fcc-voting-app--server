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
        votes: {
            type: Number,
            default: 0
        }
    }],
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    voters: [mongoose.Schema.Types.ObjectId]
});

PollSchema.methods.toJSON = function() {
    let poll = this;
    let pollObject = poll.toObject();

    return _.pick(pollObject, ['_id', 'question', 'options', 'totalVotes', 'voters']);
}


const Poll = mongoose.model('Poll', PollSchema);

module.exports = {Poll};