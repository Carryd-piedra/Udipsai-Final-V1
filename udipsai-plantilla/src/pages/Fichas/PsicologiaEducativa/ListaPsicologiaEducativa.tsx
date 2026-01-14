
import PageMeta from "../../../components/common/PageMeta";
import PsicologiaEducativaAccionesTable from "../../../components/tables/AccionTables/PsicologiaEducativaAccionesTable";

export default function ListaPsicologiaEducativa() {
  return (
    <>
      <PageMeta
        title="Psicología Educativa | Udipsai"
        description="Gestión de fichas de psicología educativa"
      />
      <PsicologiaEducativaAccionesTable />
    </>
  );
}
