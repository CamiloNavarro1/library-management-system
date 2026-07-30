package com.library.backend.repository;

import com.library.backend.entity.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LibroRepository extends JpaRepository<Libro, Long> {
    boolean existsByIsbnIgnoreCase(String isbn);
    boolean existsByIsbnIgnoreCaseAndIdNot(String isbn, Long id);
    Optional<Libro> findByIsbnIgnoreCase(String isbn);
}
