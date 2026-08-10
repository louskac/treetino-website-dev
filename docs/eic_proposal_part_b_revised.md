# Horizon Europe Programme
## EIC Accelerator Stage 1 – Short Proposal
### Project Short Proposal – Technical Description (Part B)

**Call:** HORIZON-EIC-2026-ACCELERATOR-01  
**Project Title:** Treetino: Ultra-High Density Biomimetic Dual-Modality Micro-Power Plant for Urban & Industrial Infrastructure  
**Project Acronym:** Treetino  
**Participant:** Treetino corp s.r.o. (Czechia)  
**Duration:** 24 Months  

---

## 1. Excellence and Breakthrough Nature

### 1.1 Technology Description and Scientific/Technical Breakthrough

#### The Urban Renewable Paradox and the Treetino Solution
European cities and industrial hubs face a fundamental structural challenge: achieving Carbon Neutrality by 2050 requires massive deployment of local renewable energy, yet urban environments suffer from severe land scarcity, strict aesthetic/heritage regulations, visual/acoustic impact restrictions (NIMBYism), and highly turbulent, low-velocity wind dynamics. Traditional solutions fail in dense urban contexts:
- **Rooftop & Ground Photovoltaics (PV):** Require vast horizontal surface areas (~300 m² for 45 kW peak) and suffer from low capacity factors (12–15%) due to night hours, cloud cover, and static orientation.
- **Conventional Wind Turbines:** Require large safety clearances, create low-frequency noise (>45 dB) and flickering shadows, and perform poorly in turbulent urban micro-climates where wind direction fluctuates rapidly and speeds remain low (2–4 m/s).

**Treetino solves this paradox** through a biomimetic "Smart Energy Tree"—a 12-metre vertical dual-modality micro-power plant that integrates high-efficiency solar harvesting and low-noise ducted wind harvesting on a minimal **1.2 m² ground footprint** (with a 12 m² canopy projection).

```
                 TREETINO HYBRID ARCHITECTURE (12m Vertical Structure)
                 
                        /\  /\  /\   [300 Heliotropic Solar Leaves]
                       /  \/  \/  \  (10 kW Peak, AI Multi-Axis Tracking)
                      /____________\
                     |   __    __   |
                     |  |  |  |  |  | [12 Ducted VAWT Wind Turbines]
                     |  |__|  |__|  | (35 kW Peak, FZU Venturi Shrouds)
                     |              |
                     |   [TRUNK]    | [Internal Power Electronics Bus,
                     |              |  AI Controller & Storage Bay]
                    /________________\
                   |   FOOTPRINT    | (1.2 m² Ground Footprint)
```

#### Dual-Modality Biomimetic Harvesting Breakthrough
Treetino's core novelty lies in the synergistic combination of two distinct harvesting modalities governed by an integrated artificial intelligence engine:

1. **Aerodynamic Breakthrough: Transparent Ducted Savonius Turbine (Co-developed with FZU)**
   Standard Savonius vertical-axis wind turbines (VAWT) possess high starting torque but low aerodynamic efficiency (~15–18% power coefficient $C_p$). In urban environments, turbulent flow further degrades performance. In partnership with the **Institute of Physics of the Czech Academy of Sciences (FZU)**, Treetino engineered a proprietary **transparent blade-directing system (Venturi Ducting System)** wrapping each rotor. 
   - **Aerodynamic Principle:** The transparent polymethyl methacrylate (PMMA/polycarbonate) stator shrouds channel ambient omnidirectional wind, accelerate incoming airflow into the rotor buckets via localized pressure differential creation, and prevent negative back-torque on the returning blade.
   - **Quantified Advantage:** Wind tunnel and field testing confirm an efficiency increase of **+27% in power output** compared to unshrouded Savonius rotors in turbulent flow, with power rotation initiating at wind speeds as low as **2.0 m/s** (power cut-in at **3.2 m/s**).
   - **Acoustic & Visual Elimination:** The enclosing transparent shroud dampens aerodynamic noise to **< 35 dB(A) measured at 10 m distance** at 8 m/s wind speed and completely eliminates shadow flickering, enabling permitting adjacent to residential buildings, schools, and corporate headquarters.

2. **Biomimetic Heliotropic Solar Array with Dynamic AI Tracking**
   Treetino features **300 leaf-inspired PV modules** (total 10 kW peak) distributed across biomimetic structural branches.
   - **Mechanism:** Each solar leaf cluster is governed by a central multi-axis actuator driven by our AI tracking algorithm. Mimicking natural heliotropism, the system continuously adjusts tilt and azimuth based on real-time irradiance maximums rather than static astronomical paths.
   - **Quantified Advantage:** Field measurements demonstrate a **+32% solar yield increase** compared to fixed 30° tilt rooftop PV arrays occupying equivalent rated capacity.

3. **AI Optimization & Operating System Core**
   The embedded microcontroller unit (MCU) runs real-time sensor fusion (anemometers, pyranometers, vibration sensors, thermal probes):
   - **Dynamic Load Balancing:** Smooths output intermittency by balancing complementary diurnal profiles (solar peak during daytime vs. urban thermal wind peak during late afternoon/night).
   - **Autonomous Survival Stowage:** In extreme weather (>25 m/s wind gusts), the AI automatically rotates solar leaves into a low-drag aerodynamic profile and engages electromagnetic braking on wind rotors to ensure structural integrity up to 45 m/s wind loads.

---

### 1.2 Quantitative Technical Specifications & Harmonized Baseline

To eliminate historical data discrepancies, all technical, physical, and economic parameters are harmonized across all Treetino documentation:

| Technical Parameter | Standardized Baseline Value | Verification / Measurement Standard |
| :--- | :--- | :--- |
| **Combined Rated Peak Output** | **45.0 kW Peak** (35.0 kW Wind + 10.0 kW Solar) | Measured at 12 m/s wind speed & 1000 W/m² STC solar irradiance |
| **Ground Base Footprint** | **1.2 m²** | Physical foundation bolt circle diameter |
| **Canopy Projection Area** | **12.0 m²** | Total vertical projection of branch structure |
| **Equivalent Land Requirement (Rooftop PV)** | **300 m²** | Land required for 45 kW standard 150 W/m² rooftop solar farm |
| **Space Yield Density Factor** | **25x higher annual yield per m²** ground footprint | Total annual kWh / ground base m² vs flat rooftop PV |
| **Turbine Cut-In / Rated Wind Speed** | **2.0 m/s start / 3.2 m/s cut-in / 12.0 m/s rated** | FZU Wind Tunnel Protocol WTP-2025-04 |
| **Acoustic Noise Output** | **< 35 dB(A) @ 10 m distance** | ISO 9613-2 Acoustic Field Measurement @ 8 m/s wind |
| **System CAPEX Price** | **€235,000 per V1 Commercial Unit** | Fully installed turn-key unit including power electronics |
| **Price / Power Output Ratio** | **€5,222 / kW installed peak power** | €235,000 CAPEX / 45.0 kW peak output |
| **Target Service Life / Maintenance** | **25 Years / Annual Inspection** | Structural fatigue analysis per Eurocode 3 |

---

### 1.3 TRL 5 Completion and Subsystem Validation Proof

Treetino has completed **TRL 5 (Technology Validated in Relevant Environment)** through rigorous subsystem testing and full-scale integrated prototype testing under representative urban outdoor conditions.

```
+-----------------------------------------------------------------------------------+
|                           TRL 5 INTEGRATED VALIDATION PROOF                       |
+-----------------------------------------------------------------------------------+
|  Subsystem / Module   |  Testing Environment & Duration   | Measured Result       |
+-----------------------+-----------------------------------+-----------------------+
| FZU Ducted VAWT Rotor | FZU Wind Tunnel + Outdoor Test Bed| +27% Cp efficiency vs |
| (12 Units Integrated) | (180 days continuous, 2–18 m/s)   | baseline; 2.0 m/s start|
+-----------------------+-----------------------------------+-----------------------+
| Heliotropic Solar     | Outdoor Test Field (Prague Region)| +32% annual yield vs  |
| Array (300 Leaves)    | 12 months logging (2024–2025)     | fixed 30° tilt PV     |
+-----------------------+-----------------------------------+-----------------------+
| Electrical Bus &      | CTU Power Electronics Lab +       | Unified DC bus feed;  |
| Power Conversion      | Integrated 1:1 Prototype          | 96.4% inverter efficiency; no phase mismatch |
+-----------------------+-----------------------------------+-----------------------+
| AI Control & Stowage  | Integrated Outdoor Prototype      | < 45 s stowage response|
| Algorithm             | Hardware-in-the-loop (HIL)        | at > 25 m/s wind gusts|
+-----------------------+-----------------------------------+-----------------------+
| Acoustic & Structural | Field Site (Středočeský kraj)     | < 34.2 dB(A) @ 10 m;  |
| Safety Validation     | Certified Calibrated Microphones  | zero structural resonance|
+-----------------------------------------------------------------------------------+
```

#### Detailed Proof of Full-Scale Integrated Prototype Testing
To address evaluator comments regarding full-scale proof, a 1:1 scale operational prototype (incorporating 300 active PV leaves, 12 ducted turbines, CTU-validated power electronics bus, and AI MCU controller) was deployed at our testing site in Středočeský kraj (Czech Republic) from April 2025 to October 2025 (6 months continuous operation):
- **Cumulative Energy Generation:** The integrated unit generated **24,180 kWh over 180 days**, demonstrating combined yield stabilization where wind generation compensated for cloud cover and night hours.
- **AI Yield Optimization vs. Static Control:** A 30-day side-by-side test comparing AI active tracking/load balancing against static orientation mode demonstrated a **+28.4% net energy gain** on the physical hardware (confirming earlier pure simulation models).
- **Clear Distinction Between TRL 5 and EIC-Funded TRL 6–8 Activities:**
  - *Completed TRL 5:* Integrated subsystem validation on 1:1 prototype in representative outdoor environment.
  - *EIC-Funded TRL 6–8 Activities:* Pilot deployment at customer sites under commercial grid conditions, industrial scale-up, ISO 61400 wind turbine certification, CE compliance testing, and design-for-manufacturing (DFM) tooling.

---

### 1.4 Intellectual Property (IP) Strategy and Freedom to Operate (FTO)

Treetino holds a clean, robust, and expanding IP portfolio protecting all core hardware and software innovations:

```
+--------------------------------------------------------------------------------------+
|                                 IP PORTFOLIO MATRIX                                  |
+--------------------------------------------------------------------------------------+
| Type / Asset Name        | Registration / Reference | Scope & Protected Claims       |
+--------------------------+--------------------------+--------------------------------+
| International PCT Patent | PCT/CZ2025/050053        | Dual-modality sync hub;        |
| Application              | (WO 2025/256678)         | Venturi duct stator geometry;  |
|                          | Priority: March 2025     | dynamic leaf actuator mechanism|
+--------------------------+--------------------------+--------------------------------+
| EU Industrial Design     | RCD 015029481-0001       | Biomimetic tree aesthetic,     |
| Protection               | EUIPO Registered         | structural frame geometry      |
+--------------------------+--------------------------+--------------------------------+
| Trade Secrets            | Internal Vault           | AI heliotropic algorithm weights|
|                          | Protocol TS-2025-A       | & predictive load-balance code |
+--------------------------------------------------------------------------------------+
```

#### Ownership, Partner Agreements & Freedom to Operate
- **100% IP Ownership:** Treetino corp s.r.o. holds 100% full ownership of all patents, designs, and software. Formal IP assignment agreements are executed with research partners (**FZU**, **CTU**) and industrial suppliers (**MKovo**), ensuring all background and foreground IP generated during collaborative R&D is assigned exclusively to Treetino.
- **External Freedom to Operate (FTO) Opinion:** A comprehensive FTO search conducted by an independent European Patent Attorney (Všetečka & Partners, Prague) covering IPC classes F03D (wind motors), H02S (photovoltaic power plants), and F03D3/04 (VAWT ducts) confirmed **zero infringement risk** against active patents held by major renewables manufacturers.

---

## 2. Impact, Market Opportunity and Commercialisation Strategy

### 2.1 Market Size and Realistic Bottom-Up Model

#### The Space-Constrained Urban Micro-Generation Opportunity
The transition to zero-carbon urban infrastructure is constrained not by technology cost, but by **physical space scarcity**. European municipalities, corporate headquarters, and industrial parks face stringent ESG mandates while operating under strict land footprint limitations.

#### Rigorous Bottom-Up Market Quantification
Rather than relying on vague top-down estimates, Treetino’s market sizing is derived bottom-up based on verifiable target site density and manufacturing capacity constraints:

```
                  BOTTOM-UP MARKET SIZING METHODOLOGY (2026–2030)
                  
  TAM: €140 Billion  --> Global Urban Micro-Generation & ESG Infrastructure Market
  
  SAM: €14.1 Billion --> 60,000 Target Sites in EU-27 (DACH & CEE) with Land/Permit Constraints
  
  SOM: €56.4 Million --> 240 Units Cumulative Sales (Years 1–5 Capacity-Constrained Build)
```

1. **Total Addressable Market (TAM): €140 Billion** – Global smart city micro-generation and corporate ESG green energy infrastructure market.
2. **Serviceable Addressable Market (SAM): €14.1 Billion** – Estimated 60,000 high-density commercial/industrial sites, banking headquarters, and municipal hubs across EU-27 (focused on DACH and CEE regions) that require high-yield renewable power but lack >200 m² of available roof/ground space.
3. **Capacity-Constrained Serviceable Obtainable Market (SOM): €56.4 Million (240 Units Cumulative over 5 Years)**
   Treetino's commercial projection is strictly aligned with our factory scaling plan, avoiding unrealistic sales assumptions:

| Projection Year | Monthly Capacity | Annual Units Sold | Average CAPEX / Unit | Annual Revenue | Cumulative Units |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Year 1 (2027)** | 1 unit / mo | **6 units** | €235,000 | **€1,410,000** | 6 units |
| **Year 2 (2028)** | 2 units / mo | **18 units** | €235,000 | **€4,230,000** | 24 units |
| **Year 3 (2029)** | 4 units / mo | **36 units** | €235,000 | **€8,460,000** | 60 units |
| **Year 4 (2030)** | 6 units / mo | **60 units** | €235,000 | **€14,100,000** | 120 units |
| **Year 5 (2031)** | 10 units / mo | **120 units**| €235,000 | **€28,200,000** | **240 units (€56.4M SOM)** |

---

### 2.2 Target Customer Segments and Value Proposition

To achieve rapid market adoption, Treetino focuses exclusively on two high-margin early adopter segments with high willingness to pay:

1. **Corporate Headquarters & Banking Institutions (ESG Flagship Segment)**
   - *Pain Point:* Need visible, iconic green energy generation on corporate campuses to meet EU CSRD reporting standards, but lack ground space and face strict architectural guidelines.
   - *Value Proposition:* High-yield zero-land energy generation combined with an iconic biomimetic structure that serves as a physical statement of ESG leadership.

2. **Commercial & Industrial Parks with High Power Density Needs**
   - *Pain Point:* High daytime and nighttime electricity tariffs (€0.30–0.38/kWh), limited unallocated roof area (already loaded with HVAC or structural constraints), and local grid connection bottlenecks.
   - *Value Proposition:* 45 kW peak output on a 1.2 m² footprint, providing dual solar+wind energy directly behind the meter to lower peak demand charges.

---

### 2.3 Comprehensive Competitor Benchmark

Treetino occupies a distinct, high-value position between low-yield ornamental solar trees and land-intensive industrial renewables:

```
+----------------------------------------------------------------------------------------------------+
|                               COMPETITOR PERFORMANCE BENCHMARK                                     |
+----------------------------------------------------------------------------------------------------+
| Performance Metric     | Rooftop PV     | Solar Carport | SolarBotanic™ | SmartFlower | Treetino V1 |
+------------------------+----------------+---------------+---------------+-------------+-------------+
| Peak Power Output      | 45.0 kW        | 45.0 kW       | 3.4 kW        | 2.5 kW      | 45.0 kW     |
| Land Footprint         | ~300 m²        | ~250 m²       | ~15 m²        | ~18 m²      | 1.2 m²      |
| Dual Modality          | No (Solar Only)| No (Solar Only| No (Solar Only| No (Solar Only| YES (Solar+Wind) |
| Low-Noise Urban Wind   | N/A            | N/A           | N/A           | N/A         | YES (<35dB @ 10m) |
| AI Active Tracking     | No (Static)    | No (Static)   | No (Static)   | 2-Axis      | Multi-Axis AI|
| Unit CAPEX             | ~€54,000       | ~€135,000     | ~€25,000      | ~€40,000    | €235,000    |
| Price/Power Ratio      | €1,200 / kW    | €3,000 / kW   | €7,353 / kW   | €16,000 / kW| €5,222 / kW |
| Urban Aesthetics / Icon| Low            | Low/Moderate  | High          | High        | Exceptional |
+----------------------------------------------------------------------------------------------------+
```

#### Why Customers Choose Treetino Over Cheaper Alternatives
While rooftop PV offers a lower upfront CAPEX per kW (€1,200/kW vs €5,222/kW), it **cannot be deployed** where roof space is unavailable, structurally restricted, or shaded. Compared to ornamental solar trees (SolarBotanic at €7,353/kW, SmartFlower at €16,000/kW), Treetino is **significantly more cost-effective per installed kW** while delivering 10–15x higher total energy yield.

---

### 2.4 Quantified Financial Return on Investment (ROI) and Payback

To substantiate financial viability for commercial buyers, the investment payback is calculated using verified generation parameters and real European commercial electricity tariffs:

```
                        10-YEAR FINANCIAL RETURN CALCULATION (V1 UNIT)
                        
  System CAPEX: €235,000
  Annual Generation: 52,000 kWh/year (32,000 kWh Solar + 20,000 kWh Wind)
  Commercial Electricity Tariff: €0.32 / kWh
  Gross Annual Electricity Savings: 52,000 kWh * €0.32 = €16,640 / year
  Annual Maintenance & Insurance OPEX: -€1,800 / year
  Net Annual Financial Savings: €14,840 / year
  
  --> Unsubsidized Simple Payback Period: ~12.8 Years (Internal Rate of Return: 6.8%)
  --> Subsidized Payback Period (with 40% EU/National Green Infrastructure Grant): 7.7 Years
```

- **Additional Value Drivers:** Avoided carbon tax penalties, ESG brand value addition, and EV charging integration yield (~€3,500/year additional revenue potential).

---

### 2.5 Customer Traction and Verification Status

- **Anchor Commercial Contract – MKovo s.r.o.:** Treetino has executed a **binding conditional purchase agreement** with industrial manufacturing group **MKovo** for the delivery of three V1 Treetino units totaling **€705,000** (€235,000 per unit). Delivery is conditioned upon completion of EIC-funded TRL 6 pilot validation.
  - *Partner Disclosure:* MKovo acts in a dual transparent capacity as both our precision metal fabrication subcontractor and our first early-adopter commercial client, validating strong industrial alignment.
- **Municipal Demonstration Pipeline:** Signed Memorandum of Understanding (MoU) with the **City of Prague** for municipal pilot installation in urban public space.
- **Corporate Pipeline:** Active discussions and formal LOIs under negotiation with two Tier-1 Czech banking institutions seeking ESG flagship assets for corporate headquarters.

---

## 3. Team, Implementation, and Financial Rationale

### 3.1 Core Team Capabilities and Organizational Matrix

The Treetino leadership team combines serial hardware entrepreneurship, architectural design, software engineering, and project execution:

```
+---------------------------------------------------------------------------------------+
|                                CORE TEAM MATRIX                                       |
+---------------------------------------------------------------------------------------+
| Name & Role            | Background & Key Qualifications      | Project Responsibility |
+------------------------+--------------------------------------+------------------------+
| Dominik Mašek          | Serial Entrepreneur, Founder Wattino;| Commercial strategy,   |
| Chief Executive Officer| 8+ yrs scaling clean-tech ventures   | customer pipeline, GTM |
+------------------------+--------------------------------------+------------------------+
| Jakub Lustyk           | Hardware Systems Architect, Founder  | Overall R&D lead,      |
| Chief Technology Officer| Nocena; 10+ yrs embedded hardware   | system integration     |
+------------------------+--------------------------------------+------------------------+
| Matěj Čížek            | Lead Architect, M.Arch CTU;          | Biomimetic structural  |
| Head of Architecture   | Specialist in urban biomimicry design| design & statics       |
+------------------------+--------------------------------------+------------------------+
| Radim Novotný          | Lead Industrial Designer/Developer;  | Mechanical prototyping,|
| Senior Mechanical Lead | 7+ yrs CAD & aerodynamic fabrication | turbine duct testing   |
+------------------------+--------------------------------------+------------------------+
| Monika Zvěřinová       | Operations & Compliance Manager;     | Regulatory compliance, |
| Project Manager        | 6+ yrs managing complex R&D grants   | EIC work package lead  |
+------------------------+--------------------------------------+------------------------+
| Greta Božková          | Communications & Operations Lead;    | Stakeholder engagement,|
| Head of Operations     | B.A. Media Studies; 5+ yrs marketing | brand communications   |
+---------------------------------------------------------------------------------------+
```

#### Closing Competence Gaps and Hiring Roadmap
To execute commercial scale-up and bridge identified technical gaps, Treetino has established a targeted recruitment plan financed through the EIC grant:

```
                 COMPETENCE EXPANSION & HIRING ROADMAP (2026–2027)
                 
  Q1 2027: Senior Wind Aerodynamics Engineer (Ph.D. / M.Sc. Aerospace Dynamics)
  Q2 2027: Power Electronics & Grid Integration Lead (M.Sc. Electrical Engineering)
  Q2 2027: Regulatory & Certification Compliance Manager (ISO 61400 & CE Marking)
  Q3 2027: Head of AI & Autonomous Control (Ph.D. / M.Sc. Robotics / ML Systems)
```

#### Gender Balance Commitment
Treetino is actively committed to improving gender balance across our technical and executive teams. Our targeted recruitment strategy prioritizes qualified female candidates for upcoming leadership positions (Head of AI and Grid Integration Lead), aiming to increase female leadership representation from **33% (2/6)** to **40%+** by Month 12.

---

### 3.2 Work Plan and Work Package Structure (24 Months)

```
+------------------------------------------------------------------------------------+
|                             WORK PACKAGE OVERVIEW                                  |
+------------------------------------------------------------------------------------+
| WP  | Work Package Title              | Lead Role       | Key Deliverables / KPIs  |
+-----+---------------------------------+-----------------+--------------------------+
| WP1 | Full-Scale Pilot Integration &  | Jakub Lustyk    | Operational TRL 6 pilot  |
|     | TRL 6 Operational Validation    | (CTO)           | at MKovo site (M6)       |
+-----+---------------------------------+-----------------+--------------------------+
| WP2 | ISO 61400 Certification, CE &   | Compliance Lead | ISO 61400-2 & CE mark    |
|     | Regulatory Compliance           | (To be hired)   | approval (M14)           |
+-----+---------------------------------+-----------------+--------------------------+
| WP3 | Design for Manufacturing (DFM)  | Radim Novotný   | Tooling, pilot assembly  |
|     | & Supply Chain Scaling          | (Lead Mech)     | line (3 units/mo) (M18)  |
+-----+---------------------------------+-----------------+--------------------------+
| WP4 | AI Control Optimization &       | Head of AI      | Production release AI    |
|     | Firmware Security               | (To be hired)   | tracking OS (M20)        |
+-----+---------------------------------+-----------------+--------------------------+
| WP5 | Commercial Scale-Up, GTM &      | Dominik Mašek   | 18 commercial units sold;|
|     | Investor Relations              | (CEO)           | Series A equity closed(M24)|
+------------------------------------------------------------------------------------+
```

---

### 3.3 Financial Request, Budget Allocation and EIC Rationale

#### Blended Finance Structure (€2.5 Million Total Request)
Treetino requests **€2,500,000 in EIC Blended Finance**, structured as follows:

```
                  EIC BLENDED FINANCE FUNDING BREAKDOWN (€2.5M TOTAL)
                  
  +-------------------------------------------------------------------------+
  |  EIC GRANT REQUEST: €1,500,000 (70% EU Co-funding of Eligible Costs)    |
  |  - Total Eligible TRL 6-8 Project Budget: €2,142,857                     |
  |  - Company Co-financing (30%): €642,857 (Sourced via existing equity)   |
  |  - Allocation: Pilot validation, ISO/CE certification, DFM tooling, R&D|
  +-------------------------------------------------------------------------+
  |  EIC EQUITY REQUEST: €1,000,000 (Direct Equity Investment)              |
  |  - Allocation: Industrial assembly plant tooling, supply chain inventory|
  |    working capital, and DACH/CEE sales force expansion.                 |
  +-------------------------------------------------------------------------+
```

```
+---------------------------------------------------------------------------------------+
|                              EIC GRANT BUDGET ALLOCATION                              |
+---------------------------------------------------------------------------------------+
| Budget Category                            | Total Cost (€) | EIC Grant (70%) (€)   |
+--------------------------------------------+----------------+-----------------------+
| Personnel (Engineering, Compliance, AI)    | €950,000       | €665,000              |
| Subcontracting (FZU, CTU, Certification)   | €420,000       | €294,000              |
| Pilot Hardware, Materials & Prototype Components | €520,000 | €364,000              |
| Travel, Field Testing & Audit Operations   | €85,000        | €59,500               |
| Indirect Costs / Overhead (25% standard)   | €167,857       | €117,500              |
+--------------------------------------------+----------------+-----------------------+
| **TOTAL ELIGIBLE COSTS / GRANT REQUEST**   | **€2,142,857** | **€1,500,000**        |
+---------------------------------------------------------------------------------------+
```

---

### 3.4 Non-Bankability and Risk Rationale (Why EIC Support is Essential)

#### Venture Capital Market Failure for Deep-Tech Hardware
Treetino previously engaged in seed fundraising, contacting 14 regional and European venture capital firms seeking €750,000 in equity financing. 
- **Venture Capital Feedback:** Commercial VC funds unanimously declined, citing high capital intensity, hardware prototype validation risks, and long regulatory certification timelines prior to series production. Commercial VCs require TRL 8 maturity and established series manufacturing before committing growth capital.
- **The "Valley of Death":** Treetino sits squarely in the classic deep-tech "Valley of Death"—having proven TRL 5 integrated technology, but requiring capital-intensive pilot validation (TRL 6–7) and certification before private capital will invest.

#### Leverage Effect of EIC Support
EIC Blended Finance will serve as a critical de-risking catalyst:
1. **Grant Component (€1.5M):** Directly funds non-recurring engineering (NRE), ISO 61400 wind turbine certification, CE safety compliance, and pilot site testing—activities that private equity cannot fund at this stage.
2. **Equity Component (€1.0M):** De-risks series manufacturing ramp-up, leveraging an estimated **€2.5M to €4.0M in matching private equity** from co-investors in our upcoming Series A round once TRL 7 milestones are achieved.

---

### 3.5 Previous Public Support Disclosure

To ensure complete financial transparency, Treetino declares all prior public support received:
- **CzechInvest Technological Incubation Program (2023–2024):** Received **5,000,000 CZK (~€200,000)** from the national budget of the Czech Republic (Ministry of Industry and Trade). 
  - *Scope of Prior Funding:* Supported initial proof-of-concept CAD modeling, individual subsystem aerodynamic simulations, and legal establishment.
  - *Strict Separation:* The CzechInvest grant is **100% completed and closed**. Zero overlap exists between activities funded under CzechInvest and the pilot validation, certification, and scale-up tasks requested under this EIC Accelerator application.
