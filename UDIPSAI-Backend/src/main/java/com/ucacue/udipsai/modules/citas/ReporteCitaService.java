package com.ucacue.udipsai.modules.citas;

import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.Optional;

@Service
public class ReporteCitaService {

    @Autowired
    private VistaCitasCompletaRepository vistaCitasCompletaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private CitaRepository citaRepository;

    public ReporteCitaRespuestaDTO generarReportePorPaciente(Integer fichaPaciente) {
        // Obtener las ultimas 15 citas directamente de la tabla CitaEntity
        Pageable pageable = PageRequest.of(0, 15, Sort.by("fecha").descending());
        Page<CitaEntity> paginaCitas = citaRepository.findAllByFichaPaciente(Long.valueOf(fichaPaciente), pageable);

        List<CitaEntity> listaCitas = paginaCitas.getContent();

        ReporteCitaRespuestaDTO respuesta = new ReporteCitaRespuestaDTO();

        String nombrePaciente = "Desconocido";
        if (fichaPaciente != null) {
            nombrePaciente = pacienteRepository.findById(fichaPaciente)
                    .map(p -> p.getNombresApellidos())
                    .orElse("Desconocido");
        }
        respuesta.setPacienteNombreCompleto(nombrePaciente);

        if (listaCitas.isEmpty()) {
            respuesta.setCitas(List.of());
            return respuesta;
        }

        List<ReporteCitaDTO> citasDTO = listaCitas.stream()
                .filter(cita -> {
                    if (cita.getEstado() == null)
                        return false;
                    // Keep only PENDIENTE and FINALIZADA (Realizadas)
                    String estado = cita.getEstado().name();
                    return estado.equals("PENDIENTE") || estado.equals("FINALIZADA");
                })
                .map(cita -> {
                    LocalTime horaInicio = null;
                    if (cita.getHoraInicio() != null) {
                        horaInicio = cita.getHoraInicio();
                    }

                    LocalTime horaFin = null;
                    if (cita.getHoraFin() != null) {
                        horaFin = cita.getHoraFin();
                    }

                    String nombreProfesional = "Desconocido";
                    if (cita.getProfesionalId() != null) {
                        nombreProfesional = especialistaRepository.findById(Math.toIntExact(cita.getProfesionalId()))
                                .map(p -> p.getNombresApellidos())
                                .orElse("Desconocido");
                    }

                    String especialidadNombre = "General";
                    if (cita.getEspecialidad() != null) {
                        especialidadNombre = cita.getEspecialidad().getArea();
                    }

                    return new ReporteCitaDTO(
                            cita.getFecha(),
                            horaInicio,
                            horaFin,
                            nombreProfesional,
                            especialidadNombre,
                            cita.getEstado() != null ? cita.getEstado().name() : "PENDIENTE");
                }).collect(Collectors.toList());

        Collections.reverse(citasDTO);
        respuesta.setCitas(citasDTO);

        return respuesta;
    }

    public Optional<ReporteCitaRespuestaDTO> generarReportePorCedula(String cedula) {
        return pacienteRepository.findByCedula(cedula)
                .map(paciente -> generarReportePorPaciente(paciente.getId()));
    }
}
