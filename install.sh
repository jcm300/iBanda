#!/bin/bash

git clone https://github.com/jcm300/iBanda.git

echo "Change the url in variable app.locals.url in app.js and change the private and public key in the folder auth. When done press some letter to continue."
read -n 1 -p "Continue?";

mongod &
cd iBanda
npm install
npm start
