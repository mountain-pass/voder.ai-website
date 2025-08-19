---
status: proposed
date: 2025-07-07
decision-makers: voder.ai website team
---

# ADR 0005: Runtime Monitoring SDK Selection

## Context and Problem Statement

We need to capture real-user errors and performance metrics in production to diagnose issues quickly and track stability.

## Decision Drivers

- Low integration effort
- Browser & server support
- Alerting and dashboard capabilities
- Pricing and usage limits

## Considered Options

- Sentry
- Datadog RUM
- Other hosted RUM providers

## Decision Outcome

Chosen option: **Sentry**, because it offers first-class JavaScript support, automatic source-map upload, error grouping, and a generous free tier.

### Consequences

- **Good**: out-of-the-box error capture and performance monitoring.
- **Bad**: introduces a third-party dependency and potential cost.

### Confirmation

- SDK initializes without errors.
- Errors and transactions appear in Sentry dashboard.

## Pros and Cons of the Options

### Sentry

- Pros: automatic error grouping, performance tracing
- Cons: potential cost at scale

### Datadog RUM

- Pros: unified infrastructure & frontend monitoring
- Cons: more manual setup, higher cost

## More Information

- Sentry JS SDK docs: https://docs.sentry.io/platforms/javascript/
