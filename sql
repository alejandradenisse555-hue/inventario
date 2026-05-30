CREATE TABLE inventario_refacciones(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100),
categoria VARCHAR(100),
dato INT,
observaciones TEXT,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
