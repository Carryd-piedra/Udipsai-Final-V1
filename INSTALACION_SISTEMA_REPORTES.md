# Guía de Instalación y Configuración - Sistema de Reportes

## Requisitos Previos

- Backend: Java 17+, Spring Boot 3.x, Maven
- Frontend: Node.js 18+, npm o yarn
- Base de datos configurada con tablas de pacientes y citas

## Instalación

### 1. Backend (Spring Boot)

Los siguientes archivos ya están implementados en el sistema:

#### Archivos Modificados/Creados:

```
UDIPSAI-Backend/src/main/java/com/ucacue/udipsai/modules/
├── citas/
│   ├── ReporteCitaController.java         (modificado - agregado endpoint por cédula)
│   ├── ReporteCitaService.java            (modificado - agregado método por cédula)
│   ├── ReporteCitaDTO.java                (existente)
│   └── ReporteCitaRespuestaDTO.java       (modificado - agregado campo cedula)
└── paciente/
    └── repository/
        └── PacienteRepository.java        (modificado - agregado findByCedula)
```

#### No se requiere instalación adicional

El backend utilizará las dependencias existentes del proyecto. Solo es necesario:

1. Compilar el proyecto:
```bash
cd UDIPSAI-Backend
mvn clean install
```

2. Ejecutar el backend:
```bash
mvn spring-boot:run
```

O con el archivo jar:
```bash
java -jar target/udipsai-backend.jar
```

### 2. Frontend (React + TypeScript)

#### Archivos Nuevos Creados:

```
udipsai-plantilla/src/
├── services/
│   └── reportes.ts                        (nuevo servicio)
├── components/
│   └── reportes/
│       ├── BuscarReporteForm.tsx         (componente de búsqueda)
│       ├── ReporteImprimible.tsx         (componente de reporte)
│       └── EjemplosIntegracion.tsx       (ejemplos de uso)
├── pages/
│   └── Reportes/
│       └── ReportesPage.tsx              (página principal)
├── styles/
│   └── print-reporte.css                 (estilos de impresión)
└── routes/
    └── config.tsx                         (modificado - agregada ruta)
```

#### Instalación Frontend

1. Navegar al directorio del frontend:
```bash
cd udipsai-plantilla
```

2. Instalar dependencias (si es necesario):
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Compilar para producción:
```bash
npm run build
```

## Configuración

### Backend

#### 1. Verificar Configuración de Base de Datos

Asegurarse que `application.properties` tenga la configuración correcta:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/udipsai
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
```

#### 2. Verificar Vista de Citas Completa

El sistema utiliza la vista `VistaCitasCompleta`. Verificar que exista en la base de datos.

### Frontend

#### 1. Configurar URL del Backend

Verificar que `src/api/api.ts` tenga la URL correcta:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajustar según tu configuración
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### 2. Importar Estilos de Impresión (Opcional)

Si deseas usar el archivo CSS de impresión por separado, agregar en `main.tsx` o en el componente:

```typescript
import './styles/print-reporte.css';
```

## Verificación de Instalación

### 1. Verificar Endpoints del Backend

Probar con curl o Postman:

```bash
# Por ID de paciente
curl http://localhost:8080/api/citas/reporte/paciente/1

# Por cédula
curl http://localhost:8080/api/citas/reporte/cedula?cedula=1234567890
```

Respuesta esperada:
```json
{
  "pacienteNombreCompleto": "Juan Pérez",
  "cedula": "1234567890",
  "citas": [
    {
      "fecha": "14-01-2026",
      "hora": "09:00",
      "profesional": "Dr. García",
      "especialidad": "Psicología"
    }
  ]
}
```

### 2. Verificar Frontend

1. Acceder a `http://localhost:5173/reportes` (o el puerto configurado)
2. Ingresar un número de cédula válido
3. Verificar que se muestre el reporte
4. Probar el botón de impresión

## Permisos y Seguridad

### Backend

El sistema utiliza los permisos existentes. Asegurarse que los usuarios tengan:
- Acceso a endpoints de citas
- Acceso a datos de pacientes

### Frontend

La ruta de reportes requiere:
- Permiso: `PERM_PACIENTES`

Modificar en `routes/config.tsx` si se requiere un permiso diferente:

```typescript
{ path: "reportes", ...protectedRoute("TU_PERMISO", <ReportesPage />) },
```

## Troubleshooting

### Error: "Paciente no encontrado"

**Causa**: No existe un paciente con esa cédula
**Solución**: Verificar que la cédula sea correcta y que el paciente esté registrado

### Error: CORS en el backend

**Solución**: Verificar configuración de CORS en el backend

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

### Error: La impresión no se ve bien

**Solución**: 
1. Verificar que los estilos de impresión estén aplicados
2. Ajustar márgenes en configuración de impresora
3. Usar modo "Guardar como PDF" para mejor resultado

### Error: No se cargan las citas

**Causa**: Problema con la vista `VistaCitasCompleta`
**Solución**: Verificar que la vista exista y tenga datos

```sql
SELECT * FROM vista_citas_completa LIMIT 10;
```

## Migración de Datos

Si es necesario migrar datos existentes o crear datos de prueba:

```sql
-- Verificar pacientes
SELECT id, cedula, nombres_apellidos FROM pacientes LIMIT 5;

-- Verificar citas
SELECT * FROM citas WHERE ficha_paciente = 1 LIMIT 5;
```

## Actualización

Para actualizar el sistema de reportes en el futuro:

1. **Backend**: 
   - Modificar los archivos en `modules/citas/`
   - Recompilar: `mvn clean install`
   - Reiniciar servidor

2. **Frontend**:
   - Actualizar archivos en `src/components/reportes/`
   - Ejecutar: `npm run build`
   - Redesplegar

## Respaldo

Antes de implementar en producción, realizar respaldo de:

1. Base de datos
```bash
pg_dump -U usuario -d udipsai > backup_$(date +%Y%m%d).sql
```

2. Código fuente (usar git)
```bash
git add .
git commit -m "Implementación sistema de reportes"
git push
```

## Despliegue en Producción

### Backend

1. Compilar para producción:
```bash
mvn clean package -DskipTests
```

2. Copiar JAR al servidor:
```bash
scp target/udipsai-backend.jar user@server:/path/
```

3. Ejecutar en servidor:
```bash
java -jar udipsai-backend.jar --spring.profiles.active=prod
```

### Frontend

1. Compilar para producción:
```bash
npm run build
```

2. Copiar archivos de `dist/` al servidor web (nginx, apache, etc.)

3. Configurar servidor web para SPA routing

## Monitoreo

Para monitorear el uso del sistema de reportes:

1. **Backend**: Revisar logs de Spring Boot
```bash
tail -f logs/udipsai-backend.log | grep "reporte"
```

2. **Frontend**: Usar consola del navegador en modo desarrollo

## Soporte

Para problemas o dudas:
- Documentación: Ver `SISTEMA_REPORTES_README.md`
- Ejemplos: Ver `EjemplosIntegracion.tsx`
- Issues: Reportar en sistema de control de versiones

## Checklist de Implementación

- [ ] Backend compilado sin errores
- [ ] Frontend compilado sin errores
- [ ] Base de datos actualizada con método `findByCedula`
- [ ] Endpoint `/api/citas/reporte/cedula` funcional
- [ ] Endpoint `/api/citas/reporte/paciente/{id}` funcional
- [ ] Ruta `/reportes` accesible en frontend
- [ ] Formulario de búsqueda funcional
- [ ] Reporte se genera correctamente
- [ ] Botón de impresión funciona
- [ ] Estilos de impresión aplicados
- [ ] Manejo de errores implementado
- [ ] Permisos configurados
- [ ] Probado en diferentes navegadores
- [ ] Probado en modo impresión/PDF
- [ ] Documentación completa
- [ ] Respaldos realizados
