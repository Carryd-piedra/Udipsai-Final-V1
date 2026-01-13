package com.ucacue.udipsai.modules.citas;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReporteCitaDTO {
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date fecha;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime hora;
    private String profesional;
    private String especialidad;
}
