# NestJS GraphQL API + gRPC microservices

This project is a [monorepo](https://gomonorepo.org/) containing a [GraphQL](https://graphql.org/) API with [gRPC](https://grpc.io/) back-end microservices built using the [NestJS framework](https://nestjs.com/). This project is mainly used for learning/trial and boilerplate purposes only.

## Graph Model

When creating GraphQL APIs, one must understand what [Graph Theory](https://en.wikipedia.org/wiki/Graph_theory) and Graph Data Modelling are. One must also [think in graphs](https://graphql.org/learn/thinking-in-graphs/) as per the GraphQL specification recommends. A diagram of the graph data model is shown below.

![Graph Model](https://raw.githubusercontent.com/benjsicam/nestjs-graphql-microservices/master/docs/img/graph-model.png)

### Explanation

1. Users can write both posts and comments therefore, users are authors posts and comments.
2. Posts are authored by users and comments can be linked/submitted for them.
3. Comments are authored by users and are linked/submitted to posts.

## Architecture Overview
 
The GraphQL API acts as a gateway/proxy for the different microservices it exposes. The resolvers of the GraphQL API make calls to the gRPC microservices through client-server communication. The services and the data interchange are defined using [Protocol Buffers](https://developers.google.com/protocol-buffers/). The gRPC microservices handle and fulfill the requests whether they are database or storage operations or any other internal or external calls.

### Diagram

A diagram of the architecture is shown below.

![Architecture Diagram](https://raw.githubusercontent.com/benjsicam/nestjs-graphql-microservices/master/docs/img/archi-diagram.png)

This architecture implements the following Microservice Design Patterns:

1. [Microservice Architecture](https://microservices.io/patterns/microservices.html)
2. [Subdomain Decomposition](https://microservices.io/patterns/decomposition/decompose-by-subdomain.html)
3. [Externalized Configuration](https://microservices.io/patterns/externalized-configuration.html)
4. [Remote Procedure Invocation](https://microservices.io/patterns/communication-style/rpi.html)
5. [API Gateway](https://microservices.io/patterns/apigateway.html)
6. [Database per Service](https://microservices.io/patterns/data/database-per-service.html)

## Layers

### API Layer

[NestJS + GraphQL](https://nestjs.com/) acts as the API Layer for the architecture. It takes care of listening for client requests and calling the appropriate back-end microservice to fulfill them.

### Microservice Layer

[NestJS + gRPC](https://grpc.io/) was chosen as the framework to do the microservices. [Protocol buffers](https://developers.google.com/protocol-buffers/) was used as the data interchange format between the client (GraphQL API) and the server (gRPC microservices). NestJS is still the framework used to create the gRPC Microservices.

### Persistence Layer

PostgreSQL is used as the database and [Sequelize](https://sequelize.org) is used as the Object-Relational Mapper (ORM).

## Deployment

Deployment is done with containers in mind. A Docker Compose file along with Dockerfiles for the GraphQL API Gateway and each microservice are given to run the whole thing on any machine. For production, it's always recommended to use [Kubernetes](https://kubernetes.io/) for these kinds of microservices architecture to deploy in production. [Istio](https://istio.io/) takes care of service discovery, distributed tracing and other observability requirements.

## How to Run

### Pre-requisites

You must install the following on your local machine:

1. Node.js (v12.x recommended)
2. Docker
3. Docker Compose
4. PostgreSQL Client (libpq as required by [pg-native](https://www.npmjs.com/package/pg-native#install))

### Running

1. On the Terminal, go into the project's root folder (`cd /project/root/folder`) and execute `npm start`. The start script will install all npm dependencies for all projects, lint the code, transpile the code, build the artifacts (Docker images) and run all of them via `docker-compose`.

2. Once the start script is done, the GraphQL Playground will be running on [http://localhost:3000](http://localhost:3000)

## Roadmap

### API Gateway

* [ ] Add unit tests
* [x] Add refresh token support
* [ ] Add request/input data validation
* [ ] Improve logging
* [ ] Improve error handling
* [ ] Add DataLoader support

### Microservices

* [x] Add authorization
* [ ] Add caching
* [ ] Add health checks
* [ ] Add unit tests
* [ ] Improve logging
* [ ] Improve error handling
