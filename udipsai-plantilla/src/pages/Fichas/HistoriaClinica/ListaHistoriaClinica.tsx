
import PageMeta from "../../../components/common/PageMeta";
import HistoriaClinicaAccionesTable from "../../../components/tables/AccionTables/HistoriaClinicaAccionesTable";

export default function ListaHistoriaClinica() {
  return (
    <>
      <PageMeta
        title="Historia Clínica | Udipsai"
        description="Gestión de fichas de historia clínica"
      />
      <HistoriaClinicaAccionesTable />
    </>
  );
}
