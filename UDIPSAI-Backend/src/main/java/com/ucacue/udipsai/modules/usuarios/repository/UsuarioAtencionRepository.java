package com.ucacue.udipsai.modules.usuarios.repository;

import com.ucacue.udipsai.modules.usuarios.domain.UsuarioAtencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioAtencionRepository extends JpaRepository<UsuarioAtencion, Integer> {
    Optional<UsuarioAtencion> findById(Integer id);

    Optional<UsuarioAtencion> findByCedula(String cedula);
}
