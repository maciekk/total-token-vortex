---
date: 2012-06-12 02:49:00.003000+00:00
draft: false
tags:
- FountainPen
- Hardware
- Review
title: HP Laserjet 1022n under Windows 7
---

Use the 1020 driver, but turn off bidirectional support, to avoid a page job printing repeatedly.  See:  
  <http://h10025.www1.hp.com/ewfrf/wc/document?docname=c02205132&tmp_track_link=ot_faqs/top_issues/en_us/c02205132/loc:10&lc=en&dlc=en&cc=us&lang=en&product=4110396>  
  
Also suggestions on installing driver:  
<http://www.w7forums.com/drivers-hp-laserjet-1022n-printer-t5048p2.html>
  
  
  

|  |  |
| --- | --- |
| Install HP LaserJet 1022n on Windows 7 (You DONT have to connect it to USB)   * Download LaserJet 1022n driver from HP  32 bit - lj1020-HB-pnp-win32-en 64 bit - lj1020-HB-pnp-win64-en    * Run your downloaded driver  HP driver install window opens asking you to connect the USB cable   * CANCEL installation  IMPORTANT NOTE: This extracts the needed driver to your Hard Drive. Your driver will be extracted to folder: (64 bit) C:\Program Files\HP\HP LaserJet 1020 Driver (32 bit) C:\Program Files (x86)\HP\HP LaserJet 1020 Driver    * Add your printer manually - START > Devices and Printers > Add a Printer * Add a Local Printer > Create a new port > Standard TCP/IP Port > NEXT * Enter the IP address > NEXT  If you dont know the IP, have you 1022n ON, hold the diamond shaped button down for 10 seconds. A configuration page will print with the IP on it .    * "Install a printer Driver" screen opens, click HAVE DISK * Browse to the folder where your driver was extracted (shown above) * Choose the "HPLJ1020" file > OPEN > OK > NEXT * Select your printer name > NEXT > FINISH |  |

---

> **Claude (migration note):** _Possible broken/collapsed markdown table (very long pipe-delimited line detected)._
