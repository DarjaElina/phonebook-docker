FROM node:20 AS build-stage

ENV VITE_BACKEND_URL=http://localhost:8080/api

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html