import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

interface HistoriaPrenatalProps {
  data: {
    embarazoNumero: number;
    controlesEco: boolean;
    hijosVivos: number;
    segSemestreAborto: boolean;
    segSemestreAmenaza: boolean;
    alimentacion: boolean;
    ingestaMedicamentos: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const HistoriaPrenatalForm: React.FC<HistoriaPrenatalProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Número de Embarazo</Label>
        <Input
          type="number"
          value={data.embarazoNumero}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("embarazoNumero", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Hijos Vivos</Label>
        <Input
          type="number"
          value={data.hijosVivos}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("hijosVivos", Number(e.target.value))
          }
        />
      </div>
      <div className="space-y-4">
        <Switch
          label="¿Controles Eco?"
          checked={data.controlesEco}
          onChange={(checked: boolean) => onChange("controlesEco", checked)}
        />
      </div>
      <div className="space-y-4">
        <Switch
          label="¿Aborto/Amenaza 2do Semestre?"
          checked={data.segSemestreAborto}
          onChange={(checked: boolean) =>
            onChange("segSemestreAborto", checked)
          }
        />
        <Switch
          label="¿Buena Alimentación?"
          checked={data.alimentacion}
          onChange={(checked: boolean) => onChange("alimentacion", checked)}
        />
        <Switch
          label="¿Ingesta Medicamentos?"
          checked={data.ingestaMedicamentos}
          onChange={(checked: boolean) =>
            onChange("ingestaMedicamentos", checked)
          }
        />
      </div>
    </div>
  );
};

export default HistoriaPrenatalForm;
