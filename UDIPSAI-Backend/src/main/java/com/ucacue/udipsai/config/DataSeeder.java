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
        if (especialistaRepository.count() == 0) {
            Permisos adminPermisos = new Permisos();
            adminPermisos.setPacientes(true);
            adminPermisos.setPasantes(true);
            adminPermisos.setSedes(true);
            adminPermisos.setEspecialistas(true);
            adminPermisos.setEspecialidades(true);
            adminPermisos.setAsignaciones(true);
            adminPermisos.setRecursos(true);
            adminPermisos.setInstitucionesEducativas(true);
            adminPermisos.setHistoriaClinica(true);
            adminPermisos.setFonoAudiologia(true);
            adminPermisos.setPsicologiaClinica(true);
            adminPermisos.setPsicologiaEducativa(true);

            Especialista admin = new Especialista();
            admin.setCedula("0101010101");
            admin.setNombresApellidos("Administrador Inicial");
            admin.setContrasenia(passwordEncoder.encode("admin123"));
            admin.setActivo(true);
            admin.setPermisos(adminPermisos);

            especialistaRepository.save(admin);
            System.out.println("------------------------------------------------");
            System.out.println("ADMINISTRADOR INICIAL CREADO CON PERMISOS");
            System.out.println("Cédula: 0101010101");
            System.out.println("Contraseña: admin123");
            System.out.println("------------------------------------------------");
        }
    }
}
