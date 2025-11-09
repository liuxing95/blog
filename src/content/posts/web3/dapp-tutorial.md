---
title: 'DApp'
date: '2025-11-08'
excerpt: 'DApp 开发完整教程'
tags: ['Web3']
series: 'Web3学习'
---

# DApp 开发完整教程

## 目录

1. [DApp 架构概览](#dapp-架构概览)
2. [Web3.js 与 Ethers.js 介绍](#web3js-与-ethersjs-介绍)
3. [钱包交互](#钱包交互)
4. [智能合约交互](#智能合约交互)
5. [完整开发流程](#完整开发流程)
6. [最佳实践](#最佳实践)

---

## DApp 架构概览

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端应用层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTML/CSS   │  │  JavaScript  │  │   UI框架     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Web3 中间层                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Web3.js / Ethers.js 库                      │     │
│  │  • 账户管理  • 交易签名  • 合约调用  • 事件监听    │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      钱包层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MetaMask   │  │  WalletConnect│  │  Coinbase    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         (浏览器注入 window.ethereum 对象)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    区块链网络层                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              以太坊节点 (RPC Endpoint)               │     │
│  │  • Infura  • Alchemy  • 自建节点  • 公共节点      │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     智能合约层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   ERC-20     │  │   ERC-721    │  │  自定义合约   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Web3.js 与 Ethers.js 介绍

### Web3.js

**简介**

Web3.js 是以太坊官方推出的 JavaScript 库,是最早也是使用最广泛的以太坊开发库。它提供了与以太坊节点交互的完整 API。

**核心特性**

- 官方维护,社区庞大
- API 较为底层,功能全面
- 支持多种传输协议(HTTP、WebSocket、IPC)
- 包含完整的以太坊生态工具

**安装**

```bash
npm install web3
# 或
yarn add web3
```

**基础使用**

```javascript
import Web3 from 'web3';

// 初始化 Web3 实例
const web3 = new Web3(window.ethereum);
// 或连接到特定节点
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_PROJECT_ID');

// 获取账户
const accounts = await web3.eth.getAccounts();

// 获取余额
const balance = await web3.eth.getBalance(accounts[0]);
const balanceInEther = web3.utils.fromWei(balance, 'ether');

// 发送交易
const tx = await web3.eth.sendTransaction({
  from: accounts[0],
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  value: web3.utils.toWei('0.1', 'ether'),
});
```

---

### Ethers.js

**简介**

Ethers.js 是一个更现代化、轻量级的以太坊库,由 Richard Moore 开发。它提供了更简洁的 API 和更好的 TypeScript 支持。

**核心特性**

- 体积小巧(约 88KB vs Web3.js 的 ~1MB)
- 完整的 TypeScript 支持
- 更清晰的 API 设计
- ENS(以太坊域名服务)原生支持
- 更好的钱包抽象

**安装**

```bash
npm install ethers
# 或
yarn add ethers
```

**基础使用**

```javascript
import { ethers } from 'ethers';

// 连接到钱包
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// 获取地址
const address = await signer.getAddress();

// 获取余额
const balance = await provider.getBalance(address);
const balanceInEther = ethers.formatEther(balance);

// 发送交易
const tx = await signer.sendTransaction({
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  value: ethers.parseEther('0.1'),
});

await tx.wait(); // 等待交易确认
```

---

### Web3.js vs Ethers.js 对比

| 特性                | Web3.js            | Ethers.js          |
| ------------------- | ------------------ | ------------------ |
| **体积**            | ~1MB               | ~88KB              |
| **TypeScript 支持** | 社区维护的类型定义 | 原生 TypeScript    |
| **API 设计**        | 较为底层,功能全面  | 更简洁,更易用      |
| **文档质量**        | 完善但较分散       | 清晰且集中         |
| **社区规模**        | 更大,历史更悠久    | 快速增长           |
| **学习曲线**        | 稍陡               | 较平缓             |
| **Provider/Signer** | 混合在一起         | 清晰分离           |
| **ENS 支持**        | 需要额外配置       | 原生支持           |
| **钱包抽象**        | 较弱               | 强大的钱包类       |
| **大数处理**        | BN.js              | BigNumber / BigInt |
| **许可证**          | LGPL-3.0           | MIT                |

**选择建议**

- **选择 Web3.js 如果**:

  - 需要与现有 Web3.js 项目集成
  - 团队已熟悉 Web3.js
  - 需要某些 Web3.js 特有的功能

- **选择 Ethers.js 如果**:
  - 新项目,追求更小的包体积
  - 使用 TypeScript 开发
  - 希望更简洁的 API
  - 需要更好的钱包抽象

---

## 钱包交互

### 连接流程图

```
┌─────────────┐
│  用户访问   │
│   DApp      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ 检测钱包是否安装 │
│(window.ethereum) │
└──────┬──────────┘
       │
       ├─── 未安装 ──→ 提示安装 MetaMask
       │
       └─── 已安装
              │
              ▼
       ┌─────────────┐
       │ 请求连接钱包 │
       │eth_requestAccounts│
       └──────┬──────┘
              │
              ├─── 用户拒绝 ──→ 显示错误提示
              │
              └─── 用户同意
                     │
                     ▼
              ┌──────────────┐
              │ 获取账户地址  │
              │ 监听账户变化  │
              │ 监听网络变化  │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  连接成功     │
              │ 显示用户信息  │
              └──────────────┘
```

### 实现代码

#### 1. 检测钱包安装

```javascript
// 检测 MetaMask 或其他以太坊钱包
function isWalletInstalled() {
  return typeof window.ethereum !== 'undefined';
}

// 检测具体钱包
function detectWallet() {
  if (window.ethereum) {
    if (window.ethereum.isMetaMask) return 'MetaMask';
    if (window.ethereum.isCoinbaseWallet) return 'Coinbase Wallet';
    if (window.ethereum.isTrust) return 'Trust Wallet';
    return 'Unknown Wallet';
  }
  return null;
}
```

#### 2. 连接钱包 (使用 Ethers.js)

```javascript
import { ethers } from 'ethers';

class WalletConnection {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
  }

  // 连接钱包
  async connect() {
    try {
      if (!window.ethereum) {
        throw new Error('请安装 MetaMask!');
      }

      // 请求用户授权
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // 创建 provider 和 signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.address = await this.signer.getAddress();

      // 获取网络信息
      const network = await this.provider.getNetwork();
      this.chainId = network.chainId;

      console.log('连接成功:', this.address);
      console.log('网络 ID:', this.chainId);

      // 设置事件监听
      this.setupEventListeners();

      return {
        address: this.address,
        chainId: this.chainId,
      };
    } catch (error) {
      console.error('连接失败:', error);
      throw error;
    }
  }

  // 设置事件监听
  setupEventListeners() {
    // 监听账户变化
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        console.log('请连接 MetaMask');
        this.disconnect();
      } else {
        console.log('账户已切换:', accounts[0]);
        this.address = accounts[0];
        // 触发自定义事件
        window.dispatchEvent(
          new CustomEvent('walletAccountChanged', {
            detail: { address: accounts[0] },
          }),
        );
      }
    });

    // 监听网络变化
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('网络已切换:', chainId);
      this.chainId = BigInt(chainId);
      // 重新加载页面以确保数据一致性
      window.location.reload();
    });

    // 监听连接断开
    window.ethereum.on('disconnect', (error) => {
      console.log('钱包已断开:', error);
      this.disconnect();
    });
  }

  // 断开连接
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;

    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  }

  // 获取余额
  async getBalance() {
    if (!this.provider || !this.address) {
      throw new Error('钱包未连接');
    }

    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  // 切换网络
  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      // 如果网络不存在,添加网络
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  // 添加网络
  async addNetwork(chainId) {
    const networks = {
      5: {
        // Goerli 测试网
        chainId: '0x5',
        chainName: 'Goerli Testnet',
        nativeCurrency: {
          name: 'Goerli ETH',
          symbol: 'GoerliETH',
          decimals: 18,
        },
        rpcUrls: ['https://goerli.infura.io/v3/'],
        blockExplorerUrls: ['https://goerli.etherscan.io'],
      },
      11155111: {
        // Sepolia 测试网
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: {
          name: 'Sepolia ETH',
          symbol: 'SepoliaETH',
          decimals: 18,
        },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
      },
    };

    const networkParams = networks[chainId];
    if (!networkParams) {
      throw new Error('不支持的网络');
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  }
}

// 使用示例
const wallet = new WalletConnection();

// 连接钱包
document.getElementById('connectButton').addEventListener('click', async () => {
  try {
    const result = await wallet.connect();
    console.log('连接结果:', result);
    // 更新 UI
    document.getElementById('address').textContent = result.address;
  } catch (error) {
    alert(error.message);
  }
});

// 获取余额
document.getElementById('getBalanceButton').addEventListener('click', async () => {
  try {
    const balance = await wallet.getBalance();
    document.getElementById('balance').textContent = `${balance} ETH`;
  } catch (error) {
    alert(error.message);
  }
});
```

#### 3. 连接钱包 (使用 Web3.js)

```javascript
import Web3 from 'web3';

class WalletConnectionWeb3 {
  constructor() {
    this.web3 = null;
    this.accounts = [];
    this.currentAccount = null;
    this.chainId = null;
  }

  async connect() {
    try {
      if (!window.ethereum) {
        throw new Error('请安装 MetaMask!');
      }

      // 请求账户访问
      this.accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.currentAccount = this.accounts[0];

      // 初始化 Web3
      this.web3 = new Web3(window.ethereum);

      // 获取网络 ID
      this.chainId = await this.web3.eth.getChainId();

      console.log('连接成功:', this.currentAccount);
      console.log('网络 ID:', this.chainId);

      // 设置事件监听
      this.setupEventListeners();

      return {
        address: this.currentAccount,
        chainId: this.chainId,
      };
    } catch (error) {
      console.error('连接失败:', error);
      throw error;
    }
  }

  setupEventListeners() {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        console.log('请连接 MetaMask');
        this.disconnect();
      } else {
        this.currentAccount = accounts[0];
        this.accounts = accounts;
        window.dispatchEvent(
          new CustomEvent('walletAccountChanged', {
            detail: { address: accounts[0] },
          }),
        );
      }
    });

    window.ethereum.on('chainChanged', (chainId) => {
      this.chainId = parseInt(chainId, 16);
      window.location.reload();
    });
  }

  disconnect() {
    this.web3 = null;
    this.accounts = [];
    this.currentAccount = null;
    this.chainId = null;
  }

  async getBalance() {
    if (!this.web3 || !this.currentAccount) {
      throw new Error('钱包未连接');
    }

    const balanceWei = await this.web3.eth.getBalance(this.currentAccount);
    return this.web3.utils.fromWei(balanceWei, 'ether');
  }

  async sendTransaction(to, value) {
    if (!this.web3 || !this.currentAccount) {
      throw new Error('钱包未连接');
    }

    const valueWei = this.web3.utils.toWei(value.toString(), 'ether');

    const tx = await this.web3.eth.sendTransaction({
      from: this.currentAccount,
      to: to,
      value: valueWei,
    });

    return tx;
  }
}
```

---

## 智能合约交互

### 交互流程图

```
┌──────────────┐
│ 准备合约 ABI │
│   和地址     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ 创建合约实例      │
│(Contract Instance)│
└──────┬───────────┘
       │
       ├─────────────────────────────┐
       │                             │
       ▼                             ▼
┌──────────────┐            ┌──────────────┐
│  读取操作     │            │  写入操作     │
│ (view/pure)  │            │ (transaction)│
└──────┬───────┘            └──────┬───────┘
       │                           │
       ▼                           ▼
┌──────────────┐            ┌──────────────┐
│ 直接调用合约  │            │ 签名并发送    │
│ 获取结果     │            │   交易        │
└──────────────┘            └──────┬───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │ 等待交易确认  │
                            │ 监听事件     │
                            └──────┬───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │ 获取交易回执  │
                            │ 处理结果     │
                            └──────────────┘
```

### 实现代码

#### 1. 使用 Ethers.js 与合约交互

```javascript
import { ethers } from 'ethers';

// ERC-20 代币 ABI (简化版)
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

class ContractInteraction {
  constructor(contractAddress, abi, signer) {
    // 创建合约实例
    this.contract = new ethers.Contract(contractAddress, abi, signer);
    this.address = contractAddress;
  }

  // 读取操作 - 获取代币名称
  async getTokenName() {
    try {
      const name = await this.contract.name();
      return name;
    } catch (error) {
      console.error('获取代币名称失败:', error);
      throw error;
    }
  }

  // 读取操作 - 获取余额
  async getBalance(address) {
    try {
      const balance = await this.contract.balanceOf(address);
      const decimals = await this.contract.decimals();
      // 格式化余额
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('获取余额失败:', error);
      throw error;
    }
  }

  // 写入操作 - 转账
  async transfer(to, amount) {
    try {
      // 获取代币精度
      const decimals = await this.contract.decimals();
      // 转换金额为合约所需格式
      const amountInWei = ethers.parseUnits(amount.toString(), decimals);

      // 估算 Gas
      const gasEstimate = await this.contract.transfer.estimateGas(to, amountInWei);
      console.log('预估 Gas:', gasEstimate.toString());

      // 发送交易
      const tx = await this.contract.transfer(to, amountInWei, {
        gasLimit: (gasEstimate * 120n) / 100n, // 增加 20% 的 Gas 限制
      });

      console.log('交易已发送:', tx.hash);

      // 等待交易确认
      const receipt = await tx.wait();
      console.log('交易已确认:', receipt);

      return {
        hash: tx.hash,
        receipt: receipt,
      };
    } catch (error) {
      console.error('转账失败:', error);
      throw error;
    }
  }

  // 写入操作 - 授权
  async approve(spender, amount) {
    try {
      const decimals = await this.contract.decimals();
      const amountInWei = ethers.parseUnits(amount.toString(), decimals);

      const tx = await this.contract.approve(spender, amountInWei);
      console.log('授权交易已发送:', tx.hash);

      const receipt = await tx.wait();
      console.log('授权已确认:', receipt);

      return { hash: tx.hash, receipt: receipt };
    } catch (error) {
      console.error('授权失败:', error);
      throw error;
    }
  }

  // 监听事件
  listenToTransfers(fromAddress) {
    // 创建事件过滤器
    const filter = this.contract.filters.Transfer(fromAddress, null);

    // 监听事件
    this.contract.on(filter, (from, to, amount, event) => {
      console.log('检测到转账:');
      console.log('  从:', from);
      console.log('  到:', to);
      console.log('  金额:', ethers.formatEther(amount));
      console.log('  交易哈希:', event.log.transactionHash);
    });
  }

  // 停止监听
  stopListening() {
    this.contract.removeAllListeners();
  }

  // 查询历史事件
  async getTransferHistory(fromBlock = 0, toBlock = 'latest') {
    try {
      const filter = this.contract.filters.Transfer();
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

      return events.map((event) => ({
        from: event.args.from,
        to: event.args.to,
        amount: ethers.formatEther(event.args.value),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));
    } catch (error) {
      console.error('查询历史事件失败:', error);
      throw error;
    }
  }
}

// 使用示例
async function main() {
  // 连接钱包
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // 代币合约地址 (以 USDT 为例)
  const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';

  // 创建合约实例
  const tokenContract = new ContractInteraction(USDT_ADDRESS, ERC20_ABI, signer);

  // 读取代币信息
  const name = await tokenContract.getTokenName();
  console.log('代币名称:', name);

  // 获取当前用户余额
  const address = await signer.getAddress();
  const balance = await tokenContract.getBalance(address);
  console.log('余额:', balance);

  // 转账
  // const result = await tokenContract.transfer(
  //   '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  //   '10'
  // );
  // console.log('转账结果:', result);

  // 监听转账事件
  tokenContract.listenToTransfers(address);
}
```

#### 2. 使用 Web3.js 与合约交互

```javascript
import Web3 from 'web3';

class ContractInteractionWeb3 {
  constructor(contractAddress, abi, web3, fromAddress) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(abi, contractAddress);
    this.address = contractAddress;
    this.fromAddress = fromAddress;
  }

  // 读取操作
  async getTokenInfo() {
    try {
      const name = await this.contract.methods.name().call();
      const symbol = await this.contract.methods.symbol().call();
      const decimals = await this.contract.methods.decimals().call();
      const totalSupply = await this.contract.methods.totalSupply().call();

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: this.web3.utils.fromWei(totalSupply, 'ether'),
      };
    } catch (error) {
      console.error('获取代币信息失败:', error);
      throw error;
    }
  }

  // 获取余额
  async getBalance(address) {
    try {
      const balance = await this.contract.methods.balanceOf(address).call();
      const decimals = await this.contract.methods.decimals().call();

      // 根据精度格式化余额
      const divisor = this.web3.utils.toBN(10).pow(this.web3.utils.toBN(decimals));
      const balanceBN = this.web3.utils.toBN(balance);

      return balanceBN.div(divisor).toString();
    } catch (error) {
      console.error('获取余额失败:', error);
      throw error;
    }
  }

  // 写入操作 - 转账
  async transfer(to, amount) {
    try {
      const decimals = await this.contract.methods.decimals().call();
      const amountInWei = this.web3.utils
        .toBN(amount)
        .mul(this.web3.utils.toBN(10).pow(this.web3.utils.toBN(decimals)));

      // 估算 Gas
      const gasEstimate = await this.contract.methods
        .transfer(to, amountInWei.toString())
        .estimateGas({ from: this.fromAddress });

      console.log('预估 Gas:', gasEstimate);

      // 发送交易
      const receipt = await this.contract.methods.transfer(to, amountInWei.toString()).send({
        from: this.fromAddress,
        gas: Math.floor(gasEstimate * 1.2), // 增加 20% Gas
      });

      console.log('交易回执:', receipt);
      return receipt;
    } catch (error) {
      console.error('转账失败:', error);
      throw error;
    }
  }

  // 监听事件
  listenToTransfers(fromAddress) {
    this.contract.events
      .Transfer({
        filter: { from: fromAddress },
      })
      .on('data', (event) => {
        console.log('检测到转账:');
        console.log('  从:', event.returnValues.from);
        console.log('  到:', event.returnValues.to);
        console.log('  金额:', event.returnValues.value);
        console.log('  区块:', event.blockNumber);
      })
      .on('error', (error) => {
        console.error('事件监听错误:', error);
      });
  }

  // 查询历史事件
  async getPastTransfers(fromBlock = 0, toBlock = 'latest') {
    try {
      const events = await this.contract.getPastEvents('Transfer', {
        fromBlock: fromBlock,
        toBlock: toBlock,
      });

      return events.map((event) => ({
        from: event.returnValues.from,
        to: event.returnValues.to,
        amount: event.returnValues.value,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));
    } catch (error) {
      console.error('查询历史事件失败:', error);
      throw error;
    }
  }
}
```

---

## 完整开发流程

### 开发步骤流程图

```
┌─────────────────┐
│ 1. 环境准备      │
│ • 安装 Node.js   │
│ • 安装钱包       │
│ • 获取测试币     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. 项目初始化    │
│ • 创建项目       │
│ • 安装依赖       │
│ • 配置环境变量   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. 智能合约开发  │
│ • 编写合约       │
│ • 编译合约       │
│ • 部署到测试网   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. 前端开发      │
│ • 连接钱包       │
│ • 集成 Web3 库   │
│ • 实现合约交互   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. 测试          │
│ • 单元测试       │
│ • 集成测试       │
│ • 用户测试       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. 部署上线      │
│ • 部署到主网     │
│ • 部署前端       │
│ • 监控维护       │
└─────────────────┘
```

### 完整项目结构

```
my-dapp/
├── contracts/              # 智能合约
│   ├── MyToken.sol
│   └── MyNFT.sol
├── scripts/               # 部署脚本
│   ├── deploy.js
│   └── interact.js
├── test/                  # 测试文件
│   └── MyToken.test.js
├── frontend/              # 前端代码
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── lib/                   # 工具库
│   ├── wallet.js
│   └── contract.js
├── hardhat.config.js      # Hardhat 配置
├── package.json
└── .env                   # 环境变量
```

### 完整示例代码

#### 1. 项目初始化

```bash
# 创建项目目录
mkdir my-dapp && cd my-dapp

# 初始化 npm 项目
npm init -y

# 安装 Ethers.js
npm install ethers

# 或安装 Web3.js
npm install web3

# 安装 Hardhat (用于智能合约开发)
npm install --save-dev hardhat

# 初始化 Hardhat
npx hardhat init
```

#### 2. 环境配置 (.env)

```bash
# RPC 节点
INFURA_API_KEY=your_infura_api_key
ALCHEMY_API_KEY=your_alchemy_api_key

# 私钥 (仅用于部署,不要提交到 Git)
PRIVATE_KEY=your_private_key

# 合约地址
CONTRACT_ADDRESS=0x...
```

#### 3. 完整的 HTML 页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>我的 DApp</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }

      .container {
        background: white;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 100%;
      }

      h1 {
        color: #333;
        margin-bottom: 30px;
        text-align: center;
      }

      .wallet-info {
        background: #f7f7f7;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
      }

      .wallet-info p {
        margin: 10px 0;
        color: #666;
      }

      .wallet-info strong {
        color: #333;
      }

      button {
        width: 100%;
        padding: 15px;
        margin: 10px 0;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
      }

      button:hover {
        background: #764ba2;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      button:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
      }

      input {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
      }

      input:focus {
        outline: none;
        border-color: #667eea;
      }

      .status {
        padding: 15px;
        margin: 10px 0;
        border-radius: 8px;
        font-size: 14px;
      }

      .status.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .status.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      .status.info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
      }

      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🚀 我的 DApp</h1>

      <!-- 连接钱包部分 -->
      <div id="connectSection">
        <button id="connectButton">连接钱包</button>
        <div id="installMessage" class="status error hidden">
          请先安装 <a href="https://metamask.io/" target="_blank">MetaMask</a>
        </div>
      </div>

      <!-- 钱包信息 -->
      <div id="walletInfo" class="wallet-info hidden">
        <p><strong>地址:</strong> <span id="address"></span></p>
        <p><strong>余额:</strong> <span id="balance"></span> ETH</p>
        <p><strong>网络:</strong> <span id="network"></span></p>
        <button id="disconnectButton">断开连接</button>
      </div>

      <!-- 转账功能 -->
      <div id="transferSection" class="hidden">
        <h2>转账</h2>
        <input type="text" id="toAddress" placeholder="接收地址" />
        <input type="number" id="amount" placeholder="金额 (ETH)" step="0.001" />
        <button id="sendButton">发送</button>
      </div>

      <!-- 状态消息 -->
      <div id="statusMessage"></div>
    </div>

    <script type="module">
      import { ethers } from 'https://cdn.ethers.io/lib/ethers-5.7.esm.min.js';

      // DOM 元素
      const connectButton = document.getElementById('connectButton');
      const disconnectButton = document.getElementById('disconnectButton');
      const sendButton = document.getElementById('sendButton');
      const connectSection = document.getElementById('connectSection');
      const walletInfo = document.getElementById('walletInfo');
      const transferSection = document.getElementById('transferSection');
      const installMessage = document.getElementById('installMessage');
      const statusMessage = document.getElementById('statusMessage');

      // 全局状态
      let provider = null;
      let signer = null;
      let currentAddress = null;

      // 显示状态消息
      function showStatus(message, type = 'info') {
        statusMessage.className = `status ${type}`;
        statusMessage.textContent = message;
        statusMessage.style.display = 'block';
        setTimeout(() => {
          statusMessage.style.display = 'none';
        }, 5000);
      }

      // 更新 UI
      function updateUI(connected) {
        if (connected) {
          connectSection.classList.add('hidden');
          walletInfo.classList.remove('hidden');
          transferSection.classList.remove('hidden');
        } else {
          connectSection.classList.remove('hidden');
          walletInfo.classList.add('hidden');
          transferSection.classList.add('hidden');
        }
      }

      // 格式化地址
      function formatAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(38)}`;
      }

      // 连接钱包
      async function connectWallet() {
        try {
          if (!window.ethereum) {
            installMessage.classList.remove('hidden');
            return;
          }

          // 请求连接
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          provider = new ethers.providers.Web3Provider(window.ethereum);
          signer = provider.getSigner();
          currentAddress = await signer.getAddress();

          // 获取余额
          const balance = await provider.getBalance(currentAddress);
          const balanceInEth = ethers.utils.formatEther(balance);

          // 获取网络
          const network = await provider.getNetwork();

          // 更新 UI
          document.getElementById('address').textContent = formatAddress(currentAddress);
          document.getElementById('balance').textContent = parseFloat(balanceInEth).toFixed(4);
          document.getElementById('network').textContent = network.name;

          updateUI(true);
          showStatus('钱包连接成功!', 'success');

          // 设置事件监听
          setupEventListeners();
        } catch (error) {
          console.error('连接失败:', error);
          showStatus('连接失败: ' + error.message, 'error');
        }
      }

      // 断开连接
      function disconnectWallet() {
        provider = null;
        signer = null;
        currentAddress = null;
        updateUI(false);
        showStatus('已断开连接', 'info');
      }

      // 发送交易
      async function sendTransaction() {
        try {
          const to = document.getElementById('toAddress').value;
          const amount = document.getElementById('amount').value;

          if (!to || !amount) {
            showStatus('请填写完整信息', 'error');
            return;
          }

          if (!ethers.utils.isAddress(to)) {
            showStatus('无效的地址', 'error');
            return;
          }

          sendButton.disabled = true;
          sendButton.textContent = '发送中...';

          const tx = await signer.sendTransaction({
            to: to,
            value: ethers.utils.parseEther(amount),
          });

          showStatus('交易已发送,等待确认...', 'info');

          const receipt = await tx.wait();

          showStatus('交易成功! Hash: ' + receipt.transactionHash, 'success');

          // 更新余额
          const balance = await provider.getBalance(currentAddress);
          document.getElementById('balance').textContent = parseFloat(
            ethers.utils.formatEther(balance),
          ).toFixed(4);

          // 清空输入
          document.getElementById('toAddress').value = '';
          document.getElementById('amount').value = '';
        } catch (error) {
          console.error('交易失败:', error);
          showStatus('交易失败: ' + error.message, 'error');
        } finally {
          sendButton.disabled = false;
          sendButton.textContent = '发送';
        }
      }

      // 设置事件监听
      function setupEventListeners() {
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            connectWallet();
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      }

      // 事件绑定
      connectButton.addEventListener('click', connectWallet);
      disconnectButton.addEventListener('click', disconnectWallet);
      sendButton.addEventListener('click', sendTransaction);

      // 页面加载时检查连接状态
      window.addEventListener('load', async () => {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts.length > 0) {
            await connectWallet();
          }
        }
      });
    </script>
  </body>
</html>
```

---

## 最佳实践

### 1. 安全性

```javascript
// ❌ 错误:直接在前端存储私钥
const privateKey = "0x123...";

// ✅ 正确:使用钱包管理私钥
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// ✅ 验证用户输入
function isValidAddress(address) {
  return ethers.isAddress(address);
}

// ✅ 设置合理的 Gas 限制
const gasLimit = await contract.transfer.estimateGas(to, amount);
const tx = await contract.transfer(to, amount, {
  gasLimit: gasLimit * 120n / 100n
});

// ✅ 处理用户拒绝
try {
  const tx = await signer.sendTransaction({...});
} catch (error) {
  if (error.code === 4001) {
    // 用户拒绝交易
    console.log('用户拒绝了交易');
  }
}
```

### 2. 错误处理

```javascript
class DAppError {
  static handle(error) {
    if (error.code === 4001) {
      return '用户拒绝了请求';
    }

    if (error.code === -32002) {
      return '请求已在处理中,请检查 MetaMask';
    }

    if (error.code === -32603) {
      return '内部错误,请重试';
    }

    if (error.message.includes('insufficient funds')) {
      return '余额不足';
    }

    if (error.message.includes('gas required exceeds allowance')) {
      return 'Gas 限制过低';
    }

    return error.message || '未知错误';
  }
}

// 使用
try {
  await wallet.connect();
} catch (error) {
  const message = DAppError.handle(error);
  alert(message);
}
```

### 3. Gas 优化

```javascript
// 批量操作减少交易次数
async function batchTransfer(recipients, amounts) {
  // 使用支持批量转账的合约
  const tx = await contract.batchTransfer(recipients, amounts);
  return await tx.wait();
}

// 使用 multicall 减少 RPC 调用
import { Contract } from 'ethers';

async function batchRead(contract, methods) {
  const calls = methods.map((method) => contract[method]());
  return await Promise.all(calls);
}
```

### 4. 用户体验优化

```javascript
// 显示交易进度
async function sendWithProgress(tx) {
  console.log('⏳ 交易已发送:', tx.hash);

  const receipt = await tx.wait(1); // 等待 1 个确认
  console.log('✅ 1 个确认');

  await tx.wait(3); // 等待 3 个确认
  console.log('✅ 3 个确认 - 交易安全');

  return receipt;
}

// 缓存合约数据
class CachedContract {
  constructor(contract) {
    this.contract = contract;
    this.cache = new Map();
  }

  async call(method, ...args) {
    const key = `${method}-${JSON.stringify(args)}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result = await this.contract[method](...args);
    this.cache.set(key, result);

    return result;
  }
}
```

### 5. 网络适配

```javascript
const NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    rpc: 'https://mainnet.infura.io/v3/',
    explorer: 'https://etherscan.io',
  },
  5: {
    name: 'Goerli Testnet',
    rpc: 'https://goerli.infura.io/v3/',
    explorer: 'https://goerli.etherscan.io',
  },
  11155111: {
    name: 'Sepolia Testnet',
    rpc: 'https://sepolia.infura.io/v3/',
    explorer: 'https://sepolia.etherscan.io',
  },
  137: {
    name: 'Polygon Mainnet',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
  },
};

async function getCurrentNetwork() {
  const network = await provider.getNetwork();
  return NETWORKS[network.chainId] || { name: 'Unknown Network' };
}
```

### 6. 事件监听最佳实践

```javascript
class EventManager {
  constructor(contract) {
    this.contract = contract;
    this.listeners = new Map();
  }

  // 添加监听器
  on(eventName, callback) {
    const listener = (...args) => callback(...args);
    this.listeners.set(eventName, listener);
    this.contract.on(eventName, listener);
  }

  // 移除监听器
  off(eventName) {
    const listener = this.listeners.get(eventName);
    if (listener) {
      this.contract.off(eventName, listener);
      this.listeners.delete(eventName);
    }
  }

  // 移除所有监听器
  removeAll() {
    this.listeners.forEach((listener, eventName) => {
      this.contract.off(eventName, listener);
    });
    this.listeners.clear();
  }
}
```

---

## 总结

本教程涵盖了 DApp 开发的核心内容:

1. **架构理解**: DApp 的分层架构,从前端到智能合约的完整数据流
2. **库的选择**: Web3.js 和 Ethers.js 的特点、差异和使用场景
3. **钱包交互**: 连接、断开、监听事件的完整实现
4. **合约交互**: 读取和写入操作、事件监听、错误处理
5. **最佳实践**: 安全性、性能优化、用户体验提升

### 推荐学习路径

1. 熟悉 JavaScript 基础和 ES6+ 特性
2. 学习以太坊基础概念(账户、交易、Gas 等)
3. 掌握 Solidity 智能合约开发
4. 练习使用 Web3.js 或 Ethers.js
5. 完成一个完整的 DApp 项目
6. 学习安全审计和优化技巧

### 相关资源

- **Ethers.js 文档**: https://docs.ethers.org
- **Web3.js 文档**: https://web3js.readthedocs.io
- **以太坊开发文档**: https://ethereum.org/developers
- **Solidity 文档**: https://docs.soliditylang.org
- **OpenZeppelin**: https://openzeppelin.com (智能合约库)
- **Hardhat**: https://hardhat.org (开发框架)

---

祝你在 DApp 开发之路上顺利!🚀
