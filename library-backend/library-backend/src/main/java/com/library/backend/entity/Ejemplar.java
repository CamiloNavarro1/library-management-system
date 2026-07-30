package com.library.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ejemplares", uniqueConstraints = @UniqueConstraint(name = "uk_ejemplar_codigo", columnNames = "codigo_inventario"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ejemplar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_inventario", nullable = false, length = 60)
    private String codigoInventario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoEjemplar estado = EstadoEjemplar.DISPONIBLE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "libro_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ejemplar_libro"))
    private Libro libro;

    @OneToMany(mappedBy = "ejemplar")
    @Builder.Default
    private List<Prestamo> prestamos = new ArrayList<>();
}
