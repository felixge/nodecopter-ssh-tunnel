# nodecopter-ssh-tunnel

This repository contains a collection of bash scripts that allow controlling
a Parrot AR Drone 2.0 via ssh tunneling through the internet.

## Regular SSH Tunnel

Regular ssh tunneling is not implemented, but I'd be happy to accept a patch.

## Reverse SSH Tunnel

Example Situation:

* Your machine (the client) can be reached via ssh over the internet.
* Another machine (the server) is connected to an AR Drone via WiFi and also
  connected to the internet (via Ethernet, or USB/Bluetooth Tethering)
* The goal is to control the AR Drone connected to the other machine (the
  server) from your machine (the client).

On your machine (the client):

```bash
$ ./reverse/client.sh
```

On the other machine (the server):

```bash
$ ./reverse/server.sh <ssh_user@client_ip>
```
