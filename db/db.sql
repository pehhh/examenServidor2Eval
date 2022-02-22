create database coches;

use coches;

create table usuarios(
    id int auto_increment primary key,
    username varchar(40),
    password varchar(300),
    email varchar(300)
);

create table coches(
    id int auto_increment primary key,
    marca varchar (60),
    modelo varchar(80),
    url varchar(400),
    user_id int,
    foreign key (user_id) references usuarios(id)
);