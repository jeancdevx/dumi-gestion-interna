# Git Workflow Guide

This project follows a **Git Flow** workflow with conventional commits.

## Branch Structure

- **`production`**: Production-ready code (deployed to production on releases
  only)
- **`qa`**: Quality assurance and pre-production testing (deployed to QA on
  Vercel)
- **`develop`**: Integration branch for features (local development, no
  auto-deploy)
- **`feature/*`**: Feature branches (e.g., `feature/user-authentication`)
- **`chore/*`**: Maintenance and chores (e.g., `chore/update-dependencies`)
- **`docs/*`**: Documentation updates (e.g., `docs/api-docs`)
- **`release/*`**: Release preparation branches (e.g., `release/v1.2.0`)
- **`hotfix/*`**: Emergency fixes for production

## Workflow Steps

### 1. Feature Development

```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature, make commits using conventional format
npm run commit  # or git commit with conventional format

# Push feature branch
git push origin feature/your-feature-name
```

### 2. Create Pull Request

- **Features**: Create PR from `feature/your-feature-name` → `develop`
- **QA Testing**: Create PR from `develop` → `qa` (for testing)
- **Production**: Create PR from `qa` → `production` (after QA approval)
- Add meaningful description
- Request code review

### 3. Deployment Flow

**Automatic deployments via Vercel:**

- `production` branch → Production deployment (only on releases)
- `qa` branch → QA environment deployment (for testing before production)
- Feature branches → No automatic deployment (develop locally)
- Preview deployments can be triggered manually if needed

### 4. Release Process

### 4. Release Process

```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Bump version, update changelog, final testing
# Make final commits if needed

# Merge to QA for testing
git checkout qa
git merge release/v1.2.0
git push origin qa

# After QA approval, merge to production
git checkout production
git merge release/v1.2.0
git tag v1.2.0
git push origin production --tags

# Merge back to develop
git checkout develop
git merge production
git push origin develop

# Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### 5. Hotfixes

### 5. Hotfixes

```bash
# Create hotfix from production
git checkout production
git pull origin production
git checkout -b hotfix/critical-bug-fix

# Fix the issue and commit
npm run commit

# Merge to production
git checkout production
git merge hotfix/critical-bug-fix
git tag v1.2.1
git push origin production --tags

# Merge to QA and develop
git checkout qa
git merge hotfix/critical-bug-fix
git push origin qa

git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop

# Delete hotfix branch
git branch -d hotfix/critical-bug-fix
```

## Commit Message Format

We use **Conventional Commits** format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Build system changes
- **ci**: CI/CD changes
- **chore**: Maintenance tasks

### Examples

```
feat(auth): add user login functionality
fix(api): resolve data validation error
docs(readme): update installation instructions
refactor(utils): simplify date formatting function
```

## Available Commands

- `npm run commit` - Interactive commit with Commitizen
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Hooks

- **pre-commit**: Runs linting and formatting on staged files
- **commit-msg**: Validates commit message format

## Branch Protection Rules (Recommended)

### For `production` branch:

- Require pull request reviews
- Require status checks to pass (CI workflow)
- Require branches to be up to date
- Include administrators
- Restrict pushes

### For `qa` branch:

- Require pull request reviews
- Require status checks to pass (CI workflow)
- Require branches to be up to date

### For `develop` branch:

- Require pull request reviews
- Require status checks to pass (CI workflow)
- Require branches to be up to date

## Vercel Deployment Setup

1. Connect your GitHub repository to Vercel
2. Configure automatic deployments:
   - **Production**: `production` branch → Production domain (yourapp.com)
   - **QA**: `qa` branch → QA subdomain (qa-yourapp.vercel.app)
   - **Development**: Feature branches → Manual preview deployments only (not
     automatic)

3. Environment variables should be configured per environment in Vercel
   dashboard
4. Production deployments should only happen through releases via QA →
   Production flow
