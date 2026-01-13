import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";

interface DesarrolloMotorProps {
  data: {
    sostuvoLaCabeza: number;
    seSentoSolo: number;
    seParoSolo: number;
    caminoSolo: number;
    inicioGateo: number;
    tipoGateo: string;
    edadesSonrisaSocial: number;
    edadesBalbuceo: number;
    edadesPrimerasFrases: number;
  };
  onChange: (field: string, value: any) => void;
}

const DesarrolloMotorForm: React.FC<DesarrolloMotorProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Edad sostuvo la cabeza (meses)</Label>
        <Input
          type="number"
          value={data.sostuvoLaCabeza}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("sostuvoLaCabeza", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad se sentó solo (meses)</Label>
        <Input
          type="number"
          value={data.seSentoSolo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("seSentoSolo", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad se paró solo (meses)</Label>
        <Input
          type="number"
          value={data.seParoSolo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("seParoSolo", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad caminó solo (meses)</Label>
        <Input
          type="number"
          value={data.caminoSolo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("caminoSolo", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad inicio gateo (meses)</Label>
        <Input
          type="number"
          value={data.inicioGateo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("inicioGateo", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Tipo de gateo</Label>
        <Input
          value={data.tipoGateo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("tipoGateo", e.target.value)
          }
          placeholder="Ej: Cruzado"
        />
      </div>
      <div>
        <Label>Edad sonrisa social (meses)</Label>
        <Input
          type="number"
          value={data.edadesSonrisaSocial}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadesSonrisaSocial", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad balbuceo (meses)</Label>
        <Input
          type="number"
          value={data.edadesBalbuceo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadesBalbuceo", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad primeras frases (meses)</Label>
        <Input
          type="number"
          value={data.edadesPrimerasFrases}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadesPrimerasFrases", Number(e.target.value))
          }
        />
      </div>
    </div>
  );
};

export default DesarrolloMotorForm;
