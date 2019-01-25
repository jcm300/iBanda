#!/bin/bash

if [ $# -eq 1 ]; then
    if [ $1 = "p" ]; then
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
    elif [ $1 = "i" ]; then
        #start mongoDB
        mongod &

        #generate grammars
        cd grammars
        gradle generateAgendaParser
        gradle generateNewsParser

        #Install packages dependencies
        cd ..
        npm install

        #Start
        npm start
    elif [ $1 = "t" ]; then
        #create folder
        mkdir -p ~/Downloads/mongoDB

        #start mongoDB
        mongod --dbpath ~/Downloads/mongoDB/ & 
        
        #generate grammars
        cd grammars
        gradle generateAgendaParser
        gradle generateNewsParser
        
        #Start
        cd ..
        npm start
    elif [ $1 = "r" ]; then
        #create folder
        mkdir -p ~/Downloads/mongoDB

        #start mongoDB
        mongod --dbpath ~/Downloads/mongoDB/ & 
        sleep 5
        #Start
        npm start
    elif []; then
        echo "Wrong Parameter"
        echo "Please insert a paramenter:"
        echo "p --> Production"
        echo "i --> Install"
        echo "t --> Test"
        echo "r --> Run"
   
    fi
elif [ 1 ]; then
    echo "Please insert a paramenter:"
    echo "p --> Production"
    echo "i --> Install"
    echo "t --> Test"
    echo "r --> Run"
fi
