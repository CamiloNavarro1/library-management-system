package com.library.backend.controller;

import com.library.backend.dto.PrestamoRequest;
import com.library.backend.dto.PrestamoResponse;
import com.library.backend.dto.PrestamoUpdateRequest;
import com.library.backend.service.PrestamoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
@RequiredArgsConstructor
public class PrestamoController {
    private final PrestamoService prestamoService;

    @PostMapping
    public ResponseEntity<PrestamoResponse> registrar(@Valid @RequestBody PrestamoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prestamoService.registrar(request));
    }

    @GetMapping
    public List<PrestamoResponse> listar() {
        return prestamoService.listar();
    }

    @GetMapping("/{id}")
    public PrestamoResponse buscarPorId(@PathVariable Long id) {
        return prestamoService.buscarPorId(id);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<PrestamoResponse> listarPorUsuario(@PathVariable Long usuarioId) {
        return prestamoService.listarPorUsuario(usuarioId);
    }

    @GetMapping("/libro/{libroId}")
    public List<PrestamoResponse> listarPorLibro(@PathVariable Long libroId) {
        return prestamoService.listarPorLibro(libroId);
    }

    @PutMapping("/{id}")
    public PrestamoResponse actualizar(@PathVariable Long id,
                                        @Valid @RequestBody PrestamoUpdateRequest request) {
        return prestamoService.actualizar(id, request);
    }

    @PatchMapping("/{id}/devolver")
    public PrestamoResponse devolver(@PathVariable Long id) {
        return prestamoService.devolver(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        prestamoService.eliminar(id);
    }
}
