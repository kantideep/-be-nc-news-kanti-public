const db = require("../db/connection");

exports.selectTopics = () => {

    sqlQuery = 'SELECT * FROM topics';

    return db
        .query(sqlQuery)
        .then((data) => {
            const topics = data.rows;
            return topics;
        })
};

exports.selectArticleById = (article_id) => {

    sqlQuery = `SELECT u.username, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes
                FROM users u, articles a
                WHERE u.username = a.author
                AND a.article_id = $1;`

    return db
        .query(sqlQuery, [article_id])
        .then((result) => {

            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'ID not found!' })
            }

            return result.rows[0]
        })
}

exports.selectUsers = () => {

    sqlQuery = `SELECT * FROM users`;

    return db
        .query(sqlQuery)
        .then((data) => {
            const users = data.rows;
            return users;
        })
}

exports.updateVotebyArticleId = (voteChange, article_id, voteObjKey) => {

    if (typeof voteChange !== 'number' && voteChange) {
        return Promise.reject({ status: 400, msg: 'Wrong data type!' });
    }

    sqlQuery = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

    return db
        .query(sqlQuery, [voteChange, article_id])
        .then((result) => {

            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'ID not found!' })
            }

            const updatedArticle = result.rows[0];
            return updatedArticle;
        })
}