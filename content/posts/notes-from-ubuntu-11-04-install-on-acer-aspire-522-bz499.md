---
date: 2011-05-29 04:14:00+00:00
draft: false
tags:
- fountain-pen
- hardware
- linux
title: Notes from Ubuntu 11.04 install on Acer Aspire 522 - BZ499
---

* C-50 Ontario processor is 64-bit, so we'll use the 64 bit image: ubuntu-11.04-desktop-amd64.iso
* installed image onto USB stick using: 'sudo usb-creator-gtk' command
* make sure BIOS is configured to read from USB stick before HDD
* note: ubuntu kept hanging on me (mouse cursor/throbber frozen)... from posts on Net I suspect it is due to wireless driver

+ solution: install with wired connection plugged in; this allowed me to do install no problem
+ this link sounds relevant: http://fossplanet.com/f10/[bug-775034]-[new]-natty-freezes-due-acer-aspire-one-522-wireless-148584/

* suspend and hibernate work right out of the box with this (tested both)
* clicking on Additional Drivers in top bar, it seems we are already using Broadcom STA wireless driver (hence could conflict with other one)
* now able to use wifi (w/o wired plugged in) using following:

+ add in /etc/modprobe.d/blacklist.conf this line: "blacklist atl1c"
+ "sudo update-initramfs -u"

* suspend still works
* outstanding issues:

+ (non-proprietary) video driver has poor YouTube playback, etc.
+ after resume (from Suspend?) the Ubuntu top and left bars stop updating visually (Ubuntu One compiz component; switch to "Ubuntu Classic" in GDM and all is well)

* attempting ATI/AMD proprietary FGLRX gfx driver install...

+ resume from suspend no longer working... can't even ping the machine (but did not check earlier that I actually could)

* went back to non-proprietary video drivers
