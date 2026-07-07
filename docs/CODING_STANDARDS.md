# NabhaVerse Studio - Coding Standards

**Version:** 1.0  
**Last Updated:** 2026-07-07

This document defines coding standards for both frontend and backend development, ensuring consistency, maintainability, and quality across the codebase.

---

## Table of Contents

- [General Principles](#general-principles)
- [TypeScript Standards (Frontend)](#typescript-standards-frontend)
- [Python Standards (Backend)](#python-standards-backend)
- [Code Organization](#code-organization)
- [Testing Standards](#testing-standards)
- [Documentation Standards](#documentation-standards)
- [Performance Guidelines](#performance-guidelines)
- [Security Guidelines](#security-guidelines)
- [Git Conventions](#git-conventions)

---

## General Principles

### Core Philosophy

1. **Readability First** - Code is read more often than written
2. **Consistency** - Follow established patterns
3. **Simplicity** - Avoid over-engineering
4. **Type Safety** - Use strict typing
5. **Testability** - Design for testing
6. **Performance** - Optimize for production use
7. **Security** - Never trust user input

### Code Quality Metrics

- **Cyclomatic Complexity:** < 10 per function
- **Function Length:** < 50 lines (prefer < 30)
- **Class Size:** < 500 lines
- **File Size:** < 1000 lines
- **Test Coverage:** > 80% overall, 100% for critical paths
- **Duplication:** < 3% across codebase

---

## TypeScript Standards (Frontend)

### Setup & Configuration

```json
// tsconfig.json - Strict mode required
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "target": "ES2020"
  }
}
```

### Naming Conventions

```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Variables & Functions: camelCase
const characterCount = 10;
function generatePrompt() {}

// Classes & Types: PascalCase
class CharacterService {}
interface CharacterProfile {}
type CharacterStatus = 'draft' | 'approved' | 'published';

// React Components: PascalCase
export function CharacterCard() {}

// Private members: _camelCase
private _cache: Map<string, Character> = new Map();
```

### Type Definitions

```typescript
// Always define types for function parameters and returns
function createCharacter(
  name: string,
  profile: CharacterProfile
): Promise<Character> {
  // ...
}

// Use interfaces for object shapes
interface CharacterProfile {
  identity: string;
  personality: string;
  visualIdentity: VisualIdentity;
}

// Use types for unions, intersections, primitives
type CharacterStatus = 'draft' | 'approved' | 'published';
type Result<T> = Success<T> | Error<string>;

// Avoid `any` - use `unknown` if necessary
function handleResponse(data: unknown): Character {
  // Type guard and narrow
  if (typeof data === 'object' && data !== null) {
    return data as Character;
  }
  throw new Error('Invalid response');
}
```

### Component Standards

```typescript
// Use functional components with hooks
import { FC, useState, useEffect } from 'react';

interface CharacterCardProps {
  characterId: string;
  onSelect?: (id: string) => void;
  variant?: 'compact' | 'full';
}

export const CharacterCard: FC<CharacterCardProps> = ({
  characterId,
  onSelect,
  variant = 'full',
}) => {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    fetchCharacter(characterId).then(setCharacter);
  }, [characterId]);

  if (!character) return <Skeleton />;

  return (
    <div className={`card card-${variant}`} onClick={() => onSelect?.(characterId)}>
      {/* JSX */}
    </div>
  );
};
```

### State Management

```typescript
// Use React Hook Form for forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { characterSchema } from '@/schemas';

function CharacterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(characterSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}

// Use TanStack Query for server state
import { useQuery, useMutation } from '@tanstack/react-query';

function CharacterList() {
  const { data: characters, isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: () => api.getCharacters(),
  });

  const { mutate: createCharacter } = useMutation({
    mutationFn: (data) => api.createCharacter(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['characters'] }),
  });

  return <></>
}
```

### File Organization

```
features/characters/
├── api/
│   └── client.ts              # API client functions
├── components/
│   ├── CharacterCard.tsx      # Presentational component
│   ├── CharacterForm.tsx
│   └── CharacterList.tsx
├── hooks/
│   ├── useCharacter.ts        # Data fetching hooks
│   └── useCharacterForm.ts    # Form-specific hooks
├── schemas/
│   └── character.ts           # Zod validation schemas
├── types/
│   └── character.ts           # TypeScript types
├── utils/
│   └── character.ts           # Helper functions
└── index.ts                   # Barrel export
```

### ESLint & Prettier Configuration

```javascript
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-types": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## Python Standards (Backend)

### Setup & Configuration

```toml
# pyproject.toml
[tool.black]
line-length = 100
target-version = ['py310']

[tool.ruff]
line-length = 100
target-version = "py310"
select = ["E", "F", "W", "I", "N", "D"]
ignore = ["E501", "D100", "D104"]

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

### Naming Conventions

```python
# Constants: UPPER_SNAKE_CASE
MAX_RETRIES = 3
API_TIMEOUT = 5000

# Variables & Functions: snake_case
character_count = 10
def generate_prompt() -> str:
    pass

# Classes: PascalCase
class CharacterService:
    pass

# Private members: _snake_case
_cache: dict[str, Character] = {}
```

### Type Hints

```python
from typing import Optional, List, Dict
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Always use type hints
def create_character(
    name: str,
    profile: CharacterProfile,
    db: Session
) -> Character:
    """Create a new character.
    
    Args:
        name: Character name
        profile: Character profile data
        db: Database session
        
    Returns:
        Created character
    """
    pass

# Use Pydantic for validation
class CharacterCreate(BaseModel):
    name: str
    identity: str
    personality: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Luna",
                "identity": "Wise owl",
                "personality": "Curious and kind"
            }
        }
```

### Async/Await Patterns

```python
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()

@app.post("/characters")
async def create_character(
    data: CharacterCreate,
    db: AsyncSession
) -> Character:
    """Create a new character."""
    try:
        character = Character(**data.dict())
        db.add(character)
        await db.commit()
        await db.refresh(character)
        return character
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Character already exists")
```

### Error Handling

```python
from fastapi import HTTPException, status
from app.core.exceptions import CharacterNotFound, ValidationError

@app.get("/characters/{character_id}")
async def get_character(character_id: str, db: AsyncSession) -> Character:
    """Get character by ID."""
    character = await db.get(Character, character_id)
    
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found"
        )
    
    return character
```

### File Organization

```
app/
├── domain/
│   ├── characters/
│   │   ├── models.py          # Domain models
│   │   ├── repositories.py    # Data access
│   │   ├── services.py        # Business logic
│   │   └── exceptions.py      # Domain exceptions
│   └── episodes/
├── api/
│   └── v1/
│       ├── characters/
│       │   ├── routes.py      # API endpoints
│       │   └── schemas.py     # Request/response schemas
│       └── episodes/
├── infrastructure/
│   ├── database/
│   ├── cache/
│   └── ai/
├── core/
│   ├── config.py
│   ├── security.py
│   └── exceptions.py
└── main.py
```

---

## Code Organization

### Domain-Driven Structure

Organize code by business domains, not technical layers:

```
Characters Domain:
├── Features related to characters
├── Character creation, editing, versioning
├── Master profile management
└── Character relationships

Episodes Domain:
├── Episode creation and management
├── Scene management
├── Workflow (idea → script)
└── Episode publishing
```

### Module Dependencies

Follow a clean dependency graph:

```
API Layer
    ↓
Application Layer (Use Cases/Services)
    ↓
Domain Layer (Business Logic)
    ↓
Infrastructure Layer (DB, External Services)
```

**Never have circular dependencies or skip layers.**

---

## Testing Standards

### Test File Naming

```
CharacterCard.tsx → CharacterCard.test.tsx
character.ts → character.test.ts
routes.py → test_routes.py
```

### Test Structure

```typescript
// Frontend example
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterCard } from './CharacterCard';

describe('CharacterCard', () => {
  describe('rendering', () => {
    it('should render character name', () => {
      render(<CharacterCard characterId="1" />);
      expect(screen.getByText('Character Name')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onSelect when clicked', () => {
      const onSelect = jest.fn();
      render(<CharacterCard characterId="1" onSelect={onSelect} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onSelect).toHaveBeenCalledWith('1');
    });
  });
});
```

```python
# Backend example
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.characters.services import CharacterService

@pytest.mark.asyncio
class TestCharacterService:
    @pytest.fixture
    async def service(self, db: AsyncSession):
        return CharacterService(db)

    async def test_create_character(self, service: CharacterService):
        """Test character creation."""
        result = await service.create_character({
            'name': 'Luna',
            'identity': 'Wise owl'
        })
        assert result.name == 'Luna'
```

---

## Documentation Standards

### Function/Method Documentation

```typescript
/**
 * Generate an AI prompt from character specifications.
 * 
 * @param character - The character to generate prompt for
 * @param style - Optional style override
 * @returns Generated prompt string
 * @throws Error if character data is invalid
 * 
 * @example
 * const prompt = await generateCharacterPrompt(character);
 * const styled = await generateCharacterPrompt(character, 'anime');
 */
export async function generateCharacterPrompt(
  character: Character,
  style?: string
): Promise<string> {
  // ...
}
```

```python
def create_character(name: str, profile: CharacterProfile) -> Character:
    """Create a new character in the system.
    
    Args:
        name: The character's name (max 100 chars)
        profile: The character profile containing identity and specs
        
    Returns:
        The created Character object with ID assigned
        
    Raises:
        ValueError: If name is empty or profile is invalid
        IntegrityError: If character with same name already exists
        
    Example:
        >>> character = create_character('Luna', profile)
        >>> print(character.id)
    """
    pass
```

### Class Documentation

```typescript
/**
 * Manages character data and operations.
 * 
 * Handles CRUD operations, versioning, and relationships
 * for character entities. Integrates with AI providers
 * for prompt generation.
 * 
 * @example
 * const service = new CharacterService(database);
 * const character = await service.create(data);
 */
export class CharacterService {}
```

---

## Performance Guidelines

### Frontend Performance

- **Code Splitting:** Use dynamic imports for large components
- **Image Optimization:** Use Next.js Image component
- **Memoization:** Use React.memo, useMemo, useCallback strategically
- **Bundle Size:** Keep main bundle < 250KB gzipped

### Backend Performance

- **Database Queries:** Use indexes, avoid N+1 queries
- **Caching:** Cache frequently accessed data
- **Pagination:** Always paginate large result sets
- **Async Operations:** Use async/await for I/O operations

---

## Security Guidelines

- **Input Validation:** Validate all user inputs with Zod/Pydantic
- **SQL Injection:** Use parameterized queries (SQLAlchemy handles this)
- **XSS Prevention:** Sanitize HTML content
- **CSRF Protection:** Use CSRF tokens for state-changing operations
- **Secrets:** Never commit secrets, use environment variables
- **Authentication:** Follow JWT/OAuth best practices
- **Authorization:** Implement role-based access control

---

## Git Conventions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```
feat(characters): add character versioning system

Implement version control for character profiles. Each update
creates a new version that can be reverted.

Closes #123
```

---

**Last Updated:** 2026-07-07  
**Version:** 1.0  
**Status:** Foundation Phase
