---
title: ' MCP Transports'
date: '2025-11-13'
excerpt: 'Model Context Protocol (MCP) 传输层详解 - stdio 和 Streamable HTTP 深度解析'
tags: ['AI', 'MCP']
series: 'AI学习'
---

# MCP Transports 完全指南

> Model Context Protocol (MCP) 传输层详解 - stdio 和 Streamable HTTP 深度解析

## 目录

- [概述](#概述)
- [传输层架构](#传输层架构)
- [stdio 传输](#stdio-传输)
- [Streamable HTTP 传输](#streamable-http-传输)
- [会话管理](#会话管理)
- [协议版本头](#协议版本头)
- [向后兼容性](#向后兼容性)
- [实现示例](#实现示例)
- [最佳实践](#最佳实践)

---

## 概述

### 什么是 MCP Transports？

MCP Transports 是 Model Context Protocol 中负责客户端和服务器之间消息传输的底层机制。MCP 支持多种传输方式，以适应不同的部署场景和需求。

### 支持的传输方式

MCP 目前支持以下标准传输方式：

| 传输方式            | 场景     | 优势             | 劣势             |
| ------------------- | -------- | ---------------- | ---------------- |
| **stdio**           | 本地进程 | 简单、低延迟     | 仅限本地         |
| **Streamable HTTP** | 远程服务 | 支持远程、可扩展 | 需要 HTTP 服务器 |
| **自定义传输**      | 特殊需求 | 灵活可定制       | 需要自行实现     |

### 核心特性

```
MCP Transport 核心特性:

┌─────────────────────────────────────────────────┐
│  1. 消息传递                                      │
│     • JSON-RPC 2.0 消息格式                      │
│     • 请求/响应/通知                              │
│     • 双向通信                                    │
│                                                  │
│  2. 连接管理                                      │
│     • 会话生命周期                                │
│     • 断线重连                                    │
│     • 连接复用                                    │
│                                                  │
│  3. 安全性                                        │
│     • Origin 验证                                │
│     • 会话 ID 管理                               │
│     • 身份验证支持                                │
│                                                  │
│  4. 可靠性                                        │
│     • 消息去重                                    │
│     • 断点续传                                    │
│     • 错误处理                                    │
└─────────────────────────────────────────────────┘
```

---

## 传输层架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      MCP 传输层架构                           │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              MCP Client / Server Logic                 │  │
│  │  • 协议消息处理                                         │  │
│  │  • 能力协商                                             │  │
│  │  • 请求/响应匹配                                        │  │
│  └────────────────┬───────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    ↓
┌───────────────────────────────────────────────────────────────┐
│                   Transport Layer                              │
│  ┌──────────────────┬─────────────────────────────────────┐  │
│  │                  │                                      │  │
│  │   stdio          │    Streamable HTTP                  │  │
│  │   Transport      │    Transport                        │  │
│  │                  │                                      │  │
│  │  ┌────────────┐  │   ┌──────────────────────────────┐ │  │
│  │  │ stdin/out  │  │   │  HTTP POST (Client→Server)   │ │  │
│  │  │ 管道通信    │  │   │  • JSON-RPC 请求/响应/通知    │ │  │
│  │  │ 换行分隔    │  │   │  • Content-Type 协商         │ │  │
│  │  └────────────┘  │   └──────────────────────────────┘ │  │
│  │                  │                                      │  │
│  │  ┌────────────┐  │   ┌──────────────────────────────┐ │  │
│  │  │ stderr     │  │   │  SSE (Server→Client)         │ │  │
│  │  │ 日志输出    │  │   │  • 服务器推送                 │ │  │
│  │  └────────────┘  │   │  • 事件流                     │ │  │
│  │                  │   │  • 断点续传                   │ │  │
│  └──────────────────┤   └──────────────────────────────┘ │  │
│                     │                                      │  │
│                     │   ┌──────────────────────────────┐ │  │
│                     │   │  会话管理                     │ │  │
│                     │   │  • Mcp-Session-Id            │ │  │
│                     │   │  • 会话创建/终止              │ │  │
│                     │   └──────────────────────────────┘ │  │
│                     │                                      │  │
│  ┌──────────────────────────────────────────────────────┐ │  │
│  │              自定义传输（可插拔）                      │  │
│  │  • WebSocket                                          │  │
│  │  • gRPC                                               │  │
│  │  • 其他自定义协议                                      │  │
│  └──────────────────────────────────────────────────────┘ │  │
└───────────────────────────────────────────────────────────────┘
                    │
                    ↓
┌───────────────────────────────────────────────────────────────┐
│                 Network / Process Layer                        │
│  ┌──────────────────┬─────────────────────────────────────┐  │
│  │  本地进程通信     │       网络通信                        │  │
│  │  • 子进程         │       • TCP/IP                       │  │
│  │  • 管道           │       • TLS/SSL                      │  │
│  │  • 进程间通信     │       • HTTP/2                       │  │
│  └──────────────────┴─────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### 传输方式对比

```
┌──────────────────────────────────────────────────────────┐
│               stdio vs Streamable HTTP                    │
└──────────────────────────────────────────────────────────┘

stdio (本地):
┌─────────────┐     stdin/stdout      ┌─────────────┐
│   Client    │ ←──────────────────→  │   Server    │
│  (Parent)   │       (Pipe)          │ (Subprocess) │
└─────────────┘                       └─────────────┘
     ↑                                       ↑
     │ 启动                                  │ 日志
     │                                       ↓
     └────────────────────────────────→  stderr

特点:
✅ 简单直接
✅ 低延迟
✅ 无需网络
❌ 仅限本地
❌ 难以扩展

Streamable HTTP (远程/本地):
┌─────────────┐                       ┌─────────────┐
│   Client    │                       │   Server    │
└─────────────┘                       └─────────────┘
     ↓                                       ↑
     │ POST (JSON-RPC)                      │
     ├────────────────────────────────────→ │
     │                                       │
     │ ← 200 OK / SSE Stream                │
     │   (text/event-stream)                │
     ←───────────────────────────────────── │
     │                                       │
     │ GET (监听消息)                        │
     ├────────────────────────────────────→ │
     │                                       │
     │ ← SSE Stream                         │
     │   (服务器推送)                         │
     ←───────────────────────────────────── │
     │                                       │
     │ DELETE (终止会话)                     │
     ├────────────────────────────────────→ │
     │                                       │
     │ ← 200 OK / 405 Method Not Allowed    │
     ←───────────────────────────────────── │

特点:
✅ 支持远程
✅ 双向通信
✅ 可扩展
✅ 支持断点续传
❌ 较复杂
❌ 需要 HTTP 服务器
```

---

## stdio 传输

### 概念说明

**stdio** (standard input/output) 传输使用标准输入输出流进行进程间通信。这是最简单的传输方式，适合本地场景。

### 工作原理

```
stdio 传输工作流程:

┌─────────────────────────────────────────────────────────┐
│  Step 1: 客户端启动服务器子进程                           │
└─────────────────────────────────────────────────────────┘

Client Process:
┌─────────────────────────┐
│  const server = spawn(  │
│    'node',              │
│    ['server.js']        │
│  );                     │
└─────────────────────────┘
         │
         ↓ 创建子进程
┌─────────────────────────┐
│   Server Subprocess     │
└─────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Step 2: 建立管道连接                                     │
└─────────────────────────────────────────────────────────┘

Client                          Server
  │                               │
  │  stdin  ────────────────────→ │ (读取输入)
  │                               │
  │ stdout ←──────────────────── │ (写入输出)
  │                               │
  │ stderr ←──────────────────── │ (日志/错误)
  │                               │

┌─────────────────────────────────────────────────────────┐
│  Step 3: 消息交换                                         │
└─────────────────────────────────────────────────────────┘

Client → Server (via stdin):
{"jsonrpc":"2.0","id":1,"method":"initialize",...}\n
{"jsonrpc":"2.0","method":"ping"}\n
{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n

Server → Client (via stdout):
{"jsonrpc":"2.0","id":1,"result":{...}}\n
{"jsonrpc":"2.0","method":"notifications/tools/list_changed"}\n
{"jsonrpc":"2.0","id":2,"result":{"tools":[...]}}\n

Server → Logs (via stderr):
[INFO] Server started on stdio
[DEBUG] Received initialize request
[WARN] Tool execution took 500ms
```

### 协议规则

```
stdio 传输规则:

┌─────────────────────────────────────────────────────────┐
│  1. 消息格式                                              │
└─────────────────────────────────────────────────────────┘

✅ 每条消息占一行
✅ 以换行符 (\n) 分隔
✅ 必须是有效的 JSON-RPC 消息
❌ 不能包含嵌入的换行符

示例:
{"jsonrpc":"2.0","id":1,"method":"test"}\n
{"jsonrpc":"2.0","id":2,"method":"test2"}\n

错误示例:
{
  "jsonrpc": "2.0",    ← 包含换行符，不允许！
  "id": 1
}

┌─────────────────────────────────────────────────────────┐
│  2. stdin/stdout 使用规则                                │
└─────────────────────────────────────────────────────────┘

Client 的 stdin (写入到 Server):
  ✅ 只能写入有效的 MCP 消息
  ❌ 不能写入其他内容

Server 的 stdout (写入到 Client):
  ✅ 只能写入有效的 MCP 消息
  ❌ 不能写入日志或调试信息

┌─────────────────────────────────────────────────────────┐
│  3. stderr 使用规则                                       │
└─────────────────────────────────────────────────────────┘

Server 的 stderr (日志输出):
  ✅ 可以写入 UTF-8 日志
  ✅ 用于调试和监控

Client 处理 stderr:
  • 可以捕获日志
  • 可以转发到日志系统
  • 可以忽略
```

### TypeScript 实现示例

```typescript
import { spawn, ChildProcess } from 'child_process';
import * as readline from 'readline';

class StdioTransport {
  private serverProcess: ChildProcess;
  private rl: readline.Interface;
  private messageHandlers: Map<number, (result: any) => void> = new Map();
  private nextId = 1;

  constructor(serverCommand: string, serverArgs: string[]) {
    // 启动服务器子进程
    this.serverProcess = spawn(serverCommand, serverArgs, {
      stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
    });

    // 创建 readline 接口读取 stdout
    this.rl = readline.createInterface({
      input: this.serverProcess.stdout!,
      output: undefined,
    });

    // 监听消息
    this.rl.on('line', (line) => {
      this.handleMessage(line);
    });

    // 监听 stderr（日志）
    this.serverProcess.stderr!.on('data', (data) => {
      console.log('[Server Log]', data.toString());
    });

    // 监听进程退出
    this.serverProcess.on('exit', (code) => {
      console.log(`[Server] Process exited with code ${code}`);
    });
  }

  // 发送消息到服务器
  async sendRequest(method: string, params?: any): Promise<any> {
    const id = this.nextId++;

    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    // 写入 stdin（必须以换行符结束）
    this.serverProcess.stdin!.write(JSON.stringify(message) + '\n');

    // 等待响应
    return new Promise((resolve, reject) => {
      this.messageHandlers.set(id, resolve);

      // 设置超时
      setTimeout(() => {
        if (this.messageHandlers.has(id)) {
          this.messageHandlers.delete(id);
          reject(new Error(`Request ${id} timed out`));
        }
      }, 30000);
    });
  }

  // 发送通知（不等待响应）
  sendNotification(method: string, params?: any): void {
    const message = {
      jsonrpc: '2.0',
      method,
      params,
    };

    this.serverProcess.stdin!.write(JSON.stringify(message) + '\n');
  }

  // 处理收到的消息
  private handleMessage(line: string): void {
    try {
      const message = JSON.parse(line);

      // 响应消息
      if ('id' in message && 'result' in message) {
        const handler = this.messageHandlers.get(message.id);
        if (handler) {
          handler(message.result);
          this.messageHandlers.delete(message.id);
        }
      }
      // 错误响应
      else if ('id' in message && 'error' in message) {
        const handler = this.messageHandlers.get(message.id);
        if (handler) {
          handler(Promise.reject(message.error));
          this.messageHandlers.delete(message.id);
        }
      }
      // 通知消息（从服务器来的）
      else if ('method' in message && !('id' in message)) {
        console.log('[Notification]', message.method, message.params);
        // 处理通知...
      }
    } catch (error) {
      console.error('[Parse Error]', error, line);
    }
  }

  // 关闭连接
  close(): void {
    this.serverProcess.kill();
  }
}

// ========== 使用示例 ==========

async function example() {
  // 创建传输层
  const transport = new StdioTransport('node', ['./server.js']);

  // 初始化
  const initResult = await transport.sendRequest('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: {
      name: 'my-client',
      version: '1.0.0',
    },
  });

  console.log('Initialized:', initResult);

  // 调用工具
  const toolResult = await transport.sendRequest('tools/list');
  console.log('Tools:', toolResult);

  // 发送通知
  transport.sendNotification('notifications/initialized');

  // 关闭
  setTimeout(() => {
    transport.close();
  }, 5000);
}
```

### Python 实现示例

```python
import subprocess
import json
import threading
from typing import Callable, Dict, Any, Optional

class StdioTransport:
    def __init__(self, server_command: list):
        # 启动服务器子进程
        self.process = subprocess.Popen(
            server_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1  # 行缓冲
        )

        self.message_handlers: Dict[int, Callable] = {}
        self.next_id = 1
        self.running = True

        # 启动读取线程
        self.read_thread = threading.Thread(target=self._read_loop)
        self.read_thread.daemon = True
        self.read_thread.start()

        # 启动 stderr 读取线程（日志）
        self.stderr_thread = threading.Thread(target=self._read_stderr)
        self.stderr_thread.daemon = True
        self.stderr_thread.start()

    def send_request(self, method: str, params: Optional[Dict] = None) -> Any:
        """发送请求并等待响应"""
        msg_id = self.next_id
        self.next_id += 1

        message = {
            "jsonrpc": "2.0",
            "id": msg_id,
            "method": method
        }

        if params:
            message["params"] = params

        # 写入 stdin
        self.process.stdin.write(json.dumps(message) + "\n")
        self.process.stdin.flush()

        # 等待响应（简化版，实际应使用 asyncio 或事件）
        import time
        timeout = 30
        start = time.time()

        while msg_id not in self.message_handlers:
            if time.time() - start > timeout:
                raise TimeoutError(f"Request {msg_id} timed out")
            time.sleep(0.1)

        handler = self.message_handlers.pop(msg_id)
        return handler

    def send_notification(self, method: str, params: Optional[Dict] = None):
        """发送通知（不等待响应）"""
        message = {
            "jsonrpc": "2.0",
            "method": method
        }

        if params:
            message["params"] = params

        self.process.stdin.write(json.dumps(message) + "\n")
        self.process.stdin.flush()

    def _read_loop(self):
        """读取 stdout 循环"""
        while self.running:
            try:
                line = self.process.stdout.readline()
                if not line:
                    break

                message = json.loads(line)
                self._handle_message(message)
            except Exception as e:
                print(f"[Error] Reading message: {e}")

    def _read_stderr(self):
        """读取 stderr 循环（日志）"""
        while self.running:
            try:
                line = self.process.stderr.readline()
                if not line:
                    break
                print(f"[Server Log] {line.strip()}")
            except Exception as e:
                print(f"[Error] Reading stderr: {e}")

    def _handle_message(self, message: Dict):
        """处理收到的消息"""
        # 响应消息
        if "id" in message and "result" in message:
            self.message_handlers[message["id"]] = message["result"]

        # 错误响应
        elif "id" in message and "error" in message:
            self.message_handlers[message["id"]] = Exception(message["error"])

        # 通知消息
        elif "method" in message and "id" not in message:
            print(f"[Notification] {message['method']}: {message.get('params')}")

    def close(self):
        """关闭连接"""
        self.running = False
        self.process.terminate()
        self.process.wait(timeout=5)

# ========== 使用示例 ==========

def example():
    # 创建传输层
    transport = StdioTransport(["python", "server.py"])

    # 初始化
    init_result = transport.send_request("initialize", {
        "protocolVersion": "2025-06-18",
        "capabilities": {},
        "clientInfo": {
            "name": "my-client",
            "version": "1.0.0"
        }
    })

    print("Initialized:", init_result)

    # 调用工具
    tool_result = transport.send_request("tools/list")
    print("Tools:", tool_result)

    # 关闭
    transport.close()
```

---

## Streamable HTTP 传输

### 概念说明

**Streamable HTTP** 传输使用 HTTP 协议和 Server-Sent Events (SSE) 实现双向通信。这种方式支持远程服务器，并提供了更强大的功能。

### 核心组件

```
Streamable HTTP 三大组件:

┌─────────────────────────────────────────────────────────┐
│  1. HTTP POST - 客户端发送消息到服务器                    │
└─────────────────────────────────────────────────────────┘

Client → Server:
POST /mcp HTTP/1.1
Host: example.com
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: abc-123
MCP-Protocol-Version: 2025-06-18

{"jsonrpc":"2.0","id":1,"method":"tools/list"}

Server 响应:
• 如果是通知/响应 → 202 Accepted
• 如果是请求 → SSE 流 or JSON

┌─────────────────────────────────────────────────────────┐
│  2. HTTP GET - 客户端监听服务器消息                       │
└─────────────────────────────────────────────────────────┘

Client → Server:
GET /mcp HTTP/1.1
Host: example.com
Accept: text/event-stream
Mcp-Session-Id: abc-123
MCP-Protocol-Version: 2025-06-18
Last-Event-ID: 42  ← 断点续传

Server 响应:
HTTP/1.1 200 OK
Content-Type: text/event-stream

id: 43
data: {"jsonrpc":"2.0","method":"ping"}

id: 44
data: {"jsonrpc":"2.0","id":1,"result":{...}}

┌─────────────────────────────────────────────────────────┐
│  3. SSE Stream - 服务器推送消息                           │
└─────────────────────────────────────────────────────────┘

特点:
• 单向流（Server → Client）
• 支持事件 ID（用于续传）
• 可以包含多个消息
• 支持长连接
```

### 完整通信流程

```
Streamable HTTP 完整流程图:

┌──────────────────────────────────────────────────────────┐
│  Phase 1: 初始化                                          │
└──────────────────────────────────────────────────────────┘

Client                                      Server
  │                                           │
  │  POST /mcp                                │
  │  {"jsonrpc":"2.0","id":1,                │
  │   "method":"initialize",...}             │
  ├──────────────────────────────────────────→│
  │                                           │
  │ ← HTTP 200 OK (SSE Stream)               │
  │   Mcp-Session-Id: xyz-789                │ ← 返回会话 ID
  │   Content-Type: text/event-stream        │
  │                                           │
  │   data: {"jsonrpc":"2.0","id":1,         │
  │          "result":{...}}                 │
  ←───────────────────────────────────────────┤
  │                                           │
  │  保存会话 ID: xyz-789                     │
  │                                           │

┌──────────────────────────────────────────────────────────┐
│  Phase 2: 客户端请求（POST）                              │
└──────────────────────────────────────────────────────────┘

Client                                      Server
  │                                           │
  │  POST /mcp                                │
  │  Mcp-Session-Id: xyz-789                 │
  │  {"jsonrpc":"2.0","id":2,                │
  │   "method":"tools/list"}                 │
  ├──────────────────────────────────────────→│
  │                                           │
  │                                           │ 处理请求
  │                                           │
  │ ← HTTP 200 OK (SSE Stream)               │
  │   Content-Type: text/event-stream        │
  │                                           │
  │   id: 100                                │
  │   data: {"jsonrpc":"2.0","id":2,         │
  │          "result":{"tools":[...]}}       │
  ←───────────────────────────────────────────┤
  │                                           │
  │  SSE 流关闭                               │
  │                                           │

┌──────────────────────────────────────────────────────────┐
│  Phase 3: 监听服务器消息（GET）                            │
└──────────────────────────────────────────────────────────┘

Client                                      Server
  │                                           │
  │  GET /mcp                                │
  │  Accept: text/event-stream               │
  │  Mcp-Session-Id: xyz-789                 │
  ├──────────────────────────────────────────→│
  │                                           │
  │ ← HTTP 200 OK                            │
  │   Content-Type: text/event-stream        │
  │                                           │
  │   (保持连接打开，等待服务器消息)           │
  │                                           │
  │   id: 101                                │
  │   data: {"jsonrpc":"2.0",                │
  │          "method":"notifications/ping"}   │
  ←───────────────────────────────────────────┤
  │                                           │
  │   id: 102                                │
  │   data: {"jsonrpc":"2.0","id":10,        │
  │          "method":"sampling/createMessage"}│
  ←───────────────────────────────────────────┤
  │                                           │
  │  (连接保持打开，持续接收消息)              │
  │                                           │

┌──────────────────────────────────────────────────────────┐
│  Phase 4: 响应服务器请求                                   │
└──────────────────────────────────────────────────────────┘

Client                                      Server
  │                                           │
  │  收到服务器请求 (id: 10)                   │
  │                                           │
  │  POST /mcp                                │
  │  Mcp-Session-Id: xyz-789                 │
  │  {"jsonrpc":"2.0","id":10,               │
  │   "result":{...}}                        │
  ├──────────────────────────────────────────→│
  │                                           │
  │ ← HTTP 202 Accepted                      │
  ←───────────────────────────────────────────┤
  │                                           │

┌──────────────────────────────────────────────────────────┐
│  Phase 5: 断线重连（断点续传）                             │
└──────────────────────────────────────────────────────────┘

Client                                      Server
  │                                           │
  │  连接断开... (最后收到 id: 102)            │
  │                                           │
  │  GET /mcp                                │
  │  Accept: text/event-stream               │
  │  Mcp-Session-Id: xyz-789                 │
  │  Last-Event-ID: 102  ← 断点续传           │
  ├──────────────────────────────────────────→│
  │                                           │
  │ ← HTTP 200 OK                            │
  │   Content-Type: text/event-stream        │
  │                                           │
  │   id: 103                                │
  │   data: {"jsonrpc":"2.0",...}            │ ← 从 103 开始
  ←───────────────────────────────────────────┤
  │                                           │
  │  (恢复接收消息)                           │
  │                                           │

┌──────────────────────────────────────────────────────────┐
│  Phase 6: 终止会话                                        │
└──────────────────────────────────────────────────────────┘

Client                                      Server
  │                                           │
  │  DELETE /mcp                              │
  │  Mcp-Session-Id: xyz-789                 │
  ├──────────────────────────────────────────→│
  │                                           │
  │                                           │ 清理会话
  │                                           │
  │ ← HTTP 200 OK                            │
  │   or                                     │
  │ ← HTTP 405 Method Not Allowed            │
  ←───────────────────────────────────────────┤
  │                                           │
  │  会话结束                                 │
  │                                           │
```

### 消息发送规则

```
POST 请求处理规则:

┌──────────────────────────────────────────────────────────┐
│  输入类型 1: JSON-RPC 响应或通知                          │
└──────────────────────────────────────────────────────────┘

Client POST:
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {"progress": 50}
}

Server 响应:
✅ HTTP 202 Accepted (无 body)
❌ HTTP 400 Bad Request (如果格式错误)

┌──────────────────────────────────────────────────────────┐
│  输入类型 2: JSON-RPC 请求                                │
└──────────────────────────────────────────────────────────┘

Client POST:
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {...}
}

Server 有两种响应方式:

方式 A: 返回 SSE 流
HTTP/1.1 200 OK
Content-Type: text/event-stream

id: 50
data: {"jsonrpc":"2.0","method":"progress","params":{...}}

id: 51
data: {"jsonrpc":"2.0","id":1,"result":{...}}

方式 B: 返回单个 JSON
HTTP/1.1 200 OK
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"result":{...}}
```

### TypeScript 实现示例

```typescript
class StreamableHttpTransport {
  private sessionId: string | null = null;
  private baseUrl: string;
  private eventSource: EventSource | null = null;
  private messageHandlers: Map<number, (result: any) => void> = new Map();
  private nextId = 1;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 初始化会话
  async initialize(params: any): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'MCP-Protocol-Version': '2025-06-18',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: this.nextId++,
        method: 'initialize',
        params,
      }),
    });

    // 提取会话 ID
    const sessionId = response.headers.get('Mcp-Session-Id');
    if (sessionId) {
      this.sessionId = sessionId;
      console.log(`[HTTP] Session ID: ${sessionId}`);
    }

    // 处理响应
    if (response.headers.get('Content-Type')?.includes('text/event-stream')) {
      return await this.handleSSEResponse(response);
    } else {
      return await response.json();
    }
  }

  // 发送请求
  async sendRequest(method: string, params?: any): Promise<any> {
    const id = this.nextId++;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': '2025-06-18',
    };

    if (this.sessionId) {
      headers['Mcp-Session-Id'] = this.sessionId;
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params,
      }),
    });

    // 检查会话是否过期
    if (response.status === 404 && this.sessionId) {
      console.log('[HTTP] Session expired, reinitializing...');
      this.sessionId = null;
      throw new Error('Session expired');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 处理响应
    const contentType = response.headers.get('Content-Type');

    if (contentType?.includes('text/event-stream')) {
      return await this.handleSSEResponse(response);
    } else if (contentType?.includes('application/json')) {
      const result = await response.json();
      return result.result;
    } else {
      return null;
    }
  }

  // 发送通知
  async sendNotification(method: string, params?: any): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'MCP-Protocol-Version': '2025-06-18',
    };

    if (this.sessionId) {
      headers['Mcp-Session-Id'] = this.sessionId;
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
      }),
    });

    if (response.status !== 202) {
      throw new Error(`Expected 202, got ${response.status}`);
    }
  }

  // 监听服务器消息
  startListening(lastEventId?: string): void {
    const url = new URL(this.baseUrl);

    if (this.sessionId) {
      url.searchParams.set('sessionId', this.sessionId);
    }

    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
      'MCP-Protocol-Version': '2025-06-18',
    };

    if (lastEventId) {
      headers['Last-Event-ID'] = lastEventId;
    }

    if (this.sessionId) {
      headers['Mcp-Session-Id'] = this.sessionId;
    }

    this.eventSource = new EventSource(url.toString());

    this.eventSource.onmessage = (event) => {
      console.log(`[SSE] Event ID: ${event.lastEventId}`);
      this.handleSSEMessage(event.data, event.lastEventId);
    };

    this.eventSource.onerror = (error) => {
      console.error('[SSE] Error:', error);
      // 可以实现自动重连
    };
  }

  // 处理 SSE 响应
  private async handleSSEResponse(response: Response): Promise<any> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result: any = null;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const message = JSON.parse(data);

            if ('result' in message) {
              result = message.result;
            } else {
              console.log('[SSE Message]', message);
            }
          } catch (e) {
            console.error('[SSE Parse Error]', e);
          }
        }
      }
    }

    return result;
  }

  // 处理 SSE 消息
  private handleSSEMessage(data: string, eventId: string): void {
    try {
      const message = JSON.parse(data);

      // 响应消息
      if ('id' in message && 'result' in message) {
        const handler = this.messageHandlers.get(message.id);
        if (handler) {
          handler(message.result);
          this.messageHandlers.delete(message.id);
        }
      }
      // 请求消息（从服务器发来的）
      else if ('id' in message && 'method' in message) {
        console.log('[Server Request]', message);
        // 处理服务器请求...
      }
      // 通知消息
      else if ('method' in message) {
        console.log('[Notification]', message.method, message.params);
      }
    } catch (e) {
      console.error('[Message Parse Error]', e);
    }
  }

  // 终止会话
  async terminate(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'DELETE',
        headers: {
          'Mcp-Session-Id': this.sessionId,
          'MCP-Protocol-Version': '2025-06-18',
        },
      });

      if (response.status === 200) {
        console.log('[HTTP] Session terminated');
      } else if (response.status === 405) {
        console.log('[HTTP] Server does not support explicit termination');
      }
    } catch (error) {
      console.error('[HTTP] Error terminating session:', error);
    } finally {
      this.sessionId = null;
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }
  }
}

// ========== 使用示例 ==========

async function example() {
  const transport = new StreamableHttpTransport('https://example.com/mcp');

  // 1. 初始化
  const initResult = await transport.initialize({
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: {
      name: 'my-client',
      version: '1.0.0',
    },
  });

  console.log('Initialized:', initResult);

  // 2. 开始监听服务器消息
  transport.startListening();

  // 3. 发送请求
  const tools = await transport.sendRequest('tools/list');
  console.log('Tools:', tools);

  // 4. 发送通知
  await transport.sendNotification('notifications/progress', {
    progress: 50,
  });

  // 5. 终止会话
  setTimeout(async () => {
    await transport.terminate();
  }, 30000);
}
```

---

## 会话管理

### 会话生命周期

```
Streamable HTTP 会话生命周期:

┌──────────────────────────────────────────────────────────┐
│  1. 会话创建                                              │
└──────────────────────────────────────────────────────────┘

Client → Server: 初始化请求
POST /mcp
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  ...
}

Server → Client: 返回会话 ID
HTTP/1.1 200 OK
Mcp-Session-Id: 550e8400-e29b-41d4-a716-446655440000
Content-Type: text/event-stream

data: {"jsonrpc":"2.0","id":1,"result":{...}}

Client 保存会话 ID:
sessionId = "550e8400-e29b-41d4-a716-446655440000"

┌──────────────────────────────────────────────────────────┐
│  2. 会话使用                                              │
└──────────────────────────────────────────────────────────┘

Client → Server: 后续请求携带会话 ID
POST /mcp
Mcp-Session-Id: 550e8400-e29b-41d4-a716-446655440000
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

Server 验证会话 ID:
✅ 有效 → 处理请求
❌ 无效 → 返回 HTTP 400 Bad Request
❌ 过期 → 返回 HTTP 404 Not Found

┌──────────────────────────────────────────────────────────┐
│  3. 会话过期处理                                          │
└──────────────────────────────────────────────────────────┘

Client → Server: 请求（会话已过期）
POST /mcp
Mcp-Session-Id: 550e8400-...  (已过期)

Server → Client:
HTTP/1.1 404 Not Found

Client 处理:
1. 检测到 404
2. 清除本地会话 ID
3. 重新初始化（发送新的 initialize 请求）
4. 获取新的会话 ID
5. 重试原请求

┌──────────────────────────────────────────────────────────┐
│  4. 会话终止                                              │
└──────────────────────────────────────────────────────────┘

方式 A: 客户端主动终止
Client → Server:
DELETE /mcp
Mcp-Session-Id: 550e8400-...

Server → Client:
HTTP/1.1 200 OK  ← 成功终止
or
HTTP/1.1 405 Method Not Allowed  ← 不支持客户端终止

方式 B: 服务器主动终止
Server 决定终止会话（超时、资源限制等）
→ 后续请求返回 HTTP 404 Not Found

方式 C: 超时自动终止
Server 在一段时间无活动后自动清理会话
```

### 会话 ID 要求

```
会话 ID 规范:

┌──────────────────────────────────────────────────────────┐
│  生成要求                                                 │
└──────────────────────────────────────────────────────────┘

✅ 全局唯一（推荐使用 UUID）
✅ 密码学安全（SecureRandom、crypto.randomUUID 等）
✅ 只包含可见 ASCII 字符（0x21-0x7E）
❌ 不能包含空格或不可见字符

好的示例:
• 550e8400-e29b-41d4-a716-446655440000 (UUID)
• eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (JWT)
• a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6 (加密哈希)

坏的示例:
• 123 (太短，不安全)
• session 123 (包含空格)
• user_session_abc (可预测)

┌──────────────────────────────────────────────────────────┐
│  使用要求                                                 │
└──────────────────────────────────────────────────────────┘

Server 要求:
• 必须在 InitializeResult 的 Mcp-Session-Id 头中返回
• 后续请求必须验证会话 ID
• 缺少会话 ID → 400 Bad Request
• 会话过期 → 404 Not Found

Client 要求:
• 必须在所有后续请求中携带会话 ID
• 收到 404 → 重新初始化
• 保持会话 ID 安全（不泄露）
```

---

## 协议版本头

### MCP-Protocol-Version 头

```
协议版本头使用:

┌──────────────────────────────────────────────────────────┐
│  HTTP 传输必须包含版本头                                   │
└──────────────────────────────────────────────────────────┘

Client → Server: 所有请求都携带
POST /mcp HTTP/1.1
Host: example.com
Content-Type: application/json
MCP-Protocol-Version: 2025-06-18  ← 必需
Mcp-Session-Id: 550e8400-...

┌──────────────────────────────────────────────────────────┐
│  版本协商流程                                             │
└──────────────────────────────────────────────────────────┘

Step 1: Client 发送 initialize 请求
{
  "protocolVersion": "2025-06-18",
  ...
}

Step 2: Server 响应支持的版本
{
  "protocolVersion": "2025-06-18",
  ...
}

Step 3: Client 在所有后续 HTTP 请求中使用协商的版本
MCP-Protocol-Version: 2025-06-18

┌──────────────────────────────────────────────────────────┐
│  版本兼容性                                               │
└──────────────────────────────────────────────────────────┘

Server 行为:
• 收到有效版本 → 正常处理
• 收到无效/不支持的版本 → HTTP 400 Bad Request
• 没有收到版本头 → 假定为 2025-03-26 (向后兼容)

Client 行为:
• 必须发送支持的版本
• 应该支持多个版本（向后兼容）
• 根据 Server 响应选择最终版本
```

---

## 向后兼容性

### 旧版本支持

```
支持旧版 HTTP+SSE 传输 (2024-11-05):

┌──────────────────────────────────────────────────────────┐
│  Server 兼容策略                                          │
└──────────────────────────────────────────────────────────┘

Server 需要同时支持:
1. 新的 Streamable HTTP 端点
   /mcp → 支持 POST, GET, DELETE

2. 旧的 HTTP+SSE 端点
   /sse → SSE 流端点
   /messages → POST 消息端点

架构:
┌─────────────────────────────────────────────┐
│  MCP Server                                  │
│  ┌────────────────────────────────────────┐ │
│  │  新传输 (2025-06-18)                   │ │
│  │  /mcp                                  │ │
│  │  • POST/GET/DELETE                     │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │  旧传输 (2024-11-05)                   │ │
│  │  /sse  (GET)                           │ │
│  │  /messages (POST)                      │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │  共享业务逻辑                           │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Client 兼容策略                                          │
└──────────────────────────────────────────────────────────┘

Client 自动检测流程:

Step 1: 尝试新传输
POST /mcp
Accept: application/json, text/event-stream
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  ...
}

成功 → 使用新传输 ✅

Step 2: 如果失败（HTTP 4xx）
GET /mcp
Accept: text/event-stream

如果返回 SSE 流 + endpoint 事件:
→ 使用旧传输 ✅

否则:
→ 不支持 MCP ❌

┌──────────────────────────────────────────────────────────┐
│  兼容性检测代码示例                                        │
└──────────────────────────────────────────────────────────┘

async function detectTransport(url: string): Promise<'new' | 'old' | null> {
  // 1. 尝试新传输
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {...}
      })
    });

    if (response.ok) {
      return 'new'; // 新传输
    }
  } catch (error) {
    console.log('New transport failed, trying old...');
  }

  // 2. 尝试旧传输
  try {
    const eventSource = new EventSource(url);

    return new Promise((resolve) => {
      eventSource.onmessage = (event) => {
        if (event.type === 'endpoint') {
          resolve('old'); // 旧传输
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        resolve(null); // 不支持
        eventSource.close();
      };

      // 超时
      setTimeout(() => {
        resolve(null);
        eventSource.close();
      }, 5000);
    });
  } catch (error) {
    return null;
  }
}
```

---

## 实现示例

### 完整的 TypeScript Server 实现

```typescript
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  id: string;
  createdAt: number;
  lastActivity: number;
}

class MCPServer {
  private app = express();
  private sessions = new Map<string, Session>();
  private readonly SESSION_TIMEOUT = 3600000; // 1 hour

  constructor() {
    this.app.use(express.json());
    this.setupRoutes();
    this.startCleanupTimer();
  }

  private setupRoutes() {
    // Streamable HTTP endpoint
    this.app.post('/mcp', this.handlePost.bind(this));
    this.app.get('/mcp', this.handleGet.bind(this));
    this.app.delete('/mcp', this.handleDelete.bind(this));
  }

  private async handlePost(req: express.Request, res: express.Response) {
    // 验证 Origin (安全)
    const origin = req.headers.origin;
    if (origin && !this.isOriginAllowed(origin)) {
      return res.status(403).send('Forbidden origin');
    }

    // 获取协议版本
    const protocolVersion = req.headers['mcp-protocol-version'];
    if (!protocolVersion) {
      // 向后兼容：假定为旧版本
      console.log('[Server] No protocol version, assuming 2025-03-26');
    } else if (!this.isSupportedVersion(protocolVersion as string)) {
      return res.status(400).send('Unsupported protocol version');
    }

    // 获取或验证会话 ID
    let sessionId = req.headers['mcp-session-id'] as string;
    const message = req.body;

    // 初始化请求 - 创建新会话
    if (message.method === 'initialize') {
      sessionId = uuidv4();
      this.sessions.set(sessionId, {
        id: sessionId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
      });

      console.log(`[Server] Created session: ${sessionId}`);

      // 返回 SSE 流
      res.setHeader('Mcp-Session-Id', sessionId);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // 发送响应
      const response = {
        jsonrpc: '2.0',
        id: message.id,
        result: {
          protocolVersion: '2025-06-18',
          capabilities: {
            tools: {},
            resources: {},
          },
          serverInfo: {
            name: 'example-server',
            version: '1.0.0',
          },
        },
      };

      res.write(`data: ${JSON.stringify(response)}\n\n`);
      res.end();
      return;
    }

    // 其他请求 - 验证会话
    if (!sessionId) {
      return res.status(400).send('Missing session ID');
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      return res.status(404).send('Session not found');
    }

    // 更新会话活动时间
    session.lastActivity = Date.now();

    // 处理消息
    if (message.method) {
      if (message.id) {
        // 请求 - 返回响应
        const result = await this.handleRequest(message);

        // 可以选择返回 SSE 流或 JSON
        if (req.headers.accept?.includes('text/event-stream')) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.write(`id: ${Date.now()}\n`);
          res.write(`data: ${JSON.stringify(result)}\n\n`);
          res.end();
        } else {
          res.json(result);
        }
      } else {
        // 通知 - 返回 202
        console.log('[Server] Received notification:', message.method);
        res.status(202).end();
      }
    } else {
      // 响应 - 返回 202
      console.log('[Server] Received response:', message);
      res.status(202).end();
    }
  }

  private async handleGet(req: express.Request, res: express.Response) {
    const sessionId = req.headers['mcp-session-id'] as string;

    if (!sessionId) {
      return res.status(400).send('Missing session ID');
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      return res.status(404).send('Session not found');
    }

    // 返回 SSE 流
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 检查断点续传
    const lastEventId = req.headers['last-event-id'] as string;
    if (lastEventId) {
      console.log(`[Server] Resuming from event: ${lastEventId}`);
      // 实现重放逻辑...
    }

    // 保持连接打开，定期发送 ping
    const pingInterval = setInterval(() => {
      res.write(`:ping\n\n`);
    }, 30000);

    // 处理断开连接
    req.on('close', () => {
      clearInterval(pingInterval);
      console.log('[Server] Client disconnected');
    });
  }

  private async handleDelete(req: express.Request, res: express.Response) {
    const sessionId = req.headers['mcp-session-id'] as string;

    if (!sessionId) {
      return res.status(400).send('Missing session ID');
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      return res.status(404).send('Session not found');
    }

    // 删除会话
    this.sessions.delete(sessionId);
    console.log(`[Server] Terminated session: ${sessionId}`);

    res.status(200).send('Session terminated');
  }

  private async handleRequest(message: any): Promise<any> {
    // 处理不同的请求类型
    switch (message.method) {
      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            tools: [
              {
                name: 'example_tool',
                description: 'An example tool',
                inputSchema: {
                  type: 'object',
                  properties: {},
                },
              },
            ],
          },
        };

      default:
        return {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            code: -32601,
            message: 'Method not found',
          },
        };
    }
  }

  private isOriginAllowed(origin: string): boolean {
    // 实现 Origin 验证逻辑
    const allowed = ['http://localhost:3000', 'https://example.com'];
    return allowed.includes(origin);
  }

  private isSupportedVersion(version: string): boolean {
    const supported = ['2025-06-18', '2025-03-26'];
    return supported.includes(version);
  }

  private startCleanupTimer() {
    // 定期清理过期会话
    setInterval(() => {
      const now = Date.now();
      for (const [id, session] of this.sessions.entries()) {
        if (now - session.lastActivity > this.SESSION_TIMEOUT) {
          console.log(`[Server] Cleaning up expired session: ${id}`);
          this.sessions.delete(id);
        }
      }
    }, 60000); // 每分钟检查一次
  }

  start(port: number) {
    this.app.listen(port, '127.0.0.1', () => {
      console.log(`[Server] Listening on http://127.0.0.1:${port}/mcp`);
    });
  }
}

// 启动服务器
const server = new MCPServer();
server.start(3000);
```

---

## 最佳实践

### 1. 安全实践

```typescript
// ✅ Origin 验证（防止 DNS 重绑定攻击）
class SecurityMiddleware {
  validateOrigin(req: express.Request, res: express.Response, next: any) {
    const origin = req.headers.origin;

    if (!origin) {
      // 允许非浏览器客户端（无 Origin 头）
      return next();
    }

    const allowedOrigins = ['http://localhost:3000', 'https://myapp.example.com'];

    if (!allowedOrigins.includes(origin)) {
      return res.status(403).send('Forbidden: Invalid origin');
    }

    next();
  }

  // ✅ 只绑定到 localhost
  bindToLocalhost() {
    app.listen(3000, '127.0.0.1', () => {
      console.log('Listening on 127.0.0.1:3000');
    });
  }

  // ✅ 实现身份验证
  async authenticateRequest(req: express.Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error('Missing authentication');
    }

    // 验证 token
    const token = authHeader.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      throw new Error('Invalid authentication');
    }

    return user;
  }
}
```

### 2. 可靠性实践

```typescript
// ✅ 实现断点续传
class ReliableSSEManager {
  private messageQueues = new Map<
    string,
    Array<{
      id: string;
      data: string;
    }>
  >();

  sendMessage(sessionId: string, data: any): string {
    const messageId = `${Date.now()}-${Math.random()}`;
    const message = {
      id: messageId,
      data: JSON.stringify(data),
    };

    // 保存到队列
    if (!this.messageQueues.has(sessionId)) {
      this.messageQueues.set(sessionId, []);
    }
    this.messageQueues.get(sessionId)!.push(message);

    // 限制队列大小
    const queue = this.messageQueues.get(sessionId)!;
    if (queue.length > 100) {
      queue.shift(); // 移除最老的消息
    }

    return messageId;
  }

  replayMessages(sessionId: string, lastEventId?: string): Array<any> {
    const queue = this.messageQueues.get(sessionId) || [];

    if (!lastEventId) {
      return queue; // 返回所有消息
    }

    // 找到断点位置
    const index = queue.findIndex((msg) => msg.id === lastEventId);

    if (index === -1) {
      return queue; // 找不到，返回所有
    }

    // 返回断点之后的消息
    return queue.slice(index + 1);
  }
}

// ✅ 错误处理
class ErrorHandler {
  handleTransportError(error: Error, req: express.Request, res: express.Response) {
    console.error('[Transport Error]', error);

    if (error.message.includes('Session expired')) {
      return res.status(404).send('Session not found');
    }

    if (error.message.includes('Invalid message')) {
      return res.status(400).send('Bad request');
    }

    res.status(500).send('Internal server error');
  }
}
```

### 3. 性能优化

```typescript
// ✅ 连接池管理
class ConnectionPool {
  private activeConnections = new Map<string, number>();
  private readonly MAX_CONNECTIONS_PER_SESSION = 5;

  canConnect(sessionId: string): boolean {
    const count = this.activeConnections.get(sessionId) || 0;
    return count < this.MAX_CONNECTIONS_PER_SESSION;
  }

  addConnection(sessionId: string): void {
    const count = this.activeConnections.get(sessionId) || 0;
    this.activeConnections.set(sessionId, count + 1);
  }

  removeConnection(sessionId: string): void {
    const count = this.activeConnections.get(sessionId) || 0;
    if (count <= 1) {
      this.activeConnections.delete(sessionId);
    } else {
      this.activeConnections.set(sessionId, count - 1);
    }
  }
}

// ✅ 消息批处理
class MessageBatcher {
  private batches = new Map<string, Array<any>>();
  private timers = new Map<string, NodeJS.Timeout>();

  addMessage(sessionId: string, message: any): void {
    if (!this.batches.has(sessionId)) {
      this.batches.set(sessionId, []);
    }

    this.batches.get(sessionId)!.push(message);

    // 设置定时器批量发送
    if (!this.timers.has(sessionId)) {
      const timer = setTimeout(() => {
        this.flush(sessionId);
      }, 100); // 100ms 批量发送

      this.timers.set(sessionId, timer);
    }
  }

  flush(sessionId: string): void {
    const batch = this.batches.get(sessionId);
    if (!batch || batch.length === 0) return;

    // 发送批量消息
    this.sendBatch(sessionId, batch);

    // 清理
    this.batches.delete(sessionId);
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(sessionId);
    }
  }

  private sendBatch(sessionId: string, messages: Array<any>): void {
    // 实现批量发送逻辑
    console.log(`[Batch] Sending ${messages.length} messages for session ${sessionId}`);
  }
}
```

---

## 总结

### 传输方式选择指南

| 场景          | 推荐传输            | 原因               |
| ------------- | ------------------- | ------------------ |
| 本地 CLI 工具 | **stdio**           | 简单、低延迟       |
| IDE 插件      | **stdio**           | 进程隔离、易于管理 |
| 远程 API 服务 | **Streamable HTTP** | 支持网络、可扩展   |
| Web 应用      | **Streamable HTTP** | 浏览器兼容         |
| 微服务架构    | **Streamable HTTP** | 分布式部署         |
| 开发/调试     | **stdio**           | 日志清晰           |

### 关键要点

**stdio 传输:**

- ✅ 消息以换行符分隔
- ✅ 只在 stdout 写 MCP 消息
- ✅ stderr 用于日志
- ✅ 简单可靠

**Streamable HTTP 传输:**

- ✅ POST 发送消息
- ✅ SSE 接收消息
- ✅ 会话管理
- ✅ 断点续传
- ✅ Origin 验证
- ✅ 协议版本头

### 下一步

- 🔧 根据场景选择合适的传输方式
- 📚 阅读 [MCP Transports 规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
- 🎨 实现自己的传输层
- 🔒 加强安全措施
- 🚀 部署到生产环境

---

## 参考资源

- [MCP Transports 规范](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
- [Server-Sent Events (SSE) 规范](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [JSON-RPC 2.0 规范](https://www.jsonrpc.org/specification)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)

---

**License**: MIT  
**Last Updated**: 2025-06-18  
**Protocol Version**: 2025-06-18
