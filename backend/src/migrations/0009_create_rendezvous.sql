create table if not exists rendezvous (
    id serial primary key,
    patient_id integer not null references patients(id) on delete cascade,
    date date not null,
    heure time not null,
    type varchar(255) not null,
    commentaire text,
    statut varchar(50) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);