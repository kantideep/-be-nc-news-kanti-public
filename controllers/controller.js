const { selectTopics, selectArticleById } = require('../models/model');

exports.getTopics = (req, res, next) => {

    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((err) => {
            console.log(err, '<<<<<<<<<<<<<<<<<<<');
            next(err);
        })
};

exports.getArticleById = (req, res, next) => {

    const { article_id } = req.params;

    selectArticleById(article_id)
        .then((article) => {
            console.log(article), 'response in controller';
            res.status(200).send({ article })
        })
        .catch((err) => {
            next(err);
    })
}

