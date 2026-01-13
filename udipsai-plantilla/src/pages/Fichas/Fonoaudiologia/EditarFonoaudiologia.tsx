
import PageMeta from "../../../components/common/PageMeta";
import FormularioFonoaudiologia from "../../../components/form/fichas-form/FormularioFonoaudiologia";

export default function EditarFonoaudiologia() {
  return (
    <>
      <PageMeta
        title="Editar Ficha Fonoaudiología | Udipsai"
        description="Editar ficha de fonoaudiología existente"
      />
      <FormularioFonoaudiologia />
    </>
  );
}
