FROM node:12.13 as build-app
WORKDIR /app
COPY ./ChatApp/package.json ./ChatApp/package-lock.json ./
RUN npm ci
COPY ./ChatApp ./
RUN npm run build

FROM openjdk:11-jdk-slim as build-service
WORKDIR /app
COPY ./ChatService ./

RUN mkdir -p /app/src/main/resources/static

COPY --from=build-app /app/build /app/src/main/resources/static

RUN ./gradlew -no-daemon build

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build-service /app/build/libs .
ENTRYPOINT ["java", "-jar", "./WebSocket-1.0-SNAPSHOT.jar"]
