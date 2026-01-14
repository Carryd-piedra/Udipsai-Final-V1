import React from "react";
import Label from "../../../Label";
import Select from "../../../Select";

interface HistoriaNatalProps {
  data: {
    parto: string;
    llantoAlNacer: string;
    colorPielNacimiento: string;
    cordonOmbilical: string;
    presenciaIctericia: string;
    transfucionSangre: string;
  };
  onChange: (field: string, value: any) => void;
}

const HistoriaNatalForm: React.FC<HistoriaNatalProps> = ({
  data,
  onChange,
}) => {
  const optionsParto = [
    { value: "NORMAL", label: "Normal" },
    { value: "CESÁREA", label: "Cesárea" },
  ];

  const optionsLlanto = [
    { value: "INMEDIATO", label: "Inmediato" },
    { value: "AL_ESTÍMULO", label: "Al estímulo" },
    { value: "DEMORADO", label: "Demorado" },
  ];

  const optionsCordon = [
    { value: "CUELLO", label: "En el cuello" },
    { value: "CUERPO", label: "En el cuerpo" },
    { value: "OTRO", label: "Otro" },
  ];

  const optionsSiNo = [
    { value: "SI", label: "Sí" },
    { value: "NO", label: "No" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Tipo de Parto</Label>
        <Select
          options={optionsParto}
          value={data.parto}
          onChange={(val: string) => onChange("parto", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Llanto al nacer</Label>
        <Select
          options={optionsLlanto}
          value={data.llantoAlNacer}
          onChange={(val: string) => onChange("llantoAlNacer", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Color de piel al nacer</Label>
        <Select
          options={[
            { value: "NORMOCROMICO", label: "Normocrómico" },
            { value: "CIANOTICO", label: "Cianótico" },
            { value: "ICTERICO", label: "Ictérico" },
          ]}
          value={data.colorPielNacimiento}
          onChange={(val: string) => onChange("colorPielNacimiento", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Cordón umbilical</Label>
        <Select
          options={optionsCordon}
          value={data.cordonOmbilical}
          onChange={(val: string) => onChange("cordonOmbilical", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Presencia de Ictericia</Label>
        <Select
          options={optionsSiNo}
          value={data.presenciaIctericia}
          onChange={(val: string) => onChange("presenciaIctericia", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Transfusión de Sangre</Label>
        <Select
          options={optionsSiNo}
          value={data.transfucionSangre}
          onChange={(val: string) => onChange("transfucionSangre", val)}
          placeholder="Seleccione..."
        />
      </div>
    </div>
  );
};

export default HistoriaNatalForm;
