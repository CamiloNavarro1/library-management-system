# Sistema de Gestión de Biblioteca

Este proyecto implementa un sistema de gestión de biblioteca con una arquitectura Full Stack moderna. El objetivo es demostrar buenas prácticas en el desarrollo de aplicaciones web utilizando Spring Boot, React, PostgreSQL y Docker, aplicando principios de modularidad, reutilización de componentes y separación de responsabilidades.

---

# Tecnologías utilizadas

## Backend

- Java 17
- Spring Boot 3
- Spring Data JPA
- Maven
- PostgreSQL
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
prueba-tecnica/
│
├── README.md
├── docker-compose.yml
│
├── library-backend/
│   ├── library-backend/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── ...
│
├── library-frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── ...
│
└── docs/
```

---

# Funcionalidades implementadas

## Dashboard

- Resumen general del sistema.
- Total de usuarios registrados.
- Total de libros registrados.
- Total de préstamos.
- Préstamos activos.
- Historial de préstamos recientes.

## Gestión de Usuarios

- Crear usuarios.
- Editar usuarios.
- Eliminar usuarios.
- Buscar usuarios.
- Paginación.

## Gestión de Libros

- Crear libros.
- Editar libros.
- Eliminar libros.
- Buscar libros.
- Paginación.

## Gestión de Ejemplares

- Registrar ejemplares por libro.
- Consulta automática de disponibilidad.
- Asociación entre libro y ejemplares.

## Gestión de Préstamos

- Registrar préstamos.
- Registrar devoluciones.
- Eliminar préstamos.
- Búsqueda.
- Paginación.

---

# Validaciones de negocio

- No es posible prestar un ejemplar que ya se encuentra prestado.
- Un ejemplar devuelto vuelve a estar disponible automáticamente.
- El Dashboard se actualiza después de cada operación.
- Validación de fechas de préstamo y devolución.
- Validación de campos obligatorios.

---

# Instalación con Docker

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto

```bash
cd prueba-tecnica
```

Construir e iniciar todos los servicios

```bash
docker compose up --build -d
```

Verificar el estado

```bash
docker compose ps
```

Detener los servicios

```bash
docker compose down
```

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
http://localhost:8080/swagger-ui/index.html
```

---

# API REST

## Usuarios

```
GET    /api/usuarios
POST   /api/usuarios
PUT    /api/usuarios/{id}
DELETE /api/usuarios/{id}
```

## Libros

```
GET    /api/libros
POST   /api/libros
PUT    /api/libros/{id}
DELETE /api/libros/{id}
```

## Ejemplares

```
POST   /api/libros/{id}/ejemplares
GET    /api/libros/isbn/{isbn}/ejemplares-disponibles
```

## Préstamos

```
GET     /api/prestamos
POST    /api/prestamos
PATCH   /api/prestamos/{id}/devolver
DELETE  /api/prestamos/{id}
```

---

# Capturas de pantalla

Las capturas del funcionamiento de la aplicación pueden encontrarse en la carpeta:

```
docs/
```

Se recomienda incluir imágenes de:

- Dashboard
- Usuarios
- Libros
- Préstamos

---

# Decisiones de diseño

Durante el desarrollo se implementaron las siguientes decisiones técnicas:

- Arquitectura cliente-servidor desacoplada.
- Comunicación mediante API REST.
- Componentes reutilizables en React.
- Consumo centralizado mediante Axios.
- Persistencia utilizando Spring Data JPA.
- Dockerización completa del proyecto.
- Proxy inverso mediante Nginx para evitar problemas de CORS.
- Organización del código por módulos para facilitar el mantenimiento.

---

# Posibles mejoras

- Implementación de autenticación mediante JWT.
- Manejo de roles y permisos.
- Reportes y estadísticas avanzadas.
- Notificaciones de préstamos vencidos.
- Pruebas unitarias y de integración.
- Pipeline de integración y despliegue continuo (CI/CD).

---

# Autor

**Camilo Andres Navarro Ortiz**

Proyecto desarrollado como prueba técnica para demostrar conocimientos en desarrollo Full Stack utilizando Java, Spring Boot, React, PostgreSQL y Docker.
