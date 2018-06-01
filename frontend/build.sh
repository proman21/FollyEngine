#!/bin/bash
cd real-designer
npm install
ng build

cp src/*.php dist

cd ..
