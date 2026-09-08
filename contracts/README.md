# 🌳 Treetino x Creditcoin: Verifiable RWA Energy Attestation Engine

This directory contains the smart contracts and cross-chain verification architecture for Treetino on the **Creditcoin (CC3)** network, leveraging the **Attestcoin Protocol** for **BUIDL CTC 2026 Fall**.

---

## 🏗️ Architecture Overview

The protocol connects physical clean-energy installations (solar & wind trees) with verifiable on-chain attestations:

```
[Treetino Physical Hardware & Inverter Telemetry]
                      │
                      ▼
            [Ethereum Sepolia]
     (Registers Energy Batch / Deposit)
                      │
                      │  ◄── Cryptographic Proof (via Proof Builder API)
                      ▼
          [Creditcoin CC3 Testnet]
   ├── Precompiles: ChainInfo (0x...fd3) & BlockProver (0x...FD2)
   ├── Decoder Contract: 0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f
   └── TreetinoEnergyAttestation.sol
         └── Verifies cross-chain proof & mints ESG certificate / triggers yield
```

---

## ⚙️ Environment Details (Creditcoin CC3 Testnet)

* **Network Name:** Creditcoin CC3 Testnet
* **Chain ID:** `102031`
* **RPC URL:** `https://rpc.cc3-testnet.creditcoin.network`
* **Block Explorer:** `https://blockscout.cc3-testnet.creditcoin.network`
* **Decoder Contract:** `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`
* **ChainInfo Precompile:** `0x0000000000000000000000000000000000000fd3`
* **BlockProver Precompile:** `0x0000000000000000000000000000000000000FD2`
* **Supported Source Chains:**
  * **Ethereum Sepolia:** Chainkey `1`
  * **Ethereum Mainnet:** Chainkey `3`
* **Proof Builder API:** `https://proof-gen-api.cc3-testnet.creditcoin.network/`

---

## 📦 Getting Started

### 1. Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Install Dependencies
```bash
npm install
forge install
```

### 3. Build & Test
```bash
forge build
forge test
```
