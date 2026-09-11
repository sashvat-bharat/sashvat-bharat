---
date: "2026-09-11"
tags:
  - "Artificial Intelligence"
  - "Agents SDK"
title: "Agent accelerator."
description: "High-performance SDK for AI agents with a unified API across AI providers. Optimized for high cache hit rates, observability, and seamless agent orchestration. Built to power production-grade agentic systems and harnesses for teams at any scale."
authors:
  - name: "Akshat Dwivedi"
    affiliation: "Researcher"
---

One interface. Any model. Real agents in production.

Agent Accelerator gives you a single, unified `Agent` abstraction for running LLMs across providers. The exact same application code drives Google Gemini, OpenAI, OpenCode, OpenRouter, or custom OpenAI-compatible endpoints. Tools, multi-agent delegation, reasoning controls, prompt caching, streaming, and wire-level diagnostics all behave identically regardless of which provider is executing the request.

```ts
import { Agent } from "agent-accelerator";

const agent = new Agent({
  model: "google/gemini-3.5-flash-lite",
  instructions: "You are a concise research engineer.",
  cache: { retention: "short" },
});

const res = await agent.run("Explain HBM3E pricing in 3 bullets.");

console.log(res.text);
console.log(res.usage);
```

That is the entire mental model: configure your agent once, then call `.run()`, `.ask()`, or `.stream()`.

---

## Start in Seconds, Configure via Environment

Install the package and set your provider keys:

```bash
# Bun
bun add agent-accelerator

# npm
npm install agent-accelerator

# pnpm
pnpm add agent-accelerator
```

```bash
GEMINI_API_KEY=...
OPENAI_API_KEY=...
OPENCODE_API_KEY=...
OPENROUTER_API_KEY=...

# Default model selections for your environment
MODEL="google/gemini-3.5-flash-lite"
SUB_AGENT_MODEL="google/gemini-3.5-flash-lite"
```

When `MODEL` is set in your environment, minimal initialization is all that's required:

```ts
import { Agent } from "agent-accelerator";

const agent = new Agent({
  instructions: "Be direct, technical, and cite trade-offs.",
});

const res = await agent.run("Explain lock contention in concurrent data structures.");

console.log(res.text);                 // Final answer
console.log(res.thinking);             // Reasoning trace, if enabled
console.log(res.usage);                // Input, output, cached, thinking tokens + cost
console.log(res.raw.request.headers);  // Wire-level audit
```

- **`instructions`** defines your stable system prompt. Keeping instructions stable while passing per-turn dynamic data via `additionalContext` in `.run()` preserves prefix cache alignment across turns.
- **Explicit configuration always overrides environment variables.** Passing `apiKey`, `baseUrl`, or `model` directly to `new Agent({...})` takes immediate precedence.

---

## Switch Providers Without Rewriting Code

Agent Accelerator uses a standard `provider/model` string format. There is no provider-specific branching or boilerplate:

```ts
new Agent({ model: "google/gemini-3.5-flash-lite", instructions: "..." });
new Agent({ model: "openai/gpt-4o", instructions: "..." });
new Agent({ model: "openrouter/openai/gpt-4o", instructions: "..." });
new Agent({ model: "opencode/kimi-k2.5", instructions: "..." });
```

Any unknown prefix automatically routes through the OpenAI-compatible engine:

```ts
// Groq — reads GROQ_API_KEY and GROQ_BASE_URL automatically
new Agent({ model: "groq/llama-3.3-70b-versatile", instructions: "..." });

// Local inference — no API key needed, just set the endpoint
// OLLAMA_BASE_URL="http://localhost:11434/v1"
new Agent({ model: "ollama/qwen2.5-coder", instructions: "..." });
```

For type-assisted configuration, use the `ModelProvider` fluent builder:

```ts
import { Agent, ModelProvider } from "agent-accelerator";

new Agent({
  model: ModelProvider.GoogleGenAI("gemini-3.5-flash-lite"),
});

new Agent({
  model: ModelProvider.Custom(
    "groq/llama-3.3-70b-versatile",
    process.env.GROQ_API_KEY,
    { baseUrl: process.env.GROQ_BASE_URL }
  ),
});
```

There is no silent default fallback model. An empty or missing model throws immediately, and custom endpoint IDs route directly to your host without failing pre-flight catalog lookups.

You can inspect provider routing, token context limits, pricing, and permitted reasoning levels before sending a request:

```ts
import { resolveModel, getModelFromCatalog, getModelThinkingInfo } from "agent-accelerator";

const resolved = resolveModel("google/gemini-3.5-flash-lite");
console.log(resolved.provider.id, resolved.modelId);

const spec = getModelFromCatalog(resolved.provider.id, resolved.modelId);
console.log(spec?.limit?.context, spec?.pricing);

const thinkingInfo = getModelThinkingInfo(resolved.provider.id, resolved.modelId);
console.log(thinkingInfo.allowedLevels);
```

### Dynamic Model Catalog with Automated 12-Hour TTL Synchronization

Model capabilities, context windows, and token pricing shift constantly across AI providers. Rather than shipping a bloated 4.4 MB static JSON file that becomes outdated days after installation, Agent Accelerator implements an **adaptive, 12-hour TTL dynamic caching system**:

- **12-Hour Automated Cache Validation**: When `.run()`, `.ask()`, or `.stream()` executes, the runtime checks `src/data/models-cache.json`. If still within the 12-hour TTL window, it reads from the cache with zero network overhead. Once expired, it transparently downloads the latest snapshot from [models.dev](https://models.dev).
- **Full Developer Control**: Manually trigger refreshes, inspect freshness, or configure custom TTLs programmatically:

```ts
import { refreshModelCatalog, getCatalogStatus, setCatalogTTL } from "agent-accelerator";

// Force a fresh sync from models.dev:
await refreshModelCatalog({ force: true });

// Override default TTL (e.g. 24 hours):
setCatalogTTL(24 * 60 * 60 * 1000);

// Inspect current catalog metadata:
const status = getCatalogStatus();
console.log(`Catalog: ${status.modelCount} models across ${status.providerCount} providers (expired: ${status.isExpired})`);
```

Or refresh manually from your terminal:

```bash
bun run update-models                 # Force refresh latest models
bun scripts/update-models.ts --ttl=24h # Refresh with custom TTL
```

---

## Tools That Validate, Retry, and Track Execution

Tools in Agent Accelerator are deterministic functions paired with runtime policies. Define inputs with Zod, implement `execute`, and register them:

```ts
import { Agent, tool, z } from "agent-accelerator";

const agent = new Agent({
  model: "google/gemini-3.5-flash-lite",
  tools: {
    fetch_metrics: tool({
      description: "Fetch live cluster metrics for an environment.",
      input: z.object({ clusterId: z.string() }),
      execute: async ({ clusterId }) => ({
        clusterId,
        load: 0.42,
        activeNodes: 18,
      }),
    }),
  },
});
```

### Built-in Execution Hardening

Every tool call receives production-grade execution guardrails out of the box:

- **Zod Schema Validation**: Invalid model arguments fail before reaching `execute`, returning a structured, retryable hint so the model can correct its own JSON payload.
- **Bounded Concurrency**: Tools execute in parallel by default, throttled by a global semaphore (pool of 8) and an optional per-tool `maxConcurrency`.
- **Wall-Clock Deadlines**: `timeoutMs` sets a per-attempt deadline. Cancellation propagates cooperatively through `ctx.signal`.
- **Transient Retries**: Network resets, rate limits, and 5xx errors automatically retry with exponential backoff up to `maxTries`.
- **Name Normalization & Levenshtein Recovery**: Automatically reconciles camelCase, snake_case, or namespace prefixes (`tools.`, `functions.`), providing "Did you mean?" suggestions for near-miss hallucinations.
- **Immediate Repeat Guard**: Blocks the model from calling the identical tool with the exact same arguments in consecutive turns, preventing runaway loops.
- **Circular-Safe Serialization**: Results pass through `toJsonSafe`, ensuring `BigInt`, circular objects, and binary buffers never crash `JSON.stringify`.

```ts
const get_status = tool({
  name: "get_status",
  description: "Check user authentication status.",
  timeoutMs: 5_000,
  maxTries: 2,
  maxConcurrency: 2,
  input: z.object({ username: z.string() }),
  execute: async ({ username }, ctx) => {
    // ctx includes toolCallId, agentName, signal, and sessionId
    return username === "Akshat Dwivedi" ? "Valid" : "Invalid";
  },
});
```

Execution telemetry reports actual wall-clock durations per tool call:

```ts
const res = await agent.run("Check status for username: Akshat Dwivedi");

for (const r of res.toolResults) {
  console.log(`${r.name}: ${JSON.stringify(r.result)} (${r.durationMs}ms)`);
}
```

---

## Multi-Agent Architecture: Fixed Workers and Dynamic Delegation

Agent Accelerator supports two multi-agent delegation topologies:

### 1. Fixed Worker Pipelines via `SubAgent`

For pre-defined roles (researchers, reviewers, auditors), create specialized `SubAgent` instances. Passing them in `subagents` registers each worker as a callable tool for the lead agent:

```ts
import { Agent, SubAgent } from "agent-accelerator";

const researcher = new SubAgent({
  name: "researcher",
  instructions: "Collect verified, quantifiable technical facts.",
  model: "google/gemini-3.5-flash-lite",
});

const critic = new SubAgent({
  name: "critic",
  instructions: "Stress-test findings, expose assumptions, and identify risks.",
  model: "google/gemini-3.5-flash-lite",
  stateless: true, // One-shot judge: clears history after evaluation
});

const lead = new Agent({
  model: "google/gemini-3.8-flash",
  instructions: "Delegate research, gather critique, then synthesize an executive brief.",
  tools: { get_topic_brief },
  subagents: [researcher, critic],
});
```

### 2. Autonomous Dynamic Delegation via `dynamicSubagents`

When an agent needs to decompose complex tasks on the fly, enable `dynamicSubagents`. The lead agent receives a `spawn_subagents` tool to spin up specialized workers concurrently:

```ts
const agent = new Agent({
  name: "Main Agent",
  model: "google/gemini-3.8-flash",
  instructions: "Decompose multi-faceted engineering problems across parallel workers.",
  tools: { get_topic_brief },
  dynamicSubagents: {
    enabled: true,
    model: "google/gemini-3.5-flash-lite", // Fixed worker model (developer-controlled)
    maxSpawn: 4,                          // Max concurrent workers per turn
    thinkingLevel: "low",                 // Fixed reasoning level for workers
    tools: { get_weather, recent_news },  // Pre-approved tool pool for workers
    timeout: 60_000,                      // 0 = unlimited, -1 = model sets per-task timeout
  },
});

const res = await agent.run("Audit our auth pipeline and draft a complete threat model.");
console.log(res.subagents.map((s) => `${s.name} (${s.durationMs}ms)`));
```

### Strict Delegation Guardrails

- **Bounded Powers**: The lead agent controls prompts (`name`, `role`, `instructions`, `task`), selects per-task tool subsets from the developer-approved pool, and (when `timeout: -1`) sets a per-task `timeoutMs`.
- **Developer Ownership**: The lead LLM can **never** override the worker model, switch reasoning levels, or exceed `maxSpawn` (enforced by Zod schema limits and programmatic truncation).
- **Stateless Isolation**: Workers are stateless (one task in, one result out, then shut down). They never inherit conversation history or prompt caches, preventing cross-turn context pollution.
- **Roll-up Observability**: Worker token counts, durations, and costs are rolled up directly into the lead agent's `res.usage` and `res.subagents`.

---

## Unified Reasoning Controls

A single `thinkingLevel` field standardizes reasoning across providers:

```ts
new Agent({
  model: "google/gemini-3.5-flash-lite",
  thinkingLevel: "medium", // none | dynamic | minimal | low | medium | high | xhigh
});
```

Apply per-run overrides or validate levels prior to rendering UI controls:

```ts
import { validateModelThinking } from "agent-accelerator";

// Per-run reasoning override
await agent.run("Perform deep formal verification", { thinkingLevel: "high" });

// Pre-flight catalog validation
try {
  validateModelThinking("google", "gemini-3.5-flash-lite", "medium");
} catch (err: any) {
  console.log(err.allowedLevels); // Display permitted levels to user
}
```

- Invalid levels throw a descriptive `ThinkingLevelError` before any network request is initiated.
- Fixed-reasoning models (e.g. DeepSeek-R1) cleanly reject `none`.
- Custom endpoints allow all levels permissively.

---

## Prompt Caching Architecture

Agent Accelerator is built to maximize provider prefix cache reuse:

```ts
new Agent({
  model: "google/gemini-3.5-flash-lite",
  instructions: "Keep this stable across turns.",
  cache: { retention: "short" }, // implicit | short | medium | long
  sessionId: "checkout-session-123",
});
```

- **`implicit`**: Zero-storage-fee automatic prefix caching with session-affinity routing.
- **`short` / `medium` / `long`**: Maps to provider explicit cache retention (~5m, ~1h, ~12h–24h TTL).
- **Session Affinity**: Pins requests via `x-session-id` and provider-specific headers (clamped to 64 characters). In browser runtimes, custom `x-*` headers are stripped to prevent CORS preflight failures, flowing affinity safely through `promptCacheKey`.
- **`additionalContext`**: Injects volatile per-turn context into the user turn without mutating the cached system prompt prefix:

```ts
await agent.run("Summarize this pull request", {
  additionalContext: "PR #482 touches authentication and billing.",
});
```

### Explicit Cloud Context Caching

Create explicit server-side cached contents for large reference documents using the Google REST integration:

```ts
import { createExplicitCache } from "agent-accelerator";

const cache = await createExplicitCache({
  model: "google/gemini-3.5-flash-lite",
  systemInstruction: "You are an enterprise codebase analyst.",
  contents: [...largeCodebaseParts],
  ttlSeconds: 3600,
});
```

Route requests through priority or discounted tiers when supported:

```ts
new Agent({
  model: "google/gemini-3.5-flash-lite",
  serviceTier: "priority", // or "flex" for batch-tolerant workloads
});
```

---

## Granular Streaming and Real-time Lifecycle Events

Stream text, reasoning traces, tool executions, and sub-agent progress simultaneously:

### Streaming via Callbacks

Pass `stream: true` to `.run()` to await the final `AgentResponse` while consuming real-time deltas:

```ts
const res = await agent.run("Design an append-only distributed ledger.", {
  stream: true,
  wrapThinking: true, // Emits <think>...</think> tags automatically for clean UI rendering
  onThinkingDelta: (delta) => process.stdout.write(delta),
  onDelta: (delta) => process.stdout.write(delta),
  onEvent: (event) => {
    if (event.type === "tool_result") console.log(`\n[tool: ${event.toolResult!.name}]`);
    if (event.type === "subagent_complete") console.log(`\n[worker: ${event.subagent!.name}]`);
  },
});
```

### Streaming via Async Iterator

Iterate over normalized events directly with `.stream()`:

```ts
const stream = agent.stream("Explain consensus algorithms.");

for await (const event of stream) {
  if (event.type === "text_delta") process.stdout.write(event.delta!);
  if (event.type === "thinking_delta") process.stdout.write(event.thinkingDelta!);
}

const finalResponse = await stream.result();
```

### Robust Cancellation

Cancellations link user-supplied `AbortSignal`s and `stream.cancel()` into an internal `AbortController`. Breaking out of a `for await` loop or calling `controller.abort()` immediately terminates the underlying provider HTTP connection. Aborted runs reject with an `AbortError`, skip retry backoffs, and never return partial responses.

```ts
const controller = new AbortController();

await agent.run("Long-running analysis", {
  stream: true,
  signal: controller.signal,
  onDelta: (delta) => process.stdout.write(delta),
});

// Cancels HTTP fetch and tool execution immediately:
controller.abort();
```

---

## Complete Observability: Tokens, Cost, and Wire Payloads

Every run produces a strongly-typed `AgentResponse` with full auditing metadata:

```ts
const res = await agent.run("Inspect cluster health in us-east-1.");

// Core deliverables
console.log(res.text);
console.log(res.thinking);
console.log(res.turns, res.durationMs);

// Token accounting and real calculated cost
console.log(res.usage.inputTokens, res.usage.outputTokens);
console.log(res.usage.cachedTokens, res.usage.thinkingTokens);
console.log(res.usage.cost?.totalCost);

// Execution audit
console.log(res.toolCalls.length, res.toolResults.length);
console.log(res.subagents.map((s) => `${s.name}: ${s.usage.totalTokens} tokens`));

// Wire-level diagnostics (API keys and sensitive headers redacted)
console.log(res.raw.request.url);
console.log(res.raw.response?.status);
```

- **Cost Calculation**: Prefers provider-reported totals and falls back to model catalog pricing per million tokens.
- **Sub-Agent Roll-up**: Tokens and calculated costs from all worker sub-agents roll into the root agent's `res.usage`.
- **JSON Serialization**: Call `res.toJSON()` to export a clean, circular-safe object ready for structured logging (OpenTelemetry, Datadog, or S3).

---

## Unified Multimodal Inputs

Send text, images, audio, video, and documents through the same `.run()` call:

```ts
// Image input: remote URL, local path, data URL, base64, Uint8Array, or ArrayBuffer
const res = await agent.run([
  { type: "text", text: "Analyze the architecture shown in this diagram." },
  { type: "image", image: "./diagrams/system-arch.png" },
]);
```

```ts
// Audio input
await agent.run([
  { type: "text", text: "Transcribe and summarize this audio note." },
  { type: "audio", audio: "https://example.com/audio/meeting-recording.mp3" },
]);

// Document / PDF input
await agent.run([
  { type: "text", text: "Extract the liability clauses from this contract." },
  { type: "file", file: "./contracts/sla-agreement.pdf", mimeType: "application/pdf" },
]);

// Video input (requires video-capable model, e.g. Gemini)
await agent.run([
  { type: "text", text: "Identify the point of failure in this screen recording." },
  { type: "video", video: "./recordings/incident-reproduction.mp4" },
]);
```

- **Universal Normalization**: Remote URLs are fetched, data URLs and base64 strings are decoded, and local file paths are loaded via a lazy `node:fs` dynamic import so browser bundlers never fail.
- **Catalog-Driven Modality Gate**: Before any network call is made, `assertModalitiesSupported` validates that the target model supports the requested input modalities. If not, it fails fast with a one-line error naming the supported set instead of triggering a provider wire dump.
- **Reasoning History Gating**: Thinking traces in multi-turn history are echoed only to tolerant providers (`google`, `openai`, `openrouter`, `opencode`), shielding strict OpenAI-compatible endpoints from 400 Bad Request errors.

---

## Actionable Error Messages

Agent Accelerator normalizes voluminous provider errors into concise, actionable single-line messages:

```text
[openrouter/nvidia/nemotron-3.5-lightning:free] request failed (404): No endpoints found that support input video
```

Sensitive URL query parameters (where API keys frequently sit) are stripped, and verbose wire dumps are stored as non-enumerable properties. Applications stay clean and readable:

```ts
const res = await agent.run(prompt).catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});
```

---

## Production Patterns

### 1. Interactive CLI with Session Persistence

```ts
const agent = new Agent({
  instructions: "You are an expert systems engineer.",
  model: process.env.MODEL,
  cache: { retention: "implicit" },
});

const res = await agent.run(userPrompt, {
  stream: true,
  wrapThinking: true,
  onThinkingDelta: (d) => process.stdout.write(d),
  onDelta: (d) => process.stdout.write(d),
});

console.log(`\n[Usage: ${res.usage.totalTokens} tokens | Cost: $${res.usage.cost?.totalCost?.toFixed(4)}]`);
```

### 2. Multi-Agent Research & Synthesis Pipeline

```ts
const lead = new Agent({
  instructions: "Coordinate research across workers and synthesize a final report.",
  model: "google/gemini-3.8-flash",
  tools: { get_topic_brief },
  subagents: [researcher, critic],
  thinkingLevel: "high",
});

const res = await lead.run("Solid-state battery commercialization in EVs (2026-2028)", {
  stream: true,
  onEvent: (event) => {
    if (event.type === "subagent_complete") {
      console.log(`↳ Worker '${event.subagent!.name}' finished in ${event.subagent!.durationMs}ms`);
    }
  },
});
```

### 3. Isolated Evaluation Harnesses

- **Stateless Evaluators**: Pass `stateless: true` to clear conversation messages before and after each run, guaranteeing zero context leakage across benchmark samples.
- **Context Resets**: Call `agent.reset()` to flush accumulated messages and thought signatures while preserving underlying tools, cache policies, and instructions.
- **Heuristic Token Estimation**: Use `countTokens(context)` for high-speed offline token counting before network dispatch.

---

## Summary

Agent Accelerator decouples high-level agent orchestration from provider-specific transport quirks. Start with `new Agent(...)` and `.run(...)` — your tools, sub-agents, reasoning levels, prefix caches, streams, and observability remain stable and portable across the entire LLM landscape.

Agent Accelerator is under active development. We are continuously expanding provider support, shipping new agentic capabilities, and relentlessly refining developer experience to keep building high-performance agents as seamless and dependable as possible.

GitHub Repository: [https://github.com/sashvat-bharat/agent-accelerator](https://github.com/sashvat-bharat/agent-accelerator)

