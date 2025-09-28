FROM node:20.18.2-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
RUN ls -la
EXPOSE ${PORT}