# Sistema de Reportes de Citas - UDIPSAI

## Descripción General

El sistema de reportes permite buscar y generar reportes imprimibles de citas médicas de pacientes utilizando su número de cédula. El reporte incluye información del paciente y un historial de las últimas 15 citas registradas.

## Características

✅ **Búsqueda por Cédula**: Buscar pacientes utilizando su número de cédula
✅ **Reporte Imprimible**: Formato optimizado para impresión
✅ **Historial de Citas**: Muestra las últimas 15 citas del paciente
✅ **Información Detallada**: Incluye fecha, hora, profesional y especialidad
✅ **Validación**: Manejo de casos cuando no se encuentra el paciente o no tiene citas

## Componentes Implementados

### Backend (Java/Spring Boot)

1. **ReporteCitaController.java**
   - Endpoint: `GET /api/citas/reporte/cedula?cedula={cedula}`
   - Endpoint: `GET /api/citas/reporte/paciente/{id}`

2. **ReporteCitaService.java**
   - `generarReportePorCedula(String cedula)`: Genera reporte buscando por cédula
   - `generarReportePorPaciente(Integer id)`: Genera reporte por ID de paciente

3. **DTOs**
   - `ReporteCitaDTO`: Información de cada cita
   - `ReporteCitaRespuestaDTO`: Respuesta completa con datos del paciente y sus citas

4. **PacienteRepository.java**
   - Método agregado: `findByCedula(String cedula)`

### Frontend (React/TypeScript)

1. **Servicio de Reportes** (`src/services/reportes.ts`)
   - `obtenerReportePorCedula(cedula)`
   - `obtenerReportePorPaciente(id)`

2. **Componentes**
   - `BuscarReporteForm.tsx`: Formulario de búsqueda por cédula
   - `ReporteImprimible.tsx`: Vista del reporte con botón de impresión

3. **Página Principal** (`src/pages/Reportes/ReportesPage.tsx`)
   - Integra búsqueda y visualización del reporte

4. **Ruta**
   - URL: `/reportes`
   - Requiere permiso: `PERM_PACIENTES`

## Cómo Usar

### Para el Usuario Final

1. **Acceder al módulo de reportes**
   - Navegar a `/reportes` en la aplicación
   - O buscar "Reportes de Citas" en el menú

2. **Buscar un paciente**
   - Ingresar el número de cédula del paciente
   - Hacer clic en "Buscar Reporte"

3. **Visualizar el reporte**
   - El sistema mostrará la información del paciente
   - Se listarán las últimas 15 citas en orden cronológico

4. **Imprimir el reporte**
   - Hacer clic en el botón "Imprimir Reporte"
   - El navegador abrirá el diálogo de impresión
   - Seleccionar impresora o guardar como PDF

5. **Nueva búsqueda**
   - Hacer clic en "Nueva Búsqueda" para buscar otro paciente

### Casos de Uso

#### Caso 1: Paciente Encontrado con Citas
```
Entrada: Cédula "1234567890"
Resultado: 
- Muestra nombre del paciente
- Lista las últimas 15 citas
- Permite imprimir
```

#### Caso 2: Paciente Encontrado sin Citas
```
Entrada: Cédula "0987654321"
Resultado:
- Muestra nombre del paciente
- Mensaje: "No se encontraron citas registradas"
```

#### Caso 3: Paciente No Encontrado
```
Entrada: Cédula "0000000000"
Resultado:
- Error: "No se encontró ningún paciente con esa cédula"
```

## Estructura del Reporte

### Encabezado
- Título: "REPORTE DE CITAS MÉDICAS"
- Sistema: "UDIPSAI"

### Información del Paciente
- Nombre completo
- Número de cédula

### Historial de Citas
Tabla con las siguientes columnas:
- **#**: Número de orden
- **Fecha**: Fecha de la cita
- **Hora**: Hora de inicio
- **Profesional**: Nombre del especialista
- **Especialidad**: Área de atención

### Pie del Reporte
- Fecha y hora de generación
- Institución: "Universidad Católica de Cuenca"

## Estilos de Impresión

El reporte incluye estilos CSS optimizados para impresión:
- Oculta elementos de navegación
- Optimiza márgenes y espaciado
- Mantiene formato de tabla en múltiples páginas
- Márgenes de página: 2cm

## API Endpoints

### Obtener Reporte por Cédula
```http
GET /api/citas/reporte/cedula?cedula={cedula}
```

**Parámetros:**
- `cedula` (query): Número de cédula del paciente

**Respuesta:**
```json
{
  "pacienteNombreCompleto": "Juan Pérez García",
  "cedula": "1234567890",
  "citas": [
    {
      "fecha": "14-01-2026",
      "hora": "09:00",
      "profesional": "Dra. María López",
      "especialidad": "Psicología Clínica"
    }
  ]
}
```

### Obtener Reporte por ID
```http
GET /api/citas/reporte/paciente/{id}
```

**Parámetros:**
- `id` (path): ID del paciente

**Respuesta:** Mismo formato que endpoint por cédula

## Permisos Requeridos

- Frontend: `PERM_PACIENTES`
- Backend: Acceso a endpoints de reportes

## Tecnologías Utilizadas

### Backend
- Spring Boot
- Spring Data JPA
- Lombok

### Frontend
- React 18
- TypeScript
- TailwindCSS
- React Router

## Notas Técnicas

1. **Límite de Citas**: El sistema retorna las últimas 15 citas ordenadas por fecha descendente
2. **Formato de Fechas**: Las fechas se formatean en español (es-EC)
3. **Modo Oscuro**: El reporte soporta modo oscuro en pantalla, pero imprime en claro
4. **Responsive**: La interfaz es responsive pero el reporte impreso es de tamaño estándar

## Mejoras Futuras

- [ ] Exportar a PDF directamente
- [ ] Filtros por rango de fechas
- [ ] Incluir más información de cada cita (estado, notas)
- [ ] Estadísticas del paciente
- [ ] Gráficos de asistencia
- [ ] Exportar a Excel
- [ ] Enviar reporte por email

## Soporte

Para problemas o consultas sobre el sistema de reportes, contactar al equipo de desarrollo de UDIPSAI.
