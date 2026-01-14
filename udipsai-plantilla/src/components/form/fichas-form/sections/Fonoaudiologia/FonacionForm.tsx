import React from "react";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Input from "../../../input/InputField";

interface FonacionFormProps {
  data: {
    creeTonoVozEstudianteApropiado: boolean;
    respiracionNormal: boolean;
    situacionesAlteraTonoVoz: string;
    desdeCuandoAlteracionesVoz: string;
    tonoDeVoz: string;
    respiracion: string;
    ronca: boolean;
    juegoVocal: boolean;
    vocalizacion: boolean;
    balbuceo: boolean;
    silabeo: boolean;
    primerasPalabras: boolean;
    oracionesDosPalabras: boolean;
    oracionesTresPalabras: boolean;
    formacionLinguisticaCompleta: boolean;
    numeroTotalPalabras: number;
  };
  onChange: (field: string, value: any) => void;
}

const FonacionForm: React.FC<FonacionFormProps> = ({ data, onChange }) => {
  const switchesHitos = [
    { id: "ronca", label: "Ronca" },
    { id: "juegoVocal", label: "Juego vocal" },
    { id: "vocalizacion", label: "Vocalización" },
    { id: "balbuceo", label: "Balbuceo" },
    { id: "silabeo", label: "Silabeo" },
    { id: "primerasPalabras", label: "Primeras palabras" },
    { id: "oracionesDosPalabras", label: "Oraciones dos palabras" },
    { id: "oracionesTresPalabras", label: "Oraciones tres palabras" },
    {
      id: "formacionLinguisticaCompleta",
      label: "Formación lingüística completa",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Respiración y Tono de Voz
        </h4>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <Switch
            label="¿Cree tono voz estudiante apropiado?"
            checked={data.creeTonoVozEstudianteApropiado}
            onChange={(val: boolean) =>
              onChange("creeTonoVozEstudianteApropiado", val)
            }
          />
          <div>
            <Label htmlFor="situacionesAlteraTonoVoz">
              Situaciones que alteran el tono
            </Label>
            <Input
              id="situacionesAlteraTonoVoz"
              value={data.situacionesAlteraTonoVoz}
              onChange={(e) =>
                onChange("situacionesAlteraTonoVoz", e.target.value)
              }
              placeholder="Especifique..."
            />
          </div>
          <div>
            <Label htmlFor="desdeCuandoAlteracionesVoz">
              Desde cuándo hay alteraciones
            </Label>
            <Input
              id="desdeCuandoAlteracionesVoz"
              value={data.desdeCuandoAlteracionesVoz}
              onChange={(e) =>
                onChange("desdeCuandoAlteracionesVoz", e.target.value)
              }
              placeholder="Especifique..."
            />
          </div>
          <div>
            <Label htmlFor="tonoDeVoz">Tono de voz</Label>
            <Input
              id="tonoDeVoz"
              value={data.tonoDeVoz}
              onChange={(e) => onChange("tonoDeVoz", e.target.value)}
              placeholder="Normal, agudo, etc."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-4">
          <Switch
            label="Respiración normal"
            checked={data.respiracionNormal}
            onChange={(val: boolean) => onChange("respiracionNormal", val)}
          />
          <div>
            <Label htmlFor="respiracion">Respiración</Label>
            <Input
              id="respiracion"
              value={data.respiracion}
              onChange={(e) => onChange("respiracion", e.target.value)}
              placeholder="Nasal, bucal, etc."
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Hitos del Lenguaje / Fonación
        </h4>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {switchesHitos.map((sw) => (
            <Switch
              key={sw.id}
              label={sw.label}
              checked={data[sw.id as keyof typeof data] as boolean}
              onChange={(checked: boolean) => onChange(sw.id, checked)}
            />
          ))}
        </div>
        <div className="pt-4">
          <div>
            <Label htmlFor="numeroTotalPalabras">
              Número total de palabras
            </Label>
            <Input
            className="max-w-xs"
              id="numeroTotalPalabras"
              type="number"
              value={data.numeroTotalPalabras}
              onChange={(e) =>
                onChange("numeroTotalPalabras", Number(e.target.value))
              }
            />
            <p className="mt-2 text-xs text-gray-400">
              Total estimado de palabras en su léxico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FonacionForm;
