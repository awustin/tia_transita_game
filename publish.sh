#!/usr/bin/bash

function copyFilesToWebDirectory {
    webDir="/var/www/html"

    if [ ! -z $1 ]
    then webDir+="/$1"
    fi

    OUTPUT=$(sudo cp -r public/. $webDir/tia_transita/)

    if [ $? == 0 ]
    then echo "| Published to $webDir"
    else echo "$OUTPUT"
    fi
}

function copyIndexToPublic {
    OUTPUT=$(sudo cp index.html public/.)

    if [ $? == 0 ]
    then echo "| Copied index.html to public/"
    else echo "$OUTPUT"
    fi
}

printf "| ########################\n| PUBLISH TO SERVER FOLDER\n| ########################\n\n"
workdir=$(pwd);

# Arguments passed
subfolder=$1 || NULL
copyIndexToPublic=$2 || true

if $2 ; then copyIndexToPublic
fi

copyFilesToWebDirectory "$subfolder"
