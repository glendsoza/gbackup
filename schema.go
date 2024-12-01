package main

const schema = `
create table backup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    path TEXT NOT NULL,
    metadata TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(name)
);

create table active_backup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    backup_id INTEGER NOT NULL,
    metadata TEXT,
    active INTEGER NOT NULL DEFAULT 0,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(name),
    FOREIGN KEY(backup_id) REFERENCES backup(id)
);
`
