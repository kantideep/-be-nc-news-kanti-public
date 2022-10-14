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

    sqlQuery = `SELECT a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, count(c.body) ::INT AS comment_count
                FROM articles a, comments c
                WHERE a.article_id = c.article_id
                AND a.article_id = $1
                GROUP BY a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes;`

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

exports.updateVotebyArticleId = (voteChange, article_id) => {

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

exports.selectTopicsBySlug = (topic) => {

    sqlQuery = `SELECT * FROM topics WHERE slug = $1;`

    return db
        .query(sqlQuery, [topic])
        .then((data) => {
            if (data.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Topic doesn\'t exist!' })
            }
            return;
        })
}

exports.selectArticles = (topic) => {

    const sort_by = 'created_at';
    const order = 'DESC';

    const queryParams = [];

    let sqlQuery = `SELECT a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, count(c.body) ::INT AS comment_count
                    FROM articles a, comments c
                    WHERE a.article_id = c.article_id`;

    if (topic) {
        sqlQuery += ` AND a.topic = $1`;
        queryParams.push(topic);
    }

    if (sort_by) {
        sqlQuery += ` GROUP BY a.article_id ORDER BY ${sort_by}`;
    }

    if (order) {
        sqlQuery += ` ${order};`;
    }

    return db
        .query(sqlQuery, queryParams)
        .then((data) => {

            const articles = data.rows;

            if (articles.length === 0) {
                return Promise.reject({ status: 404, msg: 'Topic doesn\'t exist!' })
            }
            return articles;
        })
};

exports.selectCommentsByArticleId = (article_id) => {

    sqlQuery = `SELECT * FROM comments WHERE article_id = $1`;

    return db
        .query(sqlQuery, [article_id])
        .then(({ rows }) => {

            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'This article doesn\'t exist, or it doesn\'t have comments.' })
            }
            return rows;
        })
};

exports.addComment = (article_id, newComment) => {

    console.log(newComment, article_id, 'modelllllllllllll')

    if (!newComment.hasOwnProperty('username') || !newComment.hasOwnProperty('body')) {
        return Promise.reject({ status: 400, msg: 'Comment is missing username or comment text!' });
    }

    const { username, body } = newComment;

    console.log(username, body, 'modelllllllllllll')


    sqlQuery = `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING *;`
        
    return db
        .query(sqlQuery, [body, username, article_id])
        .then(({ rows }) => {
            const addedComment = rows[0];
            return addedComment;
        })
}