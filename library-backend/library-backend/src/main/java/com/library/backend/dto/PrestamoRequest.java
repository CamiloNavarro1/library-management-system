package com.library.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PrestamoRequest(
        @NotNull Long usuarioId,
        @NotNull Long ejemplarId,
        @NotNull LocalDate fechaPrestamo,
        @NotNull @FutureOrPresent LocalDate fechaDevolucion
) {}
