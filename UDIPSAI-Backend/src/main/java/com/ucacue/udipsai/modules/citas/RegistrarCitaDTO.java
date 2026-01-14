package com.ucacue.udipsai.modules.citas;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrarCitaDTO {
    private Long fichaPaciente;
    private Long profesionalId;
    private Long especialidadId; // Antes areaId
    private LocalDate fecha;
    private LocalTime hora;
    private Integer duracionMinutes; // Duration in minutes (e.g., 60, 120, 180)
}
