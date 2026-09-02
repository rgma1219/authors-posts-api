-- Limpia los datos existentes antes de insertar (para poder re-ejecutar sin duplicados)
-- TRUNCATE con RESTART IDENTITY reinicia también los contadores de SERIAL (id vuelve a empezar en 1)
-- CASCADE acá es necesario porque "posts" depende de "authors"
TRUNCATE TABLE posts, authors RESTART IDENTITY CASCADE;

-- Authors de prueba
INSERT INTO authors (name, email, bio) VALUES
  ('Ana García', 'ana.garcia@example.com', 'Desarrolladora backend apasionada por Node.js.'),
  ('Bruno Pérez', 'bruno.perez@example.com', 'Escribe sobre bases de datos y arquitectura de software.'),
  ('Carla Díaz', 'carla.diaz@example.com', NULL);

-- Posts de prueba (author_id 1, 2 y 3 corresponden al orden de inserción de arriba)
INSERT INTO posts (author_id, title, content, published) VALUES
  (1, 'Introducción a Express', 'Express es un framework minimalista para Node.js...', true),
  (1, 'Trabajando con PostgreSQL', 'PostgreSQL es un motor de base de datos relacional...', false),
  (2, 'Modelado de datos relacional', 'El modelado correcto de datos es clave...', true),
  (3, 'Mi primer post', 'Este es un post de prueba.', false);