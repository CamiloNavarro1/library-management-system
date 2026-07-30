# Sistema de Gestión de Biblioteca

Este proyecto implementa un sistema de gestión de biblioteca desarrollado con una arquitectura Full Stack basada en Spring Boot, React, PostgreSQL y Docker.

La aplicación permite administrar usuarios, libros, ejemplares y préstamos mediante una API REST y una interfaz web moderna, aplicando buenas prácticas de desarrollo, separación de responsabilidades y modularidad.

---

# Tecnologías utilizadas

## Backend

- Java 17
- Spring Boot 3.5.4
- Spring Data JPA
- Maven
- PostgreSQL 16
- Swagger / OpenAPI

## Frontend

- React
- Vite
- Material UI
- Axios
- React Router DOM

## DevOps

- Docker
- Docker Compose
- Nginx

---

# Arquitectura

```
                React + Material UI
                       │
                 Axios (/api)
                       │
                   Nginx Proxy
                       │
                Spring Boot REST API
                       │
                  Spring Data JPA
                       │
                  PostgreSQL 16
```

---

# Estructura del proyecto

```
library-management-system/
│
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── library-backend/
│   ├── database/
│   │   └── library_db.dump
│   ├── src/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── .gitignore
│   └── .dockerignore
│
└── library-frontend/
    ├── public/
    ├── src/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── package-lock.json
    └── ...
```

---

# Funcionalidades implementadas

## Dashboard

- Resumen general del sistema.
- Total de usuarios registrados.
- Total de libros registrados.
- Total de préstamos.
- Total de préstamos activos.
- Historial de préstamos recientes.

## Gestión de Usuarios

- Crear usuarios.
- Consultar usuarios.
- Editar usuarios.
- Eliminar usuarios.
- Buscar usuarios.
- Paginación.

## Gestión de Libros

- Crear libros.
- Consultar libros.
- Editar libros.
- Eliminar libros.
- Buscar libros.
- Paginación.

## Gestión de Ejemplares

- Registrar ejemplares por libro.
- Consulta automática de ejemplares disponibles por ISBN.
- Asociación entre libros y ejemplares.

## Gestión de Préstamos

- Registrar préstamos.
- Registrar devoluciones.
- Consultar préstamos por usuario.
- Consultar préstamos por libro.
- Eliminar préstamos.
- Búsqueda.
- Paginación.

---

# Validaciones de negocio

- Un usuario no puede tener más de un préstamo activo simultáneamente.
- No es posible prestar un ejemplar que ya se encuentra prestado.
- Un ejemplar devuelto vuelve a estar disponible automáticamente.
- El estado del préstamo se determina automáticamente (Programado, Activo, Vencido y Devuelto).
- Validación de fechas de préstamo y devolución.
- Validación de campos obligatorios.
- Actualización automática del Dashboard después de cada operación.

---

# Datos de prueba

El proyecto incluye un respaldo de la base de datos PostgreSQL ubicado en:

```
library-backend/database/library_db.dump
```

El respaldo contiene datos de prueba para facilitar la validación de la aplicación, incluyendo:

- Usuarios registrados.
- Libros.
- Ejemplares.
- Préstamos en diferentes estados (activos y devueltos).

Esto permite ejecutar y validar la aplicación sin necesidad de crear información manualmente.

---

# Instalación con Docker

## Clonar el repositorio

```bash
git clone https://github.com/CamiloNavarro1/library-management-system.git
```

Ingresar al proyecto

```bash
cd library-management-system
```

## Configurar variables de entorno

Antes de iniciar la aplicación, crea un archivo `.env` en la raíz del proyecto utilizando el archivo de ejemplo incluido.

### Windows (PowerShell)

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

El archivo `.env` contiene la configuración del entorno, como:

- Credenciales de PostgreSQL.
- Puertos de la aplicación.
- Configuración de JPA.

Puedes modificar estos valores según tus necesidades antes de iniciar los contenedores.

## Construir e iniciar todos los servicios

```bash
docker compose up --build -d
```

## Verificar el estado de los contenedores

```bash
docker compose ps
```

## Detener los servicios

```bash
docker compose down
```

---

# Variables de entorno

La configuración del proyecto se realiza mediante variables de entorno definidas en el archivo `.env`.

Se proporciona un archivo `.env.example` como referencia con la estructura necesaria para ejecutar la aplicación.

Las principales variables utilizadas son:

| Variable | Descripción |
|----------|-------------|
| DB_NAME | Nombre de la base de datos PostgreSQL |
| DB_USER | Usuario de PostgreSQL |
| DB_PASSWORD | Contraseña de PostgreSQL |
| DB_PORT | Puerto de PostgreSQL |
| DB_DRIVER | Driver JDBC de PostgreSQL |
| BACKEND_PORT | Puerto del backend Spring Boot |
| FRONTEND_PORT | Puerto publicado para el frontend |
| JPA_DDL_AUTO | Estrategia de creación de tablas |
| SHOW_SQL | Mostrar consultas SQL |

---

# Acceso a la aplicación

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:8080
```

Swagger

```
http://localhost:8080/swagger-ui.html
```

---

# API REST

## Usuarios

```
GET     /api/usuarios
GET     /api/usuarios/{id}
POST    /api/usuarios
PUT     /api/usuarios/{id}
DELETE  /api/usuarios/{id}
```

## Libros

```
GET     /api/libros
GET     /api/libros/{id}
POST    /api/libros
PUT     /api/libros/{id}
DELETE  /api/libros/{id}
```

## Ejemplares

```
POST    /api/libros/{id}/ejemplares
GET     /api/libros/isbn/{isbn}/ejemplares-disponibles
```

## Préstamos

```
GET     /api/prestamos
GET     /api/prestamos/usuario/{usuarioId}
GET     /api/prestamos/libro/{libroId}
POST    /api/prestamos
PATCH   /api/prestamos/{id}/devolver
DELETE  /api/prestamos/{id}
```

---

# Decisiones de diseño

Durante el desarrollo se implementaron las siguientes decisiones técnicas:

- Arquitectura cliente-servidor desacoplada.
- Comunicación mediante API REST.
- Componentes reutilizables en React.
- Consumo centralizado de la API mediante Axios.
- Persistencia con Spring Data JPA.
- Dockerización completa del proyecto.
- Configuración mediante variables de entorno (`.env`).
- Proxy inverso mediante Nginx.
- Configuración CORS para desarrollo local y ejecución mediante Docker.
- Organización del código por módulos para facilitar el mantenimiento y la escalabilidad.

---

# Posibles mejoras

- Implementación de autenticación mediante JWT.
- Gestión de roles y permisos.
- Reportes y estadísticas avanzadas.
- Notificaciones de préstamos vencidos.
- Pruebas unitarias.
- Pruebas de integración.
- Pipeline de Integración y Despliegue Continuo (CI/CD).

---

# Autor

**Camilo Andres Navarro Ortiz**

Desarrollador Full Stack con experiencia en Java, Spring Boot, React, PostgreSQL y Docker.

Este proyecto fue desarrollado como solución a una prueba técnica para demostrar conocimientos en desarrollo Full Stack, diseño de APIs REST, aplicaciones web modernas y despliegue mediante Docker.