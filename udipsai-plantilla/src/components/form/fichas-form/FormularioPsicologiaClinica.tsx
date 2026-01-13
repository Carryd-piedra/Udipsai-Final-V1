
import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";

import AnamnesisForm from "./sections/PsicologiaClinica.tsx/AnamnesisForm";
import SuenioForm from "./sections/PsicologiaClinica.tsx/SuenioForm";
import ConductaForm from "./sections/PsicologiaClinica.tsx/ConductaForm";
import SexualidadForm from "./sections/PsicologiaClinica.tsx/SexualidadForm";
import EvaluacionLenguajeForm from "./sections/PsicologiaClinica.tsx/EvaluacionLenguajeForm";
import EvaluacionAfectivaForm from "./sections/PsicologiaClinica.tsx/EvaluacionAfectivaForm";
import EvaluacionCognitivaForm from "./sections/PsicologiaClinica.tsx/EvaluacionCognitivaForm";
import EvaluacionPensamientoForm from "./sections/PsicologiaClinica.tsx/EvaluacionPensamientoForm";
import DiagnosticoPsicologiaForm from "./sections/PsicologiaClinica.tsx/DiagnosticoPsicologiaForm";

export interface FichaPsicologiaClinicaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  anamnesis: {
    anamnesisFamiliar: string;
    personal: string;
    momentosEvolutivosEnElDesarrollo: string;
    habitosEnLaOralidad: string;
  };
  suenio: {
    inicioHorarioDeSuenio: number;
    finHorarioDeSuenio: number;
    tipoHorarioDeSuenio: string;
    companiaSuenio: string;
    especificarCompaniaSuenio: string;
    edad: string;
    hipersomnia: boolean;
    dificultadDeConciliarElSuenio: boolean;
    despertarFrecuente: boolean;
    despertarPrematuro: boolean;
    sonambulismo: boolean;
    observacionesHabitosDeSuenio: string;
  };
  conducta: {
    temores: boolean;
    destructividad: boolean;
    nerviosismo: boolean;
    irritabilidad: boolean;
    egocentrismo: boolean;
    regresiones: boolean;
    tics: boolean;
    hurto: boolean;
    mentira: boolean;
    cuidadoPersonal: boolean;
    otrosConductasPreocupantes: string;
    observacionesConductasPreocupantes: string;
  };
  sexualidad: {
    sexoDeNacimiento: string;
    genero: string;
    orientacionSexual: string;
    curiosidadSexual: string;
    gradoDeInformacion: string;
    actividadSexual: string;
    masturbacion: string;
    promiscuidad: string;
    disfunciones: string;
    erotismo: string;
    parafilias: string;
    observacionesAspectoPsicosexual: string;
  };
  evaluacionLenguaje: {
    palabrasRaras: boolean;
    logicoYClaro: boolean;
    vozMonotona: boolean;
    malHablado: boolean;
    lentoYTeatral: boolean;
    pesimista: boolean;
    hiriente: boolean;
    charlatan: boolean;
    incoherente: boolean;
    verborrea: boolean;
    abatimiento: boolean;
    tension: boolean;
    perplejidad: boolean;
    suspicacia: boolean;
    enfado: boolean;
    preocupacion: boolean;
    obscenidad: boolean;
    disartria: boolean;
    afasiaExpresiva: boolean;
    afasiaReceptiva: boolean;
    afasiaAnomica: boolean;
    afasiaGlobal: boolean;
    ecolalia: boolean;
    palilalia: boolean;
    ensimismamiento: boolean;
    hayQueGuiarlo: boolean;
    molestoso: boolean;
    lento: boolean;
    noDeseaHacerNada: boolean;
    haceCosasExtranas: boolean;
    aislado: boolean;
    participaEnGrupos: boolean;
    esViolento: boolean;
    callado: boolean;
    amigableYCooperador: boolean;
    adaptable: boolean;
    inquieto: boolean;
    nervioso: boolean;
    tieneAmigosIntimos: boolean;
    confuso: boolean;
    centradoEnSiMismo: boolean;
    olvidadizo: boolean;
    piensaYRespondeBien: boolean;
    pocosPensamientos: boolean;
    noVeLosErrores: boolean;
    actuaInfaltilmente: boolean;
    desconfia: boolean;
    hosco: boolean;
    fastidiado: boolean;
    cansado: boolean;
    visteRaramente: boolean;
    desordenado: boolean;
    mugrosoYFachoso: boolean;
    excesoDeRopas: boolean;
    dramaticoYTeatral: boolean;
    visteNormalmente: boolean;
    impecable: boolean;
    dudaDeTodos: boolean;
    pasaAislado: boolean;
    diceEstarBien: boolean;
    gustaDeHacerDanoALosDemas: boolean;
    tieneIniciativas: boolean;
    colabora: boolean;
    reticencia: boolean;
    rechazo: boolean;
    mutismo: boolean;
    negativismo: boolean;
    agresividad: boolean;
    sarcasmo: boolean;
    pegajosidad: boolean;
    colaboracionExcesiva: boolean;
    atento: boolean;
    seductor: boolean;
    evitaConversar: boolean;
    impulsivo: boolean;
    bromista: boolean;
    toscoYDescortes: boolean;
    triste: boolean;
    irritable: boolean;
    popensoARinias: false;
    suaveYAfable: boolean;
    indiferente: boolean;
    preocupadoYPensativo: boolean;
    tendenciaAlLlanto: boolean;
    alegre: boolean;
    euforico: boolean;
    labilDeHumor: boolean;
    inactivo: boolean;
    perezoso: boolean;
    soloHaceCosasIndispensables: boolean;
    realizaSoloUnTipoDeTrabajo: boolean;
    dedicadoAVariasActividades: boolean;
    apraxia: boolean;
    catatonia: boolean;
    agitacion: boolean;
    amaneramiento: boolean;
    estereotipias: boolean;
    ecopraxia: boolean;
    obedienciaAutomatica: boolean;
    negativismoActividades: boolean;
    interceptacionMotriz: boolean;
    dispraxias: boolean;
    actosImpulsivos: boolean;
    actosObsesivos: boolean;
    ticsActividades: boolean;
    liderazgo: boolean;
    sociabilidad: boolean;
    responsabilidad: boolean;
    toleranciaNormal: boolean;
    baja: boolean;
    colaboracion: boolean;
    inquietud: boolean;
    acataOrdenesVerbales: boolean;
    agresivo: boolean;
    extravagante: boolean;
    antisocial: boolean;
    impulsivoComportamiento: boolean;
    reflexivo: boolean;
    pasivo: boolean;
    apatico: boolean;
    dependiente: boolean;
    dominante: boolean;
    cauteloso: boolean;
    quejoso: boolean;
    temeroso: boolean;
    teatral: boolean;
    ritualista: boolean;
    aislamiento: boolean;
    ataquesDePanico: boolean;
    incapacidadDeRealizacionDeActividadesProductivas: boolean;
    riesgoPotencialOPotencialSuicida: boolean;
    inhibicion: boolean;
    apatia: boolean;
    humorVariable: boolean;
  };
  evaluacionAfectiva: {
    altaSensibilidad: boolean;
    agresividadAfectividad: boolean;
    sumision: boolean;
    rabietas: boolean;
    solidaridad: boolean;
    generosidad: boolean;
    afectuoso: boolean;
    angustia: boolean;
    ansiedadSituacional: boolean;
    timidez: boolean;
    ansiedadExpectante: boolean;
    depresion: boolean;
    perdidaRecienteDeInteres: boolean;
    desesperacion: boolean;
    euforia: boolean;
    indiferencia: boolean;
    aplanamiento: boolean;
    ambivalencia: boolean;
    irritabilidadAfectividad: boolean;
    labilidad: boolean;
    tenacidad: boolean;
    incontinencia: boolean;
    sentimientosInadecuados: boolean;
    neotimia: boolean;
    disociacionIdeoAfectiva: boolean;
    anhedonia: boolean;
  };
  evaluacionCognitiva: {
    observacionesGuiaDeObservacion: string;
    lucidez: boolean;
    obnubilacion: boolean;
    estupor: boolean;
    coma: boolean;
    hipervigilancia: boolean;
    confusion: boolean;
    estadoCrepuscular: boolean;
    onirismo: boolean;
    sonambulismoEstadoDeConciencia: boolean;
    hipercepcion: boolean;
    hipoprosexia: boolean;
    disprosexia: boolean;
    distraibilidad: boolean;
    sinAlteracion: boolean;
    hipercepcionSensopercepcion: boolean;
    ilusiones: boolean;
    seudoalucionciones: boolean;
    alusinosis: boolean;
    macropsias: boolean;
    micropsias: boolean;
    noPresenta: boolean;
    alucinaiones: boolean;
    hipermnecia: boolean;
    amnesiaDeFijacion: boolean;
    amnesiaDeEvocacion: boolean;
    mixta: boolean;
    lacunar: boolean;
    dismensia: boolean;
    paramnesias: boolean;
    sinAlteracionMemoria: boolean;
    desorientacionEnTiempo: string;
    espacio: string;
    respectoASiMismo: string;
    respectoAOtrasPersonas: string;
  };
  evaluacionPensamiento: {
    incoherencia: string;
    bloqueos: string;
    preservacion: string;
    prolijidad: string;
    desgragacion: string;
    estereotipiasEstructuraDelPensamiento: string;
    neologismos: string;
    musitacion: string;
    retardo: boolean;
    aceleracion: boolean;
    fugaDeIdeas: boolean;
    mutismoCursoDelPensamiento: boolean;
    grandeza: boolean;
    suicidio: boolean;
    autocompasion: boolean;
    inferioridad: boolean;
    perdidaDeInteres: boolean;
    indecision: boolean;
    necesidadDeAyuda: boolean;
    fracaso: boolean;
    ruina: boolean;
    autoacusacion: boolean;
    resentimiento: boolean;
    muerte: boolean;
    danio: boolean;
    enfermedad: boolean;
    grave: boolean;
    hipocondrias: boolean;
    nihilistas: boolean;
    noTenerSentimientos: boolean;
    elMundoHaDejadoDeExistir: boolean;
    referencia: boolean;
    extravagantes: boolean;
    fobicas: boolean;
    compulsivas: boolean;
    obsesivas: boolean;
    desconfianzas: boolean;
    desRelacion: boolean;
    perdidaDeControl: boolean;
    serCalumniado: boolean;
    deliriosParanoides: boolean;
    depresivos: boolean;
    misticoReligioso: boolean;
    sexuales: boolean;
    difusos: boolean;
    otrosContenidoDelPensamiento: string;
    capacidadDeAutocritica: boolean;
    heterocritica: boolean;
    proyectosFuturos: boolean;
    concienciaDeLaEnfermedad: boolean;
  };
  diagnostico: {
    impresionDiagnostica: string;
    derivacionInterconsulta: string;
    objetivoPlanTratamientoIndividual: string;
    estrategiaDeIntervencion: string;
    indicadorDeLogro: string;
    tiempoEstimado: string;
    evaluacion: string;
  };
}

export const initialPsicologiaClinicaState: FichaPsicologiaClinicaState = {
  pacienteId: 0,
  activo: true,
  anamnesis: {
    anamnesisFamiliar: "",
    personal: "",
    momentosEvolutivosEnElDesarrollo: "",
    habitosEnLaOralidad: "",
  },
  suenio: {
    inicioHorarioDeSuenio: 0,
    finHorarioDeSuenio: 0,
    tipoHorarioDeSuenio: "DIURNO",
    companiaSuenio: "SOLO",
    especificarCompaniaSuenio: "",
    edad: "0",
    hipersomnia: false,
    dificultadDeConciliarElSuenio: false,
    despertarFrecuente: false,
    despertarPrematuro: false,
    sonambulismo: false,
    observacionesHabitosDeSuenio: "",
  },
  conducta: {
    temores: false,
    destructividad: false,
    nerviosismo: false,
    irritabilidad: false,
    egocentrismo: false,
    regresiones: false,
    tics: false,
    hurto: false,
    mentira: false,
    cuidadoPersonal: false,
    otrosConductasPreocupantes: "",
    observacionesConductasPreocupantes: "",
  },
  sexualidad: {
    sexoDeNacimiento: "MASCULINO",
    genero: "OTROS",
    orientacionSexual: "HETEROSEXUAL",
    curiosidadSexual: "AUSENTE",
    gradoDeInformacion: "AUSENTE",
    actividadSexual: "AUSENTE",
    masturbacion: "AUSENTE",
    promiscuidad: "AUSENTE",
    disfunciones: "AUSENTE",
    erotismo: "AUSENTE",
    parafilias: "AUSENTE",
    observacionesAspectoPsicosexual: "",
  },
  evaluacionLenguaje: {
    palabrasRaras: false,
    logicoYClaro: false,
    vozMonotona: false,
    malHablado: false,
    lentoYTeatral: false,
    pesimista: false,
    hiriente: false,
    charlatan: false,
    incoherente: false,
    verborrea: false,
    abatimiento: false,
    tension: false,
    perplejidad: false,
    suspicacia: false,
    enfado: false,
    preocupacion: false,
    obscenidad: false,
    disartria: false,
    afasiaExpresiva: false,
    afasiaReceptiva: false,
    afasiaAnomica: false,
    afasiaGlobal: false,
    ecolalia: false,
    palilalia: false,
    ensimismamiento: false,
    hayQueGuiarlo: false,
    molestoso: false,
    lento: false,
    noDeseaHacerNada: false,
    haceCosasExtranas: false,
    aislado: false,
    participaEnGrupos: false,
    esViolento: false,
    callado: false,
    amigableYCooperador: false,
    adaptable: false,
    inquieto: false,
    nervioso: false,
    tieneAmigosIntimos: false,
    confuso: false,
    centradoEnSiMismo: false,
    olvidadizo: false,
    piensaYRespondeBien: false,
    pocosPensamientos: false,
    noVeLosErrores: false,
    actuaInfaltilmente: false,
    desconfia: false,
    hosco: false,
    fastidiado: false,
    cansado: false,
    visteRaramente: false,
    desordenado: false,
    mugrosoYFachoso: false,
    excesoDeRopas: false,
    dramaticoYTeatral: false,
    visteNormalmente: false,
    impecable: false,
    dudaDeTodos: false,
    pasaAislado: false,
    diceEstarBien: false,
    gustaDeHacerDanoALosDemas: false,
    tieneIniciativas: false,
    colabora: false,
    reticencia: false,
    rechazo: false,
    mutismo: false,
    negativismo: false,
    agresividad: false,
    sarcasmo: false,
    pegajosidad: false,
    colaboracionExcesiva: false,
    atento: false,
    seductor: false,
    evitaConversar: false,
    impulsivo: false,
    bromista: false,
    toscoYDescortes: false,
    triste: false,
    irritable: false,
    popensoARinias: false,
    suaveYAfable: false,
    indiferente: false,
    preocupadoYPensativo: false,
    tendenciaAlLlanto: false,
    alegre: false,
    euforico: false,
    labilDeHumor: false,
    inactivo: false,
    perezoso: false,
    soloHaceCosasIndispensables: false,
    realizaSoloUnTipoDeTrabajo: false,
    dedicadoAVariasActividades: false,
    apraxia: false,
    catatonia: false,
    agitacion: false,
    amaneramiento: false,
    estereotipias: false,
    ecopraxia: false,
    obedienciaAutomatica: false,
    negativismoActividades: false,
    interceptacionMotriz: false,
    dispraxias: false,
    actosImpulsivos: false,
    actosObsesivos: false,
    ticsActividades: false,
    liderazgo: false,
    sociabilidad: false,
    responsabilidad: false,
    toleranciaNormal: false,
    baja: false,
    colaboracion: false,
    inquietud: false,
    acataOrdenesVerbales: false,
    agresivo: false,
    extravagante: false,
    antisocial: false,
    impulsivoComportamiento: false,
    reflexivo: false,
    pasivo: false,
    apatico: false,
    dependiente: false,
    dominante: false,
    cauteloso: false,
    quejoso: false,
    temeroso: false,
    teatral: false,
    ritualista: false,
    aislamiento: false,
    ataquesDePanico: false,
    incapacidadDeRealizacionDeActividadesProductivas: false,
    riesgoPotencialOPotencialSuicida: false,
    inhibicion: false,
    apatia: false,
    humorVariable: false,
  },
  evaluacionAfectiva: {
    altaSensibilidad: false,
    agresividadAfectividad: false,
    sumision: false,
    rabietas: false,
    solidaridad: false,
    generosidad: false,
    afectuoso: false,
    angustia: false,
    ansiedadSituacional: false,
    timidez: false,
    ansiedadExpectante: false,
    depresion: false,
    perdidaRecienteDeInteres: false,
    desesperacion: false,
    euforia: false,
    indiferencia: false,
    aplanamiento: false,
    ambivalencia: false,
    irritabilidadAfectividad: false,
    labilidad: false,
    tenacidad: false,
    incontinencia: false,
    sentimientosInadecuados: false,
    neotimia: false,
    disociacionIdeoAfectiva: false,
    anhedonia: false,
  },
  evaluacionCognitiva: {
    observacionesGuiaDeObservacion: "",
    lucidez: false,
    obnubilacion: false,
    estupor: false,
    coma: false,
    hipervigilancia: false,
    confusion: false,
    estadoCrepuscular: false,
    onirismo: false,
    sonambulismoEstadoDeConciencia: false,
    hipercepcion: false,
    hipoprosexia: false,
    disprosexia: false,
    distraibilidad: false,
    sinAlteracion: false,
    hipercepcionSensopercepcion: false,
    ilusiones: false,
    seudoalucionciones: false,
    alusinosis: false,
    macropsias: false,
    micropsias: false,
    noPresenta: false,
    alucinaiones: false,
    hipermnecia: false,
    amnesiaDeFijacion: false,
    amnesiaDeEvocacion: false,
    mixta: false,
    lacunar: false,
    dismensia: false,
    paramnesias: false,
    sinAlteracionMemoria: false,
    desorientacionEnTiempo: "AUSENTE",
    espacio: "AUSENTE",
    respectoASiMismo: "AUSENTE",
    respectoAOtrasPersonas: "AUSENTE",
  },
  evaluacionPensamiento: {
    incoherencia: "AUSENTE",
    bloqueos: "AUSENTE",
    preservacion: "AUSENTE",
    prolijidad: "AUSENTE",
    desgragacion: "AUSENTE",
    estereotipiasEstructuraDelPensamiento: "AUSENTE",
    neologismos: "AUSENTE",
    musitacion: "AUSENTE",
    retardo: false,
    aceleracion: false,
    fugaDeIdeas: false,
    mutismoCursoDelPensamiento: false,
    grandeza: false,
    suicidio: false,
    autocompasion: false,
    inferioridad: false,
    perdidaDeInteres: false,
    indecision: false,
    necesidadDeAyuda: false,
    fracaso: false,
    ruina: false,
    autoacusacion: false,
    resentimiento: false,
    muerte: false,
    danio: false,
    enfermedad: false,
    grave: false,
    hipocondrias: false,
    nihilistas: false,
    noTenerSentimientos: false,
    elMundoHaDejadoDeExistir: false,
    referencia: false,
    extravagantes: false,
    fobicas: false,
    compulsivas: false,
    obsesivas: false,
    desconfianzas: false,
    desRelacion: false,
    perdidaDeControl: false,
    serCalumniado: false,
    deliriosParanoides: false,
    depresivos: false,
    misticoReligioso: false,
    sexuales: false,
    difusos: false,
    otrosContenidoDelPensamiento: "",
    capacidadDeAutocritica: false,
    heterocritica: false,
    proyectosFuturos: false,
    concienciaDeLaEnfermedad: false,
  },
  diagnostico: {
    impresionDiagnostica: "",
    derivacionInterconsulta: "",
    objetivoPlanTratamientoIndividual: "",
    estrategiaDeIntervencion: "",
    indicadorDeLogro: "",
    tiempoEstimado: "",
    evaluacion: "",
  },
};

export default function FormularioPsicologiaClinica() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FichaPsicologiaClinicaState>(initialPsicologiaClinicaState);
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
      const data = await fichasService.obtenerPsicologiaClinica(fichaId);
      if (data) {
        setFormData(data);
      } else {
        toast.error("No se encontró la ficha");
        navigate("/psicologia-clinica");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/psicologia-clinica");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (
    section: keyof FichaPsicologiaClinicaState,
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
        await fichasService.actualizarPsicologiaClinica(Number(id), formData);
        toast.success("Ficha actualizada exitosamente");
      } else {
        await fichasService.crearPsicologiaClinica(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/psicologia-clinica");
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

      <ComponentCard title="Anamnesis">
        <AnamnesisForm
          data={formData.anamnesis}
          onChange={(field, val) => handleNestedChange("anamnesis", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Sueño">
        <SuenioForm
          data={formData.suenio}
          onChange={(field, val) => handleNestedChange("suenio", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Conducta">
        <ConductaForm
          data={formData.conducta}
          onChange={(field, val) => handleNestedChange("conducta", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Sexualidad">
        <SexualidadForm
          data={formData.sexualidad}
          onChange={(field, val) => handleNestedChange("sexualidad", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Evaluacion Lenguaje">
        <EvaluacionLenguajeForm
          data={formData.evaluacionLenguaje}
          onChange={(field, val) => handleNestedChange("evaluacionLenguaje", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Evaluacion Afectiva">
        <EvaluacionAfectivaForm
          data={formData.evaluacionAfectiva}
          onChange={(field, val) => handleNestedChange("evaluacionAfectiva", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Evaluacion Cognitiva">
        <EvaluacionCognitivaForm
          data={formData.evaluacionCognitiva}
          onChange={(field, val) => handleNestedChange("evaluacionCognitiva", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Evaluacion Pensamiento">
        <EvaluacionPensamientoForm
          data={formData.evaluacionPensamiento}
          onChange={(field, val) => handleNestedChange("evaluacionPensamiento", field, val)}
        />
      </ComponentCard>
      <ComponentCard title="Diagnóstico">
        <DiagnosticoPsicologiaForm
          data={formData.diagnostico}
          onChange={(field, val) => handleNestedChange("diagnostico", field, val)}
        />
      </ComponentCard>
       <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/psicologia-clinica")}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : isEdit ? "Actualizar Ficha" : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
