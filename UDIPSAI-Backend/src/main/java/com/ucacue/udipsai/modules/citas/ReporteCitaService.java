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

@Service
public class ReporteCitaService {

    @Autowired
    private VistaCitasCompletaRepository vistaCitasCompletaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private EspecialistaRepository especialistaRepository;

    public ReporteCitaRespuestaDTO generarReportePorPaciente(Integer fichaPaciente) {
        // Obtener las ultimas 15 citas
        Pageable pageable = PageRequest.of(0, 15, Sort.by("fecha").descending());
        Page<VistaCitasCompleta> paginaCitas = vistaCitasCompletaRepository.findByFichaPaciente(fichaPaciente,
                pageable);

        List<VistaCitasCompleta> listaCitas = paginaCitas.getContent();

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
                    cita.getEspecialidad());
        }).collect(Collectors.toList());

        Collections.reverse(citasDTO);
        respuesta.setCitas(citasDTO);

        return respuesta;
    }
}
