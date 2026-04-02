---
date: 2011-10-17 00:46:00+00:00
draft: false
tags:
- ai
- linux
title: setting static IP in Ubuntu
---

By default recent Ubuntus (e.g., 11.10) use Network Manager, which makes things simple:  
  

* click network icon in system tray
* Edit Connections
* select the one entry that you see there (unless your network is not working)
* Edit...
* IPv4 Settings
* From Method drop-down select Manual
* the rest should be straight forward

If not using Network Manager to manage network connections, you need to edit /etc/network/interfaces and add (adjust to own network parameters):

auto eth0

iface eth0 inet static

address 192.168.0.100

netmask 255.255.255.0

network 192.168.0.0

broadcast 192.168.0.255

gateway 192.168.0.1
