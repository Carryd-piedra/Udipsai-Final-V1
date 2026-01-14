import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

interface DesarrolloProps {
  data: {
    cdi: boolean;
    cdiEdad: string;
    inicial1: boolean;
    inicial1Edad: number;
    inicial2: boolean;
    inicial2Edad: number;
    primerEGB: boolean;
    edad1roEGB: number;
    perdidaAnio: boolean;
    gradoCausaPerdidaAnio: string;
    desercionEscolar: boolean;
    gradoCausaDesercionEscolar: string;
    cambioInstitucion: boolean;
    gradoCausaCambioInstitucion: string;
    problemasAprendizaje: boolean;
    problemasAprendizajeEspecificar: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosDesarrolloForm: React.FC<DesarrolloProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>CDI</Label>
        <Switch
          label="CDI"
          checked={data.cdi}
          onChange={(checked: boolean) => onChange("cdi", checked)}
        />
      </div>
      <div>
        <Label>CDI Edad</Label>
        <Input
          value={data.cdiEdad}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("cdiEdad", e.target.value)
          }
          placeholder="Ingrese CDI Edad"
        />
      </div>
      <div>
        <Label>Inicial 1</Label>
        <Switch
          label="Inicial 1"
          checked={data.inicial1}
          onChange={(checked: boolean) => onChange("inicial1", checked)}
        />
      </div>
      <div>
        <Label>Inicial 1 Edad</Label>
        <Input
          type="number"
          value={data.inicial1Edad}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("inicial1Edad", e.target.value)
          }
          placeholder="Edad"
        />
      </div>
      <div>
        <Label>Inicial 2</Label>
        <Switch
          label="Inicial 2"
          checked={data.inicial2}
          onChange={(checked: boolean) => onChange("inicial2", checked)}
        />
      </div>
      <div>
        <Label>Inicial 2 Edad</Label>
        <Input
          type="number"
          value={data.inicial2Edad}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("inicial2Edad", e.target.value)
          }
          placeholder="Edad"
        />
      </div>
      <div>
        <Label>Primer EGB</Label>
        <Switch
          label="Primer EGB"
          checked={data.primerEGB}
          onChange={(checked: boolean) => onChange("primerEGB", checked)}
        />
      </div>
      <div>
        <Label>Edad 1ro EGB</Label>
        <Input
          type="number"
          value={data.edad1roEGB}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("edad1roEGB", e.target.value)
          }
          placeholder="Edad"
        />
      </div>
      <div>
        <Label>Perdida de Anio</Label>
        <Switch
          label="Perdida de Anio"
          checked={data.perdidaAnio}
          onChange={(checked: boolean) => onChange("perdidaAnio", checked)}
        />
      </div>
      <div>
        <Label>Grado Causa Perdida de Anio</Label>
        <Input
          value={data.gradoCausaPerdidaAnio}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("gradoCausaPerdidaAnio", e.target.value)
          }
          placeholder="Ingrese Grado Causa Perdida de Anio"
        />
      </div>
      <div>
        <Label>Desercion Escolar</Label>
        <Switch
          label="Desercion Escolar"
          checked={data.desercionEscolar}
          onChange={(checked: boolean) => onChange("desercionEscolar", checked)}
        />
      </div>
      <div>
        <Label>Grado Causa Desercion Escolar</Label>
        <Input
          value={data.gradoCausaDesercionEscolar}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("gradoCausaDesercionEscolar", e.target.value)
          }
          placeholder="Ingrese Grado Causa Desercion Escolar"
        />
      </div>
      <div>
        <Label>Cambio de Institucion</Label>
        <Switch
          label="Cambio de Institucion"
          checked={data.cambioInstitucion}
          onChange={(checked: boolean) =>
            onChange("cambioInstitucion", checked)
          }
        />
      </div>
      <div>
        <Label>Grado Causa Cambio de Institucion</Label>
        <Input
          value={data.gradoCausaCambioInstitucion}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("gradoCausaCambioInstitucion", e.target.value)
          }
          placeholder="Ingrese Grado Causa Cambio de Institucion"
        />
      </div>
      <div>
        <Label>Problemas de Aprendizaje</Label>
        <Switch
          label="Problemas de Aprendizaje"
          checked={data.problemasAprendizaje}
          onChange={(checked: boolean) =>
            onChange("problemasAprendizaje", checked)
          }
        />
      </div>
      <div>
        <Label>Problemas de Aprendizaje Especificar</Label>
        <Input
          value={data.problemasAprendizajeEspecificar}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("problemasAprendizajeEspecificar", e.target.value)
          }
          placeholder="Ingrese Problemas de Aprendizaje Especificar"
        />
      </div>
    </div>
  );
};

export default DatosDesarrolloForm;
