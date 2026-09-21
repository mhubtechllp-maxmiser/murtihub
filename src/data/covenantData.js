export const covenantData = {
  title: "The Covenant",
  subtitle: "Foundational Engineering Principles",
  description:
    "The Covenant represents MurtiHub's sacred institutional commitment to our clients, our engineering discipline, and the digital systems we bring into reality. These four foundational principles govern every architectural decision.",
  principles: [
    {
      number: "01",
      name: "Deterministic Architecture",
      summary: "Predictable behavior under extreme scale and adverse network conditions.",
      details: [
        "Eliminate non-deterministic failure modes through mathematical verification and state-machine isolation.",
        "Guarantee consistent output given identical input states across all client, proxy, and database boundaries.",
        "Enforce strict SLA benchmarks where failovers execute autonomously without manual human panic."
      ]
    },
    {
      number: "02",
      name: "Zero-Debt Engineering",
      summary: "Craftsmanship over commodity shortcuts, refusing architectural compromise.",
      details: [
        "Never sacrifice long-term maintainability, security, or performance for ephemeral sprint deadlines.",
        "Refactor ruthlessly before deploying to production, delivering clean, self-documenting codebases.",
        "Eliminate framework bloat and unnecessary third-party runtime dependencies that cause future rot."
      ]
    },
    {
      number: "03",
      name: "Cryptographic Sovereignty",
      summary: "Absolute privacy, verified zero-trust boundaries, and client ownership.",
      details: [
        "Implement mutual TLS (mTLS v1.3) token validation across all internal service communications.",
        "Ensure client-side and at-rest cryptographic protection for sensitive proprietary enterprise data.",
        "Transfer 100% intellectual property, cryptographic keys, and source code ownership unconditionally to the client."
      ]
    },
    {
      number: "04",
      name: "People-First Modernization",
      summary: "Technology engineered to elevate human dignity, agency, and institutional trust.",
      details: [
        "Design systems that empower operators and end-users rather than alienating them behind opaque automation.",
        "Prioritize accessible, ultra-responsive interfaces that respect human cognitive flow and time.",
        "Honor human ethics and safety guardrails above reckless autonomous experimentation."
      ]
    }
  ]
};

