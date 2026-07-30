package com.library.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EjemplarRequest(@NotBlank @Size(max = 60) String codigoInventario) {}
