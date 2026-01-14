import {
  ArrowDown,
  ArrowUp,
  BoxIcon,
  UsersIcon,
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { pacientesService } from "../../services";

export default function EcommerceMetrics() {
  const [totalPacientes, setTotalPacientes] = useState<number | string>("-");
  const [totalCitas] = useState<number | string>("-"); // Placeholder for now

  useEffect(() => {
    const fetchData = async () => {
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
           console.warn("Unexpected patients response structure:", pacientesData);
           setTotalPacientes(0);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setTotalPacientes(0);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
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
          <Badge color="success">
            <ArrowUp size={20} />
            10%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIcon size={20} className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Endpoints de citas
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalCitas}
            </h4>
          </div>

          <Badge color="error">
            <ArrowDown size={20} />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
