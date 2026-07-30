package com.library.backend.repository;

import com.library.backend.entity.EstadoPrestamo;
import com.library.backend.entity.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
    List<Prestamo> findByUsuarioIdOrderByFechaPrestamoDesc(Long usuarioId);
    List<Prestamo> findByEjemplarLibroIdOrderByFechaPrestamoDesc(Long libroId);
    boolean existsByUsuarioIdAndEstadoPrestamoIn(Long usuarioId, Collection<EstadoPrestamo> estados);
    boolean existsByEjemplarIdAndEstadoPrestamoIn(Long ejemplarId, Collection<EstadoPrestamo> estados);
}
