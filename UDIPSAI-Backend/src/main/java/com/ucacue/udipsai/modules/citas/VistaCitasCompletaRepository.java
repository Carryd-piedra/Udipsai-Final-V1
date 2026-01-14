package com.ucacue.udipsai.modules.citas;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ucacue.udipsai.modules.citas.VistaCitasCompleta;

public interface VistaCitasCompletaRepository extends JpaRepository<VistaCitasCompleta, Integer> {
    Page<VistaCitasCompleta> findByFichaPaciente(Integer fichaPaciente, Pageable pageable);
}