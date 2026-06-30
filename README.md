🌱 AgriSustain AI: Guardians of Smart Farming
AgriSustain AI isn’t just another open-source project — it’s a digital control room for sustainable agriculture, built for the Agents for Good track. Imagine a team of AI specialists working side by side with farmers, ensuring healthier soils, resilient crops, and safe ecosystems. Every recommendation passes through a strict compliance gate, so no harmful chemical slips through, and every action respects the land and water around it.

🧩 The Three Pillars of AgriSustain
1. Multi-Agent Intelligence (Google Vertex AI ADK)
Instead of one giant brain, AgriSustain deploys a team of modular agents:

AgriOrchestratorAgent: The conductor, routing farmer queries to the right specialists.

CropSoilAgent: The soil whisperer, analyzing pH, nutrients, and moisture to suggest eco-friendly improvements.

PestDiseaseAgent: The plant doctor, diagnosing diseases and pests from symptoms.

SafetyEnforcerAgent: The compliance officer, intercepting risky chemical proposals and swapping them for organic alternatives.

Together, they form a hierarchical orchestra of intelligence, each playing its part in harmony.

2. MCP Server: The Secure Gateway
AgriSustain runs on a Model Context Protocol (MCP) server, which acts like a translator between AI and real-world farm data.

Tools like get_soil_telemetry and propose_treatment expose clean endpoints.

Any MCP-compliant client can plug in, query live telemetry, and validate treatments — without messy database drivers.

It’s modular, portable, and future-proof.

3. Safety First: Guardrails & Policies
No AI should run wild in agriculture. AgriSustain enforces two layers of protection:

Input Sanitization: Every parameter is checked — zone names, dosage limits, character sets.

Execution Policies (chemical-policy.json): A living rulebook that blocks banned substances (Paraquat, DDT) and enforces buffer zones near rivers to protect aquatic life.

Think of it as a digital watchdog, ensuring every recommendation is safe before it reaches the farmer.

📂 Project Blueprint
image
<img width="1900" height="916" alt="Image" src="https://github.com/user-attachments/assets/99861c12-84ac-463d-8d17-5a4a735fe206" />

Code
Capstone/
├── mcp-server/        <- Secure MCP backend
├── agents/            <- Multi-agent intelligence
└── frontend/          <- Glassmorphic dashboard
Each folder is a piece of the puzzle: backend validation, agent collaboration, and a futuristic UI.

🚀 Running the System
Spin up the MCP Server

bash
cd mcp-server && npm install && npm run build && npm start
Run the Multi-Agent Simulator

bash
cd agents && npm install && npm run build && npm run simulate
Safe Case ✅

Buffer Violation 🚫 → Organic fallback

Banned Chemical 🚫 → Mechanical weeding

Launch the Glassmorphic Dashboard

bash
cd frontend && npm install && npm run dev
Open http://localhost:5173 and step into your eco-tech control room.

🎨 UI: A Futuristic Control Room
Dark obsidian gradients with glowing emerald accents.

Glassmorphism panels that shimmer with depth.

Agent pipeline animations showing the journey from Orchestrator → Specialists → Safety Enforcer.

Live security terminal streaming validation logs in real time.

It feels less like software, more like a mission control for Earth’s future farms.

🌀 ANTIGRAVITY Demo Workflow
From research to polished dashboard, the ANTIGRAVITY workflow unfolds like a story:

mermaid
graph TD
    A[Research] --> B[Plan]
    B --> C[Build MCP Server]
    C --> D[Code Agents]
    D --> E[Scaffold Frontend]
    E --> F[Generate Branding]
    F --> G[Design Dashboard]
    G --> H[Test & Verify]
    H --> I[Document Everything]
Each step ensures the system isn’t just functional — it’s trustworthy, elegant, and farmer-ready.
