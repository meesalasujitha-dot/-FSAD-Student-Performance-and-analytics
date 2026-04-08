# We use a multi-stage build to keep the final image very small.

# Stage 1: Build the Java application using Maven
FROM maven:3.8.6-eclipse-temurin-8 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies to cache them
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the actual code and build it
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the minimal runtime container
FROM eclipse-temurin:8-jre
WORKDIR /app

# Copy the assembled JAR from the build container
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Explicitly expose port 8080
EXPOSE 8080

# Command to execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
