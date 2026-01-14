package com.ucacue.udipsai.modules.paciente.service;

import com.ucacue.udipsai.modules.instituciones.domain.InstitucionEducativa;
import com.ucacue.udipsai.modules.instituciones.repository.InstitucionEducativaRepository;
import com.ucacue.udipsai.modules.paciente.dto.PacienteRequest;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.dto.PacienteCriteriaDTO;
import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;
import com.ucacue.udipsai.modules.paciente.dto.PacienteSummaryDTO;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import com.ucacue.udipsai.modules.sedes.repository.SedeRepository;
import com.ucacue.udipsai.infrastructure.storage.StorageService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import com.ucacue.udipsai.modules.instituciones.dto.InstitucionEducativaDTO;
import com.ucacue.udipsai.modules.sedes.dto.SedeDTO;

import com.ucacue.udipsai.modules.documentos.dto.DocumentoDTO;
import com.ucacue.udipsai.modules.historiaclinica.repository.HistoriaClinicaRepository;
import com.ucacue.udipsai.modules.fonoaudiologia.repository.FonoaudiologiaRepository;
import com.ucacue.udipsai.modules.psicologiaclinica.repository.PsicologiaClinicaRepository;
import com.ucacue.udipsai.modules.psicologiaeducativa.repository.PsicologiaEducativaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Join;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private InstitucionEducativaRepository institucionEducativaRepository;

    @Autowired
    private SedeRepository sedeRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Autowired
    private FonoaudiologiaRepository fonoaudiologiaRepository;

    @Autowired
    private PsicologiaClinicaRepository psicologiaClinicaRepository;

    @Autowired
    private PsicologiaEducativaRepository psicologiaEducativaRepository;

    @Transactional(readOnly = true)
    public Page<PacienteDTO> listarPacientesActivos(Pageable pageable) {
        return pacienteRepository.findByActivoTrue(pageable)
                .map(this::convertirADTO);
    }

    @Transactional(readOnly = true)
    public PacienteDTO obtenerPacientePorId(Integer id) {
        return pacienteRepository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException("Paciente con ID " + id + " no encontrado"));
    }

    @Transactional(readOnly = true)
    public Page<PacienteDTO> filtrarPacientes(PacienteCriteriaDTO criteria, Pageable pageable) {
        log.info("Filtrando pacientes con criterios: {}", criteria);

        Specification<Paciente> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(criteria.getSearch())) {
                String searchPattern = "%" + criteria.getSearch().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nombresApellidos")), searchPattern),
                        cb.like(cb.lower(root.get("cedula")), searchPattern)));
            }

            if (StringUtils.hasText(criteria.getCiudad())) {
                predicates.add(cb.like(cb.lower(root.get("ciudad")),
                        "%" + criteria.getCiudad().toLowerCase() + "%"));
            }
            if (criteria.getActivo() != null) {
                predicates.add(cb.equal(root.get("activo"), criteria.getActivo()));
            }
            if (criteria.getSedeId() != null) {
                Join<Object, Object> sedeJoin = root.join("sede");
                predicates.add(cb.equal(sedeJoin.get("id"), criteria.getSedeId()));
            }
            if (criteria.getInstitucionEducativaId() != null) {
                Join<Object, Object> ieJoin = root.join("institucionEducativa");
                predicates.add(cb.equal(ieJoin.get("id"), criteria.getInstitucionEducativaId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return pacienteRepository.findAll(spec, pageable).map(this::convertirADTO);
    }

    @Transactional
    public PacienteDTO crearPaciente(PacienteRequest request, MultipartFile foto) {
        log.info("Iniciando creación de paciente: {}", request.getNombresApellidos());
        if (pacienteRepository.existsByCedula(request.getCedula())) {
            log.error("Ya existe un paciente con la cédula: {}", request.getCedula());
            throw new RuntimeException("Ya existe un paciente con la cédula: " + request.getCedula());
        }

        Paciente paciente = new Paciente();
        mapearRequestAEntidad(request, paciente);
        paciente.setFechaApertura(LocalDateTime.now());
        paciente.setActivo(true);

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            paciente.setFotoUrl(filename);
            log.debug("Foto guardada para paciente ID: {}", paciente.getId());
        }

        Paciente saved = pacienteRepository.save(paciente);
        log.info("Paciente creado exitosamente con cédula: {}", saved.getCedula());
        return convertirADTO(saved);
    }

    @Transactional
    public PacienteDTO actualizarPaciente(Integer id, PacienteRequest request, MultipartFile foto) {
        log.info("Iniciando actualización de paciente ID: {}", id);
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Error al actualizar: Paciente no encontrado ID: {}", id);
                    return new RuntimeException("Paciente no encontrado");
                });

        mapearRequestAEntidad(request, paciente);

        if (foto != null && !foto.isEmpty()) {
            String filename = storageService.store(foto);
            paciente.setFotoUrl(filename);
            log.debug("Foto actualizada para paciente ID: {}", id);
        }

        Paciente saved = pacienteRepository.save(paciente);
        log.info("Paciente actualizado exitosamente ID: {}", saved.getId());

        return convertirADTO(saved);
    }

    @Transactional
    public void eliminarPaciente(Integer id) {
        log.info("Iniciando eliminación de paciente ID: {}", id);
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Intento de eliminar paciente inexistente ID: {}", id);
                    return new RuntimeException("Paciente no encontrado");
                });
        paciente.setActivo(false);
        pacienteRepository.save(paciente);
        log.info("Paciente ID {} desactivado", id);
    }

    private void mapearRequestAEntidad(PacienteRequest request, Paciente paciente) {
        paciente.setNombresApellidos(request.getNombresApellidos());
        paciente.setCiudad(request.getCiudad());
        paciente.setFechaNacimiento(request.getFechaNacimiento());
        paciente.setCedula(request.getCedula());
        paciente.setDomicilio(request.getDomicilio());
        paciente.setNumeroTelefono(request.getNumeroTelefono());
        paciente.setNumeroCelular(request.getNumeroCelular());
        paciente.setProyecto(request.getProyecto());
        paciente.setJornada(request.getJornada());
        paciente.setNivelEducativo(request.getNivelEducativo());
        paciente.setAnioEducacion(request.getAnioEducacion());
        paciente.setPerteneceInclusion(request.getPerteneceInclusion());
        paciente.setTieneDiscapacidad(request.getTieneDiscapacidad());
        paciente.setPortadorCarnet(request.getPortadorCarnet());
        paciente.setPerteneceAProyecto(request.getPerteneceAProyecto());
        paciente.setDiagnostico(request.getDiagnostico());
        paciente.setMotivoConsulta(request.getMotivoConsulta());
        paciente.setObservaciones(request.getObservaciones());
        paciente.setTipoDiscapacidad(request.getTipoDiscapacidad());
        paciente.setDetalleDiscapacidad(request.getDetalleDiscapacidad());
        paciente.setPorcentajeDiscapacidad(request.getPorcentajeDiscapacidad());

        if (request.getInstitucionEducativaId() != null) {
            InstitucionEducativa ie = institucionEducativaRepository.findById(request.getInstitucionEducativaId())
                    .orElseThrow(() -> new RuntimeException("Institucion Educativa not found"));
            paciente.setInstitucionEducativa(ie);
        }

        if (request.getSedeId() != null) {
            Sede sede = sedeRepository.findById(request.getSedeId())
                    .orElseThrow(() -> new RuntimeException("Sede not found"));
            paciente.setSede(sede);
        }
    }

    @Transactional(readOnly = true)
    public PacienteDTO convertirADTO(Paciente paciente) {
        return PacienteDTO.builder()
                .id(paciente.getId())
                .fechaApertura(paciente.getFechaApertura())
                .activo(paciente.getActivo())
                .nombresApellidos(paciente.getNombresApellidos())
                .ciudad(paciente.getCiudad())
                .fechaNacimiento(paciente.getFechaNacimiento())
                .edad(paciente.getEdad())
                .cedula(paciente.getCedula())
                .domicilio(paciente.getDomicilio())
                .fotoUrl(paciente.getFotoUrl())
                .numeroTelefono(paciente.getNumeroTelefono())
                .numeroCelular(paciente.getNumeroCelular())
                .institucionEducativa(paciente.getInstitucionEducativa() != null ? new InstitucionEducativaDTO(
                        paciente.getInstitucionEducativa().getId(), paciente.getInstitucionEducativa().getNombre())
                        : null)
                .sede(paciente.getSede() != null ? new SedeDTO(
                        paciente.getSede().getId(), paciente.getSede().getNombre()) : null)
                .proyecto(paciente.getProyecto())
                .jornada(paciente.getJornada())
                .nivelEducativo(paciente.getNivelEducativo())
                .anioEducacion(paciente.getAnioEducacion())
                .perteneceInclusion(paciente.getPerteneceInclusion())
                .tieneDiscapacidad(paciente.getTieneDiscapacidad())
                .portadorCarnet(paciente.getPortadorCarnet())
                .perteneceAProyecto(paciente.getPerteneceAProyecto())
                .diagnostico(paciente.getDiagnostico())
                .motivoConsulta(paciente.getMotivoConsulta())
                .observaciones(paciente.getObservaciones())
                .tipoDiscapacidad(paciente.getTipoDiscapacidad())
                .detalleDiscapacidad(paciente.getDetalleDiscapacidad())
                .porcentajeDiscapacidad(paciente.getPorcentajeDiscapacidad())
                .documentos(paciente.getDocumentos() != null ? paciente.getDocumentos().stream()
                        .filter(d -> d.getActivo())
                        .map(d -> new DocumentoDTO(d.getId(), d.getUrl(), d.getNombre()))
                        .collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    @Transactional(readOnly = true)
    public PacienteSummaryDTO obtenerResumenFichas(Integer id) {
        log.info("Obteniendo resumen de fichas para paciente ID: {}", id);
        List<String> nombres = new java.util.ArrayList<>();

        if (historiaClinicaRepository.findByPacienteIdAndActivo(id, true) != null)
            nombres.add("Historia Clínica");
        if (fonoaudiologiaRepository.findByPacienteIdAndActivo(id, true) != null)
            nombres.add("Fonoaudiología");
        if (psicologiaClinicaRepository.findByPacienteIdAndActivo(id, true) != null)
            nombres.add("Psicología Clínica");
        if (psicologiaEducativaRepository.findByPacienteIdAndActivo(id, true) != null)
            nombres.add("Psicología Educativa");

        return PacienteSummaryDTO.builder()
                .totalFichas(nombres.size())
                .nombresFichas(nombres)
                .build();
    }
}
