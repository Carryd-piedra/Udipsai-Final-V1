import React from "react";
import Switch from "../../../switch/Switch";

interface HistoriaPostnatalProps {
  data: {
    convulsiones: boolean;
    medicacion: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const HistoriaPostnatalForm: React.FC<HistoriaPostnatalProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Switch
          label="¿Presentó Convulsiones?"
          checked={data.convulsiones}
          onChange={(checked: boolean) => onChange("convulsiones", checked)}
        />
      </div>
      <div>
        <Switch
          label="¿Recibe Medicación?"
          checked={data.medicacion}
          onChange={(checked: boolean) => onChange("medicacion", checked)}
        />
      </div>
    </div>
  );
};

export default HistoriaPostnatalForm;
