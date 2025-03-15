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
2. Copy the **Ballot.sol** contract from the `smart_contract/` folder.
3. Go to the file `3_Ballot.sol` and replace all the code with the copied code from our repo. Once replaced, ctrl + s to save and compile.

![alt text](/images/image1.png)

4. The third tab (compiler) will now have a green tick, indicating a successful compilation of your contract code! Click on the fourth tab (Deploy & run transactions).

![alt text](/images/image2.png)

5. Enter a valid input and then click deploy. This contract takes an array of strings which are the DAO proposal titles. Here is an example input:

![alt text](/images/image3.png)

**You have now deployed a smart contract to a local test network! Please refer to the workshop recording to see how to deploy on ETH Sepolia.**

### 3️⃣ Run the Frontend
Choose your preferred package manager:

#### Using Bun:
```sh
bun install  # Install dependencies
bun run dev  # Start the development server
```

#### Using npm:
```sh
npm install  # Install dependencies
npm run dev  # Start the development server
```

### 4️⃣ Connect Frontend to Smart Contract
1. Open `components/proposal-list`.
2. Update the `BALLOT_CONTRACT_ADDRESS` with the deployed contract address.
3. Connect your Metamask wallet.
3. Refresh the page and interact with the DAO voting system!

---

## 🚀 Possible Next Steps
- Add new features such as quadratic voting.
- Implement more wallet interactions with frameworks such as [ethers.js](https://docs.ethers.org/v5/) and [wagmi](https://wagmi.sh/)
- Deploy the frontend using **Vercel**.

Happy coding! 🎉
