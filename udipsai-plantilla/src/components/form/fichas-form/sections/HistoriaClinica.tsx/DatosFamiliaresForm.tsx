import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

interface DatosFamiliaresProps {
  data: {
    procedenciaPadre: string;
    procedenciaMadre: string;
    edadMadreAlNacimiento: string;
    edadPadreAlNacimiento: string;
    consanguinidad: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const DatosFamiliaresForm: React.FC<DatosFamiliaresProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Procedencia del Padre</Label>
        <Input
          value={data.procedenciaPadre}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("procedenciaPadre", e.target.value)
          }
          placeholder="Ingrese procedencia"
        />
      </div>
      <div>
        <Label>Procedencia de la Madre</Label>
        <Input
          value={data.procedenciaMadre}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("procedenciaMadre", e.target.value)
          }
          placeholder="Ingrese procedencia"
        />
      </div>
      <div>
        <Label>Edad de la madre al nacimiento</Label>
        <Input
          type="number"
          value={data.edadMadreAlNacimiento}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadMadreAlNacimiento", e.target.value)
          }
          placeholder="Edad"
        />
      </div>
      <div>
        <Label>Edad del padre al nacimiento</Label>
        <Input
          type="number"
          value={data.edadPadreAlNacimiento}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadPadreAlNacimiento", e.target.value)
          }
          placeholder="Edad"
        />
      </div>
      <div className="flex items-center">
        <Switch
          label="Consanguinidad"
          checked={data.consanguinidad}
          onChange={(checked: boolean) => onChange("consanguinidad", checked)}
        />
      </div>
    </div>
  );
};

export default DatosFamiliaresForm;
