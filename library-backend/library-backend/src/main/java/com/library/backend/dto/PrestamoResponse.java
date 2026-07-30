package com.library.backend.dto;

import com.library.backend.entity.EstadoPrestamo;
import java.time.LocalDate;

public record PrestamoResponse(
        Long id,
        LocalDate fechaPrestamo,
        LocalDate fechaDevolucion,
        LocalDate fechaDevolucionReal,
        EstadoPrestamo estadoPrestamo,
        Long usuarioId,
        String usuarioNombre,
        Long ejemplarId,
        String codigoInventario,
        Long libroId,
        String tituloLibro,
        String isbn
) {}
