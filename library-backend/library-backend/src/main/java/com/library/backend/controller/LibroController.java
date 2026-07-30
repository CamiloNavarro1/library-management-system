package com.library.backend.controller;

import com.library.backend.dto.*;
import com.library.backend.service.LibroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
@RequiredArgsConstructor
public class LibroController {
    private final LibroService libroService;

    @PostMapping
    public ResponseEntity<LibroResponse> crear(@Valid @RequestBody LibroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(libroService.crear(request));
    }

    @GetMapping
    public List<LibroResponse> listar() {
        return libroService.listar();
    }

    @GetMapping("/{id}")
    public LibroResponse buscarPorId(@PathVariable Long id) {
        return libroService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public LibroResponse actualizar(@PathVariable Long id, @Valid @RequestBody LibroRequest request) {
        return libroService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        libroService.eliminar(id);
    }

    @PostMapping("/{libroId}/ejemplares")
    public ResponseEntity<EjemplarResponse> agregarEjemplar(@PathVariable Long libroId,
                                                             @Valid @RequestBody EjemplarRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(libroService.agregarEjemplar(libroId, request));
    }

    @GetMapping("/isbn/{isbn}/ejemplares-disponibles")
    public List<EjemplarResponse> listarDisponiblesPorIsbn(@PathVariable String isbn) {
        return libroService.listarDisponiblesPorIsbn(isbn);
    }
}
