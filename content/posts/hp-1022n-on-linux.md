---
date: 2009-08-16 01:30:00.004000+00:00
draft: false
tags:
- hardware
- linux
- web
title: HP 1022n on Linux
---

Installation instructions from:  
<http://www.linuxquestions.org/questions/linux-software-2/cups-unable-to-discover-an-hp-1022n-network-printer-710492/>

Here are the essential instructions:

1. Configure the printer with its own facility, getting into its web page: http://the-actual-ip-address.
2. There, assign a static IP address of your choice.
3. You would have to (recommended) restart the printer with the new assigned static IP.
4. Configure manually the printer within CUPS.
5. Follow instructions up to the point where you are asked to specify the URI. There, write
   socket://the-new-ip-address
6. Specify it is an HPLIP printer, and when prompted to specify the type of printer, scroll down and find the "HP LaserJet 1022n Foomatic/hpijs, hpijs 2.8.10.33" (for example, version is actually the one shown in my system, could be some other).
7. Choose Add Printer.
8. Print a Test Page and...
9. Voila...!!
