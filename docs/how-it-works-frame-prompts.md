# "How it works" — Image & Video Frame Prompts

Following the [scroll-story-3d skill's](../.claude/skills/scroll-story-3d/SKILL.md) frame-sequence approach
(60 frames per video, 3-act structure per step).

---

## Image 1: Spec + Build (Pair)

**Prompt:**

> A dark, modern tech workspace with a wide monitor displaying a clean architectural diagram / technical specification document with flowcharts and system architecture lines. One side shows a laptop with code editor open. Floating holographic UI elements, blue and teal accent lighting. Dark theme, cyberpunk-tinged but professional. The room transitions from paperwork (left) to code/deployment (right). 16:9, cinematic, dark mode aesthetic, rim lighting, volumetric glow.

---

## Image 2: Deploy + Operate (Pair)

**Prompt:**

> A server rack or cloud infrastructure visualization with glowing neon data streams flowing. A dashboard monitor displaying real-time metrics, uptime status, and automated reports. Abstract representations of 24/7 operation — a clock, pulsing green checkmarks, Slack notification mockups. Dark background with electric blue (#3D7BFF) and teal (#10B981) accents. 16:9, cinematic, tech noir aesthetic, motion blur on data streams.

---

## Video Frame Prompts (Per Step, 60 frames each)

### Step 1 — Spec

| Act | Frames | Description |
|-----|--------|-------------|
| Act 1 (1–17) | 1–17 | Blank document template zooms in, faint grid lines appear, cursor blinks at top |
| Act 2 (18–41) | 18–41 | Text and diagrams rapidly write themselves — architecture boxes connect, arrows draw, API endpoints fill in, database schemas populate. Glowing blue lines trace through the system |
| Act 3 (42–60) | 42–60 | The spec document settles, all nodes connected, a clean full-system diagram visible. Soft pulsing glow on the final connections |

### Step 2 — Build

| Act | Frames | Description |
|-----|--------|-------------|
| Act 1 (1–17) | 1–17 | Code editor opens with the spec document floating to the side. Empty file, cursor waits |
| Act 2 (18–41) | 18–41 | Code streams in rapidly — functions, modules, API routes, agent definitions. Syntax highlighting races line by line. Small agent icons spawn and begin moving |
| Act 3 (42–60) | 42–60 | Code complete, terminal shows "Build successful". The spec document beside it highlights matching sections in green. Agents animate briefly in a corner |

### Step 3 — Deploy

| Act | Frames | Description |
|-----|--------|-------------|
| Act 1 (1–17) | 1–17 | Server rack dim. A single deploy button glows. Terminal waiting for input |
| Act 2 (18–41) | 18–41 | Pipeline animation — code packages, test checkmarks appear, docker containers stack, deployment arrows fly across a network topology map. Green checkmarks cascade |
| Act 3 (42–60) | 42–60 | Server rack fully lit with green indicators. Dashboard shows "Production — All Systems Normal". Monitoring graphs begin tracing upward |

### Step 4 — Operate

| Act | Frames | Description |
|-----|--------|-------------|
| Act 1 (1–17) | 1–17 | Dashboard showing static metrics. Clock ticks. Dark idle state |
| Act 2 (18–41) | 18–41 | Data streams pulse — incoming webhooks, automated workflows trigger, completion checkmarks scatter. A timeline shows tasks completing through the night. Slack/email notification mockups pop and dismiss |
| Act 3 (42–60) | 42–60 | Morning report generates. Dashboard shows "24h Summary — All Tasks Complete". The agent icon rests in a corner. A human avatar receives the report notification |

---

## Video generation workflow

Per the skill's **Technique 1 — Frame-sequence scrubbing**:

```bash
# 1. Generate each step as a ~2–3s video clip (60 frames)

# 2. Build a forward + reverse loop
scripts/build-loop.sh -f step1.mp4 -o step1-loop.mp4

# 3. Extract 60 WebP frames
scripts/extract-frames.sh -i step1-loop.mp4 -o assets/frames/step1 -n 60

# 4. Wire up with ScrollStory.tsx using data-act ranges per step
```
