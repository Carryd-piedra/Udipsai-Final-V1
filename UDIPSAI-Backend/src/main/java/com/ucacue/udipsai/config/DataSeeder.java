package com.ucacue.udipsai.config;

import com.ucacue.udipsai.modules.especialistas.domain.Especialista;
import com.ucacue.udipsai.modules.especialistas.repository.EspecialistaRepository;
import com.ucacue.udipsai.modules.permisos.Permisos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EspecialistaRepository especialistaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Buscar si ya existe el admin
        java.util.Optional<Especialista> adminOpt = especialistaRepository.findByCedula("0101010101");

        Especialista admin;
        Permisos adminPermisos;

        if (adminOpt.isPresent()) {
            // Si existe, actualizamos sus permisos
            admin = adminOpt.get();
            adminPermisos = admin.getPermisos();
            if (adminPermisos == null) {
                adminPermisos = new Permisos();
            }
            System.out.println("Actualizando permisos del ADMINISTRADOR (0101010101)...");
        } else {
            // Si no existe, lo creamos
            admin = new Especialista();
            admin.setCedula("0101010101");
            admin.setNombresApellidos("Administrador Inicial");
            admin.setContrasenia(passwordEncoder.encode("admin123"));
            admin.setActivo(true);

            adminPermisos = new Permisos();
            System.out.println("Creando ADMINISTRADOR (0101010101) por defecto...");
        }

        // Configurar TODOS los permisos a TRUE (Granulares y Generales)
        adminPermisos.setPacientes(true);
        adminPermisos.setPacientesCrear(true);
        adminPermisos.setPacientesEditar(true);
        adminPermisos.setPacientesEliminar(true);

        adminPermisos.setPasantes(true);
        adminPermisos.setPasantesCrear(true);
        adminPermisos.setPasantesEditar(true);
        adminPermisos.setPasantesEliminar(true);

        adminPermisos.setSedes(true);
        adminPermisos.setSedesCrear(true);
        adminPermisos.setSedesEditar(true);
        adminPermisos.setSedesEliminar(true);

        adminPermisos.setEspecialistas(true);
        adminPermisos.setEspecialistasCrear(true);
        adminPermisos.setEspecialistasEditar(true);
        adminPermisos.setEspecialistasEliminar(true);

        adminPermisos.setEspecialidades(true);
        adminPermisos.setEspecialidadesCrear(true);
        adminPermisos.setEspecialidadesEditar(true);
        adminPermisos.setEspecialidadesEliminar(true);

        adminPermisos.setAsignaciones(true);
        adminPermisos.setAsignacionesCrear(true);
        adminPermisos.setAsignacionesEditar(true);
        adminPermisos.setAsignacionesEliminar(true);

        adminPermisos.setRecursos(true);
        adminPermisos.setRecursosCrear(true);
        adminPermisos.setRecursosEditar(true);
        adminPermisos.setRecursosEliminar(true);

        adminPermisos.setInstitucionesEducativas(true);
        adminPermisos.setInstitucionesEducativasCrear(true);
        adminPermisos.setInstitucionesEducativasEditar(true);
        adminPermisos.setInstitucionesEducativasEliminar(true);

        adminPermisos.setHistoriaClinica(true);
        adminPermisos.setHistoriaClinicaCrear(true);
        adminPermisos.setHistoriaClinicaEditar(true);
        adminPermisos.setHistoriaClinicaEliminar(true);

        adminPermisos.setFonoAudiologia(true);
        adminPermisos.setFonoAudiologiaCrear(true);
        adminPermisos.setFonoAudiologiaEditar(true);
        adminPermisos.setFonoAudiologiaEliminar(true);

        adminPermisos.setPsicologiaClinica(true);
        adminPermisos.setPsicologiaClinicaCrear(true);
        adminPermisos.setPsicologiaClinicaEditar(true);
        adminPermisos.setPsicologiaClinicaEliminar(true);

        adminPermisos.setPsicologiaEducativa(true);
        adminPermisos.setPsicologiaEducativaCrear(true);
        adminPermisos.setPsicologiaEducativaEditar(true);
        adminPermisos.setPsicologiaEducativaEliminar(true);

        // Guardar cambios
        admin.setPermisos(adminPermisos);
        especialistaRepository.save(admin);

        System.out.println("------------------------------------------------");
        System.out.println("ADMINISTRADOR ACTUALIZADO/CREADO EXITOSAMENTE");
        System.out.println("------------------------------------------------");
    }
}
