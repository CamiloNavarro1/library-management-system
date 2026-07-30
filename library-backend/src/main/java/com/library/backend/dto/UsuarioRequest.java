package com.library.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record UsuarioRequest(
        @NotBlank @Size(max = 80) String nombre,
        @NotBlank @Size(max = 80) String apellido,
        @NotBlank @Email @Size(max = 150) String email,
        @NotNull @Past LocalDate fechaNacimiento
) {}
