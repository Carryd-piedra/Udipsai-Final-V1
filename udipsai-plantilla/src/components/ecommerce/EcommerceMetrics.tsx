
import {
  BoxIcon,
  UsersIcon,
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { pacientesService } from "../../services";
import { useAuth } from "../../context/AuthContext";

export default function EcommerceMetrics() {
  const { userIdentity } = useAuth();
  const [totalPacientes, setTotalPacientes] = useState<number | string>("-");
  const [citasHoy, setCitasHoy] = useState<number | string>("-");
  const [pendientesTotales, setPendientesTotales] = useState<number | string>("-");

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Patients
      try {
        const params: any = { activo: true };
        const pacientesData = await pacientesService.listarActivos(params.page, params.size, params.sort);

        if (pacientesData?.totalElements !== undefined) {
          setTotalPacientes(pacientesData.totalElements);
        } else if (Array.isArray(pacientesData)) {
          setTotalPacientes(pacientesData.length);
        } else if (pacientesData?.content && Array.isArray(pacientesData.content)) {
          setTotalPacientes(pacientesData.content.length);
        } else {
          setTotalPacientes(0);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setTotalPacientes(0);
      }

      // Fetch Citas Stats
      try {
        if (userIdentity) {
          const { especialistasService } = await import("../../services");
          const { citasService } = await import("../../services");

          const especialistaResponse = await especialistasService.filtrar({ search: userIdentity });
          if (especialistaResponse && especialistaResponse.content && especialistaResponse.content.length > 0) {
            const especialistaId = especialistaResponse.content[0].id;
            const resumen = await citasService.obtenerResumen(especialistaId);
            if (resumen) {
              setCitasHoy(resumen.citasHoy || 0);
              setPendientesTotales(resumen.pendientesTotales || 0);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching appointment stats:", error);
        // setCitasHoy(0);
        // setPendientesTotales(0);
      }
    };

    fetchData();
  }, [userIdentity]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UsersIcon size={20} className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total de pacientes
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalPacientes}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-900/20">
          <BoxIcon size={20} className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Citas para Hoy
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {citasHoy}
            </h4>
          </div>
          <Badge color="warning">
            <span className="text-xs">Programadas</span>
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-xl dark:bg-orange-900/20">
          <BoxIcon size={20} className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pendientes Totales
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {pendientesTotales}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
