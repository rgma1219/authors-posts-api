-- Elimina las tablas si ya existen, para poder re-ejecutar este script sin errores
-- Se borra primero "posts" porque depende de "authors" (por la FK)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

-- Tabla: authors
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  bio TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla: posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);