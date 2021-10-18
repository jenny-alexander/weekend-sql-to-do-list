-- Table Definition ----------------------------------------------

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_name character varying(70) NOT NULL,
    assigned_to character varying(30),
    completed boolean,
    date_completed timestamp with time zone
);