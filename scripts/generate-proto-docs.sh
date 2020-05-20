#!/bin/bash

docker run --rm \
  -v $PWD/docs/proto:/out \
  -v $PWD/_proto:/protos \
  pseudomuto/protoc-gen-doc --doc_opt=markdown,docs.md