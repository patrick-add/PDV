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
values ('Informática'), ('Celulares'), ('Beleza e Perfumaria'), ('Mercado'), ('Livros e Papelaria'), ('Brinquedos'), ('Moda'), ('Bebê'), ('Games');

create table
    produtos (
        id serial primary key,
        descricao varchar(100) not null,
        quantidade_estoque integer not null,
        valor integer not null,
        categoria_id integer not null references categorias(id)
    );

-- alter table produtos add column produto_imagem text; 3° Sprint

create table
    clientes (
        id serial primary key,
        nome varchar(50) not null,
        email text unique not null,
        cpf char(11) unique not null,
        cep char(8) not null,
        rua varchar(50),
        numero varchar(20),
        bairro varchar(50),
        cidade varchar(50),
        estado varchar(2)
    );

create table
    pedidos (
        id serial primary key,
        observacao varchar(100),
        valor_total integer not null
    );

create table
    pedido_produtos (
        id serial primary key,
        pedido_id integer not null references pedidos(id),
        produto_id integer not null references produtos(id),
        quantidade_produto integer not null,
        valor_produto integer not null
    );