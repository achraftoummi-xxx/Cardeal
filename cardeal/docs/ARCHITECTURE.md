# Architecture - CarDeal

CarDeal is a production-grade automotive marketplace platform.
It follows a monorepo architecture managed by Turborepo.

## Structure
- `apps/`: Next.js 15 applications (`client`, `partner`, `admin`)
- `packages/`: Shared packages (`ui`, `database`, `domain`, `search-engine`, `pricing-engine`, etc.)

## Principles
- Business logic in `packages/domain`
- Database access in `packages/database`
- API communication in `packages/api`
- UI components in `packages/ui`
