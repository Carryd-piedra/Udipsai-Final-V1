package com.ucacue.udipsai.modules.historiaclinica.domain.components;

import com.ucacue.udipsai.modules.historiaclinica.domain.HistoriaClinica.*;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Embeddable
@Data
public class HistoriaNatal {

    @Enumerated(EnumType.STRING)
    @Column(name = "parto")
    private Parto parto;

    @Enumerated(EnumType.STRING)
    @Column(name = "llanto_al_nacer")
    private LlantoAlNacer llantoAlNacer;

    @Column(name = "color_piel_nacimiento")
    private String colorPielNacimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "cordon_ombilical")
    private CordonOmbilical cordonOmbilical;

    @Enumerated(EnumType.STRING)
    @Column(name = "presencia_ictericia")
    private PresenciaIctericia presenciaIctericia;

    @Enumerated(EnumType.STRING)
    @Column(name = "transfucion_sangre")
    private TransfucionSangre transfucionSangre;
}
