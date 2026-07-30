package com.library.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record LibroRequest(
        @NotBlank @Size(max = 180) String titulo,
        @NotBlank @Size(max = 20) String isbn,
        @NotBlank @Size(max = 40) String edicion,
        @NotNull @PastOrPresent LocalDate fechaPublicacion,
        @NotBlank @Size(max = 150) String autor
) {}
