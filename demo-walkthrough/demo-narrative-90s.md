# Demo Narrative (90 seconds)

## Opening (10s)
“Ghost Engine is a deterministic, plug-in game generation kernel: it takes a prompt and produces a playable level spec you can replay and share.”

## Setup (10s)
“I’ll generate a DOOM-style ‘doom-bridge’ level from a simple prompt and immediately play it in the browser.”

## Warmup (10s)
(Click Warmup) “This checks that our backend dependencies are healthy—DynamoDB for jobs and S3 for artifacts.”

## Generate (20s)
(Click Generate) “A job is created and processed by workers. Because the output is deterministic, the same seed produces the same LevelSpec—great for debugging and collaboration.”

## Play (30s)
(Click Play Browser; move around)
“This is the generated level running live. Under the hood, the runtime loads the LevelSpec and renders a minimal DOOM-style grid. We can share this exact job link and replay it anytime.”

## Close (10s)
“This is the kernel. Next we expand with more plugins and richer runtimes—GE DOOM becomes a full showcase title, but the deterministic engine stays the same.”

## Optional 15s extension (if time)
(Replay same seed) “Same seed, same spec—byte-identical.”
