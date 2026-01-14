package com.ucacue.udipsai.modules.citas;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

/*
 * Controlador para las Citas.
*/
@RestController
@RequestMapping("/api/citas")
public class CitaController {
    @Autowired
    private CitaService citaServ;

    // Obtener todas las Citas.
    @GetMapping
    public ResponseEntity<Page<CitaDTO>> obtenerCitas(
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitas(pageable, request);
    }

    // Obtener una Cita especifica por Id.
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerCita(@PathVariable Long id, HttpServletRequest request) {
        return citaServ.obtenerCitaPorId(id, request);
    }

    // Obtener citas filtro unico
    @GetMapping("/filtro")
    public ResponseEntity<?> obtenerCitasPorFiltro(@RequestParam(required = false) Long id,
            @RequestParam(name = "filtro", required = true) String filtro,
            @PageableDefault(page = 0, size = 5, direction = Sort.Direction.ASC) Pageable pageable,
            HttpServletRequest request) {
        return citaServ.obtenerCitasFiltro(filtro, pageable);
    }

    // Obtener citas por filtro.
    @GetMapping("/filtros")
    public ResponseEntity<Page<CitaEntity>> obtenerCitasPorFiltros(
            @PageableDefault(page = 0, size = 5) Pageable pageable,
            @RequestParam(name = "filtro", required = true) String filtro,
            @RequestParam(required = false) Long idCita, @RequestParam(required = false) Long fichaPaciente,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate fecha,
            HttpServletRequest request) {
        return citaServ.obtenerCitasPorFiltros(idCita, fichaPaciente, fecha, pageable, request);
    }

    // Obtener citas con estado PENDIENTE.
    @GetMapping("/pendientes")
    public ResponseEntity<Page<CitaDTO>> obtenerCitasPendientes(
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitasPorEstado(CitaEntity.Estado.PENDIENTE, pageable, request);
    }

    // Obtener citas con estado ASISTIDO (Antes FINALIZADA).
    @GetMapping("/finalizadas")
    public ResponseEntity<Page<CitaDTO>> obtenerCitasFinalizadas(
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitasPorEstado(CitaEntity.Estado.ASISTIDO, pageable, request);
    }

    // Obtener citas con estado CANCELADA.
    @GetMapping("/canceladas")
    public ResponseEntity<Page<CitaDTO>> obtenerCitasCanceladas(
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitasPorEstado(CitaEntity.Estado.CANCELADA, pageable, request);
    }

    // Obtener horas libres de un Profesional en una fecha especifica.
    @GetMapping("/horas-libres/{profesionalId}/")
    public ResponseEntity<?> encontrarHorasLibresProfesional(@PathVariable Long profesionalId,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate fecha, HttpServletRequest request) {
        return citaServ.encontrarHorasLibresProfesional(profesionalId, fecha, request);
    }

    // Registrar una Cita.
    @PostMapping
    public ResponseEntity<?> registrarCita(@RequestBody RegistrarCitaDTO cita, HttpServletRequest request) {
        return citaServ.registrarCita(cita, request);
    }

    // Reagendar una Cita.
    @PutMapping("/reagendar/{id}")
    public ResponseEntity<?> reagendarCita(@PathVariable Long id, @RequestBody RegistrarCitaDTO cita,
            HttpServletRequest request) {
        return citaServ.reagendarCita(id, cita, request);
    }

    // Cambiar estado de una cita a FALTA JUSTIFICADA.
    @PatchMapping("/falta-justificada/{id}")
    public ResponseEntity<?> faltaJustificada(@PathVariable Long id) {
        return citaServ.faltaJustificada(id);
    }

    // Cambiar estado de una cita a FALTA INJUSTIFICADA.
    @PatchMapping("/falta-injustificada/{id}")
    public ResponseEntity<?> faltaInjustificada(@PathVariable Long id) {
        return citaServ.faltaInjustificada(id);
    }

    // Finalizar una Cita.
    @PatchMapping("/finalizar/{id}")
    public ResponseEntity<?> finalizarCita(@PathVariable Long id) {
        return citaServ.finalizarCita(id);
    }

    // Cancelar una Cita.
    @PatchMapping("/cancelar/{id}")
    public ResponseEntity<?> cancelarCita(@PathVariable Long id) {
        return citaServ.cancelarCita(id);
    }

    // Obtener Citas por profesional
    @GetMapping("/profesional/{id}")
    public ResponseEntity<?> obtenerCitasPorProfesional(@PathVariable Long id,
            @PageableDefault(page = 0, size = 5, sort = "estado") Pageable pageable, HttpServletRequest request) {
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("estado").descending());
        return citaServ.obtenerCitasPorProfesional(id, pageable);
    }

    // Obtener citas por especialidad (antes area)
    @GetMapping("/especialidad/{id}")
    public ResponseEntity<?> obtenerCitasPorEspecialidad(@PathVariable Integer id,
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitasPorEspecialidad(id, pageable);
    }

    // Obtener citas por Especialidades (antes areas)
    @GetMapping("/especialidades")
    public ResponseEntity<?> obtenerCitasPorEspecialidades(
            @RequestParam(name = "especialidades", required = true) List<Integer> especialidades,
            @PageableDefault(page = 0, size = 5) Pageable pageable, HttpServletRequest request) {
        return citaServ.obtenerCitasPorEspecialidades(especialidades, pageable);
    }

    // Obtener citas por paciente
    @GetMapping("/paciente/{id}")
    public ResponseEntity<?> obtenerCitasCompletasPorPaciente(@PathVariable int id,
            @PageableDefault(page = 0, size = 5, sort = "fechaModificacionCita", direction = Sort.Direction.ASC) Pageable pageable,
            HttpServletRequest request) {
        return (ResponseEntity<?>) citaServ.obtenerCitasCompletasPorPaciente(id, pageable);
    }
}
