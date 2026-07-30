package com.library.backend.dto;

import com.library.backend.entity.EstadoEjemplar;

public record EjemplarResponse(Long id, String codigoInventario, EstadoEjemplar estado, Long libroId, String isbn) {}
