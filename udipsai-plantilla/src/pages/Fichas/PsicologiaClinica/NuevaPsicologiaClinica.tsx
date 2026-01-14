
import PageMeta from "../../../components/common/PageMeta";
import FormularioPsicologiaClinica from "../../../components/form/fichas-form/FormularioPsicologiaClinica";

export default function NuevaPsicologiaClinica() {
  return (
    <>
      <PageMeta
        title="Nueva Psicología Clínica | Udipsai"
        description="Crear una nueva ficha de psicología clínica"
      />
      <FormularioPsicologiaClinica />
    </>
  );
}
