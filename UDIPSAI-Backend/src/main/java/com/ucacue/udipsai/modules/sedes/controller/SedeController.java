package com.ucacue.udipsai.modules.sedes.controller;

import com.ucacue.udipsai.modules.sedes.dto.SedeCriteriaDTO;
import com.ucacue.udipsai.modules.sedes.service.SedeService;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/sedes")
@Slf4j
public class SedeController {

    private final SedeService sedeService;

    public SedeController(SedeService sedeService) {
        this.sedeService = sedeService;
    }

    @GetMapping("/activos")
    public ResponseEntity<Page<Sede>> listarSedesActivas(
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(sedeService.listarSedesActivas(pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Sede>> filtrarSedes(
            SedeCriteriaDTO criteria,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(sedeService.filtrarSedes(criteria, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sede> obtenerSedePorId(@PathVariable Integer id) {
        return sedeService.obtenerSedePorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Sede con ID {} no encontrada en la petición GET", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping()
    public ResponseEntity<Sede> crearSede(@RequestBody Sede request) {
        Sede nuevaSede = sedeService.crearSede(request);
        return new ResponseEntity<>(nuevaSede, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sede> actualizarSede(@PathVariable Integer id, @RequestBody Sede nuevaSede) {
        try {
            return ResponseEntity.ok(sedeService.actualizarSede(id, nuevaSede));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSede(@PathVariable Integer id) {
        log.info("Petición DELETE para desactivar sede ID: {}", id);
        sedeService.eliminarSede(id);
        return ResponseEntity.noContent().build();
    }
}
