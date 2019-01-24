#!/bin/bash

#Convert attribute names to english ones
sed -i '/\"_id\"[^\n]*/d' "$@"
sed -i "s/titulo/title/" "$@"
sed -i "s/tipo/type/" "$@"
sed -i "s/compositor/composer/" "$@"
sed -i "s/instrumentos/instruments/" "$@"
sed -i "s/arranjo/arrangement/" "$@"
sed -i "s/nome/name/g" "$@"
sed -i "s/partitura/score/g" "$@"
sed -i "s/voz/voice/g" "$@"
sed -i "s/afinacao/tune/g" "$@"

#Import files to mongoDB
for f in $* 
do
    mongoimport -d iBanda -c pieces --file "$f"
done
