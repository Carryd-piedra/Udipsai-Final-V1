package com.ucacue.udipsai.modules.psicologiaeducativa.service;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.paciente.service.PacienteService;
import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaRequest;
import com.ucacue.udipsai.modules.psicologiaeducativa.domain.PsicologiaEducativa;
import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaDTO;
import com.ucacue.udipsai.modules.psicologiaeducativa.repository.PsicologiaEducativaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PsicologiaEducativaService {

    @Autowired
    private PsicologiaEducativaRepository psicologiaEducativaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PacienteService pacienteService;

    @Transactional(readOnly = true)
    public List<PsicologiaEducativaDTO> listarFichasPsicologiaEducativa() {
        log.info("Consultando todas las fichas de psicología educativa activas");
        return psicologiaEducativaRepository.findAll().stream()
                .filter(PsicologiaEducativa::getActivo)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PsicologiaEducativaDTO obtenerFichaPsicologiaEducativaPorPacienteId(Integer pacienteId) {
        log.info("Consultando ficha de psicología educativa por paciente ID: {}", pacienteId);
        PsicologiaEducativa ficha = psicologiaEducativaRepository.findByPacienteIdAndActivo(pacienteId, true);
        if (ficha != null && ficha.getActivo()) {
            return convertirADTO(ficha);
        }
        return null;
    }

    @Transactional(readOnly = true)
    public PsicologiaEducativa obtenerEntidadFichaPorIdPaciente(Integer pacienteId) {
        log.debug("Consultando entidad ficha psicología educativa por paciente ID: {}", pacienteId);
        return psicologiaEducativaRepository.findByPacienteIdAndActivo(pacienteId, true);
    }

    @Transactional
    public PsicologiaEducativaDTO guardarFichaPsicologiaEducativa(PsicologiaEducativaRequest request) {
        log.info("Iniciando guardado de ficha psicología educativa para paciente ID: {}", request.getPacienteId());
        if (request.getPacienteId() == null) {
            log.error("El ID del paciente es requerido");
            throw new IllegalArgumentException("El ID del paciente es requerido");
        }
        PsicologiaEducativa ficha = psicologiaEducativaRepository.findByPacienteIdAndActivo(request.getPacienteId(),
                true);

        if (ficha == null) {
            log.info("Creando nueva ficha psicología educativa para paciente ID: {}", request.getPacienteId());
            ficha = new PsicologiaEducativa();
            Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                    .orElseThrow(() -> {
                        log.error("Paciente ID {} no encontrado", request.getPacienteId());
                        throw new RuntimeException("Paciente no encontrado");
                    });
            ficha.setPaciente(paciente);
        } else {
            log.info("Actualizando ficha psicología educativa existente ID: {}", ficha.getId());
        }

        if (request.getHistoriaEscolar() != null)
            ficha.setHistoriaEscolar(request.getHistoriaEscolar());
        if (request.getDesarrollo() != null)
            ficha.setDesarrollo(request.getDesarrollo());
        if (request.getAdaptacion() != null)
            ficha.setAdaptacion(request.getAdaptacion());
        if (request.getEstadoGeneral() != null)
            ficha.setEstadoGeneral(request.getEstadoGeneral());

        ficha.setActivo(true);
        PsicologiaEducativa saved = psicologiaEducativaRepository.save(ficha);
        log.info("Ficha psicología educativa guardada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    public void eliminarFichaPsicologiaEducativa(Integer id) {
        log.info("Eliminando (desactivando) ficha psicología educativa ID: {}", id);
        if (id != null) {
            psicologiaEducativaRepository.findById(id).ifPresent(f -> {
                f.setActivo(false);
                psicologiaEducativaRepository.save(f);
                log.info("Ficha ID {} desactivada", id);
            });
        }
    }

    private PsicologiaEducativaDTO convertirADTO(PsicologiaEducativa ficha) {
        PsicologiaEducativaDTO dto = new PsicologiaEducativaDTO();
        dto.setId(ficha.getId());
        dto.setPaciente(pacienteService.convertirADTO(ficha.getPaciente()));
        dto.setActivo(ficha.getActivo());

        dto.setHistoriaEscolar(ficha.getHistoriaEscolar());
        dto.setDesarrollo(ficha.getDesarrollo());
        dto.setAdaptacion(ficha.getAdaptacion());
        dto.setEstadoGeneral(ficha.getEstadoGeneral());

        return dto;
    }
}