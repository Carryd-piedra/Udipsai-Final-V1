import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import TextArea from "../../../input/TextArea";

interface AntecedentesMedicosProps {
  data: {
    alergias: string;
    enfermedadesVirales: string;
    hospitalizacionesQuirurgicasYCausas: string;
    accidentesYSecuelas: string;
    tomaMedicacionActualmente: string;
    examenesComplementariosRealizados: string;
    antecedentesPatologicosFamiliares: string;
    vacunacionC: string;
  };
  onChange: (field: string, value: any) => void;
}

const AntecedentesMedicosForm: React.FC<AntecedentesMedicosProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="xl:col-span-2">
        <Label>Alergias</Label>
        <TextArea
          value={data.alergias}
          onChange={(val: string) => onChange("alergias", val)}
          placeholder="Describa alergias..."
        />
      </div>
      <div className="xl:col-span-2">
        <Label>Enfermedades Virales</Label>
        <TextArea
          value={data.enfermedadesVirales}
          onChange={(val: string) => onChange("enfermedadesVirales", val)}
          placeholder="Ej: Sarampión, Rubeola..."
        />
      </div>
      <div className="xl:col-span-2">
        <Label>Hospitalizaciones / Quirúrgicas y causas</Label>
        <TextArea
          value={data.hospitalizacionesQuirurgicasYCausas}
          onChange={(val: string) =>
            onChange("hospitalizacionesQuirurgicasYCausas", val)
          }
          placeholder="Detalle..."
        />
      </div>
      <div className="xl:col-span-2">
        <Label>Accidentes y Secuelas</Label>
        <TextArea
          value={data.accidentesYSecuelas}
          onChange={(val: string) => onChange("accidentesYSecuelas", val)}
          placeholder="Detalle..."
        />
      </div>
      <div className="xl:col-span-2">
        <Label>¿Toma medicación actualmente?</Label>
        <TextArea
          value={data.tomaMedicacionActualmente}
          onChange={(val: string) => onChange("tomaMedicacionActualmente", val)}
          placeholder="Cual y dosis..."
        />
      </div>
      <div className="xl:col-span-2">
        <Label>Exámenes complementarios realizados</Label>
        <TextArea
          value={data.examenesComplementariosRealizados}
          onChange={(val: string) =>
            onChange("examenesComplementariosRealizados", val)
          }
          placeholder="..."
        />
      </div>
      <div className="xl:col-span-2">
        <Label>Antecedentes Patológicos Familiares</Label>
        <TextArea
          value={data.antecedentesPatologicosFamiliares}
          onChange={(val: string) =>
            onChange("antecedentesPatologicosFamiliares", val)
          }
          placeholder="..."
        />
      </div>
      <div>
        <Label>Vacunación</Label>
        <Input
          value={data.vacunacionC}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("vacunacionC", e.target.value)
          }
          placeholder="Estado de vacunación"
        />
      </div>
    </div>
  );
};

export default AntecedentesMedicosForm;
