import React from "react";
import { ReporteCitaRespuestaDTO } from "../../services/reportes";

interface ReporteImprimibleProps {
  reporte: ReporteCitaRespuestaDTO;
}

export const ReporteImprimible: React.FC<ReporteImprimibleProps> = ({
  reporte,
}) => {
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "-";
    
    try {
      // Si es una string, intentar parsearlo
      let date;
      if (typeof dateString === 'string') {
        // Manejar diferentes formatos de fecha
        if (dateString.includes('-')) {
          date = new Date(dateString);
        } else if (dateString.includes('/')) {
          date = new Date(dateString);
        } else {
          return dateString; // Si ya es un formato legible, devolverlo
        }
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return dateString.toString();
      }
      
      return date.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return dateString?.toString() || "-";
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    
    try {
      // Si ya tiene formato HH:mm, devolverlo
      if (timeString.includes(':') && timeString.length <= 8) {
        return timeString.substring(0, 5); // Solo HH:mm
      }
      
      // Si es un timestamp o formato complejo, extraer la hora
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("es-EC", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
      }
      
      return timeString;
    } catch (error) {
      return timeString || "-";
    }
  };

  const formatEstado = (estado: string) => {
    if (!estado) return "-";
    
    const estadosMap: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'FINALIZADA': 'Asistido',
      'CANCELADA': 'Cancelado',
      'FALTA_JUSTIFICADA': 'Falta Justificada',
      'FALTA_INJUSTIFICADA': 'Falta Injustificada',
      'REAGENDADA': 'Reagendado'
    };
    
    return estadosMap[estado.toUpperCase()] || estado;
  };

  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto shadow-lg print:shadow-none print:max-w-none print:p-12" id="reporte-contenido">
        {/* Encabezado con logos */}
        <div className="flex items-center justify-between mb-10 print:mb-12">
          <div className="w-24 print:w-28">
            <img
              src="/images/logo/ucacue-logo.png.png"
              alt="Universidad Católica de Cuenca"
              className="w-full h-auto"
            />
          </div>
          
          <div className="w-24 print:w-28">
            <img
              src="/images/logo/udipsai-logo.png.png"
              alt="UDIPSAI"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Título principal */}
        <div className="text-center mb-10 print:mb-12">
          <h1 className="text-lg print:text-xl font-bold text-gray-900 mb-2 leading-tight">
            UNIDAD DE DIAGNÓSTICO E INVESTIGACIÓN<br/>
            PSICOPEDAGÓGICA, SOCIAL Y DE APOYO A LA INCLUSIÓN
          </h1>
          <p className="text-base print:text-lg text-gray-700 font-medium mt-4">
            Reporte de Asistencia a Citas
          </p>
        </div>

        {/* Información del paciente en dos columnas */}
        <div className="mb-10 print:mb-12 border-t-2 border-b-2 border-gray-900 py-4 print:py-5">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="text-sm print:text-base">
              <span className="font-bold">Paciente: </span>
              <span className="font-normal">{reporte.pacienteNombreCompleto}</span>
            </div>
            <div className="text-right text-sm print:text-base">
              <span className="font-bold">Fecha de Emisión: </span>
              <span className="font-normal">
                {new Date().toLocaleDateString("es-EC", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })} {new Date().toLocaleTimeString("es-EC", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {reporte.cedula && (
            <div className="text-sm print:text-base">
              <span className="font-bold">Cédula: </span>
              <span className="font-normal">{reporte.cedula}</span>
            </div>
          )}
        </div>

        {/* Tabla de citas */}
        <div className="mb-12 print:mb-16">
          {reporte.citas.length === 0 ? (
            <div className="text-center py-12 border border-gray-300 rounded">
              <p className="text-gray-600 text-base">
                No se encontraron citas registradas para este paciente.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse border-2 border-gray-900">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-900 px-4 py-3 print:px-5 print:py-4 text-center font-bold text-sm print:text-base">
                    Fecha
                  </th>
                  <th className="border border-gray-900 px-4 py-3 print:px-5 print:py-4 text-center font-bold text-sm print:text-base">
                    Hora
                  </th>
                  <th className="border border-gray-900 px-4 py-3 print:px-5 print:py-4 text-center font-bold text-sm print:text-base">
                    Profesional
                  </th>
                  <th className="border border-gray-900 px-4 py-3 print:px-5 print:py-4 text-center font-bold text-sm print:text-base">
                    Área
                  </th>
                  <th className="border border-gray-900 px-4 py-3 print:px-5 print:py-4 text-center font-bold text-sm print:text-base">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {reporte.citas.map((cita, index) => (
                  <tr key={index}>
                    <td className="border border-gray-900 px-4 py-3 print:px-5 print:py-3 text-center text-sm print:text-base">
                      {formatDate(cita.fecha)}
                    </td>
                    <td className="border border-gray-900 px-4 py-3 print:px-5 print:py-3 text-center text-sm print:text-base">
                      {formatTime(cita.hora)}
                    </td>
                    <td className="border border-gray-900 px-4 py-3 print:px-5 print:py-3 text-center text-sm print:text-base">
                      {cita.profesional || "-"}
                    </td>
                    <td className="border border-gray-900 px-4 py-3 print:px-5 print:py-3 text-center text-sm print:text-base">
                      {cita.especialidad || "-"}
                    </td>
                    <td className="border border-gray-900 px-4 py-3 print:px-5 print:py-3 text-center text-sm print:text-base">
                      {formatEstado(cita.estado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pie del documento */}
        <div className="text-center text-xs print:text-sm text-gray-600 italic mt-16 print:mt-20">
          <p>Sistema UDIPSAI - Universidad Católica de Cuenca</p>
        </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 2cm 2.5cm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          #reporte-contenido {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
          
          .print\\:p-12 {
            padding: 3rem !important;
          }
          
          .print\\:mb-12 {
            margin-bottom: 3rem !important;
          }
          
          .print\\:mb-16 {
            margin-bottom: 4rem !important;
          }
          
          .print\\:mt-20 {
            margin-top: 5rem !important;
          }
          
          .print\\:py-5 {
            padding-top: 1.25rem !important;
            padding-bottom: 1.25rem !important;
          }
          
          .print\\:px-5 {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
          
          .print\\:py-4 {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          
          .print\\:py-3 {
            padding-top: 0.75rem !important;
            padding-bottom: 0.75rem !important;
          }
          
          .print\\:text-xl {
            font-size: 1.25rem !important;
            line-height: 1.75rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1.125rem !important;
            line-height: 1.75rem !important;
          }
          
          .print\\:text-base {
            font-size: 1rem !important;
            line-height: 1.5rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.875rem !important;
            line-height: 1.25rem !important;
          }
          
          .print\\:w-28 {
            width: 7rem !important;
          }
          
          table {
            page-break-inside: avoid;
            border-collapse: collapse !important;
          }
          
          tr {
            page-break-inside: avoid;
          }
          
          thead {
            display: table-header-group;
          }
          
          .bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          
          .border-gray-900 {
            border-color: #111827 !important;
          }
        }
      `}</style>
    </div>
  );
};
