package com.ucacue.udipsai.modules.fonoaudiologia.service;

import com.ucacue.udipsai.modules.fonoaudiologia.domain.Fonoaudiologia;
import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaDTO;
import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaRequest;
import com.ucacue.udipsai.modules.fonoaudiologia.repository.FonoaudiologiaRepository;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.paciente.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FonoaudiologiaService {

    @Autowired
    private FonoaudiologiaRepository fonoaudiologiaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private PacienteService pacienteService;

    @Transactional(readOnly = true)
    public List<FonoaudiologiaDTO> listarFichasFonoaudiologia() {
        log.info("Consultando todas las fichas de fonoaudiología activas");
        return fonoaudiologiaRepository.findAll().stream()
                .filter(Fonoaudiologia::getActivo)
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FonoaudiologiaDTO obtenerFichaFonoaudiologiaPorPacienteId(Integer pacienteId) {
        log.info("Consultando ficha de fonoaudiología activa para el paciente ID: {}", pacienteId);
        Fonoaudiologia ficha = fonoaudiologiaRepository.findByPacienteIdAndActivo(pacienteId, true);
        if (ficha != null && ficha.getActivo()) {
            return convertirADTO(ficha);
        }
        return null;
    }
    
    @Transactional(readOnly = true)
    public Fonoaudiologia obtenerEntidadFichaPorIdPaciente(Integer pacienteId) {
        log.debug("Consultando entidad Fonoaudiologia por Paciente ID: {}", pacienteId);
        return fonoaudiologiaRepository.findByPacienteIdAndActivo(pacienteId, true);
    }

    @Transactional
    public FonoaudiologiaDTO guardarFichaFonoaudiologia(FonoaudiologiaRequest request) {
        log.info("Iniciando guardado de ficha fonoaudiología para Paciente ID: {}", request.getPacienteId());
        if (request.getPacienteId() == null) {
            throw new IllegalArgumentException("El ID del paciente es requerido");
        }
        Fonoaudiologia ficha = fonoaudiologiaRepository.findByPacienteIdAndActivo(request.getPacienteId(), true);
        
        if (ficha == null) {
            log.info("Creando nueva ficha de fonoaudiología para Paciente ID: {}", request.getPacienteId());
            ficha = new Fonoaudiologia();
            Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> {
                    log.error("Error al guardar ficha: Paciente ID {} no encontrado", request.getPacienteId());
                    return new RuntimeException("Paciente no encontrado");
                });
            ficha.setPaciente(paciente);
        } else {
             log.info("Actualizando ficha de fonoaudiología existente ID: {}", ficha.getId());
        }

        if (request.getHabla() != null) ficha.setHabla(request.getHabla());
        if (request.getAudicion() != null) ficha.setAudicion(request.getAudicion());
        if (request.getFonacion() != null) ficha.setFonacion(request.getFonacion());
        if (request.getHistoriaAuditiva() != null) ficha.setHistoriaAuditiva(request.getHistoriaAuditiva());
        if (request.getVestibular() != null) ficha.setVestibular(request.getVestibular());
        if (request.getOtoscopia() != null) ficha.setOtoscopia(request.getOtoscopia());
        
        ficha.setActivo(true);
        Fonoaudiologia saved = fonoaudiologiaRepository.save(ficha);
        log.info("Ficha de fonoaudiología guardada exitosamente ID: {}", saved.getId());
        return convertirADTO(saved);
    }

    public void eliminarFichaFonoaudiologia(Integer id) {
        if (id == null) return;
        log.info("Eliminando ficha fonoaudiología ID: {}", id);
        fonoaudiologiaRepository.findById(id).ifPresent(f -> {
            f.setActivo(false);
            fonoaudiologiaRepository.save(f);
            log.info("Ficha fonoaudiología ID: {} desactivada", id);
        });
    }

    private FonoaudiologiaDTO convertirADTO(Fonoaudiologia ficha) {
        FonoaudiologiaDTO dto = new FonoaudiologiaDTO();
        dto.setId(ficha.getId());
        dto.setPaciente(pacienteService.convertirADTO(ficha.getPaciente()));
        dto.setActivo(ficha.getActivo());
        
        dto.setHabla(ficha.getHabla());
        dto.setAudicion(ficha.getAudicion());
        dto.setFonacion(ficha.getFonacion());
        dto.setHistoriaAuditiva(ficha.getHistoriaAuditiva());
        dto.setVestibular(ficha.getVestibular());
        dto.setOtoscopia(ficha.getOtoscopia());
        
        return dto;
    }
}