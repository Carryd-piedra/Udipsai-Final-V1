package com.ucacue.udipsai.modules.psicologiaeducativa.domain.components;

import com.ucacue.udipsai.modules.psicologiaeducativa.domain.PsicologiaEducativa.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Embeddable
@Data
public class HistoriaEscolar {

    @Column(name = "asignaturas_gustan")
    private String asignaturasGustan;

    @Column(name = "asignaturas_disgustan")
    private String asignaturasDisgustan;

    @Enumerated(EnumType.STRING)
    @Column(name = "relacion_docentes")
    private RelacionDocentes relacionDocentes;

    @Column(name = "causa_relacion_docentes")
    private String causaRelacionDocentes;

    @Column(name = "gusta_ir_institucion")
    private Boolean gustaIrInstitucion;

    @Column(name = "causa_gusta_ir_institucion")
    private String causaGustaIrInstitucion;

    @Enumerated(EnumType.STRING)
    @Column(name = "relacion_con_grupo")
    private RelacionConGrupo relacionConGrupo;

    @Column(name = "causa_relacion_con_grupo")
    private String causaRelacionConGrupo;
}
