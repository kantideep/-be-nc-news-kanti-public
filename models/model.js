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
            console.log(result.rows.length, '----> should be 0 in model')
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'ID not found!' })
            }
            return result.rows[0]
        })
}
