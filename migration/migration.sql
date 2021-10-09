CREATE TABLE UserData (       
    user_id TEXT,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL,
    point INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id)
);
