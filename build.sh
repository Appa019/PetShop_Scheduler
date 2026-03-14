#!/bin/bash
set -e

# Build landing page
cd landing && npm install && npm run build && cd ..

# Build app
cd frontend && npm install && npm run build && cd ..

# Merge outputs
mkdir -p dist
cp -r landing/dist/* dist/
mkdir -p dist/app
cp -r frontend/dist/* dist/app/
