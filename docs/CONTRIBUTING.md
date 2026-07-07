# Contributing to NabhaVerse Studio

Thank you for your interest in contributing to NabhaVerse Studio! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Review](#code-review)
- [Testing Requirements](#testing-requirements)
- [Commit Conventions](#commit-conventions)
- [Documentation](#documentation)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors are expected to:

- Be respectful and professional
- Welcome feedback and criticism
- Focus on what's best for the community
- Show empathy towards other community members

Unacceptable behavior includes harassment, discrimination, and disrespect.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- Redis 7+
- Git 2.30+

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/NabhaVerse.git
   cd NabhaVerse
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   cd apps/api && pip install -r requirements.txt
   ```

3. **Setup local environment**
   ```bash
   cp .env.example .env.local
   # Update .env.local with your local configuration
   ```

4. **Run database migrations**
   ```bash
   cd apps/api
   alembic upgrade head
   ```

5. **Start development servers**
   ```bash
   # From root directory
   pnpm dev
   ```

See [Local Setup Guide](./development/LOCAL_SETUP.md) for detailed instructions.

---

## Development Workflow

### Branch Naming

Branches should follow this naming convention:

```
<type>/<scope>/<description>
```

**Types:**
- `feature` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Test additions/changes
- `chore` - Build, dependencies, tooling

**Examples:**
```
feature/characters/master-profile
fix/dashboard/loading-state
docs/api/authentication
refactor/episode/script-processing
```

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/characters/master-profile
```

### Development Cycle

1. **Create branch** from `main`
2. **Make changes** following [Coding Standards](./CODING_STANDARDS.md)
3. **Write tests** for all changes
4. **Run linting and tests** locally
5. **Commit** with clear messages
6. **Push** to your fork
7. **Create Pull Request** to `main`

---

## Pull Request Process

### Before Submitting

1. **Update documentation**
   - Update README if needed
   - Add docstrings to new functions
   - Update CHANGELOG.md

2. **Run all checks locally**
   ```bash
   # Frontend
   cd apps/web
   pnpm lint
   pnpm type-check
   pnpm test

   # Backend
   cd apps/api
   ruff check .
   black --check .
   pytest
   ```

3. **Ensure tests pass**
   - Unit tests: 100% for new code
   - Integration tests for API changes
   - E2E tests for user workflows

### PR Title Format

```
<type>(<scope>): <subject>
```

**Examples:**
- `feat(characters): add master profile API endpoint`
- `fix(dashboard): resolve loading state bug`
- `docs(api): update authentication guide`
- `perf(search): optimize asset search queries`

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Bullet point summary of changes
- Another change

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Changes don't break existing features
```

### PR Review Expectations

- **Reviewers:** At least 2 approvals required
- **Timeline:** Reviews within 24 hours
- **Feedback:** Constructive and actionable
- **Changes:** Address all feedback before merge

---

## Code Review

### For Reviewers

1. **Check Code Quality**
   - Follows [Coding Standards](./CODING_STANDARDS.md)
   - No code duplication
   - Proper error handling
   - Clear variable/function names

2. **Verify Tests**
   - Tests are comprehensive
   - Edge cases covered
   - No flaky tests
   - Coverage maintained

3. **Assess Architecture**
   - Follows design patterns
   - No breaking changes
   - Performance acceptable
   - Security implications considered

4. **Review Documentation**
   - Clear and accurate
   - Examples provided
   - Updated with changes

### For Contributors

- Respond to feedback promptly
- Ask for clarification if needed
- Make requested changes in new commits
- Request re-review when ready

---

## Testing Requirements

### Test Coverage Targets
- **Overall:** > 80%
- **Critical paths:** 100%
- **API endpoints:** 100%
- **Database models:** 100%
- **Utilities:** > 90%

### Test Types

#### Unit Tests
```bash
# Frontend
cd apps/web && pnpm test

# Backend
cd apps/api && pytest unit/
```

#### Integration Tests
```bash
# Backend
cd apps/api && pytest integration/
```

#### E2E Tests
```bash
# Frontend
cd apps/web && pnpm test:e2e
```

### Writing Tests

- Use descriptive test names
- Test one thing per test
- Use mocks and fixtures
- Clean up after tests
- Group related tests

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (no logic change)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Test-related
- `chore` - Build, dependencies, tooling

### Subject
- Imperative mood ("add" not "adds")
- Lowercase first letter
- No period at end
- < 50 characters

### Body
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer
- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

### Examples

```
feat(characters): add character versioning

Implement version control for character profiles to track changes
over time. Each update creates a new version that can be reverted.

Closes #456
```

```
fix(api): handle null responses from AI provider

Add null check before processing AI provider responses to prevent
null pointer exceptions.

Closes #789
```

---

## Documentation

### When to Document
- New features
- API changes
- Architecture decisions
- Complex logic
- Breaking changes

### Documentation Types

1. **Code Documentation**
   - Docstrings for functions/classes
   - Inline comments for complex logic
   - Type hints for clarity

2. **User Documentation**
   - Feature guides
   - API documentation
   - Troubleshooting guides

3. **Developer Documentation**
   - Architecture decisions
   - Setup guides
   - Contribution guidelines

### Documentation Standards

- Use clear, concise language
- Include examples
- Keep documentation updated
- Link to related documentation
- Use Markdown formatting

---

## Performance Considerations

When contributing, keep performance in mind:

- Profile code for bottlenecks
- Use caching appropriately
- Optimize database queries
- Minimize bundle size (frontend)
- Test with realistic data volumes

---

## Security Considerations

- Never commit secrets or credentials
- Use parameterized queries
- Validate all inputs
- Follow authentication/authorization patterns
- Report security issues privately

---

## Questions?

- Check [Documentation](./README.md)
- Review [Decision Log](./architecture/DECISION_LOG.md)
- Ask in discussion forums
- Open an issue for bugs

---

**Last Updated:** 2026-07-07  
**Status:** Foundation Phase
