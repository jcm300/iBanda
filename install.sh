#!/bin/bash

#Clone rep
git clone https://github.com/jcm300/iBanda.git

echo "Change the url in variable app.locals.url in app.js and change the private and public key in the folder auth. When done press some letter to continue."
read -n 1 -p "Continue?";

#start mongoDB
mongod &

#generate grammars
cd iBanda/grammars
gradle generateAgendaParser
gradle generateNewsParser

#Install packages dependencies
cd ..
npm install

#Start
npm start