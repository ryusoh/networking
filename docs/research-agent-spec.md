# Autonomous Research & Curriculum Agent: System Architecture and Technical Specification

## 1. System Overview and Engineering Philosophy

This specification defines the architectural design, subsystem boundaries, and data contracts for an autonomous Research and Curriculum Agent system engineered to ingest, index, synthesize, and evaluate computer networking and distributed systems courseware located within the `research/` directory tree.

### 1.1 Core Engineering Principles

1. **Host-Constrained Execution Governance:** The execution runtime (the Host) strictly governs all resource lifecycles, memory boundaries, context assembly, and file system I/O. The Large Language Model (LLM) operates strictly within bounded context windows prepared by the Host.
2. **Decoupled Four-Layer Architecture:** Complete separation of concerns between Interface (UI), Domain Logic (Service), State & Lifecycle Management (Host), and LLM Interactions (Agent).
3. **Deterministic Scene Assembly:** Rather than performing unconstrained vector searches across thousands of documents, the Host assembles a deterministic, high-density context bundle ("Study Scene") prior to invoking the LLM.
4. **Auditable Citation Anchoring:** Every analytical statement, protocol explanation, and code reference produced by the system must be contractually tied to verified line ranges within repository source files (`.md` sidecars, source code, and configuration manifests).

---

## 2. Four-Layer System Architecture

```mermaid
flowchart TD
    subgraph Layer1["Layer 1: Interface Layer (UI)"]
        CLI["CLI Tooling"]
        WebUI["Web Dashboard / IDE"]
        BatchRunner["Automated Batch Runner"]
    end

    subgraph Layer2["Layer 2: Domain Service Layer (Service)"]
        CurriculumSvc["CurriculumService"]
        QuizSvc["QuizService"]
        SynthesisSvc["SynthesisService"]
        CitationEngine["CitationEngine"]
    end

    subgraph Layer3["Layer 3: Host Governance Layer (Host)"]
        SceneBuilder["SceneBuilder"]
        MemoryHost["MemoryHost"]
        ResourceGovernor["ResourceGovernor"]
        HybridIndexer["Hybrid Search & RAG Indexer"]
    end

    subgraph Layer4["Layer 4: Bounded Reasoning Layer (Agent)"]
        PromptAssembler["Prompt Assembler"]
        LLMDriver["LLM Execution Driver"]
        OutputParser["Structured Output & Citation Parser"]
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
    Layer3 --> Layer4
```

### 2.1 Layer 1: Interface Layer (UI)

The Interface Layer acts as the entry point for human interaction and automated task scheduling:

- **CLI Tooling:** Command-line interfaces for topic-driven exploration, self-assessment, and diagnostic execution.
- **Web Dashboard / IDE:** Interactive graphical interface providing real-time Markdown rendering, visual concept graphs, and document viewers.
- **Automated Batch Runner:** Asynchronous job scheduler for running large-scale repository processing, such as generating course-wide summary banks or batch quiz suites.

### 2.2 Layer 2: Domain Service Layer (Service)

The Service Layer implements domain-specific logic tailored to academic curriculum analysis:

- **`CurriculumService`:** Manages prerequisite dependency graphs across course modules (`cs231`, `cs232`, `cs233`, `cs234`), enforcing structured learning progressions.
- **`QuizService`:** Synthesizes practice problems, problem set solutions, and grading rubrics from historical homeworks, quizzes, and exams.
- **`SynthesisService`:** Conducts cross-course comparative analyses (e.g., mapping Paxos consensus mechanisms in distributed systems to centralized Software-Defined Network controllers).
- **`CitationEngine`:** Validates post-generation output to guarantee that all line references and file URIs match actual repository content.

### 2.3 Layer 3: Host Governance Layer (Host)

The Host Layer serves as the deterministic runtime engine, controlling resource boundaries, memory, and information retrieval:

- **`SceneBuilder`:** Assembles bounded, multi-source context payloads ("Study Scenes") containing relevant textbook sections, lecture slides, research papers, and source code.
- **`MemoryHost`:** Manages the dual-layer memory system comprising short-term Working Memory and long-term Durable Episode Stores.
- **`ResourceGovernor`:** Enforces strict token budgets, context limits, execution timeout boundaries, and read-only file system operations.
- **`Hybrid Search & RAG Indexer`:** Maintains a unified BM25 lexical and dense vector embedding index over plain-text `.md` sidecars, P4 source code, Python scripts, and GNS3 network topology manifests.

### 2.4 Layer 4: Bounded Reasoning Layer (Agent)

The Agent Layer isolates LLM invocation and structured response parsing:

- **Prompt Assembler:** Renders system and user prompts using host-provided scene templates.
- **LLM Execution Driver:** Dispatches requests to underlying inference APIs under strict timeout and token constraints.
- **Structured Output & Citation Parser:** Extracts structured Markdown, JSON schemas, and citation links from model responses.

---

## 3. Deterministic Scene Assembly Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant UI as Interface Layer
    participant Service as Domain Service Layer
    participant Host as Host Governance Layer
    participant Indexer as Hybrid Search Indexer
    participant Agent as Bounded Agent Layer

    UI->>Service: Query Request (e.g., "Explain B4 Controller Fault Tolerance")
    Service->>Service: Resolve Curriculum Dependencies & Prerequisite Concepts
    Service->>Host: Request Scene Assembly (Topic, Depth, Token Budget)
    Host->>Indexer: Query Hybrid Index (BM25 + Vector Embeddings)
    Indexer-->>Host: Return Ranked Sources (Readings, Slides, Code)
    Host->>Host: Construct Bounded Study Scene & Inject Memory Summary
    Host->>Agent: Execute Agent Task within Bounded Scene
    Agent->>Agent: Generate Response with Exact Line Citations
    Agent-->>Service: Return Raw Structured Response
    Service->>Service: Verify Citations via CitationEngine
    Service-->>UI: Deliver Auditable, Citation-Anchored Response
```

### 3.1 Study Scene Composition Formula

A Study Scene $S$ is a deterministic payload constructed by the Host prior to model invocation:

$$S = \{ R_{\text{primary}}, C_{\text{prereq}}, A_{\text{code}}, M_{\text{episode}}, B_{\text{token}} \}$$

Where:

- $R_{\text{primary}}$: Target primary reading source (e.g., paper markdown sidecar).
- $C_{\text{prereq}}$: Contextual prerequisite material (e.g., lecture slide markdown).
- $A_{\text{code}}$: Associated lab source code or network topology specification (`.p4`, `.py`, `.gns3`).
- $M_{\text{episode}}$: Condensed durable memory of student progress and previous misconceptions.
- $B_{\text{token}}$: Maximum allowable context window budget (e.g., 16,384 tokens).

---

## 4. Memory Architecture and State Management

```mermaid
flowchart LR
    subgraph MemoryHostSystem["MemoryHost Subsystem"]
        WorkingMemory["Working Memory (Active Turn Buffer)"]
        DurableMemory["Durable Episode Store (JSON Master Matrix)"]
    end

    WorkingMemory -->|Session End / Summarization| DurableMemory
    DurableMemory -->|Context Injection| SceneBuilder["SceneBuilder Payload"]
```

### 4.1 Memory Classification

1. **Working Memory:** Maintains recent conversational turns and scratchpad reasoning steps during an active learning session. Working memory is discarded or summarized upon session termination.
2. **Durable Episode Store:** Maintains a persistent JSON database tracking concept mastery across sessions.

### 4.2 Durable Mastery Matrix Schema

The Durable Episode Store maintains student knowledge state structured as follows:

```json
{
  "student_id": "default_user",
  "last_updated": "2026-08-02T02:00:00Z",
  "modules": {
    "cs231-distributed-systems": {
      "paxos_consensus": { "mastery_score": 0.85, "last_reviewed": "2026-08-01" },
      "vector_clocks": { "mastery_score": 1.0, "last_reviewed": "2026-07-30" }
    },
    "cs234-advanced-networks": {
      "b4_traffic_engineering": { "mastery_score": 0.9, "last_reviewed": "2026-08-02" },
      "p4_data_plane": { "mastery_score": 0.95, "last_reviewed": "2026-08-01" }
    }
  }
}
```

---

## 5. Citation Contract and Line-Anchored Verification

### 5.1 Citation Format Standard

All agent output referencing source materials must adhere to the explicit file URI format with line ranges:

```markdown
[<relative_path>#L<start_line>-L<end_line>](file://<absolute_path>#L<start_line>-L<end_line>)
```

Example:

```markdown
[cs234-04/part-01.md#L45-L60](file:///Users/lz/dev/networking/research/cs234-advanced-networks/01-slides/cs234-04/part-01.md#L45-L60)
```

### 5.2 Citation Validation Pipeline

Before returning output to Layer 1, the `CitationEngine` verifies:

1. Target file existence on the file system.
2. Line range validity (ensuring start and end line bounds fall within actual file line counts).
3. Text content alignment (verifying that quoted text matches source line contents).

If validation fails, the response is rejected and returned to Layer 3 for re-parsing or correction.

---

## 6. Anki Export Integration

Research-agent answers can be exported as Anki cards. The export uses the
inverted pipeline in `tools/research/anki_generator.py`: code selects chunks,
the LLM authors the cards, and the validator/import path gates ingestion.

### 6.1 Batch card workflow

```text
python3 tools/research/anki_generator.py --count 5 --deck "金融"
    ↓  research/anki_candidates.jsonl
LLM authors → research/anki_cards.jsonl
python3 tools/research/anki_card_validator.py research/anki_cards.jsonl
python3 tools/research/anki_generator.py --import --deck "金融"
```

### 6.2 Ad-hoc answer export

For a single synthesized answer, use the `--front` / `--back` path:

```bash
python3 tools/research/anki_generator.py \
  --front "<strong>Concept</strong>: core question?" \
  --back "<div>structured answer</div>" \
  --deck "金融" --tags "research <module>"
```

### 6.3 State discipline

- Never hand-edit `research/.anki_coverage.json`; use CLI verbs only.
- Reject bad candidates with `--reject-chunk <id> --reason <category>` instead
  of writing low-quality cards.
- Verify imports with `python3 tools/research/anki_import_verifier.py`.

---

## 7. Quality Assurance and CI Integration

The system architecture integrates directly into existing repository quality gates:

1. **Pre-commit Gating (`make precommit`):** Ensures that all added scripts, configuration files, and documentation pass formatting (Prettier), linting (ESLint, Flake8), and type checking (`make type`).
2. **Deterministic Test Suites:** Unit tests in `__tests__/` validate `SceneBuilder` context construction, `CitationEngine` URL verification, `MemoryHost` serialization, and the Anki pipeline.

---

## 8. Implementation Roadmap and Phased Rollout

```mermaid
flowchart TD
    Step1["Step 1: Structural Parsing & Line Mapping Engine"] --> Step2["Step 2: Hybrid Search Indexer (BM25 + Dense Vectors)"]
    Step2 --> Step3["Step 3: Host SceneBuilder & Token Governor MVP"]
    Step3 --> Step4["Step 4: Citation Verification & Post-Processing Engine"]
    Step4 --> Step5["Step 5: Durable Memory & Mastery Matrix Integration"]
```

### 8.1 Phase 1: Structural Parsing & Line Mapping Engine

- **Objective:** Ingest `.md` sidecars, slides, and source code while establishing accurate line-number offset maps.
- **Key Deliverables:**
  - Heading-aware parser splitting text at Markdown header boundaries (`#`, `##`) and slide separators (`<!-- slide -->`).
  - Line-offset mapping data structure linking every text segment to its start line and end line in the source file.
  - Code block integrity handler preserving P4, Python, C, and GNS3 topology configs without mid-block truncation.

### 8.2 Phase 2: Hybrid Search Indexer Construction

- **Objective:** Build dual lexical and vector search indices over parsed structural chunks.
- **Key Deliverables:**
  - BM25 Lexical Index targeting exact technical terms, protocol RFC numbers, packet fields, and function symbols.
  - Dense Vector Embedding Index representing semantic conceptual similarity across course modules.
  - Reciprocal Rank Fusion (RRF) ranker combining lexical and semantic scores into a unified top-K result set.

### 8.3 Phase 3: Host SceneBuilder & Token Governor MVP

- **Objective:** Construct the Host-side context assembly pipeline.
- **Key Deliverables:**
  - `SceneBuilder` context bundler assembling primary readings, prerequisite slide excerpts, and lab code.
  - `ResourceGovernor` token tracking ensuring compiled scenes remain within model context window limits.

### 8.4 Phase 4: Citation Verification & Post-Processing Engine

- **Objective:** Enforce auditable line-anchored citations on all generated outputs.
- **Key Deliverables:**
  - `CitationEngine` URL validator checking file existence, line bounds, and snippet matching.
  - Auto-retry loop rejecting unverified or hallucinated file references before delivery to Layer 1.

### 8.5 Phase 5: Durable Memory & Mastery Matrix Integration

- **Objective:** Persist student progress and mastery state across evaluation sessions.
- **Key Deliverables:**
  - Working Memory buffer and Durable Episode Store JSON serializer.
  - Mastery Matrix updating engine calculating topic proficiency scores based on student performance.
