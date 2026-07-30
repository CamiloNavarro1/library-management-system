package com.library.backend.service;

import com.library.backend.dto.PrestamoRequest;
import com.library.backend.dto.PrestamoResponse;
import com.library.backend.dto.PrestamoUpdateRequest;
import com.library.backend.entity.*;
import com.library.backend.exception.BusinessException;
import com.library.backend.exception.ResourceNotFoundException;
import com.library.backend.repository.EjemplarRepository;
import com.library.backend.repository.PrestamoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrestamoService {
    private static final EnumSet<EstadoPrestamo> ESTADOS_OCUPADOS =
            EnumSet.of(EstadoPrestamo.PROGRAMADO, EstadoPrestamo.ACTIVO, EstadoPrestamo.VENCIDO);

    private final PrestamoRepository prestamoRepository;
    private final EjemplarRepository ejemplarRepository;
    private final UsuarioService usuarioService;

    public PrestamoResponse registrar(PrestamoRequest request) {
        validarFechas(request.fechaPrestamo(), request.fechaDevolucion());
        Usuario usuario = usuarioService.obtenerEntidad(request.usuarioId());
        Ejemplar ejemplar = obtenerEjemplar(request.ejemplarId());
        actualizarEstadosVencidos();

        if (prestamoRepository.existsByUsuarioIdAndEstadoPrestamoIn(usuario.getId(), ESTADOS_OCUPADOS)) {
            throw new BusinessException("El usuario ya tiene un ejemplar con préstamo activo, programado o vencido.");
        }
        if (ejemplar.getEstado() != EstadoEjemplar.DISPONIBLE ||
                prestamoRepository.existsByEjemplarIdAndEstadoPrestamoIn(ejemplar.getId(), ESTADOS_OCUPADOS)) {
            throw new BusinessException("El ejemplar seleccionado no está disponible.");
        }

        EstadoPrestamo estado = calcularEstado(request.fechaPrestamo(), request.fechaDevolucion(), null);
        ejemplar.setEstado(EstadoEjemplar.PRESTADO);
        ejemplarRepository.save(ejemplar);

        Prestamo prestamo = Prestamo.builder()
                .fechaPrestamo(request.fechaPrestamo())
                .fechaDevolucion(request.fechaDevolucion())
                .estadoPrestamo(estado)
                .usuario(usuario)
                .ejemplar(ejemplar)
                .build();
        return toResponse(prestamoRepository.save(prestamo));
    }

    @Transactional(readOnly = true)
    public List<PrestamoResponse> listar() {
        return prestamoRepository.findAll().stream().map(this::actualizarEstadoEnMemoria).map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PrestamoResponse buscarPorId(Long id) {
        return toResponse(actualizarEstadoEnMemoria(obtenerEntidad(id)));
    }

    @Transactional(readOnly = true)
    public List<PrestamoResponse> listarPorUsuario(Long usuarioId) {
        usuarioService.obtenerEntidad(usuarioId);
        return prestamoRepository.findByUsuarioIdOrderByFechaPrestamoDesc(usuarioId).stream()
                .map(this::actualizarEstadoEnMemoria).map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PrestamoResponse> listarPorLibro(Long libroId) {
        return prestamoRepository.findByEjemplarLibroIdOrderByFechaPrestamoDesc(libroId).stream()
                .map(this::actualizarEstadoEnMemoria).map(this::toResponse).toList();
    }

    public PrestamoResponse actualizar(Long id, PrestamoUpdateRequest request) {
        validarFechas(request.fechaPrestamo(), request.fechaDevolucion());
        Prestamo prestamo = obtenerEntidad(id);
        if (prestamo.getEstadoPrestamo() == EstadoPrestamo.DEVUELTO) {
            throw new BusinessException("No se puede modificar un préstamo que ya fue devuelto.");
        }
        prestamo.setFechaPrestamo(request.fechaPrestamo());
        prestamo.setFechaDevolucion(request.fechaDevolucion());
        prestamo.setEstadoPrestamo(calcularEstado(request.fechaPrestamo(), request.fechaDevolucion(), null));
        return toResponse(prestamoRepository.save(prestamo));
    }

    public PrestamoResponse devolver(Long id) {
        Prestamo prestamo = obtenerEntidad(id);
        if (prestamo.getEstadoPrestamo() == EstadoPrestamo.DEVUELTO) {
            throw new BusinessException("El préstamo ya fue devuelto.");
        }
        prestamo.setFechaDevolucionReal(LocalDate.now());
        prestamo.setEstadoPrestamo(EstadoPrestamo.DEVUELTO);
        prestamo.getEjemplar().setEstado(EstadoEjemplar.DISPONIBLE);
        ejemplarRepository.save(prestamo.getEjemplar());
        return toResponse(prestamoRepository.save(prestamo));
    }

    public void eliminar(Long id) {
        Prestamo prestamo = obtenerEntidad(id);
        if (prestamo.getEstadoPrestamo() != EstadoPrestamo.DEVUELTO) {
            prestamo.getEjemplar().setEstado(EstadoEjemplar.DISPONIBLE);
            ejemplarRepository.save(prestamo.getEjemplar());
        }
        prestamoRepository.delete(prestamo);
    }

    public void actualizarEstadosVencidos() {
        prestamoRepository.findAll().forEach(prestamo -> {
            EstadoPrestamo nuevo = calcularEstado(prestamo.getFechaPrestamo(), prestamo.getFechaDevolucion(),
                    prestamo.getFechaDevolucionReal());
            if (prestamo.getEstadoPrestamo() != nuevo) {
                prestamo.setEstadoPrestamo(nuevo);
                prestamoRepository.save(prestamo);
            }
        });
    }

    private Prestamo actualizarEstadoEnMemoria(Prestamo prestamo) {
        prestamo.setEstadoPrestamo(calcularEstado(prestamo.getFechaPrestamo(), prestamo.getFechaDevolucion(),
                prestamo.getFechaDevolucionReal()));
        return prestamo;
    }

    private EstadoPrestamo calcularEstado(LocalDate inicio, LocalDate fin, LocalDate devolucionReal) {
        if (devolucionReal != null) return EstadoPrestamo.DEVUELTO;
        LocalDate hoy = LocalDate.now();
        if (hoy.isBefore(inicio)) return EstadoPrestamo.PROGRAMADO;
        if (hoy.isAfter(fin)) return EstadoPrestamo.VENCIDO;
        return EstadoPrestamo.ACTIVO;
    }

    private void validarFechas(LocalDate inicio, LocalDate fin) {
        if (fin.isBefore(inicio)) {
            throw new BusinessException("La fecha de devolución no puede ser anterior a la fecha del préstamo.");
        }
    }

    private Ejemplar obtenerEjemplar(Long id) {
        return ejemplarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el ejemplar con id " + id + "."));
    }

    private Prestamo obtenerEntidad(Long id) {
        return prestamoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el préstamo con id " + id + "."));
    }

    private PrestamoResponse toResponse(Prestamo p) {
        return new PrestamoResponse(p.getId(), p.getFechaPrestamo(), p.getFechaDevolucion(),
                p.getFechaDevolucionReal(), p.getEstadoPrestamo(), p.getUsuario().getId(),
                p.getUsuario().getNombre() + " " + p.getUsuario().getApellido(), p.getEjemplar().getId(),
                p.getEjemplar().getCodigoInventario(), p.getEjemplar().getLibro().getId(),
                p.getEjemplar().getLibro().getTitulo(), p.getEjemplar().getLibro().getIsbn());
    }
}
