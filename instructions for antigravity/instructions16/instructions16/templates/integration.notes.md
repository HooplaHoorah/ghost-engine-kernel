# Integration notes (demo.js)

## 1) Track current jobId
Ensure your demo script has a single source of truth for the current jobId, e.g.:
- `let currentJobId = null;`
- set it when generating or when loading from URL params

## 2) Wire Copy Share Link
After DOM is ready:
- `wireCopyShareLink(() => currentJobId);`

## 3) Save last success on done
Where you handle status == "done":
- call `saveLastGoodJobId(currentJobId);` AFTER successful render

## 4) Offer fallback on errors
Where you handle:
- POST /generate-scene failure
- status == "failed"
- poll timeout

Call:
- `showLoadLastSuccess((id) => loadJobById(id));`
Where `loadJobById` is your existing function that updates URL + polls + renders.

## 5) Clear error actions on success
On successful render, set `document.getElementById("errorActions").innerHTML = ""`.

