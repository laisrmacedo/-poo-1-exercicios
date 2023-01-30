-- Active: 1675099716174@@127.0.0.1@3306

CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    upload_at TEXT DEFAULT (DATETIME()) NOT NULL
);

SELECT * FROM videos;

INSERT INTO videos (id, title, duration)
VALUES
	("v001", "first video", 120),
	("v002", "second video", 480),
	("v003", "third video", 600);
