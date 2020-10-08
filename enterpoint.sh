#!/bin/bash
set -e

find /etc/nginx -name 'default.conf' | xargs sed -i "s V_SERVER_NAME $SERVER_NAME g"

cat /etc/nginx/conf.d/default.conf

exec "$@"
