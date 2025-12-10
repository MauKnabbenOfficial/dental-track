<!-- .github/copilot-instructions.md -->
# Copilot / AI Agent instructions for DentalTrack

This file gives focused, actionable information for an AI coding agent to be productive in this repository.

1) Quick start (local development)
- Backend (API):
  - Project: `DentalTrack.WebApi` (run from solution root).
  - Typical commands:
    - `dotnet build DentalTrack.sln`
    - `dotnet run --project DentalTrack.WebApi` (or `dotnet watch run --project DentalTrack.WebApi`)
  - DB/migrations: migrations live in `DentalTrack.Infrastructure/Migrations`.
    - Apply migrations: `dotnet ef database update --project DentalTrack.Infrastructure --startup-project DentalTrack.WebApi`
    - If `dotnet ef` is missing, install the tool or add `Microsoft.EntityFrameworkCore.Tools`.
  - Note: `appsettings.json` in `DentalTrack.WebApi` contains `ConnectionStrings` (default points to a local SQLExpress instance). Update for CI or containerized runs.

- Frontend (Vite + React + TypeScript):
  - Two places to look: top-level `FRONTEND/` (legacy/alternate) and `DentalTrack.Web/` (current web UI). `DentalTrack.Web` has `package.json` and Vite config.
  - Typical commands (from `DentalTrack.Web`):
    - `npm install`
    - `npm run dev` (Vite dev server; default port 5173)
  - UI tech: React + TypeScript + Tailwind + shadcn-style components. App entry: `DentalTrack.Web/src/main.tsx`.

2) Big-picture architecture
- Layered .NET solution: projects in solution (`DentalTrack.sln`):
  - `DentalTrack.Domain` — domain models.
  - `DentalTrack.Application` — DTOs and service interfaces (e.g., `IAuthService`, `IAtendimentoService`).
  - `DentalTrack.Infrastructure` — EF DbContext (`AppDbContext`), repositories, services, dependency injection extension `InfrastructureServiceExtensions.AddInfrastructure`.
  - `DentalTrack.WebApi` — ASP.NET controllers (route pattern `api/[controller]`) and program startup (JWT auth, CORS, Swagger).
- DI conventions: registration happens in `DentalTrack.Infrastructure/DependencyInjection/InfrastructureServiceExtensions.cs` — repositories and services are registered as scoped.
- Data flow: Controllers call Application services (interfaces in `DentalTrack.Application.Interfaces`) implemented in `Infrastructure.Services`, repositories live in `Infrastructure.Repositories` and use `AppDbContext`.

3) Project-specific conventions & patterns
- Files/locations to follow for changes:
  - DTOs: `DentalTrack.Application/DTOs` — use these for API contracts.
  - Interfaces: `DentalTrack.Application/Interfaces` — add new service interfaces here and register implementations in `InfrastructureServiceExtensions`.
  - Repositories: `DentalTrack.Infrastructure/Repositories` — repository classes implement repository interfaces referenced by services.
  - Controllers: `DentalTrack.WebApi/Controllers` — route `api/[controller]`, use `[Authorize]` on protected endpoints.
- Authentication: JWT configured in `DentalTrack.WebApi/Program.cs`, keys & issuer/audience in `appsettings.json`.
- Seeding: `DatabaseSeeder` in `DentalTrack.Infrastructure/Seed` is invoked automatically in Development environment at startup (seed JSON is `Seed/SeedData.json`).

4) Important files to inspect when changing behavior
- `DentalTrack.WebApi/Program.cs` — app startup, auth, CORS, swagger, seeding.
- `DentalTrack.Infrastructure/DependencyInjection/InfrastructureServiceExtensions.cs` — add/remove registrations here.
- `DentalTrack.Infrastructure/DB/AppDbContext.cs` — EF model mappings.
- Controllers examples: `AuthController.cs`, `UsuariosController.cs`, `PacientesController.cs` — follow patterns used here for new endpoints.
- Frontend entry + contexts: `DentalTrack.Web/src/main.tsx`, `src/contexts/` and `src/services/api/` — front-end API calls go through these services.

5) Common commands & dev notes
- Build solution: `dotnet build DentalTrack.sln`
- Run API: `dotnet run --project DentalTrack.WebApi`
- Run frontend (from `DentalTrack.Web`): `npm install && npm run dev`
- Apply EF migrations: `dotnet ef database update --project DentalTrack.Infrastructure --startup-project DentalTrack.WebApi`
- Run Swagger UI: start API in Development environment then open `https://localhost:<port>/swagger`.

6) When editing code: focused guidance
- When adding a new service:
  - Add interface to `DentalTrack.Application/Interfaces`.
  - Implement in `DentalTrack.Infrastructure/Services`.
  - Add repository if persistence is needed in `DentalTrack.Infrastructure/Repositories` and register both in `InfrastructureServiceExtensions.AddInfrastructure`.
  - Add controller in `DentalTrack.WebApi/Controllers` and use DTOs from `DentalTrack.Application/DTOs`.
- When changing DB schema:
  - Add migration in `DentalTrack.Infrastructure` (use `dotnet ef migrations add <Name> --project DentalTrack.Infrastructure --startup-project DentalTrack.WebApi`).
  - Apply with `dotnet ef database update` (see above).

7) Known environment assumptions
- The default DB connection targets a local SQLExpress instance; CI or Docker environments must supply a valid `DefaultConnection`.
- JWT secret in `appsettings.json` is present for development; rotate for production.

8) Additional pointers for the AI agent
- Use existing service names and DI registration patterns — prefer adding interfaces in `Application` and implementations in `Infrastructure`.
- Follow controller route and error/authorization patterns demonstrated in `AuthController.cs`.
- Frontend uses contexts (`src/contexts`) and a central `services/api` area — follow those to add new API calls.

If anything here is unclear or you'd like more examples (e.g., a sample migration flow, a new API + frontend integration example), tell me which area to expand and I'll iterate.
