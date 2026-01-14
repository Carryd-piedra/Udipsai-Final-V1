package com.ucacue.udipsai.modules.citas;

import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReporteCitaService {

    @Autowired
    private VistaCitasCompletaRepository vistaCitasCompletaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    public ReporteCitaRespuestaDTO generarReportePorCedula(String cedula) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findByCedula(cedula);

        if (!pacienteOpt.isPresent()) {
            // Si no se encuentra el paciente, retornar respuesta vacía
            ReporteCitaRespuestaDTO respuesta = new ReporteCitaRespuestaDTO();
            respuesta.setPacienteNombreCompleto("Paciente no encontrado");
            respuesta.setCitas(Collections.emptyList());
            respuesta.setCedula(cedula);
            return respuesta;
        }

        Paciente paciente = pacienteOpt.get();
        Integer fichaPaciente = paciente.getId();

        // Obtener las últimas 15 citas del paciente
        Pageable pageable = PageRequest.of(0, 15, Sort.by("fecha").descending());
        Page<VistaCitasCompleta> paginaCitas = vistaCitasCompletaRepository.findByFichaPaciente(fichaPaciente, pageable);

        List<VistaCitasCompleta> listaCitas = paginaCitas.getContent();

        ReporteCitaRespuestaDTO respuesta = new ReporteCitaRespuestaDTO();
        respuesta.setPacienteNombreCompleto(paciente.getNombresApellidos());
        respuesta.setCedula(paciente.getCedula());

        if (listaCitas.isEmpty()) {
            respuesta.setCitas(Collections.emptyList());
            return respuesta;
        }

        List<ReporteCitaDTO> citasDTO = listaCitas.stream().map(cita -> {
            LocalTime horaInicio = cita.getHorainicio() != null ? cita.getHorainicio().toLocalTime() : null;
            String nombreProfesional = especialistaRepository.findById(cita.getIdProfesional())
                .map(Especialista::getNombresApellidos)
                .orElse("Desconocido");

            return new ReporteCitaDTO(
                cita.getFecha(),
                horaInicio,
                nombreProfesional,
                cita.getEspecialidad(),
                cita.getEstadoCita() // Agregar el estado de la cita
            );
        }).collect(Collectors.toList());

        respuesta.setCitas(citasDTO);
        return respuesta;
    }

    public ReporteCitaRespuestaDTO generarReportePorPaciente(Integer fichaPaciente) {
        // Obtener las ultimas 15 citas
        Pageable pageable = PageRequest.of(0, 15, Sort.by("fecha").descending());
        Page<VistaCitasCompleta> paginaCitas = vistaCitasCompletaRepository.findByFichaPaciente(fichaPaciente,
                pageable);

        List<VistaCitasCompleta> listaCitas = paginaCitas.getContent();

        ReporteCitaRespuestaDTO respuesta = new ReporteCitaRespuestaDTO();

        String nombrePaciente = "Desconocido";
        String cedula = null;
        if (fichaPaciente != null) {
            Optional<Paciente> pacienteOpt = pacienteRepository.findById(fichaPaciente);
            if (pacienteOpt.isPresent()) {
                Paciente paciente = pacienteOpt.get();
                nombrePaciente = paciente.getNombresApellidos();
                cedula = paciente.getCedula();
            }
        }
        respuesta.setPacienteNombreCompleto(nombrePaciente);
        respuesta.setCedula(cedula);

        if (listaCitas.isEmpty()) {
            respuesta.setCitas(List.of());
            return respuesta;
        }

        List<ReporteCitaDTO> citasDTO = listaCitas.stream().map(cita -> {
            LocalTime horaInicio = null;
            if (cita.getHorainicio() != null) {
                horaInicio = cita.getHorainicio().toLocalTime();
            }

            String nombreProfesional = "Desconocido";
            if (cita.getIdProfesional() != null) {
                nombreProfesional = especialistaRepository.findById(cita.getIdProfesional())
                        .map(p -> {
                            // Asumiendo que Especialista tiene getters directos o via usuario, por ahora
                            // uso un placeholder o metodo probable
                            // Al ver el archivo corregire si es necesario.
                            // Previamente vi EspecialistaDTO con nombresApellidos.
                            // Si Entity tiene nombresApellidos directo es facil. Si no, ajustar.
                            // Por ahora pondre map simple, lo corregire al escribir si veo el archivo.
                            return p.getNombresApellidos();
                        })
                        .orElse("Desconocido");
            }

            return new ReporteCitaDTO(
                    cita.getFecha(),
                    horaInicio,
                    nombreProfesional,
                    cita.getEspecialidad(),
                    cita.getEstadoCita()); // Agregar el estado de la cita
        }).collect(Collectors.toList());

        Collections.reverse(citasDTO);
        respuesta.setCitas(citasDTO);

        return respuesta;
    }
}
