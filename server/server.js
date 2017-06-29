require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Poll} = require('./models/poll');
const {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['name', 'password']);

    let user = new User(body);

    user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['name', 'password']);

    User.findByCredentials(body.name, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.post('/polls', authenticate, (req, res) => {
    let poll = new Poll({
        question: req.body.question,
        options: req.body.options,
        creatorName: req.user.name,
        _creator: req.user._id
    });

    poll.save().then(() => {
        Poll.find().sort('-_id').then((polls) => {
            res.send(polls);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/polls', (req, res) => {
    Poll.find().sort('-_id').then((polls) => {
        res.send(polls);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/polls/me', authenticate, (req, res) => {
    Poll.find({
        _creator: req.user._id
    }).sort('-_id').then((polls) => {
        res.send(polls);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/polls/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);

    Poll.findById(id).then((poll) => {
        if (!poll) {
            res.status(404).send();
        }
        res.send(poll);
    }, (e) => {
        res.status(400).send();
    });
});

app.delete('/polls/me/:id', authenticate, (req, res) => {
    const id = req.params.id;

    Poll.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((poll) => {
        if (!poll) {
            res.status(404).send();
        }
        res.send(poll);
    }, (e) => {
        res.status(400).send();
    });
});

app.patch('/polls/:id/:optionId', authenticate, (req, res) => {
    const id = req.params.id;
    const optionId = req.params.optionId;

    Poll.update({
        _id: id,
        'options._id': optionId,
        voters: {
            $ne: req.user._id
        }
    }, {
        $inc: {
            'options.$.votes': 1,
            totalVotes: 1
        },
        $push: {
            voters: req.user._id
        }
    }, {
        new: true
    }).then(() => {
        Poll.find().sort('-_id').then((polls) => {
            res.send(polls);
        });       
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});