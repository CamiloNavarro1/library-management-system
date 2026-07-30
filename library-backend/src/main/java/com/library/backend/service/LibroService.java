package com.library.backend.service;

import com.library.backend.dto.*;
import com.library.backend.entity.*;
import com.library.backend.exception.BusinessException;
import com.library.backend.exception.ResourceNotFoundException;
import com.library.backend.repository.EjemplarRepository;
import com.library.backend.repository.LibroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LibroService {
    private final LibroRepository libroRepository;
    private final EjemplarRepository ejemplarRepository;

    public LibroResponse crear(LibroRequest request) {
        if (libroRepository.existsByIsbnIgnoreCase(request.isbn())) {
            throw new BusinessException("Ya existe un libro registrado con ese ISBN.");
        }
        Libro libro = Libro.builder()
                .titulo(request.titulo().trim())
                .isbn(normalizarIsbn(request.isbn()))
                .edicion(request.edicion().trim())
                .fechaPublicacion(request.fechaPublicacion())
                .autor(request.autor().trim())
                .build();
        return toResponse(libroRepository.save(libro));
    }

    @Transactional(readOnly = true)
    public List<LibroResponse> listar() {
        return libroRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public LibroResponse buscarPorId(Long id) {
        return toResponse(obtenerEntidad(id));
    }

    public LibroResponse actualizar(Long id, LibroRequest request) {
        Libro libro = obtenerEntidad(id);
        if (libroRepository.existsByIsbnIgnoreCaseAndIdNot(request.isbn(), id)) {
            throw new BusinessException("Ya existe otro libro registrado con ese ISBN.");
        }
        libro.setTitulo(request.titulo().trim());
        libro.setIsbn(normalizarIsbn(request.isbn()));
        libro.setEdicion(request.edicion().trim());
        libro.setFechaPublicacion(request.fechaPublicacion());
        libro.setAutor(request.autor().trim());
        return toResponse(libroRepository.save(libro));
    }

    public void eliminar(Long id) {
        libroRepository.delete(obtenerEntidad(id));
    }

    public EjemplarResponse agregarEjemplar(Long libroId, EjemplarRequest request) {
        Libro libro = obtenerEntidad(libroId);
        if (ejemplarRepository.existsByCodigoInventarioIgnoreCase(request.codigoInventario())) {
            throw new BusinessException("Ya existe un ejemplar con ese código de inventario.");
        }
        Ejemplar ejemplar = Ejemplar.builder()
                .codigoInventario(request.codigoInventario().trim())
                .estado(EstadoEjemplar.DISPONIBLE)
                .libro(libro)
                .build();
        return toEjemplarResponse(ejemplarRepository.save(ejemplar));
    }

    @Transactional(readOnly = true)
    public List<EjemplarResponse> listarDisponiblesPorIsbn(String isbn) {
        return ejemplarRepository.findByLibroIsbnIgnoreCaseAndEstado(normalizarIsbn(isbn), EstadoEjemplar.DISPONIBLE)
                .stream().map(this::toEjemplarResponse).toList();
    }

    public Libro obtenerEntidad(Long id) {
        return libroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el libro con id " + id + "."));
    }

    private LibroResponse toResponse(Libro libro) {
        long total = ejemplarRepository.countByLibroId(libro.getId());
        long disponibles = ejemplarRepository.countByLibroIdAndEstado(libro.getId(), EstadoEjemplar.DISPONIBLE);
        return new LibroResponse(libro.getId(), libro.getTitulo(), libro.getIsbn(), libro.getEdicion(),
                libro.getFechaPublicacion(), libro.getAutor(), total, disponibles);
    }

    private EjemplarResponse toEjemplarResponse(Ejemplar ejemplar) {
        return new EjemplarResponse(ejemplar.getId(), ejemplar.getCodigoInventario(), ejemplar.getEstado(),
                ejemplar.getLibro().getId(), ejemplar.getLibro().getIsbn());
    }

    private String normalizarIsbn(String isbn) {
        return isbn.replace("-", "").replace(" ", "").trim();
    }
}
