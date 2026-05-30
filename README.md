# IssueFlow

AI-powered Demultiplexer and Multiplexer Ticket System  
Proposed by Karina Maharani

## Disclaimer

This repository is an AI-clickable product intern assignment task, not a full-fledged production website or enterprise-ready system.

You are welcome to use this repository as a reference for learning or experimentation, as long as you give proper credit to the original author.

## Problem Background

Customer support teams process large ticket volumes daily. The queue often contains:

- Low-complexity repetitive questions that consume agent time.
- High-complexity tickets that combine multiple unrelated issues in one message.

Example:

> "I cannot login. I also cannot pay using my credit card and the chatbot doesn't answer my questions."

Many existing support tools (such as Zendesk and Salesforce) optimize ticket-level workflows. The challenge is that **ticket** is often not the best unit of work.

## Key Insight

**Tickets are the wrong unit of work. Issues are the correct unit of work.**  
Therefore, ticket atomization is required.

## Proposed Solution

IssueFlow introduces two complementary capabilities:

### 1. Demux (Demultiplexing)

Split one complex ticket into multiple atomic sub-issues while preserving the original as a parent issue.

Example mapping:

- Main ticket: `A-1009`
- Sub-issues:
  - `A-1009-1`: Payment completed but order not created
  - `A-1009-2`: Customer cannot log in
  - `A-1009-3`: Refund inquiry

### 2. Mux (Multiplexing)

Aggregate similar sub-issues across different tickets into shared issue clusters.

Example:

- Cluster `C-021` contains: `A-1009-1`, `A-1010`, `A-1011`

## How AI Is Implemented

- During **demultiplexing**, machine learning performs multi-intent detection to split a ticket into meaningful sub-issues.
- During **multiplexing**, semantic similarity is used to classify and group related sub-issues and tickets into clusters.

## Existing Research

The concept is informed by prior work:

1. F. Cai, W. Zhou, F. Mi, and B. Faltings, "SLIM: Explicit slot-intent mapping with BERT for joint multi-intent detection and slot filling," in Proc. IEEE Int. Conf. Acoustics, Speech and Signal Processing (ICASSP), 2022, pp. 7607-7611, doi: 10.1109/ICASSP43922.2022.9747562.
2. L. Qin, F. Wei, T. Xie, X. Xu, W. Che, and T. Liu, "GL-GIN: Fast and accurate non-autoregressive model for joint multiple intent detection and slot filling," in Proc. 59th Annual Meeting of the Association for Computational Linguistics and the 11th International Joint Conference on Natural Language Processing, 2021, pp. 178-188, doi: 10.18653/v1/2021.acl-long.15.
3. J. Liu et al., "Incident-aware duplicate ticket aggregation for cloud systems," arXiv preprint arXiv:2302.09520, 2023.

## How It Works

1. The AI reads the incoming customer ticket.
2. It detects whether the ticket contains one issue or multiple issues.
3. If multiple issues are found, the system generates sub-tickets under the main ticket ID.
4. Each sub-ticket is classified by issue type, urgency, responsible team, and required action.
5. Agents can review, edit, merge, or approve AI-generated splits.
6. The system compares sub-tickets and tickets across the dataset using semantic similarity.
7. Similar items are grouped into clusters.
8. Agents can resolve a cluster of tickets simultaneously.
9. Resolution handling:
   - Resolved sub-ticket responses are propagated to the parent ticket.
   - Normal (non-demuxed) tickets can be auto-resolved through standard flow.
10. A parent ticket can only be resolved after all sub-tickets are resolved, supported by an aggregation page for coherent final responses.

## Why It Matters

By moving from ticket-level handling to issue-level handling, IssueFlow can:

- Reduce repetitive manual work.
- Improve routing accuracy.
- Prevent incomplete responses on multi-problem tickets.
- Help teams detect recurring incidents faster.

## Success Metric

- **Number of tickets resolved using number of clusters**

This metric captures how many redundant tickets are resolved through shared cluster-based resolution.

## Current Project Scope

This repository demonstrates the product concept and interaction flow for the assignment. It is intentionally scoped as a prototype and does not represent a complete production deployment.

## Local Development

### Prerequisites

- Node.js 20+
- Bun (recommended for this repo because `bun.lock` is present)

### Run

```bash
bun install
bun run dev
```

Alternative with npm:

```bash
npm install
npm run dev
```

## License and Credit

No explicit open-source license file is currently included. If you reuse ideas, code, or structure from this repository, please provide visible credit to Karina Maharani and this project.
