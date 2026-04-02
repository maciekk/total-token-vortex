---
date: 2008-09-28 20:00:00.002000+00:00
draft: false
tags:
- review
title: Installing Win2K without key
---

(From <http://www.petri.co.il/install_windows_2000_without_supplying_the_cd_key.htm>)

How can I install Windows 2000 without supplying the CD key?

You can configure W2K to install without having to manually enter the CD key during the setup process.

First, you want to copy your Windows 2000 setup files from your CD to your hard drive. You have to copy at least the I386 directory.

Now go into the I386 directory you just copied onto your hard drive and look for a file called *setupp.ini*.

Right click it, select Properties, and remove the Read-only checkmark. Now open the file to edit it.

Your setupp.ini file should read something like this:

[Pid] ExtraData=6166656C736263737373B2574A0581 Pid=51873XXX![](chrome://itsalltext/locale/gumdrop.png "It's All Text!")

Replace the 3 X's (generally it'll be three zeros) at the end with "270". It should now read something like this:

[Pid] ExtraData=6166656C736263737373B2574A0581 Pid=51873270![](chrome://itsalltext/locale/gumdrop.png "It's All Text!")

That’s it! Now you can now install Windows 2000 without a serial number!

---

> **Claude (migration note):** _Contains instructions for bypassing software license validation — review for current relevance/legality._
