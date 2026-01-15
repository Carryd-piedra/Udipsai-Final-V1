package com.ucacue.udipsai.modules.usuarios.domain;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.permisos.Permisos;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "usuarios_atencion")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioAtencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cedula", unique = true, nullable = false, length = 15)
    private String cedula;

    @Column(name = "nombres_apellidos", nullable = false)
    private String nombresApellidos;

    @Column(name = "contrasenia")
    private String contrasenia;

    @Column(name = "foto_url")
    private String fotoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidad_id")
    private Especialidad especialidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id")
    private Sede sede;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "permisos_id")
    private Permisos permisos;
}
