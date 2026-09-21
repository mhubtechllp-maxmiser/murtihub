export const projectsData = [
  {
    id: "01",
    slug: "akshar-canvas",
    title: "Distraction-Free Publishing & Prose Architecture",
    name: "Akshar Canvas",
    status: "Live",
    gridSpan: "span-7", // large editorial card
    image: "/images/projects/akshar.jpg",
    liveUrl: "https://aksharcanvas.com",
    description:
      "A literary digital sanctuary for authors and thinkers — distraction-free typography, instant cloud state persistence, and sub-50ms editor latency.",
    overview:
      "Akshar Canvas was conceived to solve the visual clutter and latency degradation common in modern online writing software. Authors required an institutional-grade digital sanctuary prioritizing typographical purity, instantaneous keyboard response, and cryptographically verified state synchronization.",
    challenge:
      "Modern rich-text engines frequently stutter under long-form manuscripts exceeding 50,000 words. Memory leaks in DOM nodes and asynchronous autosave race conditions routinely lead to document corruption or visible typing lag.",
    engineeringApproach:
      "We engineered a custom state reconciliation pipeline on top of the TipTap headless editing core. Documents are decomposed into immutable delta trees, batched through Web Workers, and synchronized via low-overhead differential websocket broadcasts.",
    architecture:
      "Client-side virtualized rendering isolates visible paragraphs from background text trees. Server persistence is backed by MongoDB Atlas with point-in-time document revision logs, allowing authors to traverse historical drafts with zero latency.",
    metrics: [
      { value: "10K+", label: "Words / Day", sub: "Average per active author" },
      { value: "99.9%", label: "Sync Integrity", sub: "Zero state collision" },
      { value: "< 50ms", label: "Input Latency", sub: "Keystroke-to-render" }
    ],
    stack: ["React", "TipTap Engine", "MongoDB Atlas", "SCSS"],
    outcome:
      "Akshar Canvas eliminated all perceptible typing latency and established a sanctuary environment where thousands of daily authors write without fear of data loss or distraction.",
    relatedProjects: ["ghgame-zone", "omni-marketplace"]
  },
  {
    id: "02",
    slug: "ghsnap-flix",
    title: "High-Concurrency Multi-Bitrate Streaming CDN",
    name: "GHSnap Flix",
    status: "Live",
    gridSpan: "span-5", // medium editorial card
    image: "/images/projects/ghsnap.jpg",
    liveUrl: "https://ghsnapflix.com",
    description:
      "Petabyte-scale video on demand with intelligent HLS/DASH transcoding, global CDN orchestration, and zero-buffer adaptive streaming.",
    overview:
      "GHSnap Flix powers high-fidelity video on demand across millions of concurrent streaming sessions. The platform requires dynamic segment packaging, multi-bitrate HLS and DASH renditions, and intelligent edge edge-caching to guarantee seamless playback across variable network conditions.",
    challenge:
      "Handling global sudden-concurrency spikes during live releases without buffer stalls or degraded bitrates. Traditional monolithic video pipelines suffer from severe edge cache misses and transcoding bottlenecks.",
    engineeringApproach:
      "We architected a distributed transcoding cluster orchestrated with FFmpeg workers and an active Redis coordination layer. Video segments are chunked into micro-ts segments and replicated to edge nodes across multiple global regions.",
    architecture:
      "Edge ingress inspects incoming client bandwidth metrics every 1.5 seconds, dynamically stepping up or down playback bitrates without visible interruption. Origin shielding prevents stampedes on primary video storage.",
    metrics: [
      { value: "Adaptive", label: "4K UHD", sub: "Dynamic bitrate switching" },
      { value: "Zero", label: "Buffer", sub: "Predictive pre-fetching" },
      { value: "1.2M", label: "Concurrent Ops", sub: "Peak simultaneous queries" }
    ],
    stack: ["React", "HLS/DASH", "FFmpeg", "Redis"],
    outcome:
      "Achieved a 99.99% playback initiation success rate and reduced buffering ratios to virtually zero across diverse mobile and desktop clients.",
    relatedProjects: ["sentinel-gateway", "ghgame-zone"]
  },
  {
    id: "03",
    slug: "ghgame-zone",
    title: "Deterministic WebGL Game Engine & Realtime Runtime",
    name: "GHGame Zone",
    status: "Live",
    gridSpan: "span-5", // medium editorial card
    image: "/images/projects/ghgame.jpg",
    liveUrl: "https://ghgamezone.com",
    description:
      "Browser-native multiplayer gaming with deterministic physics, sub-15ms WebSocket tick sync, and zero-install WebGL shader pipelines.",
    overview:
      "GHGame Zone delivers instant zero-install browser gaming with desktop-caliber graphics and deterministic multiplayer physics. By targeting WebGL 2.0 and WebSockets directly, the runtime bypasses heavy engine bloat.",
    challenge:
      "Replicating multi-client physics across unstable residential internet connections without client-side prediction desynchronization or visual jitter.",
    engineeringApproach:
      "We built a deterministic fixed-timestep game loop running at 60 ticks per second. State inputs are compressed into binary bitmasks and reconciled using a lockstep rollback networking protocol.",
    architecture:
      "Custom GLSL vertex and fragment shaders run directly on the client GPU. Audio is synthesized with low-latency Web Audio nodes. WebSocket game servers operate state machines with under 15ms frame execution budgets.",
    metrics: [
      { value: "60 FPS", label: "Locked Canvas", sub: "Zero frame-drop threshold" },
      { value: "< 15ms", label: "Client Tick", sub: "Round-trip network sync" },
      { value: "WebGL 2", label: "Hardware", sub: "Direct GPU shader pipeline" }
    ],
    stack: ["HTML5 Canvas", "WebGL 2.0", "WebSockets", "Web Audio"],
    outcome:
      "Delivered instant-play multiplayer experiences directly in the browser with locked 60 FPS performance and tournament-grade latency synchronization.",
    relatedProjects: ["akshar-canvas", "sentinel-gateway"]
  },
  {
    id: "04",
    slug: "sentinel-gateway",
    title: "Zero-Trust Cryptographic API Mesh & Reverse Proxy",
    name: "Sentinel Gateway",
    status: "Deployed",
    gridSpan: "span-7", // wide editorial card
    image: "/images/projects/sentinel.jpg",
    liveUrl: "https://sentinel.murtihub.co.in",
    description:
      "Hardened mTLS service mesh inspecting millions of requests per second with automated certificate rotation and hardware-accelerated payload inspection.",
    overview:
      "Sentinel Gateway acts as the sovereign cryptographic perimeter for multi-service enterprise infrastructure. It replaces perimeter firewalls with fine-grained mutual TLS authentication at every internal hop.",
    challenge:
      "Inspecting millions of encrypted requests per second without introducing latency bottlenecks or risking certificate expiration disruptions.",
    engineeringApproach:
      "We leveraged Envoy Proxy's asynchronous event core integrated with custom C++ and Go filters. Ephemeral x509 certificates are minted and rotated every 12 hours via an internal automated PKI daemon.",
    architecture:
      "Dynamic rate limiting and DDoS anomaly detection run on Redis Cluster backbones with sub-millisecond lookups. Hardware-accelerated AES-GCM decryption offloads CPU usage at the edge.",
    metrics: [
      { value: "0", label: "Breaches", sub: "Continuous zero-trust audit" },
      { value: "Sub-1ms", label: "Latency", sub: "Proxy transit overhead" },
      { value: "mTLS", label: "v1.3", sub: "End-to-end cryptographic mesh" }
    ],
    stack: ["Node.js", "Envoy Proxy", "mTLS", "Redis Cluster"],
    outcome:
      "Successfully isolated critical enterprise microservices behind a mathematically impenetrable perimeter while sustaining over 10M requests per minute.",
    relatedProjects: ["ghsnap-flix", "omni-marketplace"]
  },
  {
    id: "05",
    slug: "omni-marketplace",
    title: "Turnkey Multi-Vendor Commerce & Escrow Engine",
    name: "Omni Marketplace",
    status: "Deployed",
    gridSpan: "span-12", // full-width flagship feature card
    image: "/images/projects/omni.jpg",
    liveUrl: "https://omni.murtihub.co.in",
    description:
      "Sovereign multi-vendor commerce with automated escrow settlement, dynamic tax across 40 jurisdictions, and headless GraphQL APIs.",
    overview:
      "Omni Marketplace is a sovereign institutional platform powering multi-merchant transactions, automated escrow disbursements, and real-time taxation compliance across international borders.",
    challenge:
      "Coordinating multi-party funds disbursements, escrow dispute arbitration, and cross-border nexus tax rules without locking database tables or losing transactional atomicity.",
    engineeringApproach:
      "We engineered a distributed double-entry accounting ledger inside PostgreSQL. Funds are placed in cryptographically signed escrow state containers and disbursed automatically upon verifiable event signals.",
    architecture:
      "Federated GraphQL schemas unify merchant inventories, real-time logistics feeds, and consumer checkouts into a high-concurrency stateless microservice fabric.",
    metrics: [
      { value: "10K+", label: "Merchants", sub: "Simultaneous active storefronts" },
      { value: "$45M+", label: "GMV", sub: "Annual processed volume" },
      { value: "40+", label: "Jurisdictions", sub: "Automated tax compliance" }
    ],
    stack: ["React", "GraphQL", "Multi-tenant Node.js", "PostgreSQL"],
    outcome:
      "Enabled sovereign commerce execution with mathematical settlement accuracy, protecting both buyers and merchants across $45M+ in processed transactions.",
    relatedProjects: ["sentinel-gateway", "akshar-canvas"]
  }
];

