package com.ucacue.udipsai.modules.documentos.repository;

import com.ucacue.udipsai.modules.documentos.domain.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Integer> {
}
