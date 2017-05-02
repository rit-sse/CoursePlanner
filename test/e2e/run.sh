#!/bin/bash

#Start server in background in test mode
#save pid so we can kill later
TEST=true node dist/server.js & SERVER_PID=$!

#Start selenium
webdriver-manager start > /dev/null 2>&1 &
SELENIUM_PID=$!

echo Waiting for 10 seconds...
sleep 10 # wait 10 seconds for everyting to start

#run e2e tests
npm run protractor

#kill processes we started
echo "----- Killing processes -----"

#First we need to kill the children of the children
# this is because webdriver-manager start will start
# other processes on its own
CHILD_PROCESSES=$(pgrep -P $$)
echo Our children: $CHILD_PROCESSES
for ps in $CHILD_PROCESSES; do
    echo Killing children of $ps
    pkill -P $ps 
done

#Kills all children of this process
pkill -P $$
