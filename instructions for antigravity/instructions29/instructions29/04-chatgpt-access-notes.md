# 04 — Notes for making it reachable to ChatGPT Agent

ChatGPT Agent can only hit URLs that are:
- public internet reachable
- no interactive login (SSO/VPN)
- no IP allow-listing (egress IP is not stable)

If you need protection, prefer:
- an obscure unguessable path for the demo *or*
- a temporary separate “stage” env.

Avoid:
- Cloudflare Access / Google auth walls
- Corporate VPN-only DNS
- IP allow-listing for inbound

Your ALB module already opens port 80 to 0.0.0.0/0; the key is just **sharing the base URL**.
