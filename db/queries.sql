\c nc_news_test

SELECT * FROM users;

--SELECT * FROM articles;

/*
SELECT u.username, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes
FROM users u, articles a
WHERE u.username = a.author
AND a.article_id = 1;
*/

