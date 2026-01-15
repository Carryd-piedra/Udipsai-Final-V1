package com.ucacue.udipsai.modules.pasante.domain;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.permisos.Permisos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ucacue.udipsai.modules.sedes.domain.Sede;

@Entity
@Table(name = "pasantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pasante extends com.ucacue.udipsai.modules.usuarios.domain.UsuarioAtencion {

    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura = LocalDateTime.now();

    @Column(name = "email", length = 100)
    private String email;

    @Column(length = 100)
    private String ciudad;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "inicio_pasantia", nullable = false)
    private LocalDate inicioPasantia;

    @Column(name = "fin_pasantia", nullable = false)
    private LocalDate finPasantia;

    @Column(columnDefinition = "TEXT")
    private String domicilio;

    @Column(name = "numero_telefono", length = 15)
    private String numeroTelefono;

    @Column(name = "numero_celular", length = 15)
    private String numeroCelular;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialista_id", nullable = false)
    private Especialista especialista;
}
