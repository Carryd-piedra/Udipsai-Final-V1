
import PageMeta from "../../../components/common/PageMeta";
import PsicologiaClinicaAccionesTable from "../../../components/tables/AccionTables/PsicologiaClinicaAccionesTable";

export default function ListaPsicologiaClinica() {
  return (
    <>
      <PageMeta
        title="Psicología Clínica | Udipsai"
        description="Gestión de fichas de psicología clínica"
      />
      <PsicologiaClinicaAccionesTable />
    </>
  );
}
