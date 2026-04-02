---
date: 2011-10-28 17:49:00.001000+00:00
draft: false
tags:
- hardware
- linux
title: disconnecting iPod from Linux
---

When I plug in an iPod into a machine running Ubuntu, the iPod auto-connects, but is not actually mounted.  This is especially problematic when I am running under i3 or other window manager which does not have a system tray or other mechanism for listing connected devices.  
  
Turns out it is easy to disconnect:  
  **sudo eject /dev/sdb1**  
  
Season the device path as appropriate for your system.  I typically find the device name by looking through **/var/log/messages** for the USB messages for when I connect the iPod.
