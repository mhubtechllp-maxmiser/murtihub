export const architectureData = {
  heading: "Underlying Architectural Foundation",
  mainTitle: "We Engineer The System\nBehind The Experience.",
  description:
    "A decoupled, zero-trust infrastructure where cryptographic token validation, distributed micro-frontends, and automated failover pipelines operate in deterministic synchronicity.",
  pillars: [
    {
      label: "Modular",
      detail: "Decoupled micro-services and micro-frontends bound only by versioned schemas and strict API contracts."
    },
    {
      label: "Resilient",
      detail: "Self-healing topology with active-active multi-region failovers, circuit breakers, and zero data-loss replication."
    },
    {
      label: "Future-Ready",
      detail: "Zero-debt engineering practices designed from day zero to adapt to emergent scale and regulatory demands."
    }
  ],
  topologyNodes: [
    {
      id: "ingress",
      title: "Edge Ingress & Zero Trust",
      type: "perimeter",
      protocols: "mTLS v1.3 // eBPF // DDoS Shield",
      description: "Cryptographic validation of all inbound traffic prior to internal mesh dispatch."
    },
    {
      id: "mesh",
      title: "Deterministic Service Mesh",
      type: "core",
      protocols: "Envoy Proxy // gRPC // OpenTelemetry",
      description: "Stateless microservice fabric operating with sub-millisecond inter-service transit latency."
    },
    {
      id: "storage",
      title: "Immutable Persistence Tier",
      type: "storage",
      protocols: "PostgreSQL ACID // Kafka Streams // Redis",
      description: "Dual-write protection with write-ahead distributed logs and active cross-region replication."
    },
    {
      id: "client",
      title: "Decoupled Frontend Runtime",
      type: "runtime",
      protocols: "React // TipTap // WebGL 2 // Service Workers",
      description: "Client-side state machines with local-first persistence and sub-second Core Web Vitals."
    }
  ],
  disciplines: {
    heading: "Disciplines // Architectural Systems Topology Active",
    subheading: "Engineering precision for systems where failure is not an option.",
    description:
      "We architect mathematically verified distributed systems, sovereign multi-region cloud fabrics, and zero-debt enterprise platforms built for enduring institutional performance.",
    indicators: [
      { value: "0.00%", label: "Single Point Of Failure", note: "Redundant active-active topologies" },
      { value: "10M+", label: "Concurrent Throughput", note: "Tested under sustained peak loads" },
      { value: "< 50ms", label: "Global P95 Latency", note: "Measured across 6 continental edge nodes" },
      { value: "100%", label: "IP & Source Sovereignty", note: "Zero vendor lock-in; pure client ownership" }
    ]
  }
};

