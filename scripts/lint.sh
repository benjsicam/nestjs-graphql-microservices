#!/bin/bash

cd api-gateway && npm run lint:fix && cd -
cd microservices/comments-svc && npm run lint:fix && cd -
cd microservices/posts-svc && npm run lint:fix && cd -
cd microservices/users-svc && npm run lint:fix && cd -
cd microservices/mailer-svc && npm run lint:fix && cd -
