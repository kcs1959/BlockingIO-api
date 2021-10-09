CREATE TABLE Users (       
    id TEXT,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL,
    point INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);
