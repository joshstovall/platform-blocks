---
title: QRCode
category: data-display
tags: [qrcode, barcode, scan, data, encoding]
---

The QRCode component generates QR codes for encoding text, URLs, or other data. Supports customization of size, colors, quiet zones, error correction, and various rendering options.

## Key capabilities

- Full UTF-8 payload support so international characters and emoji render reliably.
- Automatic version selection up to Version 40 (177×177 modules) based on payload and error level.
- Default quiet zone of 4 modules applied consistently to improve scanner legibility (customizable via `quietZone`).
