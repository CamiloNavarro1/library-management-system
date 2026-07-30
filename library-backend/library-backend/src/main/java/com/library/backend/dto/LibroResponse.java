package com.library.backend.dto;

import java.time.LocalDate;

public record LibroResponse(Long id, String titulo, String isbn, String edicion, LocalDate fechaPublicacion,
                            String autor, long totalEjemplares, long ejemplaresDisponibles) {}
