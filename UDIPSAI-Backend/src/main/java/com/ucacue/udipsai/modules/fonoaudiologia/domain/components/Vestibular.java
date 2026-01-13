package com.ucacue.udipsai.modules.fonoaudiologia.domain.components;

import com.ucacue.udipsai.modules.fonoaudiologia.domain.Fonoaudiologia.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Embeddable
@Data
public class Vestibular {

    @Column(name = "falta_equilibrio_caminar")
    private Boolean faltaEquilibrioCaminar;

    @Column(name = "mareos")
    private Boolean mareos;

    @Enumerated(EnumType.STRING)
    @Column(name = "cuando_mareos")
    private CuandoMareos cuandoMareos;

    @Column(name = "vertigo")
    private Boolean vertigo;
}
