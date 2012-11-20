# nodecopter-ssh-tunnel

This repository contains a collection of bash scripts that allow controlling
a Parrot AR Drone 2.0 via ssh tunneling through the internet.

## Regular SSH Tunnel

Regular ssh tunneling is not implemented, but I'd be happy to accept a patch,
it should be pretty simply.

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

Now configure your ar drone library to use `127.0.0.1` as the drone ip on
the client machine.

That's it!

(This whole things is a huge hack, so you're responsible for any collateral
damage you may cause with it.)
