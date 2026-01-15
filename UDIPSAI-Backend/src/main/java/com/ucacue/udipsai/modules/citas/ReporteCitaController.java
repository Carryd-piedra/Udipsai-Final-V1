package com.ucacue.udipsai.modules.citas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/citas/reporte")
public class ReporteCitaController {

    @Autowired
    private ReporteCitaService reporteCitaService;

    @GetMapping("/paciente/{id}")
    public ResponseEntity<ReporteCitaRespuestaDTO> obtenerReportePorPaciente(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "SECRETARIA") String tipo,
            @RequestParam(defaultValue = "RAPIDO") String alcance) {
        return ResponseEntity.ok(reporteCitaService.generarReportePorPaciente(id, tipo, alcance));
    }

    @GetMapping("/cedula/{cedula}")
    public ResponseEntity<ReporteCitaRespuestaDTO> obtenerReportePorCedula(
            @PathVariable String cedula,
            @RequestParam(defaultValue = "SECRETARIA") String tipo,
            @RequestParam(defaultValue = "RAPIDO") String alcance) {
        return reporteCitaService.generarReportePorCedula(cedula, tipo, alcance)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
