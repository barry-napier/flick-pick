# Analyze FlickPick GitHub Issue

## Introduction

Perform comprehensive analysis of FlickPick GitHub issues to prepare for implementation. This command extracts requirements, identifies dependencies, coordinates with the assigned lead agent, and creates a detailed implementation plan ready for execution.

## Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- Access to the FlickPick repository
- Understanding of the multi-agent development workflow

## Issue Reference

<issue_reference> #$ARGUMENTS </issue_reference>

## Main Tasks

### 1. Issue Context Extraction

**GitHub Issue Analysis:**

- [ ] Fetch issue details using GitHub CLI or URL
- [ ] Extract issue title, description, and labels
- [ ] Identify assigned agents (lead and supporting)
- [ ] Parse acceptance criteria and success metrics
- [ ] Review linked documentation and references
- [ ] Check for related issues and dependencies

**FlickPick Context Validation:**

- [ ] Verify phase alignment with development roadmap in `/docs/task-list.md`
- [ ] Confirm agent assignments match expertise areas
- [ ] Validate architecture references and constraints from `/CLAUDE.md`
- [ ] Check integration points with existing components
- [ ] Review leadership approval requirements

### 2. Technical Analysis & Requirements Deep Dive

**Architecture Impact Assessment:**

- [ ] Review `/CLAUDE.md` for technical specifications and architecture
- [ ] Check `/docs/PRD.md` for product requirements and constraints
- [ ] Analyze `/docs/task-list.md` for task dependencies and phase alignment
- [ ] Review existing codebase for integration patterns
- [ ] Examine Next.js 15 App Router structure and conventions

**Dependency Chain Analysis:**

- [ ] Identify prerequisite tasks and completion status
- [ ] Map handoff interfaces from previous agents
- [ ] Document required inputs and expected outputs
- [ ] Check for blocking dependencies or circular references
- [ ] Validate timeline feasibility within phase constraints

**Technical Complexity Assessment:**

- [ ] Estimate implementation effort and timeline
- [ ] Identify potential technical risks and challenges
- [ ] Review required libraries, frameworks, and tools
- [ ] Assess testing complexity and coverage requirements
- [ ] Evaluate performance and scalability implications

### 3. Lead Agent Coordination & Implementation Planning

**Agent Context Preparation:**

- [ ] Compile all relevant documentation and references
- [ ] Prepare technical specifications and constraints
- [ ] Document handoff interfaces and validation criteria
- [ ] Create implementation checklist based on acceptance criteria
- [ ] Identify review checkpoints and approval gates

**Lead Agent Analysis Task:**
Based on issue assignment, invoke the appropriate specialized agent:

#### UI/UX Design Issues (@agent-ui-ux-designer)

```
Analyze UI/UX requirements for: [Issue Title]
- Design system alignment and component specifications
- User experience flow and interaction patterns
- Accessibility compliance and WCAG standards
- Mobile-first responsive design considerations
- Visual design consistency with dark theme
```

#### Next.js UI Development Issues (@agent-nextjs-ui-builder)

```
Analyze UI development requirements for: [Issue Title]
- React component architecture and state management
- Swipe gesture implementation and animations
- TailwindCSS styling and responsive design
- Performance optimization and 60fps animations
- Integration with Next.js App Router and server components
```

#### API Development Issues (@agent-nextjs-api-developer)

```
Analyze API requirements for: [Issue Title]
- Next.js API route design and implementation
- TMDB API integration and data transformation
- Database operations with Prisma ORM
- Voting system logic and deduplication
- Caching strategies and performance optimization
```

#### Technical Architecture Issues (@agent-technical-architect)

```
Analyze architecture requirements for: [Issue Title]
- System design and component integration
- Database schema design and optimization
- Performance requirements and scalability
- Technology stack decisions and trade-offs
- Deployment and infrastructure considerations
```

#### Security Issues (@agent-security-guardian)

```
Analyze security requirements for: [Issue Title]
- Device fingerprinting and privacy compliance
- API key protection and environment security
- Input validation and XSS prevention
- Rate limiting and abuse prevention
- GDPR compliance and data protection
```

#### Testing & QA Issues (@agent-testing-qa-engineer)

```
Analyze testing requirements for: [Issue Title]
- Unit test coverage for components and utilities
- Integration testing for API endpoints
- End-to-end testing for user workflows
- Performance testing and benchmarking
- Swipe gesture testing and animation validation
```

#### Product Management Issues (@agent-product-owner)

```
Analyze product requirements for: [Issue Title]
- Business value and user impact assessment
- Feature prioritization and scope definition
- Success metrics and KPI tracking
- User story validation and acceptance criteria
- Stakeholder alignment and requirements clarification
```

### 4. Implementation Readiness Assessment

**Pre-Implementation Checklist:**

- [ ] All dependencies identified and available
- [ ] Technical specifications clearly defined
- [ ] Agent coordination plan established
- [ ] Required tools and libraries documented
- [ ] Test strategy and validation criteria defined
- [ ] Risk mitigation strategies prepared

**Leadership Review Preparation:**

- [ ] **Product Owner Review**: Business value and user impact validated
- [ ] **Technical Architect Review**: Architecture compliance and integration verified
- [ ] **UI/UX Designer Review**: Design system alignment and accessibility confirmed

**Implementation Plan Generation:**

- [ ] Break down issue into specific development tasks
- [ ] Estimate time requirements for each task
- [ ] Define task dependencies and execution order
- [ ] Identify potential blockers and mitigation strategies
- [ ] Create validation checkpoints and testing milestones

### 5. Output Generation

## Analysis Report Template

```markdown
# FlickPick Issue Analysis Report

## Issue Overview

**Issue**: [#Number] [Title]
**Phase**: [Phase X - Name from task-list.md]
**Lead Agent**: @agent-[name]
**Supporting Agents**: @agent-[name], @agent-[name]
**Estimated Effort**: [X days/hours]

## Technical Analysis

### Requirements Summary

[Detailed breakdown of what needs to be implemented]

### Architecture Impact

[How this affects the overall system architecture]

### Dependencies

**Prerequisite Issues**: [List with status]
**Required Inputs**: [What this issue needs to start]
**Delivered Outputs**: [What this issue will produce]

### Risk Assessment

**Technical Risks**: [Identified challenges and mitigation]
**Timeline Risks**: [Schedule impacts and buffers]
**Integration Risks**: [Cross-agent coordination challenges]

## Implementation Plan

### Lead Agent Responsibilities (@agent-[name])

- [ ] [Task 1 with time estimate]
- [ ] [Task 2 with time estimate]
- [ ] [Task 3 with time estimate]

### Supporting Agent Tasks

**@agent-[name]:**

- [ ] [Support task 1]
- [ ] [Support task 2]

### Validation Criteria

- [ ] [Functional validation 1]
- [ ] [Performance validation 2]
- [ ] [Integration validation 3]

## Leadership Review Requirements

- [ ] **Product Owner**: [Specific approval criteria]
- [ ] **Technical Architect**: [Technical review requirements]
- [ ] **UI/UX Designer**: [Design review needs] _(if applicable)_

## Implementation Readiness

**Status**: [Ready/Blocked/Needs Clarification]
**Blockers**: [None/List specific blockers]
**Next Steps**: [Immediate actions to begin implementation]

## Agent Handoff Package

[Complete technical specification ready for lead agent implementation]
```

### 6. Lead Agent Implementation Kickoff

**Agent Handoff Process:**

- [ ] Provide complete analysis report to lead agent
- [ ] Transfer all technical specifications and constraints
- [ ] Confirm understanding of acceptance criteria
- [ ] Establish communication plan for status updates
- [ ] Schedule review checkpoints with leadership agents

## Command Usage Examples

### Analyze by Issue Number

```bash
analyze-github-issue 15
```

### Analyze by GitHub URL

```bash
analyze-github-issue "https://github.com/user/flick-pick/issues/15"
```

### Analyze with Specific Focus

```bash
analyze-github-issue 23 --focus=architecture
```

## Success Criteria

- Complete technical analysis performed by appropriate lead agent
- Implementation plan ready for immediate execution
- All dependencies and risks identified with mitigation strategies
- Leadership review requirements clearly defined
- Agent handoff package prepared with complete specifications
- Implementation readiness confirmed before agent assignment
