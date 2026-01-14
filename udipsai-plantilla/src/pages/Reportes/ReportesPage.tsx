import React, { useState } from "react";
import { BuscarReporteForm } from "../../components/reportes/BuscarReporteForm";
import { ReporteImprimible } from "../../components/reportes/ReporteImprimible";
import { ReporteCitaRespuestaDTO } from "../../services/reportes";
import PageMeta from "../../components/common/PageMeta";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";

const ReportesPage: React.FC = () => {
  const [reporte, setReporte] = useState<ReporteCitaRespuestaDTO | null>(null);

  const handleBuscarReporte = (reporteGenerado: ReporteCitaRespuestaDTO) => {
    setReporte(reporteGenerado);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <>
      <PageMeta title="Reportes de Citas" />
      
      <div className="print:hidden">
        <PageBreadCrumb
          pageTitle="Reportes de Citas"
          items={[
            { label: "Inicio", link: "/" },
            { label: "Reportes de Citas" },
          ]}
        />
      </div>

      <div className="container mx-auto px-4 py-6 print:py-0">
        {/* Formulario de búsqueda siempre visible arriba */}
        <div className="max-w-2xl mx-auto mb-6 print:hidden">
          <BuscarReporteForm onBuscar={handleBuscarReporte} />
        </div>

        {/* Botón de imprimir - Solo visible cuando hay reporte */}
        {reporte && (
          <div className="max-w-2xl mx-auto mb-6 print:hidden">
            <button
              onClick={handleImprimir}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimir Reporte
            </button>
          </div>
        )}

        {/* Reporte visible cuando existe */}
        {reporte && (
          <div>
            <ReporteImprimible reporte={reporte} />
          </div>
        )}
      </div>

      {/* Estilos de impresión */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:p-12 {
              padding: 3rem !important;
            }
            
            .print\\:mb-12 {
              margin-bottom: 3rem !important;
            }
            
            .print\\:mb-10 {
              margin-bottom: 2.5rem !important;
            }
            
            .print\\:bg-gray-100 {
              background-color: #f3f4f6 !important;
            }
            
            .print\\:mt-16 {
              margin-top: 4rem !important;
            }
            
            .print\\:hover\\:bg-transparent:hover {
              background-color: transparent !important;
            }
            
            table {
              page-break-inside: auto;
            }
            
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            thead {
              display: table-header-group;
            }
            
            tfoot {
              display: table-footer-group;
            }
          }
          
          @page {
            margin: 2cm;
          }
        `}
      </style>
    </>
  );
};

export default ReportesPage;
