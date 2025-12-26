# Prettify-on-paste for Backup JSON textarea

## Goal
Avoid failures due to minor JSON formatting issues and give immediate feedback.

## Behavior
- On paste and on blur:
  - attempt JSON.parse
  - if parse succeeds:
    - pretty print back into textarea
    - show status “Valid JSON”
  - if parse fails:
    - show status “Invalid JSON” (do not modify textarea)

This does not save to localStorage; Save button still controls persistence.

See `templates/demo.prettify-on-paste.snippet.js`.

