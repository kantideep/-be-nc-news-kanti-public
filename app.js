const express = require('express');

const { getTopics, getArticleById } = require('./controllers/controller');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById)

//Handle endpoint error
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Endpoint not found' });
});

//Handle SQL error
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid ID!' });
    } else {
        next(err);
    }
})

//Handle custom error
app.use((err, req, res, next) => {
    if (err.status) {
        console.log(err, '//Handle custom error --------')
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
})

//Handle internal error 
app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
});

module.exports = app;
