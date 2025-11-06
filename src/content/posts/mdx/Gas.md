---
title: 'Gas 完全解析'
date: '2025-11-03'
excerpt: 'Gas 完全解析：以太坊的燃料系统'
tags: ['Web3']
series: 'Web3学习'
---

# Gas 完全解析：以太坊的燃料系统

## 目录

- [Gas 是什么？](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#gas%E6%98%AF%E4%BB%80%E4%B9%88)
- [为什么需要 Gas？](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81gas)
- [Gas 工作原理](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#gas%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)
- [Gas 费用计算](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#gas%E8%B4%B9%E7%94%A8%E8%AE%A1%E7%AE%97)
- [影响 Gas 费用的因素](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#%E5%BD%B1%E5%93%8Dgas%E8%B4%B9%E7%94%A8%E7%9A%84%E5%9B%A0%E7%B4%A0)
- [如何优化 Gas 费用](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#%E5%A6%82%E4%BD%95%E4%BC%98%E5%8C%96gas%E8%B4%B9%E7%94%A8)
- [常见场景 Gas 消耗](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#%E5%B8%B8%E8%A7%81%E5%9C%BA%E6%99%AFgas%E6%B6%88%E8%80%97)
- [实用工具](https://claude.ai/chat/67df5980-2b7b-40e6-8835-acd862eda42d#%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7)

---

## Gas 是什么？

### 简单类比

想象你要开车去一个地方：

- 🚗 **汽车** = 以太坊网络
- ⛽ **汽油** = Gas
- 💰 **油价** = Gas Price（每升油多少钱）
- 📏 **里程** = Gas Limit（准备的油量）
- 🎯 **实际消耗** = Gas Used（实际用了多少油）

**核心概念：**

```
Gas = 以太坊网络上的"计算燃料"
Gas Price = 你愿意为每单位计算支付的价格
Gas Fee = Gas Used × Gas Price = 总费用

```

### 正式定义

**Gas** 是以太坊网络上衡量计算工作量的单位。每个操作都需要消耗一定数量的 Gas。

**关键点：**

- Gas 是计算单位，不是货币
- Gas 不能"购买"或"持有"
- Gas 费用用 ETH 支付
- Gas 让网络可持续运行

---

## 为什么需要 Gas？

### 原因 1：防止垃圾信息和攻击 🛡️

**问题情境：** 如果交易免费会怎样？

```
攻击者可以：
→ 发送数百万笔无意义交易
→ 部署无限循环的恶意合约
→ 让网络瘫痪（DoS攻击）
→ 没有任何成本

```

**Gas 的解决方案：**

```
每个操作都要花钱
→ 垃圾信息变得昂贵
→ 攻击者必须支付巨额费用
→ 网络得到保护

```

**真实例子：**

```solidity
// 恶意合约示例（无限循环）
contract Attack {
    function infiniteLoop() public {
        while(true) {
            // 这会一直运行...
        }
    }
}

// 如果没有Gas限制，这会让整个网络卡住
// 有了Gas限制，执行到Gas耗尽就停止
// 攻击者还要为消耗的Gas付费！

```

### 原因 2：激励矿工/验证者 💎

**谁在运行以太坊？**

- 全球数千个节点
- 验证者需要投入：
  - 💻 高性能硬件
  - ⚡ 电力消耗
  - 🌐 带宽成本
  - ⏰ 时间和维护

**Gas 费用的流向：**

```
用户支付Gas费
    ↓
    75-90%分配给验证者/矿工（作为奖励）
    ↓
    10-25%被销毁（EIP-1559后）
    ↓
验证者获得激励继续维护网络

```

**如果没有 Gas 费用：**

- ❌ 没人愿意运行节点（成本高，无收益）
- ❌ 网络无法运行
- ❌ 去中心化无法维持

### 原因 3：资源分配和优先级 ⚖️

**有限的区块空间：**

```
每个区块能容纳的交易有限
    ↓
需要一个机制来决定：哪些交易先被处理？
    ↓
Gas Price成为"竞价系统"

```

**工作方式：**

```
低Gas Price：便宜但慢
    ↓ [等待区] ↓
中等Gas Price：合理价格，合理速度
    ↓ [优先] ↓
高Gas Price：贵但快速确认

```

**真实场景：**

```
NFT抢购：
- 你出 100 Gwei
- 别人出 200 Gwei
→ 别人的交易先被打包
→ 你可能抢不到

DeFi套利：
- 时间敏感的交易
- 愿意支付高Gas费
→ 确保快速执行

```

### 原因 4：防止计算资源滥用 🔒

**问题：** 复杂计算会占用大量资源

```
简单转账：21,000 gas（几乎瞬间）
复杂合约：可能需要几百万gas

如果不限制：
→ 有人可能部署超复杂合约
→ 占用整个区块的空间
→ 影响其他人的交易

```

**Gas Limit 的作用：**

```
每个交易设置Gas Limit
    ↓
如果超过限制，交易失败
    ↓
防止单个交易消耗过多资源
    ↓
保护网络的整体性能

```

### 原因 5：让区块链可持续发展 🌱

**经济模型：**

```
传统互联网：
公司 → 服务器成本 → 广告/订阅收入 → 覆盖成本

区块链：
用户 → Gas费用 → 验证者激励 → 网络运行 → 更多用户

```

**EIP-1559 后的良性循环：**

```
用户支付Gas
    ↓
基础费用被销毁（减少ETH供应）
    ↓
ETH变得更稀缺（通缩压力）
    ↓
ETH价值可能上升
    ↓
吸引更多验证者
    ↓
网络更加安全和分散

```

---

## Gas 工作原理

### Gas 的三个关键概念

### 1. Gas Limit（Gas 限制）

**定义：** 你愿意为这笔交易消耗的最大 Gas 数量

```
类比：油箱容量
- 你准备了50升油
- 即使车子想用60升
- 最多也只能用50升

```

**设置原则：**

```
✅ 设置得高一点：确保交易成功
   - 多余的Gas会退还
   - 只为实际使用的Gas付费

❌ 设置得太低：交易会失败
   - Gas会被消耗（不退还！）
   - 交易不会被执行
   - 白白浪费钱

```

**实际例子：**

```
简单ETH转账：
- 固定需要 21,000 gas
- 设置 21,000 = 刚好够
- 设置 50,000 = 浪费空间但安全
- 设置 20,000 = 会失败！

复杂合约调用：
- 实际需要 150,000 gas
- 钱包估算：180,000 gas（加20%安全边际）
- 你设置：200,000 gas
- 实际使用：150,000 gas
- 退还：50,000 gas

```

### 2. Gas Price（Gas 价格）

**定义：** 你愿意为每单位 Gas 支付的价格

**单位换算：**

```
1 ETH = 1,000,000,000 Gwei（10^9 Gwei）
1 Gwei = 0.000000001 ETH

常见Gas Price范围：
- 低：15-30 Gwei（网络空闲）
- 中：30-50 Gwei（正常）
- 高：50-100 Gwei（繁忙）
- 极高：100+ Gwei（NFT抢购、重大事件）

```

**Gas Price 决定速度：**

```
10 Gwei：
⏰ 可能需要等10-30分钟
💰 最便宜

30 Gwei：
⏰ 通常1-5分钟确认
💰 合理价格

100 Gwei：
⏰ 下一个区块（~15秒）
💰 贵但快

500 Gwei：
⏰ 几乎立即
💰 非常贵（紧急情况）

```

### 3. Gas Used（实际消耗）

**定义：** 交易实际使用的 Gas 数量

**示例：**

```jsx
// 发送交易前
Gas Limit: 100,000
Gas Price: 50 Gwei
预估最大费用: 100,000 × 50 = 5,000,000 Gwei = 0.005 ETH

// 交易执行后
Gas Used: 65,000 (实际使用)
退还: 100,000 - 65,000 = 35,000 gas
实际费用: 65,000 × 50 = 3,250,000 Gwei = 0.00325 ETH

节省: 0.00175 ETH（自动退还到你的钱包）

```

---

## Gas 费用计算

### 传统方式（EIP-1559 之前）

```
总费用 = Gas Used × Gas Price

示例：
Gas Used: 21,000
Gas Price: 50 Gwei

计算：
21,000 × 50 Gwei = 1,050,000 Gwei
= 0.00105 ETH

如果1 ETH = $2,000:
0.00105 × $2,000 = $2.10

```

### 新方式：EIP-1559（2021 年 8 月后）

**新的费用结构：**

```
总费用 = Gas Used × (Base Fee + Priority Fee)

```

**组成部分：**

### Base Fee（基础费用）

- 由网络自动调整
- 根据区块拥堵程度动态变化
- **会被销毁**（不给矿工）
- 每个区块可变化最多 12.5%

```
区块很满（>50%） → Base Fee上升
区块不满（<50%） → Base Fee下降

```

### Priority Fee（优先费/小费）

- 你给验证者的"小费"
- 鼓励快速打包
- 完全归验证者所有
- 你可以自己设置

```
不急的交易：1-2 Gwei
普通交易：2-3 Gwei
紧急交易：5-10+ Gwei

```

### Max Fee（最高费用）

- 你愿意支付的最高 Gas Price
- 保护你不会支付超出预期

```
Max Fee Per Gas = 最高愿意支付的价格
实际支付 = Base Fee + Priority Fee
如果 Base Fee + Priority Fee > Max Fee，交易失败

退款 = (Max Fee - Base Fee - Priority Fee) × Gas Used

```

### 实际计算例子

**场景：** 普通的 ERC-20 代币转账

```
基本参数：
Gas Used: 65,000
Base Fee: 30 Gwei（网络当前状态）
Priority Fee: 2 Gwei（你设置的小费）
Max Fee: 100 Gwei（你设置的上限）

计算：
实际Gas Price = 30 + 2 = 32 Gwei
总费用 = 65,000 × 32 = 2,080,000 Gwei = 0.00208 ETH

费用分配：
销毁（Base Fee）: 65,000 × 30 = 1,950,000 Gwei
验证者收入（Priority Fee）: 65,000 × 2 = 130,000 Gwei

如果1 ETH = $2,000:
你支付: 0.00208 × $2,000 = $4.16

```

---

## 影响 Gas 费用的因素

### 1. 网络拥堵程度 📊

**供需关系：**

```
高需求时期：
- NFT铸造
- 热门空投
- DeFi挖矿开始
- 市场剧烈波动
→ 大量用户同时交易
→ Gas价格飙升

低需求时期：
- 深夜（UTC时间）
- 周末
- 熊市期间
→ Gas价格较低

```

**实际数据：**

```
正常：30-50 Gwei
繁忙：100-200 Gwei
极端：500-1000+ Gwei（罕见）

2021年NFT热潮：曾达到5000+ Gwei！

```

### 2. 交易复杂度 🔧

**不同操作的 Gas 消耗：**

| 操作类型       | 大约 Gas 消耗   | 说明         |
| -------------- | --------------- | ------------ |
| 简单 ETH 转账  | 21,000          | 最基础操作   |
| ERC-20 转账    | 45,000-65,000   | 需要调用合约 |
| ERC-20 授权    | 45,000-50,000   | Approve 操作 |
| Uniswap 交易   | 150,000-300,000 | 复杂的交互   |
| NFT 铸造       | 50,000-200,000  | 取决于合约   |
| 复杂 DeFi 操作 | 500,000+        | 多步骤操作   |

**为什么有差异？**

```
更多操作 → 更多计算 → 更多Gas

简单转账：
1. 检查余额
2. 扣除金额
3. 增加对方金额
= 3步简单操作

Uniswap交易：
1. 检查余额和授权
2. 计算兑换率
3. 检查滑点
4. 更新流动性池
5. 转移代币A
6. 转移代币B
7. 触发多个事件
8. 更新价格预言机
= 复杂的多步骤操作

```

### 3. 存储操作 💾

**存储最贵！**

```
计算操作：便宜
读取存储：中等
写入存储：昂贵
清空存储：有退款

实际成本：
写入一个新存储槽：20,000 gas
修改现有存储：5,000 gas
清空存储（退款）：-15,000 gas

```

**示例：**

```solidity
contract GasExample {
    uint256 public value; // 存储变量

    // 昂贵：写入存储
    function setValue(uint256 _value) public {
        value = _value;  // 20,000 gas（首次）
    }

    // 便宜：只读取
    function getValue() public view returns (uint256) {
        return value;  // ~2,000 gas
    }

    // 计算：中等
    function calculate(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;  // ~200 gas
    }
}

```

### 4. 合约优化 ⚡

**好的合约设计可以节省大量 Gas！**

**示例对比：**

```solidity
// ❌ 低效代码
contract Inefficient {
    uint256[] public numbers;

    function addNumbers(uint256[] memory _nums) public {
        for(uint i = 0; i < _nums.length; i++) {
            numbers.push(_nums[i]);  // 每次push都写存储
        }
    }
}
// Gas消耗：~100,000+ gas（10个数字）

// ✅ 高效代码
contract Efficient {
    uint256[] public numbers;

    function addNumbers(uint256[] memory _nums) public {
        uint256 len = _nums.length;  // 缓存长度
        for(uint i = 0; i < len; i++) {
            numbers.push(_nums[i]);
        }
    }
}
// Gas消耗：~80,000 gas（同样10个数字）
// 节省：20%!

```

---

## 如何优化 Gas 费用

### 策略 1：选择正确的交易时间 ⏰

**最佳时间（UTC）：**

```
✅ 最便宜：
- 周末
- 凌晨 2:00-6:00
- 假期

❌ 最贵：
- 工作日
- 下午 2:00-10:00（美国/欧洲工作时间）
- 重大事件发生时

```

**实用工具：**

- https://ethereumprice.org/gas/
- https://etherscan.io/gastracker
- https://www.gasprice.io/

### 策略 2：批量操作 📦

**单独操作 vs 批量：**

```
❌ 分别发送：
转账给A：21,000 gas + 费用
转账给B：21,000 gas + 费用
转账给C：21,000 gas + 费用
总计：63,000 gas + 3笔交易费用

✅ 批量发送（使用多发合约）：
一次性转账给A、B、C：45,000 gas + 1笔交易费用
节省：~40%!

```

**批量工具：**

- Disperse.app（多地址转账）
- Gnosis Safe（批量交易）

### 策略 3：使用 Layer 2 🚀

**以太坊主网 vs Layer 2：**

```
主网（Layer 1）：
简单转账：$2-10
Swap：$20-100
复杂操作：$50-500+

Layer 2（如Arbitrum、Optimism）：
简单转账：$0.01-0.50
Swap：$0.50-5
复杂操作：$1-20

节省：95-99%!

```

**流行的 Layer 2：**

- Arbitrum
- Optimism
- zkSync
- Polygon（严格说是侧链）
- Base

### 策略 4：设置合理的 Gas Price 💡

**技巧：**

```
不急的交易：
- 设置低Gas Price
- 可能等待30分钟-数小时
- 适合：定期存款、非时间敏感的转账

普通交易：
- 使用钱包推荐的Gas Price
- 通常5-15分钟确认
- 适合：日常使用

紧急交易：
- 设置高Gas Price
- 1-2分钟内确认
- 适合：套利、抢购、止损

```

**EIP-1559 技巧：**

```
Max Fee设置：当前Base Fee × 2
- 保护自己免受突然的费用飙升
- 只会支付实际需要的费用

Priority Fee设置：
- 不急：1-2 Gwei
- 普通：2-3 Gwei
- 紧急：5-10+ Gwei

```

### 策略 5：使用 Gas 代币 ⛽

**GasToken/CHI：**

```
原理：
- Gas便宜时"铸造"代币
- Gas贵时"销毁"代币换取退款

优点：
- 可以套利Gas价格差
- 大户常用

缺点：
- 需要提前准备
- 现在效果不如以前（EIP-3529限制）

```

### 策略 6：优化智能合约代码 👨‍💻

**如果你是开发者：**

```solidity
// 技巧1：使用短路运算
if (condition1 && condition2) { ... }
// condition1为false时，不会检查condition2

// 技巧2：缓存数组长度
uint256 len = array.length;  // 一次读取
for(uint i = 0; i < len; i++) { ... }

// 技巧3：使用unchecked（Solidity 0.8+）
unchecked {
    counter++;  // 跳过溢出检查，节省gas
}

// 技巧4：打包变量
struct Packed {
    uint128 a;  // 一起存储
    uint128 b;  // 在同一个槽位
}

// 技巧5：使用事件而不是存储
emit DataLogged(value);  // 便宜
// 而不是
storedData = value;  // 昂贵

```

---

## 常见场景 Gas 消耗

### 真实世界的 Gas 费用表

**基于 30 Gwei Gas Price + 1 ETH = $2,000**

| 操作             | Gas 消耗 | ETH 费用 | USD 费用 |
| ---------------- | -------- | -------- | -------- |
| ETH 转账         | 21,000   | 0.00063  | $1.26    |
| ERC-20 转账      | 65,000   | 0.00195  | $3.90    |
| ERC-20 授权      | 46,000   | 0.00138  | $2.76    |
| Uniswap V2 交易  | 152,000  | 0.00456  | $9.12    |
| Uniswap V3 交易  | 184,000  | 0.00552  | $11.04   |
| NFT 铸造         | 100,000  | 0.00300  | $6.00    |
| NFT 转移         | 85,000   | 0.00255  | $5.10    |
| OpenSea 购买     | 200,000  | 0.00600  | $12.00   |
| 质押 ETH 到 DeFi | 150,000  | 0.00450  | $9.00    |
| 从 DeFi 提取     | 120,000  | 0.00360  | $7.20    |

**注意：** 实际费用会根据 Gas Price 和 ETH 价格波动！

### Gas 费用飙升案例

**历史上的极端情况：**

```
2021年5月 - Bored Ape NFT铸造：
- Gas Price：1000+ Gwei
- 简单转账：$50+
- NFT铸造：$200-500

2021年8月 - EIP-1559上线：
- Gas Price：200-300 Gwei（初期混乱）
- 逐渐稳定到更低水平

2023年2月 - 某Meme币热潮：
- Gas Price：500+ Gwei
- 用户抢购，Gas战

经验教训：
❌ 不要在热潮时FOMO
✅ 等待Gas降低
✅ 考虑Layer 2替代方案

```

---

## 实用工具

### Gas 追踪器

1. **Etherscan Gas Tracker**
   - https://etherscan.io/gastracker
   - 实时 Gas 价格
   - 历史图表
   - 推荐 Gas Price
2. **Ethereum Gas Charts**
   - https://ethereumprice.org/gas/
   - 详细统计
   - 最佳交易时间建议
3. **Gas Now**
   - https://www.gasnow.org/
   - 简洁界面
   - 快速查看当前 Gas
4. **Blocknative Gas Estimator**
   - https://www.blocknative.com/gas-estimator
   - 精确预测
   - 开发者 API

### 钱包内置 Gas 估算

**MetaMask：**

- 自动估算 Gas
- 可手动调整
- 显示"慢"、"中"、"快"选项

**Rainbow Wallet：**

- 智能 Gas 优化
- 清晰的费用显示

**Ledger/Trezor：**

- 硬件钱包也支持 Gas 设置
- 更安全但需要手动确认

### 浏览器插件

1. **ETH Gas Station Extension**
   - 实时 Gas 价格
   - 浏览器通知
2. **Gas Price Alert**
   - 设置价格提醒
   - Gas 降到目标价时通知

---

## 常见问题

### Q1: 如果 Gas 不够会怎样？

```
情况：
你设置 Gas Limit = 50,000
实际需要 = 65,000

结果：
❌ 交易失败（Out of Gas）
❌ 已消耗的50,000 gas不会退还
❌ 状态回滚，但Gas费损失

教训：
✅ 总是设置足够的Gas Limit
✅ 使用钱包推荐值
✅ 宁可多设置，多余会退还

```

### Q2: 为什么有时 Gas 估算不准确？

**原因：**

```
1. 网络状态变化
   - 估算时：30 Gwei
   - 实际时：100 Gwei

2. 合约状态依赖
   - 有些合约根据状态消耗不同Gas
   - 估算时和执行时状态可能不同

3. 复杂的条件逻辑
   - 不同路径消耗不同Gas
   - 估算使用平均值

解决：
- 加20-30%安全边际
- 检查合约代码
- 使用经验值

```

### Q3: 可以取消正在 pending 的交易吗？

**可以！两种方法：**

**方法 1：加速交易**

```
1. 用更高的Gas Price重新发送
2. 使用相同的Nonce
3. 原交易会被替换

```

**方法 2：取消交易**

```
1. 发送0 ETH给自己
2. 使用相同的Nonce
3. 设置更高的Gas Price
4. 原交易被取消

```

### Q4: Gas 费可以用其他代币支付吗？

**主网：不行**

- 只能用 ETH 支付 Gas
- 这是以太坊的设计原则

**例外情况：**

```
✅ 某些Layer 2：
   - Polygon可用MATIC
   - BSC可用BNB

✅ Meta Transactions（元交易）：
   - 第三方代付Gas
   - 用户看起来"免费"
   - 实际有人支付了

✅ Gasless交易：
   - 项目方补贴
   - 用户无感支付

```

### Q5: 为什么有时 Gas 费比转账金额还高？

**常见情况：**

```
转账金额：0.001 ETH ($2)
Gas费用：0.005 ETH ($10)

原因：
- Gas费与金额无关
- 只与操作复杂度相关
- 小额转账不经济

建议：
- 累积后批量转账
- 使用Layer 2
- 考虑成本效益

```

---

## 进阶话题

### Gas 优化编译器

**Solidity 编译器优化：**

```bash
solc --optimize --optimize-runs 200 Contract.sol

optimize-runs：
- 200：平衡部署和运行成本
- 1：优化部署成本
- 1000000：极致优化运行成本

```

### Gas Refunds（Gas 退款）

**可以获得退款的操作：**

```
1. 清空存储槽
   - 释放5,000 gas（部分退款）

2. 自毁合约（SELFDESTRUCT）
   - 退款24,000 gas
   - EIP-3529后减少

限制：
- 最多退50%的Gas
- 鼓励清理链上数据

```

### Gas Limit 的区块级别

**每个区块的 Gas Limit：**

```
当前：~30,000,000 gas per block
区块时间：~12秒

意味着：
- 每个区块可容纳约1400笔简单转账
- 或约100笔Uniswap交易
- 决定网络吞吐量

```

---

## 总结

### Gas 的本质

```
Gas是：
✅ 计算单位
✅ 防止滥用的机制
✅ 激励验证者的方式
✅ 资源分配的工具
✅ 网络可持续性的保障

Gas不是：
❌ 单纯的"税费"
❌ 可以避免的成本
❌ 以太坊的"缺陷"

```

### 最佳实践清单

**交易前：**

- [ ] 检查当前 Gas 价格
- [ ] 选择合适的交易时间
- [ ] 设置合理的 Gas Limit
- [ ] 考虑 Layer 2 替代方案

**交易中：**

- [ ] 不要在热潮时 FOMO
- [ ] 使用批量操作
- [ ] 监控交易状态

**交易后：**

- [ ] 检查实际 Gas 消耗
- [ ] 学习优化经验
- [ ] 记录成本供参考

### 未来展望

**以太坊路线图改进：**

```
✅ EIP-1559：已实施（2021）
   - 更可预测的费用
   - 基础费用销毁

🔄 Dencun升级：已实施（2024）
   - Blob交易
   - Layer 2成本大幅降低

🔮 未来：
   - 分片（Sharding）
   - 更多Layer 2
   - 最终：极低的Gas费用

```

---

## 延伸阅读

### 官方资源

1. **Ethereum.org - Gas and Fees**
   - https://ethereum.org/en/developers/docs/gas/
2. **EIP-1559 详解**
   - https://eips.ethereum.org/EIPS/eip-1559
3. **Vitalik 的文章**
   - https://vitalik.ca/general/2021/01/05/rollup.html

### 工具和数据

1. **Etherscan Gas Tracker**
   - https://etherscan.io/gastracker
2. **L2Fees 比较**
   - https://l2fees.info/
3. **Dune Analytics - Gas Dashboard**
   - https://dune.com/queries?category=dashboards

### 开发者资源

1. **Gas 优化技巧**
   - https://github.com/iskdrews/awesome-solidity-gas-optimization
2. **OpenZeppelin - Gas 优化**
   - https://blog.openzeppelin.com/the-ultimate-guide-to-gas-optimization

---

**记住：** Gas 不是 bug，而是 feature！它是让去中心化网络可持续运行的核心机制。理解 Gas，就能更好地使用以太坊和其他区块链。

_最后更新：2025 年 11 月祝你成为 Gas 优化大师！⛽_
