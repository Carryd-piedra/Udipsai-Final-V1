package com.ucacue.udipsai.modules.fonoaudiologia.domain;

import com.ucacue.udipsai.modules.paciente.domain.Paciente;
import com.ucacue.udipsai.modules.fonoaudiologia.domain.components.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fonoaudiologia_registros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fonoaudiologia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id")
    private Paciente paciente;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // --- Componentes @Embeddable ---
    
    @Embedded
    private Habla habla;

    @Embedded
    private Audicion audicion;

    @Embedded
    private Fonacion fonacion;

    @Embedded
    private HistoriaAuditiva historiaAuditiva;

    @Embedded
    private Vestibular vestibular;

    @Embedded
    private Otoscopia otoscopia;


    // --- Enums ---

    public enum ComunicacionPreferentementeForma {
        VERBAL, GESTUAL, MIXTA
    }

    public enum GradoPerdida {
        SÚBITA, PROGRESIVA
    }

    public enum Permanecia {
        TEMPORAL, FLUCTUANTE, PERMANENTE
    }

    public enum TipoOtitis {
        MEDIO, AGUDO
    }

    public enum GradoPermanenciaOtalgia {
        MEDIA, AGUDA, CRÓNICA
    }

    public enum GradoPermanenciaOtorrea {
        MEDIA, AGUDA, CRÓNICA
    }

    public enum ConQueOidoEscuchaMejor {
        AMBOS, DERECHO, IZQUIERDO
    }

    public enum HaceCuantoTiempoPresentaSintomasAuditivos {
        DÍAS, SEMANAS, MESES, AÑOS
    }

    public enum CuandoMareos {
        SIEMPRE, A_VECES, AL_CAMINAR, AL_PARARSE
    }

    public enum PalpacionOido {
        NORMAL, DOLOR, INFLAMADA
    }

    public enum CAEOido {
        NORMAL, IRRITADO, SUPURACION, INFLAMADO
    }

    public enum ObstruccionOido {
        SI, NO, TOTAL, PARCIAL
    }

    public enum AparienciaMenbranaTimpanica {
        NORMAL, IRRITADO, SUPURACION, INFLAMADA
    }

    public enum ColoracionOido {
        NORMAL, AZUL, ERITEMATOSA, OPACA
    }
}
