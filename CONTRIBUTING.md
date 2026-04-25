# Contributing to Sigil

This document outlines the standards and procedures for contributing to Sigil. We welcome contributions that improve the protocol's functionality, documentation, or security.

## Development Setup

### Prerequisites
- Rust: rustup.rs
- Solana CLI: docs.solana.com/cli/install-solana-cli-tools
- Anchor CLI: www.anchor-lang.com/docs/installation
- Bun: bun.sh

### Initializing the Workspace
```bash
# Clone the repository
git clone https://github.com/sigil-xyz/sigil && cd sigil

# Install dependencies
bun install

# Build the programs
anchor build

# Run test suite
cargo test
```

## Git Workflow and Repository Standards

These workflows are maintained by the repository maintainer and senior development team to ensure protocol stability and high code quality.

### Branching Model

- main: The source of truth for production-ready code. Protected branch; direct commits are prohibited.
- feat/: Feature development. Branches must be scoped (e.g., feat/credential/issuance).
- fix/: Critical and non-critical bug fixes.
- docs/: Documentation improvements.
- chore/: Tooling, dependency updates, and maintenance.

### Development Cycle

1. Synchronize: Ensure your local main is up to date with the upstream repository.
2. Branch: Create a descriptive branch from main.
3. Implementation: Adhere to the project's coding standards and design patterns.
4. Validation: Execute all local tests and linting suites before pushing.
5. Review: Open a Pull Request. Every PR requires at least one approval from a senior developer or the maintainer.
6. Integration: Approved PRs are squash-merged into main to maintain a clean, linear history.

### Commit Conventions

We strictly follow the Conventional Commits specification. This enables automated changelog generation and versioning.

Format: ``<type>(<scope>): <description>``

Common Types:
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding or correcting tests.
- `chore`: Updates to build process or dependencies.

Example: `feat(registry): implement on-chain discovery filters`

## Pull Request Process

1. Fork and Branch: Create a dedicated branch from main.
2. Quality Check: Verify that code passes linting and tests.
   - bun lint
   - cargo test
   - bunx tsc --noEmit
3. Documentation: Update relevant documentation for any functional changes.
4. Review: Request a review from maintainers.
5. Merge: Approved PRs will be squash-merged into main.

## Code of Conduct

Maintain professional and respectful conduct in all interactions within the Sigil community. We aim to foster a collaborative and inclusive environment.
