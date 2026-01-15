package com.ucacue.udipsai.modules.citas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/citas/reporte")
public class ReporteCitaController {

    @Autowired
    private ReporteCitaService reporteCitaService;

    @GetMapping("/paciente/{id}")
    public ResponseEntity<ReporteCitaRespuestaDTO> obtenerReportePorPaciente(@PathVariable Integer id) {
        return ResponseEntity.ok(reporteCitaService.generarReportePorPaciente(id));
    }

    @GetMapping("/cedula/{cedula}")
    public ResponseEntity<ReporteCitaRespuestaDTO> obtenerReportePorCedula(@PathVariable String cedula) {
        return reporteCitaService.generarReportePorCedula(cedula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
