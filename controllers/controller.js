const { selectTopics, selectArticleById, selectUsers, updateVotebyArticleId, selectArticles } = require('../models/model');

exports.getTopics = (req, res, next) => {

    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((err) => {
            next(err);
        })
};

exports.getArticleById = (req, res, next) => {

    const { article_id } = req.params;

    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch((err) => {
            next(err);
        })
}

exports.getUsers = (req, res, next) => {

    selectUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch((err) => {
            next(err);
        })
}

exports.updateVotes = (req, res, next) => {

    const { article_id } = req.params;

    const voteChange = req.body.inc_votes;

    const voteObjKey = Object.keys(req.body)[0];

    updateVotebyArticleId(voteChange, article_id, voteObjKey)
        .then((updatedArticle) => {
            res.status(200).send({ updatedArticle: updatedArticle });
        })
        .catch((err) => {
            next(err);
        })
}

exports.getArticles = (req, res, next) => {
    // if (Object.keys(req.query).length > 0)
    //     selectArticlesByQuery(req.query)
    //         .then((articles) => {
    //             res.status(200).send(articles);
    //         })
    //         .catch((err) => {
    //             next(err);
    //         });
    // else
        selectArticles()
            .then((articles) => {
                res.status(200).send({ articles });
            })
            .catch((err) => {
                next(err);
            });
};