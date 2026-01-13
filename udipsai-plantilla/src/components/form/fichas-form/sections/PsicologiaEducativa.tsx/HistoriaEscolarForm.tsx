import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

interface HistoriaEscolarProps {
  data: {
    asignaturasGustan: string;
    asignaturasDisgustan: string;
    relacionDocentes: string;
    causaRelacionDocentes: string;
    gustaIrInstitucion: boolean;
    causaGustaIrInstitucion: string;
    relacionConGrupo: string;
    causaRelacionConGrupo: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosHistoriaEscolarForm: React.FC<HistoriaEscolarProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Asignaturas que gusta</Label>
        <Input
          value={data.asignaturasGustan}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("asignaturasGustan", e.target.value)
          }
          placeholder="Ingrese asignaturas"
        />
      </div>
      <div>
        <Label>Asignaturas que no gusta</Label>
        <Input
          value={data.asignaturasDisgustan}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("asignaturasDisgustan", e.target.value)
          }
          placeholder="Ingrese asignaturas"
        />
      </div>
      <div>
        <Label>Relacion con docentes</Label>
        <Input
          value={data.relacionDocentes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("relacionDocentes", e.target.value)
          }
          placeholder="Ingrese relacion"
        />
      </div>
      <div>
        <Label>Causa relacion con docentes</Label>
        <Input
          value={data.causaRelacionDocentes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaRelacionDocentes", e.target.value)
          }
          placeholder="Ingrese causa"
        />
      </div>
      <div>
        <Label>Gusta ir a institucion</Label>
        <Switch
          label="Gusta ir a institucion"
          checked={data.gustaIrInstitucion}
          onChange={(checked: boolean) =>
            onChange("gustaIrInstitucion", checked)
          }
        />
      </div>
      <div>
        <Label>Causa gusta ir a institucion</Label>
        <Input
          value={data.causaGustaIrInstitucion}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaGustaIrInstitucion", e.target.value)
          }
          placeholder="Ingrese causa"
        />
      </div>
      <div>
        <Label>Relacion con grupo</Label>
        <Input
          value={data.relacionConGrupo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("relacionConGrupo", e.target.value)
          }
          placeholder="Ingrese relacion"
        />
      </div>
      <div>
        <Label>Causa relacion con grupo</Label>
        <Input
          value={data.causaRelacionConGrupo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaRelacionConGrupo", e.target.value)
          }
          placeholder="Ingrese causa"
        />
      </div>
    </div>
  );
};

export default DatosHistoriaEscolarForm;
