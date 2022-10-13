\c nc_news_test

--psql -f ./db/queries.sql > output.txt

--SELECT * FROM users;

--SELECT * FROM articles where article_id = 1;
--UPDATE articles SET votes = votes + 1 WHERE article_id = 1 RETURNING *;
--SELECT * FROM articles where article_id = 1;

SELECT a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, count(c.body) ::INT AS comment_count
FROM articles a, comments c
WHERE a.article_id = c.article_id
AND a.topic = 'mitch'
GROUP BY a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes
ORDER BY a.created_at DESC;


--SELECT * FROM topics;


/*
SELECT u.username, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes
FROM users u, articles a
WHERE u.username = a.author
AND a.article_id = 1;
*/


