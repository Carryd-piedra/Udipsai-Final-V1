
import PageMeta from "../../../components/common/PageMeta";
import FonoaudiologiaAccionesTable from "../../../components/tables/AccionTables/FonoaudiologiaAccionesTable";

export default function ListaFonoaudiologia() {
  return (
    <>
      <PageMeta
        title="Fonoaudiología | Udipsai"
        description="Gestión de fichas de fonoaudiología"
      />
      <FonoaudiologiaAccionesTable />
    </>
  );
}
