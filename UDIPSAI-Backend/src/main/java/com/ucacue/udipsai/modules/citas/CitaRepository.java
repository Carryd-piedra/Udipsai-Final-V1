package com.ucacue.udipsai.modules.citas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/*
 * Repositorio de la entidad Cita.
*/
@Repository
public interface CitaRepository extends JpaRepository<CitaEntity, Long> {
        Optional<CitaEntity> findById(Long id);

        boolean existsByEstadoAndFechaAndHoraInicioAndFichaPaciente(CitaEntity.Estado estado, LocalDate fecha,
                        LocalTime hora,
                        Long fichaPaciente);

        boolean existsByEstadoAndFechaAndHoraInicioAndProfesionalId(CitaEntity.Estado estado, LocalDate fecha,
                        LocalTime hora,
                        Long profesionalId);

        Page<CitaEntity> findAll(Pageable pageable);

        Page<CitaEntity> findAllByFichaPaciente(Long id, Pageable pageable);

        Page<CitaEntity> findAllByProfesionalId(Long profesionalId, Pageable pageable);

        Page<CitaEntity> findAllByEspecialidad_Id(Integer especialidadId, Pageable pageable);

        Page<CitaEntity> findAllByEstado(CitaEntity.Estado estado, Pageable pageable);

        Page<CitaEntity> findAllByFecha(LocalDate fecha, Pageable pageable);

        @Query("SELECT c FROM CitaEntity c WHERE " +
                        "(:idCita IS NULL OR c.idCita = :idCita) AND " +
                        "(:fichaPaciente IS NULL OR c.fichaPaciente = :fichaPaciente)")
        Page<CitaEntity> findCitasByFilter(@Param("idCita") Long idCita, @Param("fichaPaciente") Long fichaPaciente,
                        Pageable pageable);

        @Query("SELECT c.horaInicio FROM CitaEntity c WHERE c.profesionalId = :profesionalId AND c.fecha = :fecha AND c.estado = 'PENDIENTE'")
        List<LocalTime> findHorasOcupadasByProfesionalAndFecha(Long profesionalId, LocalDate fecha);

        // Obtener citas por filtro.
        @Query("SELECT c FROM CitaEntity c WHERE " +
                        "(:filtro IS NULL OR CAST(c.fichaPaciente AS string) LIKE %:filtro%)")
        Page<CitaEntity> findCitasFiltro(@Param("filtro") String filtro, Pageable pageable);

}
