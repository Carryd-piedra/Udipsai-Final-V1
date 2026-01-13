import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

interface AdaptacionProps {
  data: {
    inclusionEducativa: boolean;
    causaInclusionEducativa: string;
    adaptacionesCurriculares: boolean;
    gradoAdaptacion: string;
    especifiqueAsignaturas: string;
    evaluacionPsicologicaUOtrosAnterior: boolean;
    causaEvaluacionPsicologicaUOtrosAnterior: string;
    recibeApoyo: boolean;
    causaLugarTiempoRecibeApoyo: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosAdaptacionForm: React.FC<AdaptacionProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Inclusion Educativa</Label>
        <Switch
          label="Inclusion Educativa"
          checked={data.inclusionEducativa}
          onChange={(checked: boolean) =>
            onChange("inclusionEducativa", checked)
          }
        />
      </div>
      <div>
        <Label>Causa Inclusion Educativa</Label>
        <Input
          value={data.causaInclusionEducativa}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaInclusionEducativa", e.target.value)
          }
          placeholder="Ingrese causa"
        />
      </div>
      <div>
        <Label>Adaptaciones Curriculares</Label>
        <Switch
          label="Adaptaciones Curriculares"
          checked={data.adaptacionesCurriculares}
          onChange={(checked: boolean) =>
            onChange("adaptacionesCurriculares", checked)
          }
        />
      </div>
      <div>
        <Label>Grado Adaptacion</Label>
        <Input
          value={data.gradoAdaptacion}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("gradoAdaptacion", e.target.value)
          }
          placeholder="Ingrese grado"
        />
      </div>
      <div>
        <Label>Especifique Asignaturas</Label>
        <Input
          value={data.especifiqueAsignaturas}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("especifiqueAsignaturas", e.target.value)
          }
          placeholder="Ingrese asignaturas"
        />
      </div>
      <div>
        <Label>Evaluacion Psicologica U Otros Anterior</Label>
        <Switch
          label="Evaluacion Psicologica U Otros Anterior"
          checked={data.evaluacionPsicologicaUOtrosAnterior}
          onChange={(checked: boolean) =>
            onChange("evaluacionPsicologicaUOtrosAnterior", checked)
          }
        />
      </div>
      <div>
        <Label>Causa Evaluacion Psicologica U Otros Anterior</Label>
        <Input
          value={data.causaEvaluacionPsicologicaUOtrosAnterior}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaEvaluacionPsicologicaUOtrosAnterior", e.target.value)
          }
          placeholder="Ingrese causa"
        />
      </div>
      <div>
        <Label>Recibe Apoyo</Label>
        <Switch
          label="Recibe Apoyo"
          checked={data.recibeApoyo}
          onChange={(checked: boolean) =>
            onChange("recibeApoyo", checked)
          }
        />
      </div>
      <div>
        <Label>Causa Lugar Tiempo Recibe Apoyo</Label>
        <Input
          value={data.causaLugarTiempoRecibeApoyo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaLugarTiempoRecibeApoyo", e.target.value)
          }
          placeholder="Ingrese causa"
        />
      </div>
    </div>
  );
};

export default DatosAdaptacionForm;