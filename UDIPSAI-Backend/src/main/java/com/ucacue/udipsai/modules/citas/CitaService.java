package com.ucacue.udipsai.modules.citas;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.especialidad.dto.EspecialidadDTO;
import com.ucacue.udipsai.modules.especialidad.repository.EspecialidadRepository;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import com.ucacue.udipsai.modules.especialistas.service.EspecialistaService;
import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;
import com.ucacue.udipsai.modules.paciente.service.PacienteService;
import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.paciente.repository.PacienteRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepo;

    @Autowired
    private PacienteRepository pacienteRepo;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private EspecialistaService especialistaService;

    @Autowired
    private EspecialidadRepository especialidadRepo;

    @Autowired
    private VistaCitasCompletaRepository vistaCitasCompletaRepository;

    private static final Logger logger = LoggerFactory.getLogger(CitaService.class);

    // Mapear de una Cita a DTO.
    public CitaDTO mapearDTO(CitaEntity cita, PacienteDTO paciente, EspecialistaDTO especialista,
            EspecialidadDTO especialidad) {
        CitaDTO dto = new CitaDTO(
                cita.getIdCita(),
                cita.getFecha(),
                cita.getHoraInicio(),
                cita.getHoraFin(),
                cita.getEstado().toString(),
                paciente,
                especialista,
                especialidad);
        return dto;
    }

    // Obtener todas las Citas.
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaDTO>> obtenerCitas(Pageable pageable, HttpServletRequest request) {
        logger.info("obtenerCitas()");
        logger.info("Obteniendo todas las Citas");
        Page<CitaEntity> citas = citaRepo.findAll(pageable);

        if (citas.isEmpty()) {
            Page<CitaDTO> emptyPage = Page.empty(pageable);
            return new ResponseEntity<>(emptyPage, HttpStatus.OK);
        }

        Page<CitaDTO> dtos = citas.map(cita -> {
            Optional<Paciente> pacienteOpt = pacienteRepo.findById(cita.getFichaPaciente().intValue());
            if (pacienteOpt.isPresent()) {
                PacienteDTO paciente = pacienteService.convertirADTO(pacienteOpt.get());
                EspecialistaDTO especialista = especialistaService
                        .obtenerEspecialistaPorId(cita.getProfesionalId().intValue());
                Especialidad especialidadEntity = cita.getEspecialidad();
                EspecialidadDTO especialidad = new EspecialidadDTO(especialidadEntity.getId(),
                        especialidadEntity.getArea(), null);

                return mapearDTO(cita, paciente, especialista, especialidad);
            } else {
                // Si falta el paciente, retornamos null o manejamos el error.
                // Para mantener consistencia con obtenerCitasPorEstado, lanzamos excepción o
                // logueamos.
                // Aqui opto por saltar o usar placeholders si fuera critico, pero lanzaré
                // excepcion.
                throw new EntityNotFoundException("Paciente no encontrado para cita " + cita.getIdCita());
            }
        });

        logger.info("200 OK: Citas obtenidas correctamente");

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    // Obtener una Cita por Id.
    @Transactional(readOnly = true)
    public ResponseEntity<?> obtenerCitaPorId(Long idCita, HttpServletRequest request) {
        logger.info("obtenerCitaPorId()");
        logger.info("Obteniendo cita con id {}", idCita);

        CitaEntity cita = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita con id " + idCita + " no encontrada"));

        Paciente pacienteEncontrado = pacienteRepo.findById(cita.getFichaPaciente().intValue())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Paciente con ficha " + cita.getFichaPaciente() + " asignado a la cita no fue encontrado"));

        PacienteDTO paciente = pacienteService.convertirADTO(pacienteEncontrado);
        EspecialistaDTO especialista = especialistaService.obtenerEspecialistaPorId(cita.getProfesionalId().intValue());

        // Mapear Especialidad a DTO
        Especialidad especialidadEntity = cita.getEspecialidad();
        EspecialidadDTO especialidad = new EspecialidadDTO(
                especialidadEntity.getId(),
                especialidadEntity.getArea(),
                null // Permisos null ya que venian de AreaDTO y aqui es simplificado o no disponible
        );

        if (especialista == null) {
            throw new EntityNotFoundException(
                    "Especialista con id " + cita.getProfesionalId() + " asignado a la cita no fue encontrado");
        }

        CitaDTO dto = mapearDTO(cita, paciente, especialista, especialidad);
        logger.info("200 OK: Cita obtenida correctamente");

        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Registrar una Cita.
    @Transactional
    public ResponseEntity<?> registrarCita(RegistrarCitaDTO dto, HttpServletRequest request) {
        logger.info("registrarCita()");
        logger.info("Registrando una Cita");

        // Nota: RegistrarCitaDTO podria necesitar actualizacion tambien (areaId ->
        // especialidadId)
        // Asumiremos que dto.getAreaId() ahora se refiere a especialidadId
        if (dto.getFichaPaciente() == null || dto.getProfesionalId() == null || dto.getEspecialidadId() == null
                || dto.getFecha() == null || dto.getHora() == null) {
            throw new IllegalArgumentException("Faltan datos para el registro de la cita");
        }

        Paciente pacienteEncontrado = pacienteRepo.findById(dto.getFichaPaciente().intValue())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Paciente con ficha " + dto.getFichaPaciente() + " no encontrado para el registro de la cita"));

        PacienteDTO paciente = pacienteService.convertirADTO(pacienteEncontrado);

        EspecialistaDTO especialista = especialistaService.obtenerEspecialistaPorId(dto.getProfesionalId().intValue());

        Especialidad especialidadEntity = especialidadRepo.findById(dto.getEspecialidadId().intValue())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Especialidad con id " + dto.getEspecialidadId() + " no encontrada"));

        EspecialidadDTO especialidad = new EspecialidadDTO(especialidadEntity.getId(), especialidadEntity.getArea(),
                null);

        if (especialista == null) {
            throw new EntityNotFoundException(
                    "Especialista con id " + dto.getProfesionalId() + " no encontrado para el registro de la cita");
        }

        if (citaRepo.existsByEstadoAndFechaAndHoraInicioAndFichaPaciente(CitaEntity.Estado.PENDIENTE, dto.getFecha(),
                dto.getHora(),
                dto.getFichaPaciente())) {
            throw new IllegalArgumentException(
                    "Paciente " + paciente.getNombresApellidos().trim()
                            + " ya tiene una cita asignada en la fecha "
                            + dto.getFecha().toString() + " y hora " + dto.getHora().toString());
        }

        if (citaRepo.existsByEstadoAndFechaAndHoraInicioAndProfesionalId(CitaEntity.Estado.PENDIENTE, dto.getFecha(),
                dto.getHora(),
                dto.getProfesionalId())) {
            throw new IllegalArgumentException("Especialista " + especialista.getNombresApellidos().trim().toUpperCase()
                    + " ya tiene una cita asignada en la fecha "
                    + dto.getFecha().toString() + " y hora " + dto.getHora().toString());
        }

        // Validacion de Overlap (Solapamiento)
        int duration = (dto.getDuracionMinutes() != null && dto.getDuracionMinutes() > 0)
                ? dto.getDuracionMinutes()
                : 60;
        LocalTime newStart = dto.getHora();
        LocalTime newEnd = newStart.plusMinutes(duration);

        // Obtener todas las citas del profesional esa fecha para validar solapamiento
        // real
        List<CitaEntity> citasDia = citaRepo.findCitasOcupadasByProfesionalAndFecha(dto.getProfesionalId(),
                dto.getFecha());

        for (CitaEntity existing : citasDia) {
            LocalTime existingStart = existing.getHoraInicio();
            LocalTime existingEnd = existing.getHoraFin();

            // Check if ranges overlap
            // Overlap condition: (StartA < EndB) and (EndA > StartB)
            if (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)) {
                throw new IllegalArgumentException(
                        "Especialista " + especialista.getNombresApellidos().trim().toUpperCase()
                                + " ya tiene una cita ocupada en el rango " + existingStart + " - " + existingEnd
                                + " que conflicto con el nuevo horario " + newStart + " - " + newEnd);
            }
        }

        // Validacion Paciente (Misma logica si necesario, pero principal es
        // Especialista aqui)
        // ... (Podriamos agregar check similar para Paciente si quisieramos estricto)

        CitaEntity cita = new CitaEntity();
        cita.setFecha(dto.getFecha());
        cita.setHoraInicio(dto.getHora());
        cita.setHoraFin(newEnd);

        cita.setEstado(CitaEntity.Estado.PENDIENTE);
        cita.setFichaPaciente(dto.getFichaPaciente());
        cita.setProfesionalId(dto.getProfesionalId());
        cita.setEspecialidad(especialidadEntity);

        CitaEntity citaGuardada = citaRepo.save(cita);
        CitaDTO citaDto = mapearDTO(citaGuardada, paciente, especialista, especialidad);
        logger.info("201 Created: Cita registrada correctamente");

        return new ResponseEntity<>(citaDto, HttpStatus.CREATED);
    }

    // Reagendar una Cita.
    @Transactional
    public ResponseEntity<?> reagendarCita(Long idCita, RegistrarCitaDTO dto, HttpServletRequest request) {
        logger.info("reagendarCita()");
        logger.info("Reagendando una Cita");

        CitaEntity citaEncontrada = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada"));

        if (citaEncontrada.getEstado() != CitaEntity.Estado.PENDIENTE
                && citaEncontrada.getEstado() != CitaEntity.Estado.NO_ASISTIDO) {
            throw new IllegalArgumentException(
                    "La cita no se puede reagendar porque se encuentra finalizada o fue cancelada");
        }

        if (dto.getFichaPaciente() == null || dto.getProfesionalId() == null || dto.getEspecialidadId() == null
                || dto.getFecha() == null || dto.getHora() == null) {
            throw new IllegalArgumentException("Faltan datos para el reagendamiento de la cita");
        }

        Paciente pacienteEncontrado = pacienteRepo.findById(dto.getFichaPaciente().intValue())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Paciente con ficha " + dto.getFichaPaciente()
                                + " no encontrado para el reagendamiento de la cita"));
        PacienteDTO paciente = pacienteService.convertirADTO(pacienteEncontrado);

        EspecialistaDTO especialista = especialistaService.obtenerEspecialistaPorId(dto.getProfesionalId().intValue());

        Especialidad especialidadEntity = especialidadRepo.findById(dto.getEspecialidadId().intValue())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Especialidad con id " + dto.getEspecialidadId() + " no encontrada"));
        EspecialidadDTO especialidad = new EspecialidadDTO(especialidadEntity.getId(), especialidadEntity.getArea(),
                null);

        if (especialista == null) {
            throw new EntityNotFoundException(
                    "Especialista con id " + dto.getProfesionalId()
                            + " no encontrado para el reagendamiento de la cita");
        }

        if (citaRepo.existsByEstadoAndFechaAndHoraInicioAndFichaPaciente(CitaEntity.Estado.PENDIENTE, dto.getFecha(),
                dto.getHora(),
                dto.getFichaPaciente())) {
            throw new IllegalArgumentException(
                    "Paciente " + paciente.getNombresApellidos().trim()
                            + " ya tiene una cita asignada en la fecha "
                            + dto.getFecha().toString() + " y hora " + dto.getHora().toString());
        }

        if (citaRepo.existsByEstadoAndFechaAndHoraInicioAndProfesionalId(CitaEntity.Estado.PENDIENTE, dto.getFecha(),
                dto.getHora(),
                dto.getProfesionalId())) {
            throw new IllegalArgumentException("Especialista " + especialista.getNombresApellidos().trim().toUpperCase()
                    + " ya tiene una cita asignada en la fecha "
                    + dto.getFecha().toString() + " y hora " + dto.getHora().toString());
        }

        citaEncontrada.setFecha(dto.getFecha());
        citaEncontrada.setHoraInicio(dto.getHora());
        citaEncontrada.setHoraFin(dto.getHora().plusMinutes(60));
        citaEncontrada.setEstado(CitaEntity.Estado.PENDIENTE);
        // Tambien deberiamos actualizar los otros campos si cambiaron
        citaEncontrada.setProfesionalId(dto.getProfesionalId());
        citaEncontrada.setEspecialidad(especialidadEntity);

        CitaEntity citaGuardada = citaRepo.save(citaEncontrada);
        CitaDTO citaDto = mapearDTO(citaGuardada, paciente, especialista, especialidad);
        logger.info("200 OK: Cita reagendada correctamente");

        return new ResponseEntity<>(citaDto, HttpStatus.OK);
    }

    // Obtener todas las Citas por estado.
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaDTO>> obtenerCitasPorEstado(CitaEntity.Estado estado, Pageable pageable,
            HttpServletRequest request) {
        logger.info("obtenerCitasPorEstado()");
        logger.info("Obteniendo todas las Citas con estado {}", estado.toString());

        Page<CitaEntity> citas = citaRepo.findAllByEstado(estado, pageable);

        if (citas.isEmpty()) {
            throw new EntityNotFoundException("No existen citas con estado " + estado.toString());
        }

        Page<CitaDTO> dtos = citas.map(cita -> {
            Optional<Paciente> pacienteOpt = pacienteRepo.findById(cita.getFichaPaciente().intValue());
            if (pacienteOpt.isPresent()) {
                PacienteDTO paciente = pacienteService.convertirADTO(pacienteOpt.get());
                EspecialistaDTO especialista = especialistaService
                        .obtenerEspecialistaPorId(cita.getProfesionalId().intValue());
                Especialidad especialidadEntity = cita.getEspecialidad();
                EspecialidadDTO especialidad = new EspecialidadDTO(especialidadEntity.getId(),
                        especialidadEntity.getArea(), null);

                return mapearDTO(cita, paciente, especialista, especialidad);
            } else {
                throw new EntityNotFoundException("Paciente no encontrado");
            }
        });
        logger.info("200 OK: Citas con estado {} obtenidas correctamente", estado.toString());

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    // Obtener Citas por filtros.
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaEntity>> obtenerCitasPorFiltros(Long idCita, Long fichaPaciente, LocalDate fecha,
            Pageable pageable,
            HttpServletRequest request) {
        logger.info("obtenerCitasPorFiltro()");
        logger.info("Obteniendo citas por filtro");

        Page<CitaEntity> citas = Page.empty();

        if (fecha != null && idCita == null && fichaPaciente == null) {
            citas = citaRepo.findAllByFecha(fecha, pageable);
        } else {
            citas = citaRepo.findCitasByFilter(idCita, fichaPaciente, pageable);
        }

        if (citas.isEmpty()) {
            return new ResponseEntity<>(Page.empty(), HttpStatus.OK);
        }

        logger.info("200 OK: Citas obtenidas por filtro correctamente");

        return new ResponseEntity<>(citas, HttpStatus.OK);
    }

    // Encontrar horas libres de un Profesional en una fecha especifica.
    @Transactional(readOnly = true)
    public ResponseEntity<List<String>> encontrarHorasLibresProfesional(Long profesionalId, LocalDate fecha,
            HttpServletRequest request) {
        logger.info("encontrarHorasLibresProfesional()");
        logger.info("Encontrando horas libres de Profesional con id {} en una fecha especifica {}", profesionalId,
                fecha.toString());

        EspecialistaDTO especialista = especialistaService.obtenerEspecialistaPorId(profesionalId.intValue());

        if (especialista == null) {
            throw new EntityNotFoundException("Profesional con id " + profesionalId + " no encontrado");
        }

        List<CitaEntity> citasOcupadas = citaRepo.findCitasOcupadasByProfesionalAndFecha(profesionalId, fecha);
        List<LocalTime> horasOcupadas = new ArrayList<>();

        for (CitaEntity cita : citasOcupadas) {
            LocalTime start = cita.getHoraInicio();
            LocalTime end = cita.getHoraFin();
            while (start.isBefore(end)) {
                horasOcupadas.add(start);
                start = start.plusHours(1);
            }
        }

        List<String> horasLibres = new ArrayList<>();

        LocalTime horaInicio = LocalTime.of(8, 0);
        LocalTime horaReceso = LocalTime.of(12, 0);
        LocalTime horaFin = LocalTime.of(17, 0);

        while (horaInicio.isBefore(horaFin)) {
            if (!horasOcupadas.contains(horaInicio) && !horaInicio.equals(horaReceso)) {
                horasLibres.add(horaInicio.format(DateTimeFormatter.ofPattern("HH:mm")));
            }
            // Asumiendo citas de 1 hora de duraciÃ³n.
            horaInicio = horaInicio.plusHours(1);
        }
        logger.info("200 OK: Horas libres encontradas correctamente");
        return new ResponseEntity<>(horasLibres, HttpStatus.OK);
    }

    // Finalizar una Cita.
    @Transactional
    public ResponseEntity<?> finalizarCita(Long idCita) {
        logger.info("finalizarCita()");
        logger.info("Finalizando una Cita");

        CitaEntity cita = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita con id " + idCita + " no encontrada"));

        if (cita.getEstado() != CitaEntity.Estado.PENDIENTE) {
            throw new IllegalArgumentException(
                    "La cita no se puede finalizar porque anteriormente ya ha finalizado o ya fue cancelada");
        }

        cita.setEstado(CitaEntity.Estado.ASISTIDO);
        citaRepo.save(cita);
        logger.info("200 OK: Cita marcada como ASISTIDO correctamente");
        CitaResponse citaResponse = new CitaResponse("Cita marcada como ASISTIDO correctamente");
        return ResponseEntity.ok().body(citaResponse);

    }

    // Cancelar una Cita.
    @Transactional
    public ResponseEntity<?> cancelarCita(Long idCita) {
        logger.info("cancelarCita()");
        logger.info("Cancelando una Cita");

        CitaEntity cita = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita con id " + idCita + " no encontrada"));

        if (cita.getEstado() != CitaEntity.Estado.PENDIENTE) {
            throw new IllegalArgumentException(
                    "La cita no se puede cancelar porque ya ha finalizado o ya fue cancelada");
        }

        cita.setEstado(CitaEntity.Estado.CANCELADA);
        citaRepo.save(cita);
        CitaResponse response = new CitaResponse("Cita cancelada correctamente");

        return ResponseEntity.ok().body(response);
    }

    // Cambiar estado de cita a Falta Justificada.
    @Transactional
    public ResponseEntity<?> faltaJustificada(Long idCita) {
        // Metodo eliminado: faltaJustificada unificado en noAsistido (usar
        // faltaInjustificada logic -> marcarNoAsistido)
        // Manteniendo firma para evitar borrar demasiado, pero podria deprecarse.
        return faltaInjustificada(idCita);
    }

    // Cambiar estado de cita a Falta Injustificada.
    @Transactional
    public ResponseEntity<?> faltaInjustificada(Long idCita) {
        logger.info("faltaInjustificada()");
        logger.info("Cambiando estado de cita a Falta Injustificada");

        CitaEntity cita = citaRepo.findById(idCita)
                .orElseThrow(() -> new EntityNotFoundException("Cita con id " + idCita + " no encontrada"));

        if (cita.getEstado() != CitaEntity.Estado.PENDIENTE && cita.getEstado() != CitaEntity.Estado.NO_ASISTIDO) {
            throw new IllegalArgumentException(
                    "La cita no se puede asignar como NO ASISTIDO porque ya ha finalizado o ya fue cancelada");
        }

        cita.setEstado(CitaEntity.Estado.NO_ASISTIDO);
        citaRepo.save(cita);
        CitaResponse response = new CitaResponse("Cita asignada como NO ASISTIDO correctamente");

        return ResponseEntity.ok().body(response);
    }

    static class CitaResponse {
        private String message;

        public CitaResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // obtener citas filtro unico
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaEntity>> obtenerCitasFiltro(String filtro, Pageable pageable) {
        logger.info("obtenerCitasFiltro()");
        logger.info("Obteniendo citas por filtro");

        Page<CitaEntity> citas = citaRepo.findCitasFiltro(filtro, pageable);

        logger.info("200 OK: Citas obtenidas por filtro correctamente");

        return new ResponseEntity<>(citas, HttpStatus.OK);
    }

    // Obtener citas por Profesional
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaDTO>> obtenerCitasPorProfesional(Long idProfesional, Pageable pageable) {
        logger.info("obtenerCitasPorProfesional()");
        logger.info("Obteniendo citas por Profesional");

        Page<CitaEntity> citas = citaRepo.findAllByProfesionalId(idProfesional, pageable);

        if (citas.isEmpty()) {
            Page<CitaDTO> emptyPage = Page.empty(pageable);
            return new ResponseEntity<>(emptyPage, HttpStatus.OK);
        }

        Page<CitaDTO> dtos = citas.map(cita -> {
            Optional<Paciente> pacienteOpt = pacienteRepo.findById(cita.getFichaPaciente().intValue());
            if (pacienteOpt.isPresent()) {
                PacienteDTO paciente = pacienteService.convertirADTO(pacienteOpt.get());
                EspecialistaDTO especialista = especialistaService
                        .obtenerEspecialistaPorId(cita.getProfesionalId().intValue());
                Especialidad especialidadEntity = cita.getEspecialidad();
                EspecialidadDTO especialidad = new EspecialidadDTO(especialidadEntity.getId(),
                        especialidadEntity.getArea(), null);

                return mapearDTO(cita, paciente, especialista, especialidad);
            } else {
                throw new EntityNotFoundException("Paciente no encontrado para cita " + cita.getIdCita());
            }
        });

        logger.info("200 OK: Citas obtenidas por Profesional correctamente");

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    // Obtener citas por Especialidad (antes Area)
    // Obtener citas por Especialidad (antes Area)
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaDTO>> obtenerCitasPorEspecialidad(Integer idEspecialidad, Pageable pageable) {
        logger.info("obtenerCitasPorEspecialidad()");
        logger.info("Obteniendo citas por Especialidad");

        Page<CitaEntity> citas = citaRepo.findAllByEspecialidad_Id(idEspecialidad, pageable);

        if (citas.isEmpty()) {
            Page<CitaDTO> emptyPage = Page.empty(pageable);
            return new ResponseEntity<>(emptyPage, HttpStatus.OK);
        }

        Page<CitaDTO> dtos = citas.map(cita -> {
            Optional<Paciente> pacienteOpt = pacienteRepo.findById(cita.getFichaPaciente().intValue());
            if (pacienteOpt.isPresent()) {
                PacienteDTO paciente = pacienteService.convertirADTO(pacienteOpt.get());
                EspecialistaDTO especialista = especialistaService
                        .obtenerEspecialistaPorId(cita.getProfesionalId().intValue());
                Especialidad especialidadEntity = cita.getEspecialidad();
                EspecialidadDTO especialidad = new EspecialidadDTO(especialidadEntity.getId(),
                        especialidadEntity.getArea(), null);

                return mapearDTO(cita, paciente, especialista, especialidad);
            } else {
                // Return null or handle error - consistent with obtenerCitas logic which
                // throws/fails?
                // or just skip. internal map lambda requires return.
                logger.warn("Paciente no encontrado para cita " + cita.getIdCita());
                return null;
            }
        });

        logger.info("200 OK: Citas obtenidas por Especialidad correctamente");

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    // Obtener citas por una lista de especialidades (antes areas)
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaEntity>> obtenerCitasPorEspecialidades(List<Integer> especialidades,
            Pageable pageable) {
        logger.info("obtenerCitasPorEspecialidades()");
        logger.info("Obteniendo citas por especialidades");

        List<CitaEntity> allCitas = new ArrayList<>();

        for (Integer espId : especialidades) {
            Page<CitaEntity> citasEsp = citaRepo.findAllByEspecialidad_Id(espId, pageable);
            allCitas.addAll(citasEsp.getContent());
        }

        if (allCitas.isEmpty()) {
            logger.info("No se encontraron citas para las especialidades proporcionadas");
            return new ResponseEntity<>(Page.empty(pageable), HttpStatus.OK);
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allCitas.size());

        if (start > allCitas.size()) {
            return new ResponseEntity<>(Page.empty(pageable), HttpStatus.OK);
        }

        List<CitaEntity> paginatedList = allCitas.subList(start, end);

        Page<CitaEntity> pageCitas = new PageImpl<>(paginatedList, pageable, allCitas.size());

        logger.info("200 OK: Citas obtenidas por especialidades correctamente");
        return new ResponseEntity<>(pageCitas, HttpStatus.OK);
    }

    // Obtener citas por paciente
    @Transactional(readOnly = true)
    public ResponseEntity<Page<CitaEntity>> obtenerCitasPorPaciente(Long idPaciente, Pageable pageable) {
        logger.info("obtenerCitasPorPaciente()");
        logger.info("Obteniendo citas por Paciente");

        Page<CitaEntity> citas = citaRepo.findAllByFichaPaciente(idPaciente, pageable);

        logger.info("200 OK: Citas obtenidas por Paciente correctamente");

        return new ResponseEntity<>(citas, HttpStatus.OK);
    }

    // Obtener citas por paciente Completa
    public ResponseEntity<Page<VistaCitasCompleta>> obtenerCitasCompletasPorPaciente(int idPaciente,
            Pageable pageable) {
        Page<VistaCitasCompleta> citas = vistaCitasCompletaRepository.findByFichaPaciente(idPaciente, pageable);
        return new ResponseEntity<>(citas, HttpStatus.OK);

    }
}
