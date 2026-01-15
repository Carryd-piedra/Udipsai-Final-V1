package com.ucacue.udipsai.modules.citas;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "citas")
public class CitaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita", nullable = false, unique = true)
    private Long idCita;

    @Column(name = "ficha_paciente", nullable = false)
    private Long fichaPaciente;

    @ManyToOne
    @JoinColumn(name = "usuario_atencion_id", nullable = false)
    private com.ucacue.udipsai.modules.usuarios.domain.UsuarioAtencion usuarioAtencion;

    @ManyToOne
    @JoinColumn(name = "id_especialidad", nullable = false)
    private Especialidad especialidad;

    @Column(name = "fecha", nullable = false)
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate fecha;

    @Column(name = "horaInicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "horaFin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fecha_modificacion")
    private LocalDate fechaModificacion;

    public enum Estado {
        PENDIENTE, ASISTIDO, CANCELADA, NO_ASISTIDO
    }

    // Métodos para manejar auditoría
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDate.now();
        this.fechaModificacion = LocalDate.now();
        // Aquí puedes establecer el usuario actual, por ejemplo, obteniéndolo del
        // contexto de seguridad
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaModificacion = LocalDate.now();
        // Aquí puedes establecer el usuario actual, por ejemplo, obteniéndolo del
        // contexto de seguridad
    }
}
