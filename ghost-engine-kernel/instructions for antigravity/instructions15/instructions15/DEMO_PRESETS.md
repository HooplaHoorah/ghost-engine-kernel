# Demo presets (“Presentation” group)

## Goal
Stage-safe prompts that complete quickly and show the gameplay beats clearly.

## Recommended presets
1) 3 rooms + locked exit + key (seed 12345)
   Prompt: "A tiny dungeon with 3 rooms and a key behind a locked door."

2) 2 rooms + straight shot exit (seed 222)
   Prompt: "Two rooms connected by a doorway; exit in the second room."

3) 4 rooms + one enemy ambush (seed 333)
   Prompt: "Four small rooms; place an enemy guarding the path to the exit."

4) Hub + spokes vibe (seed 444)
   Prompt: "A hub room connected to three side rooms; key in one side room; exit in another."

5) Arena + door (seed 555)
   Prompt: "An arena room with a locked door leading to the exit; key near spawn."

## Implementation
In the demo UI preset data structure, add objects like:
- label
- prompt
- plugin
- seed

Selecting a preset sets:
- prompt textarea value
- plugin dropdown
- seed input

