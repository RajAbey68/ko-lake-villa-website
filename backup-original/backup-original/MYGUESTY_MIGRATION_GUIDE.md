# myGuesty Migration Guide

## Quick URL Update for Ko Lake Villa

When you're ready to integrate with myGuesty, simply update these environment variables in your `.env` file:

### Current Airbnb URLs
```
AIRBNB_KLV_URL=https://airbnb.co.uk/h/klv
AIRBNB_KLV1_URL=https://airbnb.co.uk/h/klv1
AIRBNB_KLV3_URL=https://airbnb.co.uk/h/klv3
AIRBNB_KLV6_URL=https://airbnb.co.uk/h/klv6
```

### Update to myGuesty URLs
Replace with your myGuesty booking links:
```
AIRBNB_KLV_URL=https://your-myguesty-domain.com/entire-villa
AIRBNB_KLV1_URL=https://your-myguesty-domain.com/master-suite
AIRBNB_KLV3_URL=https://your-myguesty-domain.com/triple-rooms
AIRBNB_KLV6_URL=https://your-myguesty-domain.com/group-room
```

## What This Updates

The short URLs will automatically redirect to your new myGuesty links:
- `/klv` → Your myGuesty entire villa booking page
- `/klv1` → Your myGuesty master suite booking page
- `/klv3` → Your myGuesty triple rooms booking page
- `/klv6` → Your myGuesty group room booking page

## No Code Changes Required

All redirects and room configuration will automatically use the new URLs once you update the environment variables.

## Testing After Migration

Test each short URL to ensure proper redirection:
```bash
curl -I https://your-domain.com/klv
curl -I https://your-domain.com/klv1
curl -I https://your-domain.com/klv3
curl -I https://your-domain.com/klv6
```

Each should return a 301 redirect to your myGuesty booking pages.