create database pdv;

create table
    usuarios (
        id serial primary key,
        nome varchar (50) not null,
        email text unique not null,
        senha text not null
    );

create table
    categorias (
        id serial primary key,
        descricao text
    );

insert into
    categorias (descricao)
values ('Informática'), ('Celulares'), ('Beleza e Perfumaria'), ('Mercado'), ('Livros e Papelaria'), ('Moda'), ('Bebê'), ('Games');