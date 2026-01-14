
import PageMeta from "../../../components/common/PageMeta";
import FormularioPsicologiaClinica from "../../../components/form/fichas-form/FormularioPsicologiaClinica";

export default function EditarPsicologiaClinica() {
  return (
    <>
      <PageMeta
        title="Editar Psicología Clínica | Udipsai"
        description="Editar ficha de psicología clínica existente"
      />
      <FormularioPsicologiaClinica />
    </>
  );
}
