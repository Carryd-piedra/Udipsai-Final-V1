# Instrucciones para Crear Usuario Administrador

## Opción 1: Ejecutar el Script SQL (RECOMENDADO)

1. **Abrir pgAdmin** o tu cliente de PostgreSQL favorito

2. **Conectarte a la base de datos** `udipsai`

3. **Ejecutar el script** [insert_admin_user.sql](insert_admin_user.sql)
   - Abre el archivo `UDIPSAI-Backend/insert_admin_user.sql`
   - Copia todo el contenido
   - Pégalo en una nueva ventana de consulta SQL
   - Ejecuta el script

4. **Verificar** que el usuario se creó correctamente:
   ```sql
   SELECT cedula, nombres_apellidos, activo, pacientes 
   FROM especialistas 
   WHERE cedula = '0101010101';
   ```

## Opción 2: Desde línea de comandos (PostgreSQL)

```bash
# Conectar a PostgreSQL
psql -U postgres -d udipsai

# Ejecutar el script
\i 'C:/Users/Usuario/Downloads/Udipsai-Final-V1-main/Udipsai-Final-V1-main/UDIPSAI-Backend/insert_admin_user.sql'

# Salir
\q
```

## Opción 3: Inserción Manual (si el script falla)

Si el script completo da error, ejecuta estos comandos uno por uno:

```sql
-- 1. Eliminar usuario admin si existe
DELETE FROM especialistas WHERE cedula = '0101010101';

-- 2. Insertar usuario admin (ajusta según tu estructura de tabla)
INSERT INTO especialistas (
    cedula, nombres_apellidos, contrasenia, activo, 
    pacientes, especialistas, recursos
) VALUES (
    '0101010101',
    'Administrador del Sistema',
    '$2a$10$N9qppMKzJQ0eVlHpQz.Q6eXr4JYKlGJlPZf0FqP0qZ1eGZJZQ5Qk2',
    true,
    true, true, true
);

-- 3. Verificar
SELECT * FROM especialistas WHERE cedula = '0101010101';
```

## Credenciales del Administrador

```
Usuario (Cédula): 0101010101
Contraseña: admin123
```

## Permisos Incluidos

El usuario administrador tiene TODOS los permisos habilitados:
- ✅ Pacientes (necesario para reportes)
- ✅ Pasantes
- ✅ Sedes
- ✅ Especialistas
- ✅ Especialidades
- ✅ Asignaciones
- ✅ Recursos
- ✅ Instituciones Educativas
- ✅ Historia Clínica
- ✅ Fonoaudiología
- ✅ Psicología Clínica
- ✅ Psicología Educativa

## Verificar Estructura de Tabla

Si el script da error, primero verifica la estructura de tu tabla:

```sql
-- Ver columnas de la tabla especialistas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'especialistas'
ORDER BY ordinal_position;
```

Ajusta el script INSERT según las columnas que realmente existan en tu base de datos.

## Troubleshooting

### Error: "column does not exist"
- Verifica la estructura de la tabla con el comando anterior
- Ajusta el INSERT para incluir solo las columnas que existen

### Error: "duplicate key value"
- El usuario ya existe. Ejecuta primero el DELETE:
  ```sql
  DELETE FROM especialistas WHERE cedula = '0101010101';
  ```

### Error de autenticación después de crear el usuario
- Verifica que el hash de la contraseña sea correcto
- Reinicia el backend después de insertar el usuario
- Verifica que la columna `activo` sea `true`

## Después de Crear el Usuario

1. **Reiniciar el backend** (si está ejecutándose)
2. **Limpiar caché del navegador** o usar modo incógnito
3. **Iniciar sesión** con las credenciales:
   - Usuario: `0101010101`
   - Contraseña: `admin123`
4. **Acceder a reportes**: Navegar a `/reportes` en la aplicación

## Cambiar Contraseña (Opcional)

Si deseas usar una contraseña diferente, genera el hash con BCrypt:

1. Ejecuta la clase `PasswordHashGenerator.java`
2. Usa el hash generado en el script SQL
3. O cambia la contraseña desde la interfaz después de iniciar sesión
