const { push } = require('../db/data/test-data/articles');
const { selectTopics, selectArticleById, selectUsers, updateVotebyArticleId, selectArticles, selectCommentsByArticleId, selectTopicsBySlug, addComment } = require('../models/model');

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

    const { topic } = req.query;

    let promiseArr = [selectArticles(topic)];

    if (topic) {
        promiseArr.push(selectTopicsBySlug(topic))
    }

    Promise.all(promiseArr)
        .then((response) => {
            res.status(200).send({ articles: response[0] });
        })
        .catch((err) => {
            next(err);
        });
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postComment = (req, res, next) => {

    const newComment = req.body;
    const { article_id } = req.params;

    console.log(newComment, article_id, 'controlerrrrrrrrrrr')

    addComment(article_id, newComment)
        .then((addedComment) => {
            res.status(201).send({ addedComment });
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};
