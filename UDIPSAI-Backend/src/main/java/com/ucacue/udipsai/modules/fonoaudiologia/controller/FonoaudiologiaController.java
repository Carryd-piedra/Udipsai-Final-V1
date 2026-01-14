package com.ucacue.udipsai.modules.fonoaudiologia.controller;

import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaDTO;
import com.ucacue.udipsai.modules.fonoaudiologia.dto.FonoaudiologiaRequest;
import com.ucacue.udipsai.modules.fonoaudiologia.service.FonoaudiologiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api/fonoaudiologia")
@Slf4j
public class FonoaudiologiaController {

    @Autowired
    private FonoaudiologiaService fonoaudiologiaService;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA')")
    public List<FonoaudiologiaDTO> listarFichasFonoaudiologia() {
        log.info("Petición GET para listar todas las fichas de fonoaudiología activas");
        return fonoaudiologiaService.listarFichasFonoaudiologia();
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<FonoaudiologiaDTO> obtenerFichaFonoaudiologiaPorPacienteId(@PathVariable Integer pacienteId) {
        log.info("Petición GET para obtener ficha de fonoaudiología del paciente ID: {}", pacienteId);
        FonoaudiologiaDTO ficha = fonoaudiologiaService.obtenerFichaFonoaudiologiaPorPacienteId(pacienteId);
        if (ficha != null) {
            return ResponseEntity.ok(ficha);
        }
        log.warn("Ficha de fonoaudiología no encontrada para paciente ID: {}", pacienteId);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA') and @asignacionSecurity.checkPasanteAcceso(#request.pacienteId)")
    public ResponseEntity<FonoaudiologiaDTO> guardarFichaFonoaudiologia(@RequestBody FonoaudiologiaRequest request) {
        log.info("Petición POST para guardar ficha de fonoaudiología para Paciente ID: {}", request.getPacienteId());
        try {
            return ResponseEntity.ok(fonoaudiologiaService.guardarFichaFonoaudiologia(request));
        } catch (IllegalArgumentException e) {
            log.error("Error de validación al guardar ficha fonoaudiología: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error al guardar ficha fonoaudiología: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_FONOAUDIOLOGIA')")
    public ResponseEntity<Void> eliminarFichaFonoaudiologia(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar ficha fonoaudiología ID: {}", id);
        fonoaudiologiaService.eliminarFichaFonoaudiologia(id);
        return ResponseEntity.noContent().build();
    }
}
