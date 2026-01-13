
import PageMeta from "../../../components/common/PageMeta";
import FormularioHistoriaClinica from "../../../components/form/fichas-form/FormularioHistoriaClinica";

export default function EditarHistoriaClinica() {
  return (
    <>
      <PageMeta
        title="Editar Historia Clínica | Udipsai"
        description="Editar ficha de historia clínica existente"
      />
      <FormularioHistoriaClinica />
    </>
  );
}
