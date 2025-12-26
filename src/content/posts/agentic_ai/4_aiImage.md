---
title: 'AI 图像生成与 Prompt Engineering：从理论到实践的系统化方法论'
date: '2025-12-26'
excerpt: '深入探讨 AI 图像生成中的 Prompt 工程技术，涵盖结构化提示词设计、视觉层级控制、跨模型对比分析等核心方法，帮助实现可控、可复现的高质量图像生成。'
tags: ['Agentic AI']
series: 'Agentic AI'
---

# AI 图像生成与 Prompt Engineering：从理论到实践的系统化方法论

## 目录

1. [引言：AI 图像生成的技术本质](#1-引言ai-图像生成的技术本质)
2. [核心学习目标](#2-核心学习目标)
3. [Prompt 工程方法论](#3-prompt-工程方法论)
4. [视觉层级描述技术](#4-视觉层级描述技术)
5. [专业术语应用](#5-专业术语应用)
6. [主流模型对比分析](#6-主流模型对比分析)
7. [风格化生成实践](#7-风格化生成实践)
8. [最佳实践总结](#8-最佳实践总结)
9. [进阶方向](#9-进阶方向)

---

## 1. 引言：AI 图像生成的技术本质

在 AI 图像生成领域，Prompt Engineering 不是"试运气"的艺术，而是一门**将自然语言转化为高质量视觉资产的技术中介层**。

### 核心理念

AI 图像生成的本质是：

> **将脑中的画面，翻译成模型能理解的语言**

这个过程涉及三个关键要素：

1. **可控性**：通过精确的语言描述控制生成结果
2. **可复现性**：相同的 Prompt 和参数应产生一致的输出
3. **模型理解**：不同模型对语言的响应机制存在显著差异

### 技术目标

- 从"尝试性输入"转向"确定性输出"
- 建立模块化、可复用的 Prompt 编写框架
- 理解并利用不同模型的特性优势

---

## 2. 核心学习目标

### 2.1 理解 Prompt 的结构化组成

**关键问题**：
- 哪些信息会显著影响生成结果？
- 描述顺序、权重、粒度如何影响模型？

**学习重点**：
- Prompt 的模块化拆解
- 各模块的优先级和相互作用
- 信息密度与输出质量的关系

### 2.2 掌握视觉层级描述方法

**关键问题**：
- 如何让模型区分主体、次要元素与背景？
- 如何引导视线焦点与构图中心？

**学习重点**：
- 空间层级的语言表达
- 清晰度和光线的控制技巧
- 视角和景深的精确描述

### 2.3 熟练使用专业术语

**关键问题**：
- 如何提高生成图像的"专业感"？
- 如何减少模型随机发挥带来的风格偏移？

**学习重点**：
- 摄影术语的正确应用
- 美术风格的精确表达
- 3D 渲染参数的使用

### 2.4 跨模型语义对齐

**关键问题**：
- 不同扩散模型对词权的响应差异是什么？
- 如何针对特定模型优化 Prompt？

**学习重点**：
- Midjourney / DALL·E / Stable Diffusion 的能力边界
- 同一 Prompt 在不同模型中的表现差异
- 模型特定的参数和语法

### 2.5 形成可迁移的最佳实践

**关键问题**：
- 如何建立通用的 Prompt 编写模板？
- 如何在不同场景间复用经验？

**学习重点**：
- 模板化、模块化的 Prompt 编写思路
- 可复用的描述模式
- 系统化的优化方法

---

## 3. Prompt 工程方法论

### 3.1 模块化 Prompt 架构

一份专业的 Prompt 并非词语的堆砌，而应遵循**视觉优先级响应**原则。

#### 标准模块结构

```
[主体 Subject]
  ↓
[动作/状态 Action]
  ↓
[环境/场景 Environment]
  ↓
[视觉层级与构图 Composition]
  ↓
[风格/艺术方向 Style]
  ↓
[摄影/渲染参数 Technical Details]
  ↓
[质量与限制条件 Quality Constraints]
```

#### 通用公式

```
[主体] + [动作/场景] + [构图/镜头] + [光影/色彩] + [艺术风格] + [渲染参数]
```

#### 实战示例

**基础版本**：
```
A cyberpunk city
```

**结构化版本**：
```
A futuristic cyberpunk city (主体+环境),
a lone female hacker standing on a rooftop (主体+动作),
foreground focus, background city blurred (视觉层级),
neon lights, rainy night, reflections (风格),
cinematic lighting, shallow depth of field, 35mm lens (摄影术语),
ultra-detailed, 8k, realistic rendering (质量控制)
```

**效果对比**：
- 基础版本：随机性高，风格不可控
- 结构化版本：输出稳定，符合预期

### 3.2 模块化编写原则

#### 原则 1：由宏观到微观

```
错误顺序：
"35mm lens, neon lights, a hacker, cyberpunk city"

正确顺序：
"A cyberpunk city (全局氛围)
→ with neon lights and rain (环境细节)
→ a hacker on rooftop (主体)
→ 35mm lens, cinematic (技术参数)"
```

#### 原则 2：先主体，后环境，再风格，最后参数

```typescript
interface PromptStructure {
  subject: string;        // P0 - 必需
  action?: string;        // P1 - 推荐
  environment: string;    // P0 - 必需
  composition: string;    // P1 - 推荐
  style: string;          // P0 - 必需
  technical: string;      // P2 - 可选
  quality: string;        // P1 - 推荐
}

const prompt: PromptStructure = {
  subject: 'A lone astronaut',
  action: 'floating in space',
  environment: 'surrounded by distant galaxies',
  composition: 'centered, rule of thirds',
  style: 'sci-fi concept art, dramatic',
  technical: '85mm lens, f/2.8, rim lighting',
  quality: 'ultra-detailed, 8k, photorealistic'
};

// 组装成最终 Prompt
const finalPrompt = Object.values(prompt).filter(Boolean).join(', ');
```

#### 原则 3：不要一次性"堆词"

```
❌ 错误示例：
"beautiful amazing stunning gorgeous epic masterpiece 
ultra-detailed 8k photorealistic cinematic dramatic..."

✅ 正确示例：
"Photorealistic portrait, cinematic lighting, 
ultra-detailed, 8k resolution"
```

**原因**：
- 过多形容词会稀释权重
- 模型会"平均化"所有描述
- 导致输出平庸而非突出

---

## 4. 视觉层级描述技术

### 4.1 核心原则

> 模型无法"猜你的构图"，只能"服从你的语言结构"。

告诉模型"先看什么，再看什么"是控制视觉焦点的关键。

### 4.2 空间层级控制

#### 三层空间结构

```
Foreground (前景)
  ↓
Midground (中景)
  ↓
Background (背景)
```

#### 实战示例

```
"A medieval knight in the foreground (sharp focus),
a castle in the midground (slightly blurred),
mountains in the background (soft focus, atmospheric perspective)"
```

**技术要点**：
- 前景：sharp focus, detailed
- 中景：moderate detail
- 背景：blurred, atmospheric

### 4.3 清晰度控制

#### 清晰度术语

| 术语 | 效果 | 适用场景 |
|------|------|----------|
| **sharp focus** | 极度清晰 | 主体、产品摄影 |
| **soft focus** | 柔和模糊 | 人像、梦幻风格 |
| **blurred** | 明显虚化 | 背景、运动感 |
| **bokeh** | 光斑虚化 | 浅景深、艺术效果 |
| **motion blur** | 运动模糊 | 动态、速度感 |

#### 权重分配技巧

**Stable Diffusion 语法**：
```
(main subject:1.5), sharp focus,
(background:0.8), blurred,
bokeh effect
```

**Midjourney 语法**：
```
main subject, sharp focus --no blurred background
```

### 4.4 光线引导

#### 光线类型

| 光线类型 | 描述 | 视觉效果 |
|----------|------|----------|
| **Rim Light** | 边缘光 | 勾勒轮廓，增强立体感 |
| **Key Light** | 主光源 | 定义主体明暗 |
| **Backlight** | 背光 | 创造剪影或光晕 |
| **Golden Hour** | 黄金时段光 | 温暖、柔和、电影感 |
| **Cinematic Lighting** | 电影级光照 | 戏剧性、高对比 |

#### 实战组合

```
"Portrait of a woman,
rim light from the left (highlighting hair),
key light from front-right (soft, diffused),
backlight creating subtle glow,
golden hour atmosphere,
cinematic lighting"
```

### 4.5 视角控制

#### 视角术语

| 视角 | 描述 | 心理效果 |
|------|------|----------|
| **Low Angle** | 低角度仰拍 | 威严、强大 |
| **High Angle** | 高角度俯拍 | 渺小、脆弱 |
| **Eye Level** | 平视 | 中性、真实 |
| **Bird's Eye View** | 鸟瞰 | 全局、上帝视角 |
| **Worm's Eye View** | 虫视 | 极端仰视、震撼 |

#### 景别控制

```
Close-up (特写)
  ↓
Medium Shot (中景)
  ↓
Wide Shot (远景)
  ↓
Extreme Wide Shot (大远景)
```

**示例**：
```
"Close-up portrait of an elderly man,
wrinkles and details visible,
shallow depth of field,
85mm lens, f/1.8"
```

---

## 5. 专业术语应用

### 5.1 摄影术语体系

#### 镜头与焦距

| 焦距 | 特性 | 适用场景 |
|------|------|----------|
| **Wide Angle (16-35mm)** | 广角、空间感强 | 建筑、风景、室内 |
| **Standard (35-50mm)** | 接近人眼视角 | 街拍、纪实 |
| **Portrait (50-85mm)** | 人像黄金焦段 | 人像、产品 |
| **Telephoto (85-200mm+)** | 压缩空间、虚化强 | 特写、野生动物 |
| **Macro** | 微距、极致细节 | 昆虫、珠宝、纹理 |

#### 光圈与景深

```
Large Aperture (f/1.4 - f/2.8)
→ Shallow depth of field (浅景深)
→ 主体清晰，背景虚化
→ 适合人像、产品

Small Aperture (f/8 - f/16)
→ Deep depth of field (深景深)
→ 全局清晰
→ 适合风景、建筑
```

#### 快门与动态

| 快门速度 | 效果 | 适用场景 |
|----------|------|----------|
| **Long Exposure** | 光轨、流水丝滑 | 夜景、瀑布 |
| **Motion Blur** | 运动模糊 | 速度感、动态 |
| **High-Speed Sync** | 瞬间冻结 | 运动、飞溅 |
| **Freeze Frame** | 定格 | 动作捕捉 |

### 5.2 摄影术语精准应用

通过引入专业参数，可以显著提升生成图像的"高级感"：

| 术语类别 | 关键词示例 | 预期视觉效果 |
|----------|------------|--------------|
| **镜头/焦距** | Wide angle, 85mm prime, Macro | 改变空间感与背景虚化程度 |
| **光影控制** | Golden hour, Rim lighting, Cinematic lighting | 增强主体的立体感与叙事性 |
| **快门/动态** | Long exposure, Motion blur, High-speed sync | 捕捉流动感或瞬间冻结 |

#### 实战示例

```
"Product photography of a luxury watch,
macro lens, f/2.8,
soft lighting from top-left,
shallow depth of field,
reflections on polished surface,
studio setup, white background,
ultra-detailed, 8k"
```

### 5.3 美术与风格术语

#### 艺术媒介

| 媒介 | 特征 | 适用场景 |
|------|------|----------|
| **Watercolor Illustration** | 透明、流动、柔和 | 儿童插画、梦幻风格 |
| **Oil Painting** | 厚重、质感、古典 | 肖像、风景、古典风格 |
| **Concept Art** | 专业、设计感强 | 游戏、电影概念设计 |
| **Ink Drawing** | 线条、黑白、传统 | 漫画、传统艺术 |
| **Digital Art** | 现代、多样化 | 通用数字创作 |

#### 艺术风格

```
Classical Styles:
- Renaissance
- Baroque
- Impressionism
- Art Nouveau

Modern Styles:
- Minimalism
- Abstract
- Surrealism
- Pop Art

Contemporary:
- Cyberpunk
- Steampunk
- Vaporwave
- Low Poly
```

**注意事项**：
- 避免直接使用艺术家名字（版权问题）
- 使用"in the style of [movement]"而非"by [artist]"
- 结合多个风格时注意兼容性

### 5.4 3D 渲染术语

#### 渲染引擎

| 引擎 | 特点 | 适用场景 |
|------|------|----------|
| **Octane Render** | 高质量、真实感强 | 产品可视化、建筑 |
| **Unreal Engine** | 实时、游戏级 | 游戏、虚拟场景 |
| **Blender Cycles** | 开源、灵活 | 通用3D创作 |
| **V-Ray** | 专业、建筑级 | 建筑可视化 |

#### 光照与材质

```
Lighting:
- Global Illumination (全局光照)
- Ambient Occlusion (环境光遮蔽)
- Subsurface Scattering (次表面散射)
- Volumetric Lighting (体积光)

Materials:
- Physically Based Rendering (PBR)
- Metallic (金属)
- Dielectric (电介质)
- Translucent (半透明)
```

#### 实战示例

```
"3D render of a futuristic car,
octane render,
physically based materials,
metallic paint with clear coat,
global illumination,
volumetric fog,
studio lighting setup,
ultra-realistic, 8k"
```

---

## 6. 主流模型对比分析

### 6.1 模型特性矩阵

| 维度 | Midjourney | DALL·E 3 | Stable Diffusion |
|------|------------|----------|------------------|
| **风格化能力** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **语义理解** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **可控性** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **商业可用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **学习曲线** | 低 | 极低 | 高 |
| **成本** | 订阅制 | 按次付费 | 免费/自托管 |

### 6.2 Midjourney

#### 核心特点

- **风格化能力极强**：对艺术方向和情绪的理解优秀
- **美学上限高**：纹理真实度和视觉冲击力强
- **自然语言友好**：接近人类描述习惯

#### 适用场景

```
✅ 概念设计
✅ 插画、封面、艺术创作
✅ 情绪化、氛围感强的作品
✅ 需要高美学质量的场景
```

#### Prompt 特点

**语法要素**：
```
/imagine prompt: [description] --ar 16:9 --stylize 500 --v 6
```

**关键参数**：
- `--ar`: 宽高比 (aspect ratio)
- `--stylize`: 风格化程度 (0-1000)
- `--chaos`: 随机性 (0-100)
- `--quality`: 质量 (0.25, 0.5, 1, 2)
- `--no`: 排除元素

**优化技巧**：
1. **Prompt 顺序极其重要**：前面的词权重更高
2. **风格词权重极高**：艺术流派、材质描述反应敏锐
3. **使用 `--no` 排除干扰**：比正向描述更有效

**实战示例**：

```
/imagine prompt: iridescent dragon scales, 
brutalist architecture background, 
ethereal glow, volumetric fog, 
cinematic composition, 
ultra-detailed textures 
--ar 16:9 --stylize 750 --v 6 --no people, text
```

**发现**：
- 对艺术流派（如 iridescent, brutalism）反应极其敏锐
- 偏向艺术家思维，适合创意探索
- 自动优化构图和色彩平衡

### 6.3 DALL·E 3

#### 核心特点

- **语义理解能力极强**：支持复杂的自然语言输入
- **现实世界物体准确**：对日常物品和场景的理解精准
- **商业可用性高**：版权清晰，适合商业用途

#### 适用场景

```
✅ 产品图
✅ 信息图、教育内容
✅ UI/UX 设计素材
✅ Marketing 视觉
✅ 需要精确语义的场景
```

#### Prompt 特点

**语法特点**：
- 自然语言输入，无需特殊语法
- 自动对简单词汇进行"隐性扩充"
- 强调"是什么"，而不是"像谁"

**优化技巧**：
1. **描述清晰、具体**：避免过度艺术化
2. **复杂参数较少**：专注于内容描述
3. **利用自动扩充**：简单描述会被智能补充

**实战示例**：

```
"A modern minimalist living room with large windows,
natural sunlight streaming in,
Scandinavian furniture in light wood and white fabric,
indoor plants on wooden shelves,
clean lines and uncluttered space,
professional interior photography"
```

**发现**：
- 会自动补充合理的细节（如光线、材质）
- 适合快速创意构思，但对微观参数控制力稍弱
- 文字渲染能力强（可以生成准确的文字）

### 6.4 Stable Diffusion

#### 核心特点

- **高度可控**：支持精细的参数调整
- **可扩展性强**：支持 LoRA、ControlNet、Textual Inversion
- **适合工程化**：本地部署、批量生成、自动化流程

#### 适用场景

```
✅ 定制风格模型
✅ 批量生成
✅ 需要严格遵循设计规范的生产环境
✅ 研究与二次开发
✅ 像素级构图控制
```

#### Prompt 特点

**双 Prompt 系统**：
```
Positive Prompt: [想要的内容]
Negative Prompt: [不想要的内容]
```

**权重语法**：
```
(keyword:1.5)  # 增强权重
(keyword:0.8)  # 降低权重
[keyword]      # 降低权重（简写）
```

**关键参数**：
- **Steps**: 采样步数 (20-50)
- **CFG Scale**: 提示词遵循度 (7-12)
- **Sampler**: 采样器 (Euler a, DPM++, etc.)
- **Seed**: 随机种子（固定可复现）

**优化技巧**：
1. **正向 + 反向 Prompt 配合**
2. **权重符号精确控制**
3. **参数敏感，需要测试**

**实战示例**：

```
Positive Prompt:
"(masterpiece:1.4), (best quality:1.4),
portrait of a young woman,
(detailed face:1.3), (expressive eyes:1.2),
natural lighting, soft shadows,
85mm lens, f/1.8, shallow depth of field,
photorealistic, ultra-detailed"

Negative Prompt:
"(worst quality:1.4), (low quality:1.4),
blurry, distorted, deformed,
bad anatomy, extra fingers,
watermark, signature, text"

Parameters:
Steps: 30
CFG Scale: 7.5
Sampler: DPM++ 2M Karras
Seed: 12345678
```

**发现**：
- 通过 LoRA 和 ControlNet 可以实现像素级的构图控制
- 适合需要严格遵循设计规范的生产环境
- 学习曲线陡峭，但上限极高

### 6.5 跨模型 Prompt 迁移策略

#### 从 Midjourney 到 DALL·E

```
Midjourney:
"ethereal forest, bioluminescent plants, 
mystical atmosphere --ar 16:9 --stylize 750"

DALL·E 转换:
"A mystical forest scene with glowing bioluminescent plants,
ethereal atmosphere with soft blue and green lights,
magical and dreamlike quality,
wide-angle view, cinematic composition"
```

**转换要点**：
- 移除参数语法
- 扩展描述细节
- 强调具体视觉元素

#### 从 DALL·E 到 Stable Diffusion

```
DALL·E:
"A cozy coffee shop interior with warm lighting,
wooden furniture, and people reading books"

Stable Diffusion 转换:
Positive:
"(cozy coffee shop interior:1.3),
(warm ambient lighting:1.2),
wooden tables and chairs,
people reading books,
soft focus background,
professional photography,
(detailed textures:1.1)"

Negative:
"blurry, low quality, distorted,
bad anatomy, watermark"
```

**转换要点**：
- 添加权重标记
- 分离正向和反向描述
- 增加技术参数

---

## 7. 风格化生成实践

### 7.1 风格分类体系

| 风格类型 | 关键 Prompt 要点 | 核心术语 |
|----------|------------------|----------|
| **写实 (Realistic)** | 摄影术语、光线、镜头、材质 | photorealistic, 85mm lens, natural lighting, detailed textures |
| **插画 (Illustration)** | 艺术媒介、线条、色彩风格 | watercolor, ink drawing, flat colors, stylized |
| **3D** | 渲染引擎、材质、光照模型 | octane render, PBR materials, global illumination |
| **概念艺术 (Concept Art)** | 设计感、叙事性、专业性 | concept art, matte painting, cinematic, detailed |
| **抽象 (Abstract)** | 形状、色彩、情绪 | abstract, geometric, color theory, minimalist |

### 7.2 写实风格 (Photorealistic)

#### 核心要素

```
Subject + Photography Terms + Lighting + Lens + Quality
```

#### 模板

```
"Photorealistic [subject],
[lens specification],
[lighting description],
[depth of field],
[additional details],
ultra-detailed, 8k, professional photography"
```

#### 实战案例

**人像摄影**：
```
"Photorealistic portrait of a 30-year-old woman,
85mm lens, f/1.8,
natural window light from the left,
shallow depth of field, bokeh background,
detailed skin texture, expressive eyes,
professional headshot,
ultra-detailed, 8k"
```

**产品摄影**：
```
"Product photography of a luxury smartphone,
macro lens, f/2.8,
studio lighting with softbox,
white background, reflections on glass surface,
detailed metal frame, screen reflection,
commercial photography,
ultra-detailed, 8k"
```

**建筑摄影**：
```
"Architectural photography of modern glass building,
wide-angle lens, 16mm,
golden hour lighting,
deep depth of field, sharp throughout,
dramatic sky, reflections on glass,
professional architectural photography,
ultra-detailed, 8k"
```

### 7.3 插画风格 (Illustration)

#### 核心要素

```
Subject + Art Medium + Color Palette + Line Style + Mood
```

#### 模板

```
"[art medium] illustration of [subject],
[color description],
[line style],
[mood/atmosphere],
[additional artistic elements]"
```

#### 实战案例

**水彩插画**：
```
"Watercolor illustration of a peaceful garden,
soft pastel colors, gentle brush strokes,
transparent washes, flowing textures,
dreamy and ethereal atmosphere,
children's book style"
```

**扁平插画**：
```
"Flat design illustration of a city skyline,
bold colors, geometric shapes,
clean lines, no gradients,
modern and minimalist,
vector art style"
```

**手绘风格**：
```
"Hand-drawn ink illustration of a fantasy dragon,
detailed line work, cross-hatching,
black and white, traditional pen and ink,
intricate scales and textures,
classic illustration style"
```

### 7.4 3D 渲染风格

#### 核心要素

```
Subject + Rendering Engine + Materials + Lighting + Technical Quality
```

#### 模板

```
"3D render of [subject],
[rendering engine],
[material description],
[lighting setup],
[technical specifications],
ultra-realistic, 8k"
```

#### 实战案例

**产品可视化**：
```
"3D render of a futuristic sports car,
octane render,
metallic paint with clear coat,
carbon fiber details,
studio lighting with HDRI,
physically based materials,
global illumination,
ultra-realistic, 8k"
```

**建筑可视化**：
```
"3D architectural render of modern villa,
V-Ray render,
realistic materials (concrete, glass, wood),
natural daylight simulation,
ambient occlusion,
photorealistic vegetation,
ultra-detailed, 8k"
```

**角色设计**：
```
"3D character render of a sci-fi soldier,
Unreal Engine 5,
PBR textures, subsurface scattering,
dramatic rim lighting,
detailed armor and weapons,
game-ready quality,
4k textures"
```

### 7.5 风格混搭技巧

#### 核心原则

> **风格不是一个词，而是一组协同描述。**

#### 混搭策略

**策略 1：主风格 + 辅助元素**
```
"Cyberpunk cityscape (主风格),
watercolor painting style (艺术媒介),
soft pastel colors (色彩调整),
dreamy atmosphere (情绪)"
```

**策略 2：跨时代融合**
```
"Viking warrior (历史元素),
in Pixar animation style (现代风格),
3D render, octane (技术实现),
vibrant colors, playful (情绪调整)"
```

**策略 3：文化融合**
```
"Japanese temple architecture (东方元素),
Art Nouveau decorative style (西方艺术),
intricate patterns, flowing lines,
harmonious fusion"
```

#### 实战案例

```
"Steampunk airship (蒸汽朋克),
rendered in Studio Ghibli animation style (吉卜力风格),
soft watercolor textures,
warm sunset lighting,
whimsical and nostalgic atmosphere,
detailed mechanical parts with organic flowing design,
hand-painted quality"
```

**效果**：
- 机械感 + 手绘温暖感
- 工业 + 自然的和谐
- 视觉冲击力强，原创性高

---

## 8. 最佳实践总结

### 8.1 核心原则

#### 原则 1：控制而非祈祷

```
❌ 错误思维:
"希望模型能理解我想要的感觉"

✅ 正确思维:
"用明确的限制条件定义输出"
```

**实践方法**：
- 使用 Negative Prompt 排除不想要的结果
- 指定具体的技术参数
- 定义清晰的视觉层级

#### 原则 2：具体化取代抽象化

```
❌ 抽象描述:
"Beautiful landscape"

✅ 具体描述:
"Mountain landscape at golden hour,
snow-capped peaks, alpine meadow with wildflowers,
dramatic clouds, warm sunlight,
wide-angle view, 24mm lens"
```

**对比效果**：
- 抽象描述：随机性高，不可控
- 具体描述：输出稳定，符合预期

#### 原则 3：避免否定词陷阱

模型通常难以理解"没有、不包含"等否定概念。

```
❌ 错误方式:
"A forest without people"

✅ 正确方式:
Positive: "A pristine forest, untouched wilderness"
Negative (SD): "people, humans, figures"
```

**技术原理**：
- 模型基于正向关联训练
- 否定词会被"关注"而非"排除"
- 应通过正向描述或专门的 Negative Prompt 处理

#### 原则 4：迭代与变体

> 优秀的图像是"喂"出来的。

**迭代流程**：
```
1. 基础 Prompt
   ↓
2. 生成初版
   ↓
3. 分析问题（构图/光线/细节）
   ↓
4. 调整 Prompt
   ↓
5. 固定 Seed，微调参数
   ↓
6. 重复直到满意
```

**Seed 的作用**：
```typescript
// 固定随机性，实现可复现
const config = {
  prompt: "...",
  seed: 12345678,  // 固定种子
  steps: 30,
  cfg: 7.5
};

// 相同配置 → 相同输出
// 微调 Prompt → 可控变化
```

### 8.2 针对模型优化 Prompt

#### Midjourney 优化策略

**重点**：情绪与风格

```
优化前:
"A dragon"

优化后:
"Majestic dragon with iridescent scales,
perched on ancient ruins,
dramatic storm clouds,
epic fantasy atmosphere,
cinematic composition
--ar 16:9 --stylize 750"
```

**关键技巧**：
- 使用情绪化词汇（majestic, epic, ethereal）
- 强调艺术风格（iridescent, cinematic）
- 利用参数增强效果（--stylize）

#### DALL·E 优化策略

**重点**：语义准确

```
优化前:
"Cool tech gadget"

优化后:
"A sleek wireless charging pad,
minimalist design with matte black finish,
LED indicator light,
placed on a modern desk,
product photography with soft lighting"
```

**关键技巧**：
- 精确描述物体特征
- 明确场景和用途
- 使用清晰的摄影术语

#### Stable Diffusion 优化策略

**重点**：结构与参数

```
优化前:
"Beautiful woman"

优化后:
Positive:
"(masterpiece:1.4), (best quality:1.4),
portrait of elegant woman,
(detailed face:1.3), (expressive eyes:1.2),
natural makeup, soft smile,
professional photography,
85mm lens, f/1.8,
(photorealistic:1.3)"

Negative:
"(worst quality:1.4), (low quality:1.4),
blurry, distorted, deformed,
bad anatomy, extra limbs,
watermark, text"
```

**关键技巧**：
- 使用权重标记精确控制
- 正向和反向 Prompt 配合
- 调整技术参数（steps, CFG, sampler）

### 8.3 可复现性意识

#### 记录系统

建立 Prompt 记录模板：

```yaml
prompt_record:
  id: "PR-2024-001"
  date: "2024-12-26"
  model: "Midjourney V6"
  
  prompt:
    positive: "..."
    negative: "..."
    parameters:
      ar: "16:9"
      stylize: 750
      quality: 1
  
  result:
    image_url: "..."
    rating: 8/10
    notes: "Good composition, needs more detail in background"
  
  iterations:
    - version: 1
      changes: "Added 'cinematic lighting'"
      result: "Improved mood"
    - version: 2
      changes: "Increased --stylize to 750"
      result: "Better artistic quality"
```

#### 版本控制

```
v1.0: 基础 Prompt
v1.1: + 光线描述
v1.2: + 构图控制
v1.3: + 质量参数
v2.0: 重构结构，优化顺序
```

### 8.4 风格混搭原则

#### 兼容性检查

```
Compatible:
✅ Cyberpunk + Neon + Rain
✅ Fantasy + Epic + Dramatic
✅ Minimalist + Clean + Modern

Incompatible:
❌ Photorealistic + Cartoon
❌ Medieval + Futuristic (需要特殊处理)
❌ Watercolor + Hyperrealistic
```

#### 混搭公式

```
[主风格] + [辅助风格] + [技术实现] + [情绪调整]

示例:
"Steampunk (主风格)
+ Art Nouveau decorative elements (辅助风格)
+ 3D render, octane (技术实现)
+ warm, nostalgic atmosphere (情绪调整)"
```

---

## 9. 进阶方向

### 9.1 Prompt 模板库

#### 通用模板

```typescript
interface PromptTemplate {
  category: string;
  template: string;
  variables: string[];
  examples: string[];
}

const templates: PromptTemplate[] = [
  {
    category: "Portrait Photography",
    template: `Photorealistic portrait of {subject},
      {lens} lens, {aperture},
      {lighting} lighting,
      {depth_of_field},
      {additional_details},
      professional photography, ultra-detailed, 8k`,
    variables: ["subject", "lens", "aperture", "lighting", "depth_of_field", "additional_details"],
    examples: [
      "subject: a young woman",
      "lens: 85mm",
      "aperture: f/1.8",
      "lighting: natural window",
      "depth_of_field: shallow depth of field",
      "additional_details: detailed skin texture, expressive eyes"
    ]
  },
  // ... 更多模板
];
```

#### 风格特定模板

**写实产品摄影**：
```
"Product photography of {product},
{lens} lens, {aperture},
studio lighting with {light_setup},
{background} background,
{special_effects},
commercial photography,
ultra-detailed, 8k"
```

**抽象插画**：
```
"{art_medium} illustration,
abstract {subject},
{color_palette} color scheme,
{composition} composition,
{mood} atmosphere,
{additional_style}"
```

### 9.2 Negative Prompt 工程

#### 通用 Negative Prompt 库

```
Quality Issues:
"(worst quality:1.4), (low quality:1.4),
blurry, out of focus, distorted,
pixelated, jpeg artifacts"

Anatomy Issues:
"bad anatomy, deformed, disfigured,
extra limbs, extra fingers, missing limbs,
poorly drawn hands, poorly drawn face"

Unwanted Elements:
"watermark, signature, text, logo,
username, artist name, copyright"

Style Issues:
"cartoon, anime, 3d render (如果要求2D),
oversaturated, overexposed, underexposed"
```

#### 场景特定 Negative Prompt

**人像**：
```
"bad anatomy, deformed face,
asymmetric eyes, crooked teeth,
double chin, bad proportions,
extra fingers, mutated hands"
```

**建筑**：
```
"distorted perspective, crooked lines,
unrealistic proportions, floating objects,
inconsistent lighting, blurry details"
```

### 9.3 ControlNet 与高级控制

#### ControlNet 类型

| 类型 | 功能 | 适用场景 |
|------|------|----------|
| **Canny Edge** | 边缘检测 | 保持轮廓，改变风格 |
| **Depth** | 深度图 | 保持空间关系 |
| **OpenPose** | 姿态控制 | 人物姿势精确控制 |
| **Scribble** | 草图引导 | 快速构图 |
| **Segmentation** | 语义分割 | 精确区域控制 |

#### 实战流程

```
1. 准备参考图
   ↓
2. 选择合适的 ControlNet 类型
   ↓
3. 调整 ControlNet 权重 (0.5-1.5)
   ↓
4. 编写 Prompt
   ↓
5. 生成并微调
```

**示例**：
```
ControlNet: OpenPose
Reference: 舞蹈姿势图
Weight: 1.0

Prompt:
"Professional dancer in elegant pose,
flowing dress, stage lighting,
dramatic atmosphere,
photorealistic, 8k"

Result: 保持姿势，改变服装和风格
```

### 9.4 权重与优先级控制

#### Stable Diffusion 权重语法

```
基础语法:
(keyword)       # 权重 1.1
((keyword))     # 权重 1.21
[keyword]       # 权重 0.9
(keyword:1.5)   # 精确权重 1.5
(keyword:0.8)   # 精确权重 0.8

组合使用:
"(detailed face:1.3), (expressive eyes:1.2),
natural makeup, (soft smile:1.1),
(photorealistic:1.4)"
```

#### 权重调优策略

```
问题: 主体不够突出
解决: 增加主体权重
"(main subject:1.5), background"

问题: 某元素过于强烈
解决: 降低权重或添加到 Negative
"subject, (unwanted element:0.5)"
或
Negative: "(unwanted element:1.3)"

问题: 风格不够明显
解决: 增加风格词权重
"subject, (cyberpunk style:1.4),
(neon lights:1.3)"
```

### 9.5 批量生成与自动化

#### 批量生成脚本

```typescript
interface BatchConfig {
  basePrompt: string;
  variations: string[];
  parameters: {
    steps: number;
    cfg: number;
    sampler: string;
  };
  count: number;
}

async function batchGenerate(config: BatchConfig): Promise<void> {
  for (const variation of config.variations) {
    const prompt = `${config.basePrompt}, ${variation}`;
    
    for (let i = 0; i < config.count; i++) {
      await generateImage({
        prompt,
        ...config.parameters,
        seed: Math.floor(Math.random() * 1000000)
      });
    }
  }
}

// 使用示例
const config: BatchConfig = {
  basePrompt: "Portrait of a person",
  variations: [
    "natural lighting",
    "dramatic lighting",
    "soft lighting",
    "golden hour lighting"
  ],
  parameters: {
    steps: 30,
    cfg: 7.5,
    sampler: "DPM++ 2M Karras"
  },
  count: 3
};

await batchGenerate(config);
```

#### A/B 测试框架

```typescript
interface ABTest {
  promptA: string;
  promptB: string;
  parameters: Record<string, unknown>;
  iterations: number;
}

async function runABTest(test: ABTest): Promise<void> {
  const resultsA: string[] = [];
  const resultsB: string[] = [];
  
  for (let i = 0; i < test.iterations; i++) {
    const seed = Math.floor(Math.random() * 1000000);
    
    // 测试 A
    const imageA = await generateImage({
      prompt: test.promptA,
      seed,
      ...test.parameters
    });
    resultsA.push(imageA);
    
    // 测试 B (相同 seed)
    const imageB = await generateImage({
      prompt: test.promptB,
      seed,
      ...test.parameters
    });
    resultsB.push(imageB);
  }
  
  // 对比分析
  console.log("A vs B comparison ready for review");
}
```

---

## 参考资源

### 学术论文

- "High-Resolution Image Synthesis with Latent Diffusion Models" (Rombach et al., 2022)
- "Photorealistic Text-to-Image Diffusion Models with Deep Language Understanding" (Saharia et al., 2022)
- "DALL·E 2: Hierarchical Text-Conditional Image Generation with CLIP Latents" (Ramesh et al., 2022)

### 工具与平台

- **Midjourney**: https://www.midjourney.com
- **DALL·E**: https://openai.com/dall-e-3
- **Stable Diffusion**: https://stability.ai
- **Civitai**: 模型与 LoRA 分享平台
- **PromptHero**: Prompt 分享社区

### 学习资源

- Midjourney 官方文档
- Stable Diffusion WebUI Wiki
- OpenAI DALL·E Guide
- ControlNet 官方教程

---

## 结语

AI 图像生成的 Prompt Engineering 是一门**可工程化的技术**，而非玄学。通过系统化的方法论、结构化的 Prompt 设计、以及对不同模型特性的深入理解，我们可以实现：

- **可控性**：精确控制生成结果
- **可复现性**：稳定输出高质量图像
- **可扩展性**：建立可复用的模板库

记住核心公式：

> **视觉结果 = Prompt 结构 × 模型特性 × 参数控制**

从"尝试性输入"转向"确定性输出"，将脑中的画面精确翻译成模型能理解的语言，这就是 AI 图像生成 Prompt Engineering 的本质。
