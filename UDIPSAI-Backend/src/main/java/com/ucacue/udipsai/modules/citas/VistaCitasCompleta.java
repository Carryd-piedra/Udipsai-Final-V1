package com.ucacue.udipsai.modules.citas;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

import java.sql.Time;
import java.time.LocalTime;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "vista_citas_completa")
public class VistaCitasCompleta {

    @Id
    @Column(name = "id_cita")
    private Integer idCita;

    @Column(name = "ficha_paciente")
    private Integer fichaPaciente;

    @Column(name = "id_profesional")
    private Integer idProfesional;

    @Column(name = "id_area")
    private Integer idArea;

    @Column(name = "nombre_area")
    private String nombreArea;

    @Column(name = "fecha")
    private Date fecha;

    @Column(name = "horainicio")
    private Time horainicio;

    @Column(name = "horafin")
    private Time horafin;

    @Column(name = "estado_cita")
    private String estadoCita;

    @Column(name = "fecha_creacion_cita")
    private Date fechaCreacionCita;

    @Column(name = "fecha_modificacion_cita")
    private Date fechaModificacionCita;

    @Column(name = "especialidad")
    private String especialidad;

    @Column(name = "estado_profesional")
    private String estadoProfesional;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name = "cedula")
    private String cedula;

    @Column(name = "celular")
    private String celular;

    @Column(name = "email")
    private String email;

    @Column(name = "estado_usuario")
    private String estadoUsuario;

    @Column(name = "nombres")
    private String nombres;
}