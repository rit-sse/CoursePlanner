#!/bin/bash

SECRETS="/run/secrets"

export GOOGLE_CLIENT_SECRET=`cat $SECRETS/GOOGLE_CLIENT_SECRET`
export JWT_SECRET=`cat $SECRETS/JWT_SECRET`

node dist/server.js -p $PORT
