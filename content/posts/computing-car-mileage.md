---
date: 2008-11-25 03:43:00.009000+00:00
draft: false
tags:
- FountainPen
title: computing (car) mileage
---

I've been thinking on how best to get an accurate estimate of fuel consumption on my Honda Civic. Here is what I came up with:

* keep a notebook in car
* upon filling up the tank with gas:

+ fill the tank all the way up
+ note how many litres were purchased; write this down in the notebook, with today's date
+ also write down how many kilometres were travelled since last such refueling
+ reset the "fuel" distance counter

Figuring out the mileage over the distance travelled since the last refueling thus becomes trivial:

> mileage = 100km / distance travelled \* litres consumed

This gives you Canadian-style mileage, expressed in litres per 100km.
