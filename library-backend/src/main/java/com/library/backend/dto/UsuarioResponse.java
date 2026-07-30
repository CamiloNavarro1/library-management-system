package com.library.backend.dto;

import java.time.LocalDate;

public record UsuarioResponse(Long id, String nombre, String apellido, String email, LocalDate fechaNacimiento) {}
