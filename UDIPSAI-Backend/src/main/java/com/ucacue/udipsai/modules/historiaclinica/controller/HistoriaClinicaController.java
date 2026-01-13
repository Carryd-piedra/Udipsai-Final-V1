package com.ucacue.udipsai.modules.historiaclinica.controller;

import com.ucacue.udipsai.modules.historiaclinica.dto.HistoriaClinicaDTO;
import com.ucacue.udipsai.modules.historiaclinica.dto.HistoriaClinicaRequest;
import com.ucacue.udipsai.modules.historiaclinica.service.HistoriaClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/historia-clinica")
@Slf4j
public class HistoriaClinicaController {

    @Autowired
     private HistoriaClinicaService historiaClinicaService;

    @Autowired
    private com.ucacue.udipsai.modules.asignacion.service.AsignacionSecurityService asignacionSecurity;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA')")
    public List<HistoriaClinicaDTO> listarHistoriasClinicas() {
        log.info("Petición GET para listar todas las historias clínicas activas");
        return historiaClinicaService.listarHistoriasClinicas();
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<HistoriaClinicaDTO> obtenerHistoriaClinicaPorPacienteId(@PathVariable Integer pacienteId) {
        log.info("Petición GET para obtener historia clínica del paciente ID: {}", pacienteId);
        HistoriaClinicaDTO historia = historiaClinicaService.obtenerHistoriaClinicaPorPacienteId(pacienteId);
        if (historia != null) {
            return ResponseEntity.ok(historia);
        }
        log.warn("Ficha clínica no encontrada para paciente ID: {}", pacienteId);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA')")
    public ResponseEntity<HistoriaClinicaDTO> guardarHistoriaClinica(
            @RequestParam("data") String data,
            @RequestParam(value = "genograma", required = false) MultipartFile genograma) throws IOException {
        
        log.info("Petición POST para guardar historia clínica. Data: {}", data);
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules(); 
            HistoriaClinicaRequest request = mapper.readValue(data, HistoriaClinicaRequest.class);
            
            // Manual Security Check due to Multipart
            if (!asignacionSecurity.checkPasanteAcceso(request.getPacienteId())) {
                 log.warn("Acceso denegado al guardar historia clínica para paciente ID: {}", request.getPacienteId());
                 return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
            }

            HistoriaClinicaDTO saved = historiaClinicaService.guardarHistoriaClinica(request, genograma);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            log.error("Error al procesar JSON o Archivo en guardado de historia clínica: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error al guardar historia clínica: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/paciente/{pacienteId}/genograma")
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA') and @asignacionSecurity.checkPasanteAcceso(#pacienteId)")
    public ResponseEntity<Resource> descargarGenograma(@PathVariable Integer pacienteId) {
        log.info("Petición GET para descargar genograma del paciente ID: {}", pacienteId);
        Resource file = historiaClinicaService.cargarGenogramaComoRecurso(pacienteId);
        if (file == null) {
            log.warn("Genograma no encontrado para paciente ID: {}", pacienteId);
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_HISTORIA_CLINICA')")
    public ResponseEntity<Void> eliminarHistoriaClinica(@PathVariable Integer id) {
        log.info("Petición DELETE para eliminar historia clínica ID: {}", id);
        historiaClinicaService.eliminarHistoriaClinica(id);
        return ResponseEntity.noContent().build();
    }
}
