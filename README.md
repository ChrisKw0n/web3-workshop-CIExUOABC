# 🚀 CIE x UOABC Workshop

Welcome to the **CIE DAO Workshop**! In this session, we'll explore **on-chain interactions** by deploying a **Ballot smart contract** on **Remix IDE** and then interacting with it from a **Next.js front end**. This repo also acts as an idea that you can extend off during the hackathon.

---

## 📌 Workshop Overview

- Deploy a **Ballot smart contract** using **Remix IDE**.
- Connect a **Next.js frontend** to interact with the deployed contract.
- Learn how to read/write data on-chain with **Remix IDE**.

---

## 🎯 Prerequisites

Before starting, make sure you have:

- [Node.js](https://nodejs.org/) installed
- [MetaMask](https://metamask.io/) extension set up
- A **testnet faucet** to get test ETH.

**Note:** Provided laptops in workshop will have metamask setup with some Sepolia ETH to start off with.

---

## 🔧 Setup & Deployment

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/ChrisKw0n/web3-workshop-CIExUOABC.git
cd web3-workshop-CIExUOABC
```

### 2️⃣ Deploy the Smart Contract
1. Open [Remix IDE](https://remix.ethereum.org/).
2. Copy the **Ballot.sol** contract from the `contract/` folder.
3. Compile and Deploy on a testnet using MetaMask.
4. Copy the **contract address** after deployment.

### 3️⃣ Run the Frontend
Choose your preferred package manager:

#### Using Bun:
```sh
cd frontend
bun install  # Install dependencies
bun run dev  # Start the development server
```

#### Using npm:
```sh
cd frontend
npm install  # Install dependencies
npm run dev  # Start the development server
```

### 4️⃣ Connect Frontend to Smart Contract
1. Open `frontend/config.js`.
2. Update the `CONTRACT_ADDRESS` with the deployed contract address.
3. Refresh the page and interact with the DAO voting system!

---

## 📜 Smart Contract (Ballot.sol)
```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Ballot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }
    mapping(address => bool) public voters;
    Proposal[] public proposals;
    function vote(uint proposal) public {
        require(!voters[msg.sender], "Already voted");
        voters[msg.sender] = true;
        proposals[proposal].voteCount++;
    }
}
```

---

## 🚀 Next Steps
- Modify the contract to allow vote delegation.
- Add wallet connection using **ethers.js**.
- Deploy the frontend using **Vercel**.

Happy coding! 🎉
