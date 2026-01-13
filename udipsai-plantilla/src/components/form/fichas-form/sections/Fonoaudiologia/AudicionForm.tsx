import React from "react";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";
import Input from "../../../input/InputField";
import DatePicker from "../../../date-picker";

interface AudicionFormProps {
  data: {
    seARealizadoExamenAudiologico: boolean;
    perdidaAuditivaConductivaNeurosensorial: boolean;
    hipoacusiaConductivaBilateral: boolean;
    hipoacusiaConductivaUnilateral: boolean;
    hipoacusiaNeurosensorialBilateral: boolean;
    hipoacusiaNeurosensorialUnilateral: boolean;
    infeccionesOidoFuertes: boolean;
    cualInfeccionesOidoFuertes: string;
    edadInfeccionesOidoFuertes: number;
    perdidaAuditiva: boolean;
    unilateral: boolean;
    oidoDerecho: boolean;
    oidoIzquierdo: boolean;
    bilateral: boolean;
    gradoPerdida: string;
    permanecia: string;
    otitis: boolean;
    tipoOtitis: string;
    duracionOtitisInicio: string;
    duracionOtitisFin: string;
    antecedentesFamiliares: boolean;
    exposisionRuidos: boolean;
    duracionExposisionRuidosInicio: string;
    duracionExposisionRuidosFin: string;
    ototoxicos: boolean;
    infecciones: boolean;
    usoAudifonos: boolean;
    inicioUsoAudifonos: string;
    finUsoAudifonos: string;
    implanteCoclear: boolean;
    tratamientoFonoaudiologicoPrevio: boolean;
    atenidoPerdidaAudicionPasado: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const AudicionForm: React.FC<AudicionFormProps> = ({ data, onChange }) => {
  const optionsGradoPerdida = [
    { value: "SÚBITA", label: "Súbita" },
    { value: "PROGRESIVA", label: "Progresiva" },
  ];

  const optionsPermanencia = [
    { value: "TEMPORAL", label: "Temporal" },
    { value: "FLUCTUANTE", label: "Fluctuante" },
    { value: "PERMANENTE", label: "Permanente" },
  ];

  const optionsTipoOtitis = [
    { value: "MEDIO", label: "Medio" },
    { value: "AGUDO", label: "Agudo" },
  ];

  const handleDateChange = (name: string, dates: Date[]) => {
    if (dates.length > 0) {
      onChange(name, dates[0].toISOString());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Exámenes e Hipoacusia
        </h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Switch
              label="Se ha realizado examen audiológico"
              checked={data.seARealizadoExamenAudiologico}
              onChange={(val: boolean) =>
                onChange("seARealizadoExamenAudiologico", val)
              }
            />
            <Switch
              label="Pérdida auditiva conductiva neurosensorial"
              checked={data.perdidaAuditivaConductivaNeurosensorial}
              onChange={(val: boolean) =>
                onChange("perdidaAuditivaConductivaNeurosensorial", val)
              }
            />
            <Switch
              label="Hipoacusia conductiva bilateral"
              checked={data.hipoacusiaConductivaBilateral}
              onChange={(val: boolean) =>
                onChange("hipoacusiaConductivaBilateral", val)
              }
            />
            <Switch
              label="Hipoacusia conductiva unilateral"
              checked={data.hipoacusiaConductivaUnilateral}
              onChange={(val: boolean) =>
                onChange("hipoacusiaConductivaUnilateral", val)
              }
            />
            <Switch
              label="Hipoacusia neurosensorial bilateral"
              checked={data.hipoacusiaNeurosensorialBilateral}
              onChange={(val: boolean) =>
                onChange("hipoacusiaNeurosensorialBilateral", val)
              }
            />
            <Switch
              label="Hipoacusia neurosensorial unilateral"
              checked={data.hipoacusiaNeurosensorialUnilateral}
              onChange={(val: boolean) =>
                onChange("hipoacusiaNeurosensorialUnilateral", val)
              }
            />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Infecciones de Oído
        </h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="flex items-center">
            <Switch

              label="Infecciones oido fuertes"
              checked={data.infeccionesOidoFuertes}
              onChange={(val: boolean) =>
                onChange("infeccionesOidoFuertes", val)
              }
            />
          </div>
            <div>
              <Label htmlFor="cualInfeccionesOidoFuertes">¿Cuál?</Label>
              <Input
                id="cualInfeccionesOidoFuertes"
                value={data.cualInfeccionesOidoFuertes}
                onChange={(e) =>
                  onChange("cualInfeccionesOidoFuertes", e.target.value)
                }
                disabled={!data.infeccionesOidoFuertes}
                placeholder="Especifique..."
              />
            </div>
            <div>
              <Label htmlFor="edadInfeccionesOidoFuertes">Edad</Label>
              <Input
                id="edadInfeccionesOidoFuertes"
                type="number"
                value={data.edadInfeccionesOidoFuertes}
                onChange={(e) =>
                  onChange("edadInfeccionesOidoFuertes", Number(e.target.value))
                }
                disabled={!data.infeccionesOidoFuertes}
              />
            </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Detalle de Pérdida Auditiva
        </h4>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Switch
              label="Pérdida auditiva"
              checked={data.perdidaAuditiva}
              onChange={(val: boolean) => onChange("perdidaAuditiva", val)}
            />
            <Switch
              label="Unilateral"
              checked={data.unilateral}
              onChange={(val: boolean) => onChange("unilateral", val)}
            />
            <Switch
              label="Oido Derecho"
              checked={data.oidoDerecho}
              onChange={(val: boolean) => onChange("oidoDerecho", val)}
            />
            <Switch
              label="Oido Izquierdo"
              checked={data.oidoIzquierdo}
              onChange={(val: boolean) => onChange("oidoIzquierdo", val)}
            />
            <Switch
              label="Bilateral"
              checked={data.bilateral}
              onChange={(val: boolean) => onChange("bilateral", val)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6">
            <div>
              <Label htmlFor="gradoPerdida">Grado pérdida</Label>
              <Select
                options={optionsGradoPerdida}
                value={data.gradoPerdida}
                onChange={(val: string) => onChange("gradoPerdida", val)}
              />
            </div>
            <div>
              <Label htmlFor="permanecia">Permanencia</Label>
              <Select
                options={optionsPermanencia}
                value={data.permanecia}
                onChange={(val: string) => onChange("permanecia", val)}
              />
            </div>
          </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Otitis y Otros Antecedentes
        </h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Switch
              label="Presenta Otitis"
              checked={data.otitis}
              onChange={(val: boolean) => onChange("otitis", val)}
            />
            {data.otitis && (
              <div>
                <Label htmlFor="tipoOtitis">Tipo Otitis</Label>
                <Select
                  options={optionsTipoOtitis}
                  value={data.tipoOtitis}
                  onChange={(val: string) => onChange("tipoOtitis", val)}
                />
              </div>
            )}
              <DatePicker
                id="duracionOtitisInicio"
                label="Inicio Otitis"
                defaultDate={data.duracionOtitisInicio}
                onChange={(dates) =>
                  handleDateChange("duracionOtitisInicio", dates)
                }
              />
              <DatePicker
                id="duracionOtitisFin"
                label="Fin Otitis"
                defaultDate={data.duracionOtitisFin}
                onChange={(dates) =>
                  handleDateChange("duracionOtitisFin", dates)
                }
              />
          </div>
          <div className="grid grid-cols-1 pt-6 gap-4 sm:grid-cols-3">
            <Switch
              label="Antecedentes familiares"
              checked={data.antecedentesFamiliares}
              onChange={(val: boolean) =>
                onChange("antecedentesFamiliares", val)
              }
            />
            <Switch
              label="Exposición ruidos"
              checked={data.exposisionRuidos}
              onChange={(val: boolean) => onChange("exposisionRuidos", val)}
            />
            <Switch
              label="Ototóxicos"
              checked={data.ototoxicos}
              onChange={(val: boolean) => onChange("ototoxicos", val)}
            />
            <Switch
              label="Infecciones"
              checked={data.infecciones}
              onChange={(val: boolean) => onChange("infecciones", val)}
            />
          </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Ayudas Auditivas y Tratamientos
        </h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Switch
              label="Uso audífonos"
              checked={data.usoAudifonos}
              onChange={(val: boolean) => onChange("usoAudifonos", val)}
            />
              <DatePicker
                id="inicioUsoAudifonos"
                label="Inicio Audífonos"
                defaultDate={data.inicioUsoAudifonos}
                onChange={(dates) =>
                  handleDateChange("inicioUsoAudifonos", dates)
                }
                placeholder="Seleccione fecha"
              />
              <DatePicker
                id="finUsoAudifonos"
                label="Fin Audífonos"
                defaultDate={data.finUsoAudifonos}
                onChange={(dates) => handleDateChange("finUsoAudifonos", dates)}
                placeholder="Seleccione fecha"
              />
            <Switch
              label="Implante coclear"
              checked={data.implanteCoclear}
              onChange={(val: boolean) => onChange("implanteCoclear", val)}
            />
            <Switch
              label="Tratamiento previo"
              checked={data.tratamientoFonoaudiologicoPrevio}
              onChange={(val: boolean) =>
                onChange("tratamientoFonoaudiologicoPrevio", val)
              }
            />
            <Switch
              label="Atendido en pasado"
              checked={data.atenidoPerdidaAudicionPasado}
              onChange={(val: boolean) =>
                onChange("atenidoPerdidaAudicionPasado", val)
              }
            />
          </div>
        </div>
    </div>
  );
};

export default AudicionForm;
