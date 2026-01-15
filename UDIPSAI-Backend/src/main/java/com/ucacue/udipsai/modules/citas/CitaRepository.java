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

        boolean existsByEstadoAndFechaAndHoraInicioAndUsuarioAtencion_Id(CitaEntity.Estado estado, LocalDate fecha,
                        LocalTime hora,
                        Integer usuarioAtencionId);

        Page<CitaEntity> findAll(Pageable pageable);

        Page<CitaEntity> findAllByFichaPaciente(Long id, Pageable pageable);

        Page<CitaEntity> findAllByUsuarioAtencion_Id(Integer usuarioAtencionId, Pageable pageable);

        Page<CitaEntity> findAllByEspecialidad_Id(Integer especialidadId, Pageable pageable);

        Page<CitaEntity> findAllByEstado(CitaEntity.Estado estado, Pageable pageable);

        Page<CitaEntity> findAllByFecha(LocalDate fecha, Pageable pageable);

        @Query("SELECT c FROM CitaEntity c WHERE " +
                        "(:idCita IS NULL OR c.idCita = :idCita) AND " +
                        "(:fichaPaciente IS NULL OR c.fichaPaciente = :fichaPaciente)")
        Page<CitaEntity> findCitasByFilter(@Param("idCita") Long idCita, @Param("fichaPaciente") Long fichaPaciente,
                        Pageable pageable);

        @Query("SELECT c FROM CitaEntity c WHERE c.usuarioAtencion.id = :usuarioAtencionId AND c.fecha = :fecha AND c.estado != 'CANCELADA'")
        List<CitaEntity> findCitasOcupadasByProfesionalAndFecha(Integer usuarioAtencionId, LocalDate fecha);

        List<CitaEntity> findAllByEstadoAndFechaBefore(CitaEntity.Estado estado, LocalDate fecha);

        // Obtener citas por filtro.
        @Query("SELECT c FROM CitaEntity c WHERE " +
                        "(:filtro IS NULL OR CAST(c.fichaPaciente AS string) LIKE %:filtro%)")
        Page<CitaEntity> findCitasFiltro(@Param("filtro") String filtro, Pageable pageable);

        // Count methods for dashboard
        // Count methods for dashboard
        long countByUsuarioAtencion_IdAndFecha(Integer usuarioAtencionId, LocalDate fecha);

        long countByUsuarioAtencion_IdAndEstado(Integer usuarioAtencionId, CitaEntity.Estado estado);

}
