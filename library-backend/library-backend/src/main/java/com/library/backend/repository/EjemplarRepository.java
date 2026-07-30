package com.library.backend.repository;

import com.library.backend.entity.Ejemplar;
import com.library.backend.entity.EstadoEjemplar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EjemplarRepository extends JpaRepository<Ejemplar, Long> {
    boolean existsByCodigoInventarioIgnoreCase(String codigoInventario);
    List<Ejemplar> findByLibroIsbnIgnoreCaseAndEstado(String isbn, EstadoEjemplar estado);
    long countByLibroId(Long libroId);
    long countByLibroIdAndEstado(Long libroId, EstadoEjemplar estado);
}
