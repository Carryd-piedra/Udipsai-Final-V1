package com.ucacue.udipsai.modules.psicologiaeducativa.controller;

import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaDTO;
import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaRequest;
import com.ucacue.udipsai.modules.psicologiaeducativa.service.PsicologiaEducativaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api/psicologia-educativa")
@Slf4j
public class PsicologiaEducativaController {

    @Autowired
    private PsicologiaEducativaService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA')")
    public ResponseEntity<List<PsicologiaEducativaDTO>> listarFichasPsicologiaEducativa() {
        log.info("Petición GET para listar todas las fichas de psicología educativa activas");
        return ResponseEntity.ok(service.listarFichasPsicologiaEducativa());
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<PsicologiaEducativaDTO> obtenerFichaPsicologiaEducativaPorPacienteId(@PathVariable Integer pacienteId) {
        log.info("Petición GET para obtener ficha de psicología educativa por paciente ID: {}", pacienteId);
        PsicologiaEducativaDTO ficha = service.obtenerFichaPsicologiaEducativaPorPacienteId(pacienteId);
        if (ficha != null) {
            return ResponseEntity.ok(ficha);
        }
        log.warn("Ficha de psicología educativa no encontrada para paciente ID: {}", pacienteId);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA') and @asignacionSecurity.checkPasanteAcceso(#request.pacienteId)")
    public ResponseEntity<PsicologiaEducativaDTO> guardarFichaPsicologiaEducativa(@RequestBody PsicologiaEducativaRequest request) {
        log.info("Petición POST para guardar/actualizar ficha de psicología educativa para paciente ID: {}", request.getPacienteId());
        try {
            return ResponseEntity.ok(service.guardarFichaPsicologiaEducativa(request));
        } catch (Exception e) {
            log.error("Error al guardar ficha de psicología educativa: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_PSICOLOGIA_EDUCATIVA')")
    public ResponseEntity<Void> eliminarFichaPsicologiaEducativa(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar ficha de psicología educativa ID: {}", id);
        service.eliminarFichaPsicologiaEducativa(id);
        return ResponseEntity.noContent().build();
    }
}
