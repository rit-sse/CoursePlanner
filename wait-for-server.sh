RETRIES=20

echo "Waiting for server to start..."

while [ $RETRIES -gt 0 ] ; do
    wget localhost:8080
    if [ $? -eq 0 ] ; then
        exit 0
    fi
    RETRIES=$(($RETRIES-1))
    echo "Sleeping for 1m. $RETRIES retries left"
    sleep 1m
done

echo "Never connected to server"
exit 1
