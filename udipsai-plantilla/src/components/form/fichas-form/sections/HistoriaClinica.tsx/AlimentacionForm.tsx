import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import TextArea from "../../../input/TextArea";

interface AlimentacionProps {
  data: {
    tomoSeno: boolean;
    edadDesteteTomoSeno: number;
    tomoBiberon: boolean;
    edadDesteteTomoBiberon: number;
    edadInicioComidaSolida: number;
    habitosAlimenticiosActuales: string;
    edadDejoPanial: number;
    edadControlEsfinferesDiurno: number;
    edadControlEsfinferesNocturno: number;
    seVisteSolo: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const AlimentacionForm: React.FC<AlimentacionProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="space-y-4">
        <Switch
          label="¿Tomó seno?"
          checked={data.tomoSeno}
          onChange={(checked: boolean) => onChange("tomoSeno", checked)}
        />
        {data.tomoSeno && (
          <div>
            <Label>Edad destete seno (meses)</Label>
            <Input
              type="number"
              value={data.edadDesteteTomoSeno}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("edadDesteteTomoSeno", Number(e.target.value))
              }
            />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <Switch
          label="¿Tomó biberón?"
          checked={data.tomoBiberon}
          onChange={(checked: boolean) => onChange("tomoBiberon", checked)}
        />
        {data.tomoBiberon && (
          <div>
            <Label>Edad destete biberón (meses)</Label>
            <Input
              type="number"
              value={data.edadDesteteTomoBiberon}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("edadDesteteTomoBiberon", Number(e.target.value))
              }
            />
          </div>
        )}
      </div>
      <div>
        <Label>Edad inicio comida sólida (meses)</Label>
        <Input
          type="number"
          value={data.edadInicioComidaSolida}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadInicioComidaSolida", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad dejó pañal (meses)</Label>
        <Input
          type="number"
          value={data.edadDejoPanial}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadDejoPanial", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad control esfínteres diurno</Label>
        <Input
          type="number"
          value={data.edadControlEsfinferesDiurno}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadControlEsfinferesDiurno", Number(e.target.value))
          }
        />
      </div>
      <div>
        <Label>Edad control esfínteres nocturno</Label>
        <Input
          type="number"
          value={data.edadControlEsfinferesNocturno}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edadControlEsfinferesNocturno", Number(e.target.value))
          }
        />
      </div>
      <div className="flex items-center">
        <Switch
          label="¿Se viste solo?"
          checked={data.seVisteSolo}
          onChange={(checked: boolean) => onChange("seVisteSolo", checked)}
        />
      </div>
      <div className="xl:col-span-2">
        <Label>Hábitos alimenticios actuales</Label>
        <TextArea
          value={data.habitosAlimenticiosActuales}
          onChange={(val: string) =>
            onChange("habitosAlimenticiosActuales", val)
          }
          placeholder="Describa hábitos..."
        />
      </div>
    </div>
  );
};

export default AlimentacionForm;
