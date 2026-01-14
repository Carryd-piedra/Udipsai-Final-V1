package com.ucacue.udipsai.modules.permisos;

import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.pasante.repository.PasanteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PermisoService {

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private PasanteRepository pasanteRepository;

    public PermisosDTO obtenerPermisosEspecialista(Integer id) {
        Especialista especialista = especialistaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialista no encontrado"));
        return mapToDTO(especialista.getPermisos());
    }

    public PermisosDTO obtenerPermisosPasante(Integer id) {
        Pasante pasante = pasanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pasante no encontrado"));
        return mapToDTO(pasante.getPermisos());
    }

    @Transactional
    public PermisosDTO actualizarPermisosEspecialista(Integer id, PermisosDTO dto) {
        Especialista especialista = especialistaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Especialista no encontrado"));
        
        if (especialista.getPermisos() == null) {
            especialista.setPermisos(new Permisos());
        }
        
        updatePermisosFromDTO(especialista.getPermisos(), dto);
        especialistaRepository.save(especialista);
        return mapToDTO(especialista.getPermisos());
    }

    @Transactional
    public PermisosDTO actualizarPermisosPasante(Integer id, PermisosDTO dto) {
        Pasante pasante = pasanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pasante no encontrado"));

        if (pasante.getPermisos() == null) {
            pasante.setPermisos(new Permisos());
        }

        updatePermisosFromDTO(pasante.getPermisos(), dto);
        pasanteRepository.save(pasante);
        return mapToDTO(pasante.getPermisos());
    }

    private PermisosDTO mapToDTO(Permisos entity) {
        if (entity == null) return new PermisosDTO(); // Return empty defaults if null
        PermisosDTO dto = new PermisosDTO();
        dto.setId(entity.getId());
        dto.setPacientes(entity.getPacientes());
        dto.setPasantes(entity.getPasantes());
        dto.setSedes(entity.getSedes());
        dto.setEspecialistas(entity.getEspecialistas());
        dto.setEspecialidades(entity.getEspecialidades());
        dto.setAsignaciones(entity.getAsignaciones());
        dto.setRecursos(entity.getRecursos());
        dto.setInstitucionesEducativas(entity.getInstitucionesEducativas());
        dto.setHistoriaClinica(entity.getHistoriaClinica());
        dto.setFonoAudiologia(entity.getFonoAudiologia());
        dto.setPsicologiaClinica(entity.getPsicologiaClinica());
        dto.setPsicologiaEducativa(entity.getPsicologiaEducativa());
        return dto;
    }

    private void updatePermisosFromDTO(Permisos entity, PermisosDTO dto) {
        if (dto.getPacientes() != null) entity.setPacientes(dto.getPacientes());
        if (dto.getPasantes() != null) entity.setPasantes(dto.getPasantes());
        if (dto.getSedes() != null) entity.setSedes(dto.getSedes());
        if (dto.getEspecialistas() != null) entity.setEspecialistas(dto.getEspecialistas());
        if (dto.getEspecialidades() != null) entity.setEspecialidades(dto.getEspecialidades());
        if (dto.getAsignaciones() != null) entity.setAsignaciones(dto.getAsignaciones());
        if (dto.getRecursos() != null) entity.setRecursos(dto.getRecursos());
        if (dto.getInstitucionesEducativas() != null) entity.setInstitucionesEducativas(dto.getInstitucionesEducativas());
        if (dto.getHistoriaClinica() != null) entity.setHistoriaClinica(dto.getHistoriaClinica());
        if (dto.getFonoAudiologia() != null) entity.setFonoAudiologia(dto.getFonoAudiologia());
        if (dto.getPsicologiaClinica() != null) entity.setPsicologiaClinica(dto.getPsicologiaClinica());
        if (dto.getPsicologiaEducativa() != null) entity.setPsicologiaEducativa(dto.getPsicologiaEducativa());
    }
}
