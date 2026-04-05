---
date: 2007-11-12 21:28:00.001000+00:00
draft: false
tags:
- Ai
- FountainPen
- Programming
- Web
title: Windows STOP messages
---

I just had Windows reboot out of the blue (no BSOD, just as if I pressed RESET). Looking at the system event log it seems Windows ran into trouble:
Event Type: Information
Event Source: Save Dump
Event Category: None
Event ID: 1001
Date: 12/11/2007
Time: 3:19:32 PM
User: N/A
Computer: SKYNET
Description:
The computer has rebooted from a bugcheck. The bugcheck was: 0x100000d1 (0x00000000, 0x00000002, 0x00000001, 0xba940dc2). A dump was saved in: C:\WINDOWS\Minidump\Mini111207-01.dmp.
For more information, see Help and Support Center at http://go.microsoft.com/fwlink/events.asp.
A useful website detailing the STOP codes: <http://aumha.org/a/stop.htm>
Also of interest is the KB article on dealing with the minidumps: <http://support.microsoft.com/kb/315263>
