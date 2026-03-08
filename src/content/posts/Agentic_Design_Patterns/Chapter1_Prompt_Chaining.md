---
title: 'Chapter 1: Prompt Chaining'
date: '2025-12-25'
excerpt: 'Prompt chaining, sometimes referred to as Pipeline pattern, represents a powerful paradigm for handling intricate tasks when leveraging large langu...'
tags: ['Agentic AI', 'Design Patterns']
series: 'Agentic AI'
---

# Chapter 1: Prompt Chaining

# 第一章：提示链

## Prompt Chaining Pattern Overview

## 提示链模式概述

Prompt chaining, sometimes referred to as Pipeline pattern, represents a powerful paradigm for handling intricate tasks when leveraging large language models (LLMs).

提示链，有时称为管道模式，代表了在利用大语言模型(LLM)处理复杂任务时的一个强大范式。

Rather than expecting an LLM to solve a complex problem in a single, monolithic step, prompt chaining advocates for a divide-and-conquer strategy.

提示链不是期望LLM在单一的、整体步骤中解决复杂问题，而是倡导分而治之的策略。

The core idea is to break down the original, daunting problem into a sequence of smaller, more manageable sub-problems.

核心思想是将原本令人生畏的问题分解成一系列更小、更易于管理的子问题。

Each sub-problem is addressed individually through a specifically designed prompt, and the output generated from one prompt is strategically fed as input into the subsequent prompt in the chain.

每个子问题都通过专门设计的提示单独处理，一个提示生成的输出被战略性地作为链中下一个提示的输入。

This sequential processing technique inherently introduces modularity and clarity into the interaction with LLMs.

这种顺序处理技术本质上为与LLM的交互引入了模块性和清晰度。

By decomposing a complex task, it becomes easier to understand and debug each individual step, making the overall process more robust and interpretable.

通过分解复杂任务，更容易理解和调试每个单独的步骤，使整个过程更加健壮和可解释。

Each step in the chain can be meticulously crafted and optimized to focus on a specific aspect of the larger problem, leading to more accurate and focused outputs.

链中的每个步骤都可以精心设计和优化，以专注于更大问题的特定方面，从而产生更准确和专注的输出。

The output of one step acting as the input for the next is crucial.

一个步骤的输出作为下一个步骤的输入是至关重要的。

This passing of information establishes a dependency chain, hence the name, where the context and results of previous operations guide the subsequent processing.

这种信息传递建立了依赖链，因此得名，上下文和先前操作的结果指导后续处理。

This allows the LLM to build on its previous work, refine its understanding, and progressively move closer to the desired solution.

这允许LLM在其先前工作的基础上进行改进，深化其理解，并逐步接近期望的解决方案。

Furthermore, prompt chaining is not just about breaking down problems; it also enables the integration of external knowledge and tools.

此外，提示链不仅仅是分解问题；它还支持外部知识和工具的集成。

At each step, the LLM can be instructed to interact with external systems, APIs, or databases, enriching its knowledge and abilities beyond its internal training data.

在每个步骤中，可以指示LLM与外部系统、API或数据库交互，丰富其超越内部训练数据的知识和能力。

This capability dramatically expands the potential of LLMs, allowing them to function not just as isolated models but as integral components of broader, more intelligent systems.

这种能力显著扩展了LLM的潜力，使它们不仅能作为孤立的模型运作，还能作为更广泛、更智能系统的组成部分。

The significance of prompt chaining extends beyond simple problem-solving. It serves as a foundational technique for building sophisticated AI agents.

提示链的重要性超越了简单的解决问题。它作为构建复杂AI智能体的基础技术。

These agents can utilize prompt chains to autonomously plan, reason, and act in dynamic environments.

这些智能体可以利用提示链在动态环境中自主地计划、推理和行动。

By strategically structuring the sequence of prompts, an agent can engage in tasks requiring multi-step reasoning, planning, and decision-making.

通过战略性地结构化提示序列，智能体可以参与需要多步推理、规划和决策的任务。

Such agent workflows can mimic human thought processes more closely, allowing for more natural and effective interactions with complex domains and systems.

这样的智能体工作流程可以更紧密地模仿人类思维过程，允许与复杂领域和系统进行更自然和有效的交互。

### Limitations of single prompts: For multifaceted tasks, using a single, complex prompt for an LLM can be inefficient, causing the model to struggle with constraints and instructions, potentially leading to instruction neglect where parts of the prompt are overlooked, contextual drift where the model loses track of the initial context, error propagation where early errors amplify, prompts which require a longer context window where the model gets insufficient information to respond back and hallucination where the cognitive load increases the chance of incorrect information.

### 单个提示的局限性：对于多方面的任务，对LLM使用单个复杂提示可能效率很低，导致模型难以处理约束和指令，可能导致提示忽略（提示部分被忽略）、上下文漂移（模型失去对初始上下文的跟踪）、错误传播（早期错误放大）、需要更长上下文窗口的提示（模型获得的信息不足无法回复）以及幻觉（认知负荷增加导致错误信息的可能性增加）。

For example, a query asking to analyze a market research report, summarize findings, identify trends with data points, and draft an email risks failure as the model might summarize well but fail to extract data or draft an email properly.

例如，一个要求分析市场研究报告、总结发现、识别数据点的趋势并起草电子邮件的查询可能会失败，因为模型可能总结得很好，但无法正确提取数据或起草电子邮件。

Enhanced Reliability Through Sequential Decomposition: Prompt chaining addresses these challenges by breaking the complex task into a focused, sequential workflow, which significantly improves reliability and control.

通过顺序分解增强可靠性：提示链通过将复杂任务分解为专注的顺序工作流来应对这些挑战，这显著提高了可靠性和控制力。

Given the example above, a pipeline or chained approach can be described as follows:

鉴于上述示例，管道或链接方法可以描述如下：

1. Initial Prompt (Summarization): "Summarize the key findings of the following market research report: [text]." The model's sole focus is summarization, increasing the accuracy of this initial step.

1. 初始提示（总结）："总结以下市场研究报告的主要发现：[文本]。模型唯一的焦点是总结，提高了这一步的准确性。

1. Second Prompt (Trend Identification): "Using the summary, identify the top three emerging trends and extract the specific data points that support each trend: [output from step 1]." This prompt is now more constrained and builds directly upon a validated output.

1. 第二个提示（趋势识别）："使用总结，识别前三个新兴趋势并提取支持每个趋势的具体数据点：[步骤1的输出]。这个提示现在更加受限，并直接建立在经过验证的输出之上。

1. Third Prompt (Email Composition): "Draft a concise email to the marketing team that outlines the following trends and their supporting data: [output from step 2]."

1. 第三个提示（电子邮件撰写）："起草一封简洁的电子邮件给营销团队，概述以下趋势及其支持数据：[步骤2的输出]。"

This decomposition allows for more granular control over the process. Each step is simpler and less ambiguous, which reduces the cognitive load on the model and leads to a more accurate and reliable final output.

这种分解允许对过程进行更精细的控制。每个步骤更简单且更少歧义，这减少了模型的认知负荷，并导致更准确和可靠的最终输出。

This modularity is analogous to a computational pipeline where each function performs a specific operation before passing its result to the next.

这种模块化类似于计算管道，每个函数在将结果传递给下一个函数之前执行特定操作。

To ensure an accurate response for each specific task, the model can be assigned a distinct role at every stage.

为确保每个特定任务获得准确的响应，可以为模型在每个阶段分配不同的角色。

For example, in the given scenario, the initial prompt could be designated as "Market Analyst," the subsequent prompt as "Trade Analyst," and the third prompt as "Expert Documentation Writer," and so forth.

例如，在给定场景中，初始提示可以指定为"市场分析师"，后续提示为"交易分析师"，第三个提示为"专业文档撰写者"，等等。

### The Role of Structured Output

### 结构化输出的作用

The reliability of a prompt chain is highly dependent on the integrity of the data passed between steps.

提示链的可靠性高度依赖于步骤之间传递的数据的完整性。

If the output of one prompt is ambiguous or poorly formatted, the subsequent prompt may fail due to faulty input.

如果一个提示的输出模糊或格式不佳，后续提示可能因输入错误而失败。

To mitigate this, specifying a structured output format, such as JSON or XML, is crucial.

为缓解这一问题，指定结构化输出格式（如JSON或XML）至关重要。

For example, the output from the trend identification step could be formatted as a JSON object:

例如，趋势识别步骤的输出可以格式化为JSON对象：

```json
{
  "trends": [
    {
      "trend_name": "AI-Powered Personalization",
      "supporting_data": "73% of consumers prefer to do business with brands that use personal information to make their shopping experiences more relevant."
    },
    {
      "trend_name": "Sustainable and Ethical Brands",
      "supporting_data": "Sales of products with ESG-related claims grew 28% over the last five years, compared to 20% for products without."
    }
  ]
}
```

This structured format ensures that the data is machine-readable and can be precisely parsed and inserted into the next prompt without ambiguity.

这种结构化格式确保数据是机器可读的，可以精确解析并插入下一个提示中而不会产生歧义。

This practice minimizes errors that can arise from interpreting natural language and is a key component in building robust, multi-step LLM-based systems.

这种实践最大限度地减少了解释自然语言可能产生的错误，是在构建健壮的多步LLM系统时的关键组成部分。

## Practical Applications & Use Cases

## 实际应用和用例

Prompt chaining is a versatile pattern applicable in a wide range of scenarios when building agentic systems. Its core utility lies in breaking down complex problems into sequential, manageable steps.

提示链是一个多功能的模式，在构建智能体系统时适用于广泛的场景。它的核心用途在于将复杂问题分解为顺序的、可管理的步骤。

Here are several practical applications and use cases:

以下是几个实际应用和用例：

1. **Information Processing Workflows**: Many tasks involve processing raw information through multiple transformations. For instance, summarizing a document, extracting key entities, and then using those entities to query a database or generate a report.

1. **信息处理工作流**: 许多任务涉及通过多个转换处理原始信息。例如，总结文档、提取关键实体，然后使用这些实体查询数据库或生成报告。

1. **Complex Query Answering**: Answering complex questions that require multiple steps of reasoning or information retrieval is a prime use case.

1. **复杂查询回答**: 回答需要多步推理或信息检索的复杂问题是主要用例。

1. **Data Extraction and Transformation**: The conversion of unstructured text into a structured format is typically achieved through an iterative process.

1. **数据提取和转换**: 将非结构化文本转换为结构化格式通常通过迭代过程实现。

1. **Content Generation Workflows**: The composition of complex content is a procedural task that is typically decomposed into distinct phases.

1. **内容生成工作流**: 复杂内容的组成是一个程序性任务，通常分解为不同的阶段。

1. **Conversational Agents with State**: Although comprehensive state management architectures employ methods more complex than sequential linking, prompt chaining provides a foundational mechanism for preserving conversational continuity.

1. **有状态的对话智能体**: 虽然全面的状态管理架构使用比顺序链接更复杂的方法，但提示链提供了保持对话连续性的基础机制。

1. **Code Generation and Refinement**: The generation of functional code is typically a multi-stage process.

1. **代码生成和优化**: 功能代码的生成通常是一个多阶段过程。

1. **Multimodal and multi-step reasoning**: Analyzing datasets with diverse modalities necessitates breaking down the problem into smaller, prompt-based tasks.

1. **多模态和多步推理**: 分析具有多种模态的数据集需要将问题分解为更小的、基于提示的任务。

## Hands-On Code Example

## 实践代码示例

The following code implements a two-step prompt chain that functions as a data processing pipeline:

以下代码实现了一个作为数据处理管道的两步提示链：

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({ temperature: 0 });

// Prompt 1: Extract Information
const promptExtract = ChatPromptTemplate.fromTemplate(
  "Extract the technical specifications from the following text:\n\n{text_input}"
);

// Prompt 2: Transform to JSON
const promptTransform = ChatPromptTemplate.fromTemplate(
  "Transform the following specifications into a JSON object with 'cpu', 'memory', and 'storage' as keys:\n\n{specifications}"
);

// Build the Chain using LCEL
const extractionChain = promptExtract.pipe(llm).pipe(new StringOutputParser());

const fullChain = ({ textInput }) =>
  promptExtract
    .pipe(llm)
    .pipe(new StringOutputParser())
    .pipe({
      transform: async (specifications) => {
        return { specifications };
      },
    })
    .pipe(promptTransform)
    .pipe(llm)
    .pipe(new StringOutputParser())
    .invoke({ textInput });

// Run the Chain
const inputText = "The new laptop model features a 3.5 GHz octa-core processor, 16GB of RAM, and a 1TB NVMe SSD.";
const finalResult = await fullChain({ textInput: inputText });
console.log(finalResult);
```

### Context Engineering and Prompt Engineering

### 上下文工程和提示工程

Context Engineering is the systematic discipline of designing, constructing, and delivering a complete informational environment to an AI model prior to token generation.

上下文工程是在令牌生成之前设计、构建和向AI模型提供完整信息环境的系统化学科。

This methodology asserts that the quality of a model's output is less dependent on the model's architecture itself and more on the richness of the context provided.

这种方法论断言模型输出的质量较少依赖于模型本身的架构，而更多地依赖于所提供上下文的丰富性。

### Key Takeaways

### 关键要点

- Prompt Chaining breaks down complex tasks into a sequence of smaller, focused steps. This is occasionally known as the Pipeline pattern.

- 提示链将复杂任务分解为一系列更小、更专注的步骤。这有时称为管道模式。

- Each step in a chain involves an LLM call or processing logic, using the output of the previous step as input.

- 链中的每个步骤涉及LLM调用或处理逻辑，使用上一步的输出作为输入。

- This pattern improves the reliability and manageability of complex interactions with language models.

- 这种模式提高了与语言模型复杂交互的可靠性和可管理性。

- Frameworks like LangChain/LangGraph, and Google ADK provide robust tools to define, manage, and execute these multi-step sequences.

- LangChain/LangGraph和Google ADK等框架提供了强大的工具来定义、管理和执行这些多步序列。

### Conclusion

### 结论

By deconstructing complex problems into a sequence of simpler, more manageable sub-tasks, prompt chaining provides a robust framework for guiding large language models.

通过将复杂问题分解为一系列更简单、更易于管理的子任务，提示链为引导大语言模型提供了健壮的框架。

This "divide-and-conquer" strategy significantly enhances the reliability and control of the output by focusing the model on one specific operation at a time.

这种"分而治之"策略通过一次让模型专注于一个特定操作来显著增强输出的可靠性和控制力。

As a foundational pattern, it enables the development of sophisticated AI agents capable of multi-step reasoning, tool integration, and state management.

作为基础模式，它能够开发具有多步推理、工具集成和状态管理能力的复杂AI智能体。

---

