package com.library.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PrestamoUpdateRequest(@NotNull LocalDate fechaPrestamo, @NotNull LocalDate fechaDevolucion) {}
