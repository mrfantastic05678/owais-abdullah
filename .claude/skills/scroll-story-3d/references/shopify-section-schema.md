# Shopify Section Conventions (Online Store 2.0)

Verify current schema attribute list via Tavily/`shopify.dev` before relying
on this for a live theme — Shopify revises schema settings periodically.

## File placement

- Lives at `sections/<name>.liquid` in the theme. One `{% schema %}...{%
  endschema %}` block per file, at the end, never rendered to the storefront.
- Add it to a template's JSON (`templates/index.json` etc.) or let merchants
  add it via "Add section" in the theme editor if it has a `presets` entry.

## Schema shape used by this skill's template

```json
{
  "name": "Scroll Story",
  "tag": "section",
  "class": "scroll-story-section",
  "settings": [
    { "type": "select", "id": "mode", "label": "Playback mode",
      "options": [
        { "value": "frames", "label": "Frame sequence (best performance)" },
        { "value": "video", "label": "Video (simpler, upload one clip)" }
      ], "default": "video" },
    { "type": "video", "id": "story_video", "label": "Story video (loop: calm -> dramatic -> calm)" },
    { "type": "text", "id": "frames_base_url", "label": "Frame sequence base URL",
      "info": "Only used in Frame sequence mode. Run scripts/extract-frames.sh, upload the .webp files to Shopify Files, then paste the shared URL prefix here (everything before the 3-digit frame number)." },
    { "type": "range", "id": "frame_count", "label": "Frame count", "min": 10, "max": 200, "step": 1, "default": 60 },
    { "type": "range", "id": "act1_end", "label": "Act 1 end (%) — calm/floating", "min": 5, "max": 50, "step": 1, "default": 28 },
    { "type": "range", "id": "act2_end", "label": "Act 2 end (%) — dramatic transform", "min": 50, "max": 95, "step": 1, "default": 68 },
    { "type": "color", "id": "text_color", "label": "Overlay text color", "default": "#FFFFFF" }
  ],
  "blocks": [
    {
      "type": "act",
      "name": "Act overlay",
      "settings": [
        { "type": "text", "id": "heading", "label": "Heading" },
        { "type": "textarea", "id": "subheading", "label": "Subheading" },
        { "type": "range", "id": "start_pct", "label": "Show from scroll %", "min": 0, "max": 100, "step": 1, "default": 0 },
        { "type": "range", "id": "end_pct", "label": "Show until scroll %", "min": 0, "max": 100, "step": 1, "default": 28 }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [
    { "name": "Scroll Story", "blocks": [ { "type": "act" }, { "type": "act" }, { "type": "act" } ] }
  ]
}
```

## Why `mode: video` is the schema default, not `frames`

Shopify's theme editor has no native "upload an image sequence" input —
merchants can pick one `video` (native picker, hosted on Shopify's CDN) or
one image at a time via `image_picker`, but not bulk-upload 40-80
sequentially-named frames through the editor UI. So:

- **`video` mode** (default): merchant uploads one MP4 via the native
  `type: "video"` setting — zero CLI needed, works out of the box, uses the
  engine's `<video>`-scrub fallback path (see `browser-scroll-apis.md` for
  why that's the fallback, not the primary path).
- **`frames` mode** (opt-in, better perf): for merchants/developers willing
  to run `scripts/extract-frames.sh` locally and upload the resulting
  `.webp` files to **Settings → Files** in Shopify admin, then paste the
  shared URL prefix into `frames_base_url`. The section builds each frame
  URL as `` `${frames_base_url}${String(i).padStart(3, '0')}.webp` ``.

Don't try to make `frames` mode automatic/no-code for merchants — that
requires a public Files API or a custom app, out of scope for a theme
section. Document the manual upload step clearly in the section's `info`
field instead (already included above).

## Required conventions to keep

- `{{ block.shopify_attributes }}` on each rendered block's root element —
  without it, merchants can't click-to-select that block in the editor.
- `class` at the schema root scopes the section's outer wrapper class for
  free — use it instead of hardcoding a class name in two places.
- `presets` is what makes the section appear in "Add section" at all; omit
  it only if the section should be template-only (not merchant-addable).
- Keep all copy defaults in the schema's `default` values so a merchant who
  adds the section from presets sees a working, non-empty demo immediately
  — never ship a preset that renders blank.
