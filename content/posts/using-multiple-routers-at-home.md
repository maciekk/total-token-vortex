---
date: 2009-08-06 14:53:00.006000+00:00
draft: false
tags:
- Ai
- FountainPen
- Hardware
title: using multiple routers at home
---

<http://forums.linksysbycisco.com/linksys/board/message?board.id=Access_Points&thread.id=11089>
The above forum thread discusses how to setup multiple routers at home. In particular, the thread is by someone in a similar situation to my own, where the cable modem comes with a wireless router already, which are setup in the basement, and wants to add a second router on second floor of house for better connectivity. The solution:

```
There are 2 ways this can be done.

1. Use the WRT54GS as a router and cascade the routers.
2. Use the WRT54GS as an Access Point (AP).

Solution for option 1.
Set the LAN IP of the WRT54GS to 192.168.2.1
Set the WAN IP of the WRT54GS to 192.168.1.2
Set the Gateway and DNS to 192.168.1.1
Set the DNS server IP range to suit the new IP
Connect the Ethernet cable from the WAN port of
the WRT54GS to the LAN port of your choice.
Clients will get an IP from the WRT54GS.

Solution for option 2.
Install DD-WRT for the WRT54GS
Turn off the WAN port.
Turn off the DHCP server
Set the LAN IP to 192.168.1.2
Set the Gateway and DNS to 192.168.1.1
Connect the Ethernet cable from the LAN port to
of the WRT54GS to the LAN port of your choice.
Clients will get an IP from the TRENDnet device.

This was done from the top of my head as I was
to lazy to check my WRT54G for the settings, but
I am sure they are correct.

The difference between the 2 setups is that your
network will appear as 2 different networks under
option 1. In option 2 everything will appear as a
single network. As far as function is concerned
I don't think you will realistically notice the
operational difference.

As for the wireless side of things I suggest setting
a different SSID and channel to the primary router.
Try to use WPA security if the option is available.

Regards

Fred
```
