package com.ucacue.udipsai.modules.historiaclinica.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;

import com.ucacue.udipsai.modules.historiaclinica.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "historias_clinicas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id")
    private Paciente paciente;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    @Column(name = "genograma_url")
    private String genogramaUrl;

    // --- Componentes @Embeddable ---

    @Embedded
    private DatosFamiliares datosFamiliares;

    @Embedded
    private HistoriaPrenatal historiaPrenatal;

    @Embedded
    private HistoriaNatal historiaNatal;

    @Embedded
    private HistoriaPostnatal historiaPostnatal;

    @Embedded
    private DesarrolloMotor desarrolloMotor;

    @Embedded
    private Alimentacion alimentacion;

    @Embedded
    private AntecedentesMedicos antecedentesMedicos;

    // --- Enums ---

    public enum Parto {
        NORMAL, CESÁREA
    }

    public enum LlantoAlNacer {
        INMEDIATO, AL_ESTÍMULO, DEMORADO
    }

    public enum CordonOmbilical {
        CUELLO, CUERPO, OTRO
    }

    public enum PresenciaIctericia {
        SI, NO
    }

    public enum TransfucionSangre {
        SI, NO
    }
}
