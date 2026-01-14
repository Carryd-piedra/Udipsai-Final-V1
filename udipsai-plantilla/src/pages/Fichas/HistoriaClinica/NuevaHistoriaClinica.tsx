
import PageMeta from "../../../components/common/PageMeta";
import FormularioHistoriaClinica from "../../../components/form/fichas-form/FormularioHistoriaClinica";

export default function NuevaHistoriaClinica() {
  return (
    <>
      <PageMeta
        title="Nueva Historia Clínica | Udipsai"
        description="Crear una nueva ficha de historia clínica"
      />
      <FormularioHistoriaClinica />
    </>
  );
}
