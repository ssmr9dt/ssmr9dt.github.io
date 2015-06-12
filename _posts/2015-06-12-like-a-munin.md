---
layout: post
title: munin
---

## like a munin

### make a script
```
$ vim /usr/local/bin/mm
#!/bin/bash

read arg0 arg1

arg0=$(echo $arg0 | tr -d "\r" | tr -d "\n");
arg1=$(echo $arg1 | tr -d "\r" | tr -d "\n");

echo "#"

#if [ $# -eq 0 -o $arg1 = "cpu" ]; then
  echo "cpu `ps aux | awk '{total = total + $3} END{print total}'`"
#fi
echo "memory `free | awk '/buffers\/cache/{print $3/($3+$4)*100}'`"
echo "hdd `df --portability | awk '/md0/{print $3/($3+$4)*100}'`"

echo "."
```

## regist xinetd
```
$ vim /etc/xinetd.d/mm
service mm
{
  disable         = no
  port            = 4950
  socket_type     = stream
  wait            = no
  only_from       = 127.0.0.1 192.168.1.0/24
  user            = root
  server          = /usr/local/bin/munin-murakami
  log_on_failure  += USERID
}
```

## follow-up!
```
$ telnet localhost 4950
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.

#
cpu 0.7
memory 51.2232
hdd 61.4268
.
Connection closed by foreign host.
```
