# Developer User Story Map - Voder.ai Website Tooling

## Journey Phases (Columns)

| **Setup**                  | **Write Specs**                         | **Compile**                              | **Validate**            | **Iterate**           | **Maintain**          |
| -------------------------- | --------------------------------------- | ---------------------------------------- | ----------------------- | --------------------- | --------------------- |
| _Get environment ready_    | _Define behavior in structured prompts_ | _Autonomous compilation to code & tests_ | _Verify implementation_ | _Edit specs, rebuild_ | _Keep system healthy_ |
| **Project Initialization** | **Spec-Driven Development**             | **LLM Pipeline Execution**               | **Quality Assurance**   | **Rapid Refinement**  | **Operations**        |

**Developer Workflow:**
Developers use structured prompt files (`feature.md`) to describe intended behavior declaratively. The LLM pipeline compiles these specs into code, tests, and documentation. This approach avoids vibe coding (massive AI PRs that burn out reviewers) by maintaining small, focused changes tied to clear specifications. Benefits include traceability, reproducibility, and platform portability.

## Personas

- 🎯 **PRIMARY**: Frontend Developers - _Building features via structured specs rather than vibe coding_
- 🔧 **DevOps Engineers** - _Managing autonomous build/compile pipeline_
- 👥 **Contributing Developers** - _External contributors working with spec-driven workflow_
- 🏗️ **Platform Engineers** (Secondary) - _Scaling spec-driven development across teams_

---

# Developer Story Map with Releases

| **Release 0.5 (Essential Dev Experience)** (Completed) | **Setup**           | **Write Specs**       | **Compile**      | **Validate**             | **Iterate** | **Maintain** |
| ------------------------------------------------------ | ------------------- | --------------------- | ---------------- | ------------------------ | ----------- | ------------ |
| **Foundation & Quality**                               | Node.js setup (002) | TypeScript (004)      | Vite build (005) | JavaScript linting (010) | -           | -            |
|                                                        | Dependencies (003)  | Spec formatting (006) | -                | CSS linting (007)        | -           | -            |
|                                                        | -                   | Vite dev server (005) | -                | HTML linting (008)       | -           | -            |
|                                                        | -                   | -                     | -                | Markdown linting (009)   | -           | -            |
|                                                        | -                   | -                     | -                | Unit testing (011)       | -           | -            |
|                                                        | -                   | -                     | -                | Test coverage (012.0)    | -           | -            |
|                                                        | -                   | -                     | -                | Git hooks (012.1)        | -           | -            |
|                                                        | -                   | -                     | -                | Prepare script (012.2)   | -           | -            |
|                                                        | -                   | -                     | -                | E2E screenshots (012.4)  | -           | -            |
|                                                        | -                   | -                     | -                | Simple deployment (022)  | -           | -            |

| **Release 1.0 (Enhanced Quality)** (Current Release) | **Setup** | **Write Specs**           | **Compile** | **Validate**            | **Iterate** | **Maintain**               |
| ---------------------------------------------------- | --------- | ------------------------- | ----------- | ----------------------- | ----------- | -------------------------- |
| **3D Experience & Problem Management**               | -         | 3D Animation spec (025.0) | -           | FOUC Prevention (025.1) | -           | Problem Management (025.3) |
|                                                      | -         | -                         | -           | -                       | -           | -                          |

| **Release 2 (Spec-Driven Tooling)** | **Setup** | **Write Specs**      | **Compile**             | **Validate**               | **Iterate**             | **Maintain**       |
| ----------------------------------- | --------- | -------------------- | ----------------------- | -------------------------- | ----------------------- | ------------------ |
| **Autonomous delivery experience**  | -         | Spec IDE integration | LLM pipeline automation | Automated acceptance tests | Spec iteration workflow | Spec documentation |
|                                     | -         | Prompt templates     | Compilation dashboard   | Integration tests          | Edit-compile-test cycle | Dependency updates |
|                                     | -         | Spec validation      | Traceability tracking   | Accessibility testing      | Small PR workflow       | Error tracking     |
|                                     | -         | -                    | Platform portability    | Advanced security          | -                       | Change logs        |
|                                     | -         | -                    | -                       | Security scanning          | -                       | -                  |

---

## Interview Questions

I'd like to understand your priorities and specific needs. Let me ask some questions:

### **1. Development Workflow Priority**

What's most important for your daily development experience?

- A) Fast feedback loops (hot reload, instant linting)
- B) Robust quality checks (comprehensive testing)
- C) Easy debugging and troubleshooting
- D) Smooth collaboration (consistent formatting, shared configs)

### **2. Quality Assurance Focus**

Which quality aspects are critical for this project?

- Visual consistency (UI looks right across browsers)
- Accessibility compliance (WCAG standards)
- Performance (load times, Core Web Vitals)
- Code maintainability (clean, documented code)
- Security (dependency scanning, secure practices)

### **3. Testing Strategy**

What level of testing automation do you want?

- A) Basic unit tests for critical functions
- B) Component testing for UI interactions
- C) Integration tests for full user flows
- D) Visual regression tests for design consistency
- E) Performance/accessibility automated testing

### **4. Deployment & Operations**

How do you envision the deployment process?

- Manual builds and uploads
- Automated CI/CD with branch previews
- Staged deployments (dev → staging → production)
- Rollback capabilities and monitoring

### **5. Team Collaboration**

Who else will be working on this codebase?

- Just you
- Small team (2-3 developers)
- External contributors
- Designers who need to validate implementations

### **6. Current Pain Points**

What development frustrations do you want to eliminate?

- Slow build times
- Inconsistent code formatting
- Missing type safety
- Hard to catch bugs early
- Difficult to onboard new developers

Please share your thoughts on these areas so I can build out the specific user stories that matter most to your workflow!
