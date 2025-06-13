#!/bin/bash

# run redis-server use "redis-server" command
# run ES use "~/elasticsearch-8.4.1/bin/elasticsearch" command

# onnect to server on windows
export UESTC_BBS_BACKEND_SERVER=http://192.168.31.139:8080

# test connection
curl http://192.168.31.139:8080/star/api/v1/ok

# run
pnpm run bbs:dev
