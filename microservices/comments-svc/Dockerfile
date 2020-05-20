FROM node:12-alpine as build

WORKDIR /usr/share/comments-svc

ADD dist package.json ./

RUN apk add --no-cache make g++ python postgresql-dev \
  && npm install --production

FROM node:12-alpine

RUN apk add --no-cache libpq

ADD https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.3.2/grpc_health_probe-linux-amd64 /bin/grpc_health_probe

RUN chmod +x /bin/grpc_health_probe

WORKDIR /usr/share/comments-svc

COPY --from=build /usr/share/comments-svc .

EXPOSE 50051

CMD ["node", "main.js"]
