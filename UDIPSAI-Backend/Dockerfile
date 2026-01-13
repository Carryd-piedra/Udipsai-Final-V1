# =============================================================
# ETAPA 1: BUILD (Compilación y Creación del JAR)
# Usamos una imagen que tiene Maven y Java 17 para la compilación.
# =============================================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de Maven y el pom.xml primero para aprovechar el cache
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descarga las dependencias para que solo se ejecute si cambian el pom.xml
RUN mvn dependency:go-offline

# Copia todo el código fuente del proyecto
COPY src src

# Empaqueta la aplicación Spring Boot en un archivo JAR
RUN mvn package -DskipTests

# =============================================================
# ETAPA 2: RUN (Ejecución - Imagen ligera)
# Usamos una imagen base mínima con solo JRE para ejecutar la aplicación.
# =============================================================
FROM eclipse-temurin:17-jre-focal AS runner

# Establece el directorio de trabajo
WORKDIR /app

# Expone el puerto por defecto de Spring Boot
EXPOSE 8090

# Copia el JAR generado desde la etapa 'builder'
# El nombre del JAR suele ser 'udipsai-backend-0.0.1-SNAPSHOT.jar', ajusta si es necesario.
# Si tu JAR tiene otro nombre, revisa el archivo 'target' después de una compilación local.
ARG JAR_FILE=target/UDIPSAI-Backend-0.0.1-SNAPSHOT.jar
COPY --from=builder /app/${JAR_FILE} app.jar

# Copia el Dockerfile que tienes en tu proyecto
COPY Dockerfile .
COPY mvnw .
COPY pom.xml .
COPY src src


# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]