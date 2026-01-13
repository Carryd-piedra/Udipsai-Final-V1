package com.ucacue.udipsai.modules.asignacion.service;

import com.ucacue.udipsai.modules.asignacion.domain.Asignacion;
import com.ucacue.udipsai.modules.asignacion.dto.AsignacionDTO;
import com.ucacue.udipsai.modules.asignacion.dto.AsignacionRequest;
import com.ucacue.udipsai.modules.asignacion.repository.AsignacionRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.paciente.service.PacienteService;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;
import com.ucacue.udipsai.modules.pasante.service.PasanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AsignacionService {

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PasanteRepository pasanteRepository;

    @Autowired
    private PacienteService pacienteService;
    
    @Autowired
    private PasanteService pasanteService;

    public List<AsignacionDTO> listarAsignaciones() {
        log.info("Consultando todas las asignaciones activas");
        return asignacionRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public AsignacionDTO crearAsignacion(AsignacionRequest request) {
        log.info("Creando asignación para Paciente ID: {} y Pasante ID: {}", request.getPacienteId(), request.getPasanteId());
        if (request.getPacienteId() == null) {
            log.error("Error al crear asignación: Paciente ID es nulo");
            throw new IllegalArgumentException("Paciente ID requerido");
        }
        if (request.getPasanteId() == null) {
            log.error("Error al crear asignación: Pasante ID es nulo");
            throw new IllegalArgumentException("Pasante ID requerido");
        }

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> {
                    log.error("Error al crear asignación: Paciente con ID {} no encontrado", request.getPacienteId());
                    return new RuntimeException("Paciente no encontrado");
                });
        Pasante pasante = pasanteRepository.findById(request.getPasanteId())
                .orElseThrow(() -> {
                    log.error("Error al crear asignación: Pasante con ID {} no encontrado", request.getPasanteId());
                    return new RuntimeException("Pasante no encontrado");
                });

        Asignacion asignacion = new Asignacion();
        asignacion.setPaciente(paciente);
        asignacion.setPasante(pasante);
        asignacion.setActivo(true);
        
        Asignacion asignacionGuardada = asignacionRepository.save(asignacion);
        log.info("Asignación creada exitosamente con ID: {}", asignacionGuardada.getId());

        return convertirADTO(asignacionGuardada);
    }
    
    public List<AsignacionDTO> listarAsignacionesPorPasanteId(Integer pasanteId) {
        log.info("Consultando asignaciones activas para el pasante ID: {}", pasanteId);
        return asignacionRepository.findByPasanteIdAndActivoTrue(pasanteId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public void eliminarAsignacion(Long id) {
        if (id == null) {
            log.warn("Intento de eliminar asignación con ID nulo");
            return;
        }
        asignacionRepository.findById(id).ifPresentOrElse(a -> {
            log.info("Eliminando (desactivando) asignación ID: {}", id);
            a.setActivo(false);
            asignacionRepository.save(a);
        }, () -> log.warn("Intento de eliminar asignación inexistente ID: {}", id));
    }

    public AsignacionDTO convertirADTO(Asignacion asignacion) {
        return AsignacionDTO.builder()
                .id(asignacion.getId())
                .paciente(pacienteService.convertirADTO(asignacion.getPaciente()))
                .pasante(pasanteService.convertirADTO(asignacion.getPasante()))
                .activo(asignacion.getActivo())
                .build();
    }
}
