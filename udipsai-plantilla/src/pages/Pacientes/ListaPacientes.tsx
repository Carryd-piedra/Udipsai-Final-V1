import PageMeta from "../../components/common/PageMeta";
import PacientesAccionesTable from "../../components/tables/AccionTables/PacientesAccionesTable";

export default function ListaPacientes() {
  return (
    <>
      <PageMeta
        title="Lista de Pacientes | Udipsai"
        description="Formulario para la gestión de pacientes en Udipsai"
      />
      <PacientesAccionesTable />
    </>
  );
}
