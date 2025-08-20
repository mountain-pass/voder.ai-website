# UI Testing Domain Examples (GSAP / Three.js)

Purpose: Collect domain-specific UI/animation/3D testing helper patterns that are intentionally excluded from the universal and per-package core development docs to keep them technology-neutral.

> Scope: These examples are OPTIONAL. Only import or adapt them in packages that actually depend on the corresponding libraries. Do **not** add these helpers to generic packages.

## Principles
- Keep universal + package dev guides vendor-neutral.
- Centralize vendor mocks here to avoid copy/paste divergence.
- Any new vendor mock should include: rationale, minimal API surface, cleanup guidance.

## GSAP Mock Factory
```ts
// gsap-mock.ts
export const mockGSAP = {
  to: vi.fn().mockReturnValue({ kill: vi.fn() }),
  from: vi.fn().mockReturnValue({ kill: vi.fn() }),
  timeline: vi.fn().mockReturnValue({
    to: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    kill: vi.fn()
  })
};
```

Usage in test setup:
```ts
beforeEach(() => {
  vi.mock('gsap', () => mockGSAP);
});
```

## Three.js Minimal Mock
```ts
// three-mock.ts
export const threeMock = {
  WebGLRenderer: vi.fn(),
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  Mesh: vi.fn(),
  BoxGeometry: vi.fn(),
  MeshBasicMaterial: vi.fn()
};

beforeEach(() => {
  vi.mock('three', () => threeMock);
});
```

## Test Setup Integration Example
```ts
// test-setup.ui.ts
import { mockGSAP } from './gsap-mock.js';
import { threeMock } from './three-mock.js';

beforeEach(() => {
  vi.mock('gsap', () => mockGSAP);
  vi.mock('three', () => threeMock);
});
```

## Adding a New Vendor Mock
1. Justify need (animation, rendering, sensor, etc.).
2. Provide minimal stub API actually used by tests.
3. Document cleanup / lifecycle if needed.
4. Update this file; do NOT add to universal guide.

## ADR Requirement
Large or complex vendor mock additions (beyond trivial method stubs) require an ADR summarizing:
- Why real library not suitable in tests (perf, flakiness, environment constraints).
- API surface chosen and future-proof considerations.

## Editorial Guard
- Do not reintroduce GSAP/Three examples into `universal-guide.md` or generic package docs; reference this file instead.

---
End of UI testing domain examples.
