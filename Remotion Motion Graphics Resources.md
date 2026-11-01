# Open-Source Motion Graphics & SVG Resources for Code-Driven Explainer Videos

Creating [Kurzgesagt](https://kurzgesagt.org/)-style educational explainers with [Remotion](https://www.remotion.dev/) and AI coding agents works best when you separate **vector illustration assets** from **programmatic animation logic**. Rather than prompting an LLM to draw complex vector paths from scratch, combine pre-built motion graphics repositories, layered open-source SVG libraries, state-machine animations, and code-first explainer engines.

## Pre-Built Remotion Repositories Accelerate Scene Assembly and AI Prompting

Open-source component libraries and agent skill packs give [Remotion](https://www.remotion.dev/) and Claude Code production-ready building blocks for camera movements, transitions, kinetic typography, and particle effects.

| Repository or Package | Primary Focus | Key Capabilities for Explainer Videos |
| :--- | :--- | :--- |
| [lifeprompt-team/remotion-scenes](https://github.com/lifeprompt-team/remotion-scenes) | 201+ motion graphics scenes | Provides ready-to-use, After Effects-inspired React animation scenes and templates for explainers. |
| [av/remotion-bits](https://github.com/av/remotion-bits) | Composable animation utilities | Supplies particle systems, gradient transitions, text effects, 3D scene helpers, and color utilities. |
| [degueba/onda](https://github.com/degueba/onda) | Editable motion components | Drops `.tsx` source files and Zod schemas directly into your repo so you and Claude Code own and edit the code. |
| [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) | 50 AI coding agent skills | Teaches AI coding agents to build kinetic typography, data visualizations, explainers, and zero-asset canvas animations. |
| [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) | Claude Code Remotion skill | Gives Claude Code structured rules for Remotion timing, spring physics, and multi-scene video editing. |
| [Liamrjohnston/remotion-motion-graphics-skill](https://github.com/Liamrjohnston/remotion-motion-graphics-skill) | Story-driven motion graphics skill | Guides AI agents to select reference story mechanisms, research briefs, and asset structures for motion graphics. |
| [Vincentwei1021/anything2explainer](https://github.com/Vincentwei1021/anything2explainer) | End-to-end explainer skill | Turns a topic into a black-canvas motion-graphics explainer video complete with TTS voiceover, subtitles, and chapter bars. |
| [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) | Reusable chart & video templates | Offers starter Remotion compositions including animated charts and text layouts. |
| [@remotion/shapes](https://www.remotion.dev/docs/shapes) | Official SVG shape primitives | Generates geometric SVG paths (polygons, stars, circles, pies, triangles) programmatically with clean bounding boxes. |
| [@remotion/paths](https://www.remotion.dev/docs/paths/) | Official SVG path manipulation | Calculates path lengths, interpolates stroke drawing (`evolvePath`), and morphs or Warps SVG paths over time. |

## Layered Flat-Vector SVG Libraries Provide Clean Geometry for React Components

To achieve a vibrant, multi-layered flat vector aesthetic, source illustrations with semantic grouping (`<g>`) from open-source vector libraries, convert them into React `.tsx` components via [SVGR](https://github.com/gregberge/svgr), and animate individual layers in [Remotion](https://www.remotion.dev/).

| Vector Library | Visual Style & License | How to Use It in Your Pipeline |
| :--- | :--- | :--- |
| [Storyset](https://storyset.com/) | Layered flat-vector scenes (Free with attribution) | Customize palettes online and export clean SVGs across [People](https://storyset.com/people), [Information](https://storyset.com/information), and [Work](https://storyset.com/work) with pre-grouped layers ready for React animation. |
| [unDraw](https://undraw.co/) | Minimalist flat SVG scenes (Open-source, no attribution) | Download clean, recolorable flat illustrations for conceptual scenes, technology metaphors, and backgrounds. |
| [Humaaans](https://www.humaaans.com/) | Modular flat-vector characters (Free for commercial/personal use) | Mix, match, and rotate heads, torsos, and limbs like building blocks to rig custom human characters. |
| [Open Peeps](https://www.openpeeps.com/) | Hand-drawn modular people (CC0 Public Domain) | Combine vector arms, legs, clothing, and facial expressions to express varied character emotions in explainers. |
| [SVG Repo](https://www.svgrepo.com/) | 500,000+ multi-color vectors & icons (Open-licensed) | Search multi-color flat vectors for planets, cells, atoms, nature props, and diagram icons. |
| [Iconoir](https://iconoir.com/) | 1,600+ clean SVG icons (MIT License) | Import first-class React SVG icon components directly via npm without sign-up or attribution. |
| [Awesome Illustrations](https://github.com/MrPeker/awesome-illustrations) | Curated directory of vector packs (Open-source directory) | Browse dozens of additional flat, 3D, and hand-drawn SVG repositories and design tools. |

## Pre-Animated Lottie and Rive Assets Eliminate Manual Keyframing

Instead of hand-coding secondary motion (like blinking eyes, spinning planets, or liquid splashes) in React, embed pre-animated vector files that lock deterministically to [Remotion](https://www.remotion.dev/)'s frame counter:

* **[@remotion/lottie](https://www.remotion.dev/docs/lottie) + [LottieFiles](https://lottiefiles.com/free-animations)**: Install `@remotion/lottie` (`npx remotion add @remotion/lottie`) to render Adobe After Effects Bodymovin JSON animations exported from [LottieFiles](https://lottiefiles.com/), scrubbing them forward or backward in sync with `useCurrentFrame()`.
* **[@remotion/rive](https://www.remotion.dev/docs/rive) + [Rive Runtimes](https://rive.app/docs/runtimes/getting-started)**: Use [`RemotionRiveCanvas`](https://www.remotion.dev/docs/rive/remotionrivecanvas) to drive interactive vector state machines in Remotion, allowing your TypeScript code to toggle character states (such as idle, talking, walking, or pointing) at exact timestamps.

## Specialized Code-Driven Animation Engines Complement Remotion for Explainers

While [Remotion](https://github.com/remotion-dev/remotion) treats video as declarative React state (`frame => UI`), several open-source frameworks were engineered specifically for sequential, voiceover-synced YouTube explainers:

| Framework | Core Language & Model | Best Use Case for Educational Creators |
| :--- | :--- | :--- |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) ([Website](https://motioncanvas.io/)) | TypeScript generator functions (`yield*`) | Built specifically for informative vector animations; includes a web editor to scrub procedural animations directly against a voiceover audio track ([Examples](https://github.com/motion-canvas/examples)). |
| [Revideo](https://github.com/redotvideo/revideo) ([Overview](https://midrender.com/revideo)) | TypeScript (MIT-licensed fork of Motion Canvas) | Retains Motion Canvas's sequential animation model while adding headless Node.js rendering, audio support, and API-driven batch pipelines ([Comparison](https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026)). |
| [Manim Community](https://github.com/manimCommunity/manim) ([Website](https://www.manim.community/)) | Python programmatic scenes | Powers 3Blue1Brown-style ([3b1b/manim](https://github.com/3b1b/manim)) mathematical, geometric, and physics visualizations that can be rendered to MP4/WebM and composited into Remotion. |

## Step-by-Step Workflow Converts Layered SVGs into Animated Remotion Scenes

1. **Source a Grouped Vector**: Download an illustration from [Storyset](https://storyset.com/) or [SVG Repo](https://www.svgrepo.com/) in `.svg` format, keeping internal layer groups (`<g id="...">`) intact.
2. **Convert SVG to a React Component**: Run [SVGR](https://react-svgr.com/) via CLI (`npx @svgr/cli --typescript --icon Illustration.svg -o src/components/Illustration.tsx`) to turn raw SVG markup into a clean TypeScript React component.
3. **Install Remotion Animation Skills**: Add [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) or [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) to your project so Claude Code follows idiomatic Remotion animation patterns.
4. **Prompt Claude Code on Semantic Layers**: Ask Claude Code to inspect `src/components/Illustration.tsx`, wrap each `<g>` element in `spring()` entrance transforms and `interpolate()` floating loops using `@remotion/shapes` ([Docs](https://www.remotion.dev/docs/shapes)) and `@remotion/paths` ([Docs](https://www.remotion.dev/docs/paths/)), and apply a high-contrast dark background with vibrant flat-vector accent colors.
