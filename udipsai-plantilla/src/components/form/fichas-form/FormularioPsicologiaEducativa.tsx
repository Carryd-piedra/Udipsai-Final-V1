
import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";

import HistoriaEscolarForm from "./sections/PsicologiaEducativa.tsx/HistoriaEscolarForm";
import DesarrolloForm from "./sections/PsicologiaEducativa.tsx/DesarrolloForm";
import AdaptacionForm from "./sections/PsicologiaEducativa.tsx/AdaptacionForm";
import EstadoGeneralForm from "./sections/PsicologiaEducativa.tsx/EstadoGeneralForm";

export interface FichaPsicologiaEducativaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  historiaEscolar: {
    asignaturasGustan: string;
    asignaturasDisgustan: string;
    relacionDocentes: string;
    causaRelacionDocentes: string;
    gustaIrInstitucion: boolean;
    causaGustaIrInstitucion: string;
    relacionConGrupo: string;
    causaRelacionConGrupo: string;
    
  };
  desarrollo: {
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
  adaptacion: {
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
  estadoGeneral: {
    aprovechamientoGeneral: string;
    actividadEscolar: string;
    observaciones: string;
  };
}

export const initialPsicologiaEducativaState: FichaPsicologiaEducativaState = {
  pacienteId: 0,
  activo: true,
  historiaEscolar: {
    asignaturasGustan: "",
    asignaturasDisgustan: "",
    relacionDocentes: "REGULAR",
    causaRelacionDocentes: "",
    gustaIrInstitucion: false,
    causaGustaIrInstitucion: "",
    relacionConGrupo: "REGULAR",
    causaRelacionConGrupo: "",
  },
  desarrollo: {
    cdi: false,
    cdiEdad: "",
    inicial1: false,
    inicial1Edad: 0,
    inicial2: false,
    inicial2Edad: 0,
    primerEGB: false,
    edad1roEGB: 0,
    perdidaAnio: false,
    gradoCausaPerdidaAnio: "",
    desercionEscolar: false,
    gradoCausaDesercionEscolar: "",
    cambioInstitucion: false,
    gradoCausaCambioInstitucion: "",
    problemasAprendizaje: false,
    problemasAprendizajeEspecificar: "",
  },
  adaptacion: {
    inclusionEducativa: false,
    causaInclusionEducativa: "",
    adaptacionesCurriculares: false,
    gradoAdaptacion: "",
    especifiqueAsignaturas: "",
    evaluacionPsicologicaUOtrosAnterior: false,
    causaEvaluacionPsicologicaUOtrosAnterior: "",
    recibeApoyo: false,
    causaLugarTiempoRecibeApoyo: "",
  },
  estadoGeneral: {
    aprovechamientoGeneral: "REGULAR",
    actividadEscolar: "",
    observaciones: "",
  },
};

export default function FormularioPsicologiaEducativa() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FichaPsicologiaEducativaState>(initialPsicologiaEducativaState);
  const [loading, setLoading] = useState(false);
  
  // Create Mode state
  const isEdit = !!id;
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pacienteIdParam = searchParams.get("pacienteId");
    if (isEdit && id) {
      loadFicha(id);
    } else if (pacienteIdParam) {
        loadPacienteFromUrl(pacienteIdParam);
    }
  }, [id, isEdit, searchParams]);

  const loadPacienteFromUrl = async (id: string) => {
    try {
        setLoading(true);
        const paciente = await pacientesService.obtenerPorId(id);
        if (paciente) {
            setSelectedPatient(paciente);
            setFormData(prev => ({ ...prev, pacienteId: paciente.id }));
        }
    } catch (error) {
        console.error("Error loading patient from URL", error);
        toast.error("Error al cargar datos del paciente asociado");
    } finally {
        setLoading(false);
    }
  };


  const loadFicha = async (fichaId: string) => {
    try {
      setLoading(true);
      const data = await fichasService.obtenerPsicologiaEducativa(fichaId);
      if (data) {
        setFormData(data);
      } else {
        toast.error("No se encontró la ficha");
        navigate("/psicologia-educativa");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/psicologia-educativa");
    } finally {
      setLoading(false);
    }
  };


  const handleNestedChange = (
    section: keyof FichaPsicologiaEducativaState,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isEdit && id) {
        await fichasService.actualizarPsicologiaEducativa(Number(id), formData);
        toast.success("Ficha actualizada exitosamente");
      } else {
        await fichasService.crearPsicologiaEducativa(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/psicologia-educativa");
    } catch (error: any) {
         if (error.response?.status === 409) {
            toast.error("Este paciente ya tiene una ficha activa.");
        } else {
            toast.error(isEdit ? "Error al actualizar la ficha" : "Error al crear la ficha");
        }
      console.error("Error saving ficha:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando ficha...
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {!isEdit && selectedPatient && (
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
            <div>
                <span className="font-semibold text-blue-900">Paciente:</span> {selectedPatient.nombres} {selectedPatient.apellidos} ({selectedPatient.cedula})
            </div>
        </div>
      )}

      <ComponentCard title="Historia Escolar">
        <HistoriaEscolarForm
          data={formData.historiaEscolar}
          onChange={(field, value) =>
            handleNestedChange("historiaEscolar", field, value)
          }
        />
      </ComponentCard>
      <ComponentCard title="Desarrollo">
        <DesarrolloForm
          data={formData.desarrollo}
          onChange={(field, value) =>
            handleNestedChange("desarrollo", field, value)
          }
        />
      </ComponentCard>
      <ComponentCard title="Adaptación">
        <AdaptacionForm
          data={formData.adaptacion}
          onChange={(field, value) =>
            handleNestedChange("adaptacion", field, value)
          }
        />
      </ComponentCard>
      <ComponentCard title="Estado General">
        <EstadoGeneralForm
          data={formData.estadoGeneral}
          onChange={(field, value) =>
            handleNestedChange("estadoGeneral", field, value)
          }
        />
      </ComponentCard>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/psicologia-educativa")}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : isEdit ? "Actualizar Ficha" : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
