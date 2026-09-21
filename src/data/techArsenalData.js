export const techArsenalData = {
  heading: "Technical Arsenal",
  subheading: "Sovereign Tooling For Institutional Performance",
  description:
    "We select technologies strictly based on deterministic latency, algorithmic predictability, and architectural durability — rejecting passing trends in pursuit of foundational reliability.",
  applicationTier: {
    title: "Application Tier",
    description: "High-throughput runtimes, low-latency microservices, and strongly typed schema communication layers.",
    modules: [
      {
        name: "Node.js / Express",
        category: "Event Loop & API Layer",
        role: "Asynchronous non-blocking I/O orchestration for high-volume gateway routing and real-time client sessions.",
        strengths: ["Event-driven non-blocking I/O", "Massive ecosystem interoperability", "Sub-10ms HTTP request routing"],
        status: "Production Standard"
      },
      {
        name: "Go Microservices",
        category: "High-Concurrency Core",
        role: "Ultra-compact goroutine threading for distributed microservices, network proxies, and low-latency data pipelines.",
        strengths: ["Sub-millisecond memory footprint", "Native multi-core parallel dispatch", "Deterministic compile targets"],
        status: "Core Infrastructure"
      },
      {
        name: "Python / FastAPI",
        category: "Computation & Agentic AI",
        role: "Type-checked ASGI microservices driving deterministic agentic pipelines, vector similarity calculations, and ML model inference.",
        strengths: ["Pydantic strict schema validation", "Async IO coroutines", "Native AI/vector library ecosystem"],
        status: "AI & Data Tier"
      },
      {
        name: "Rust Components",
        category: "Low-Level Systems & Wasm",
        role: "Memory-safe, zero-cost abstraction kernels for cryptographic signing, binary parsing, and high-frequency algorithms.",
        strengths: ["Zero garbage collection pauses", "Guaranteed thread safety", "WebAssembly compilation targets"],
        status: "High-Performance Kernel"
      },
      {
        name: "gRPC & Protobuf",
        category: "Inter-Service Communication",
        role: "Compact binary transport protocols over HTTP/2, enforcing compile-time API contracts between distributed clusters.",
        strengths: ["10x smaller payloads than JSON", "Bidirectional streaming", "Strict cross-language code generation"],
        status: "Internal Transport"
      },
      {
        name: "GraphQL Federation",
        category: "Unified Gateway Schema",
        role: "Decoupled sub-graph composition allowing distinct squads to deploy autonomous service schemas behind a unified endpoint.",
        strengths: ["Zero over-fetching", "Declarative schema composition", "Institutional API version resilience"],
        status: "Client Query Ingress"
      }
    ]
  },
  persistenceTier: {
    title: "Persistence Tier",
    description: "ACID-compliant relational engines, append-only distributed event logs, and in-memory caches.",
    modules: [
      {
        name: "PostgreSQL & Timescale",
        category: "Relational & Time-Series Engine",
        role: "Rock-solid transactional ledger guaranteeing ACID durability, spatial indexing, and hyper-table time-series aggregations.",
        strengths: ["Strict ACID transactional guarantees", "Native JSONB indexing", "Automated time-partitioning"],
        status: "Primary Source of Truth"
      },
      {
        name: "Redis Streams & Valkey",
        category: "In-Memory Data & Streaming",
        role: "Sub-millisecond latency caching, distributed locks, session management, and ephemeral message stream coordination.",
        strengths: ["Sub-millisecond read/write latency", "Consumer group stream semantics", "Cluster-mode high availability"],
        status: "In-Memory Tier"
      },
      {
        name: "Apache Kafka",
        category: "Distributed Event Backbone",
        role: "Immutable, high-durability distributed event streaming log connecting microservices with replayable audit histories.",
        strengths: ["Petabyte-scale throughput", "Partition-level ordering", "Strict audit replayability"],
        status: "Event Broker"
      },
      {
        name: "Elasticsearch / OpenSearch",
        category: "Distributed Search & Analytics",
        role: "Full-text lexical retrieval, distributed vector indexing, and real-time observability telemetry aggregation.",
        strengths: ["Sub-second multi-field search", "BM25 lexical ranking", "Horizontal cluster sharding"],
        status: "Search & Telemetry"
      }
    ]
  }
};

