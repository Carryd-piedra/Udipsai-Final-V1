
import PageMeta from "../../../components/common/PageMeta";
import FormularioFonoaudiologia from "../../../components/form/fichas-form/FormularioFonoaudiologia";

export default function NuevaFonoaudiologia() {
  return (
    <>
      <PageMeta
        title="Nueva Ficha Fonoaudiología | Udipsai"
        description="Crear una nueva ficha de fonoaudiología"
      />
      <FormularioFonoaudiologia />
    </>
  );
}
