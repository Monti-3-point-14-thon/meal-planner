# AI-Powered Personalized Meal Planner

A science-backed, personalized meal planning application that uses AI to generate customized nutrition plans based on your health goals, biometrics, cultural preferences, and dietary restrictions.

## What is Abe?

Abe makes Claude Code work like a **technical co-founder** for non-technical founders:

- **Prevents AI drift** with structured workflow (spec -> plan -> tasks -> code)
- **Guides product decisions** with 28 PM frameworks from world-class PMs
- **Remembers everything** through a memory layer (decisions, patterns, design system)
- **Gets smarter over time** with accumulated technical wisdom
- **Never forgets context** even when you close VS Code

## Getting Started

```bash
# 1. Clone this repository
git clone https://github.com/adrienmuller/abe-technical-cofounder-for-vibecoding.git
cd abe-technical-cofounder-for-vibecoding

# 2. Initialize the framework (sets project name, creates any missing files)
.vibecode/scripts/init.sh

# 3. Open in VS Code with Claude Code extension

# 4. Establish your project principles
/vibecode:constitution

# 5. Start your first feature
/vibecode:specify "your feature description"

# 6. Follow the workflow
/vibecode:plan -> /vibecode:tasks -> /vibecode:implement
```

### Prerequisites

- Claude Code (VS Code extension or CLI)
- Git
- Bash (macOS/Linux)
- Node.js 18+ and npm
- Google Cloud account (for OAuth)
- MongoDB Atlas account (free tier available)
- OpenRouter account (for AI meal generation)

## Meal Planner Setup

This project is an AI-powered meal planning app built with Next.js, MongoDB, and NextAuth. Follow these steps to set up your local development environment.

### 1. Install Dependencies

```bash
npm install
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure OAuth consent screen (set to External for testing)
6. Set Application type to **Web application**
7. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
8. Copy **Client ID** and **Client Secret**

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster (512MB, sufficient for MVP)
3. Configure database access:
   - Create database user with username + password
   - Note credentials for connection string
4. Configure network access:
   - Add IP: `0.0.0.0/0` (allow from anywhere for development)
   - ⚠️ Restrict in production
5. Get connection string:
   - Click **Connect** > **Connect your application**
   - Copy connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database user password
   - Add database name: `meal-planner-dev`

### 4. OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or sign in
3. Navigate to **API Keys**
4. Create new API key
5. Copy the key (starts with `sk-or-v1-...`)

### 5. Environment Variables

Create a `.env.local` file in the project root:

```env
# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_ID=<your-google-client-id>
GOOGLE_SECRET=<your-google-client-secret>

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/meal-planner-dev?retryWrites=true&w=majority

# OpenRouter (AI meal generation)
OPENROUTER_API_KEY=<your-openrouter-api-key>
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. First-Time User Flow

1. Click **Sign in with Google**
2. Complete OAuth flow
3. Create your profile:
   - Enter biometrics (weight, height, age, sex)
   - Select dietary restrictions (if any)
   - Add food preferences (dislikes)
   - Choose cultural cuisines
   - Set location
4. Generate your first meal plan:
   - Select primary goal (muscle building, weight loss, etc.)
   - Click **Generate**
   - AI creates personalized 1-day meal plan
5. View meal plan history at `/history`

### 8. Seed Test Data (Optional)

To populate database with mock meal plans (avoids AI API costs during testing):

```bash
node scripts/seedTestMealPlans.js
```

This creates 3 test meal plans with different goals.

## Slash Commands

Type `/vibecode:` in Claude Code to see all commands.

### Core Workflow

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/vibecode:resume` | Resume where you left off | Starting a new session |
| `/vibecode:constitution` | Establish project principles | New project, updating standards |
| `/vibecode:specify` | Create feature spec (WHAT and WHY) | Starting a new feature |
| `/vibecode:plan` | Technical plan (HOW to build it) | After spec is complete |
| `/vibecode:tasks` | Break plan into ordered tasks | After plan is approved |
| `/vibecode:implement` | Build it, logging decisions | Ready to code |

### Supporting Commands

| Command | Purpose |
|---------|---------|
| `/vibecode:skills` | Manage PM skill weights |
| `/vibecode:memory` | Query decisions and patterns |
| `/vibecode:components` | View reusable component registry |
| `/vibecode:boilerplate` | Enable/disable boilerplate integration |

## How It Works

### The Memory Layer

Unlike traditional AI coding where every session starts fresh, Abe **remembers**:

- **Decisions**: Why you chose NextAuth over Auth0
- **Trade-offs**: When to prototype vs build robust
- **Patterns**: Your accumulated technical wisdom
- **Design System**: Visual consistency rules
- **Components**: What's already built

Each feature is faster than the last (compounding returns).

### PM Skills

Abe activates relevant PM frameworks based on what you're doing:

- **Building features**: zero-to-launch, strategic-build, ship-decisions
- **Making decisions**: decision-frameworks, prioritization-craft
- **Scope forcing**: "What's the ONE core job?" (aggressive by default)

Configure in [.vibecode/pm-skills-config.json](.vibecode/pm-skills-config.json).

### Context Engineering

CLAUDE.md provides automatic context loading on every conversation:
1. Reads project state to know where you are
2. Loads active feature context if you're mid-feature
3. References constitution and past decisions before making new ones
4. Logs decisions automatically during workflow

## Framework Structure

```
.vibecode/
├── session/              # Current work state
│   └── state.json        # Phase, active feature, flags
├── memory/
│   ├── core/             # Constitution, tech stack, architecture
│   ├── trade-offs/       # Decision patterns
│   ├── decisions/        # Decision log (active + archived)
│   └── design-system/    # Visual consistency
├── specs/                # Feature specifications
├── components-registry/  # Component catalog
├── scripts/              # Automation (init.sh)
└── pm-skills-config.json # Skills toggle and weights
```

## Use Cases

### Perfect For
- **Solo founders** building MVPs without technical team
- **Serial MVP builders** who need speed + consistency
- **Product managers** who want to prototype without engineers
- **Technical founders** who want structure + PM expertise

### Not Ideal For
- Large dev teams with established processes
- One-off 2-day prototypes (framework is overkill)
- Pure exploration/learning projects

## Documentation

Detailed background documentation is in [docs/](docs/):
- [Framework Architecture](docs/VIBECODING_FRAMEWORK.md)
- [Executive Summary](docs/FRAMEWORK_SUMMARY.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)
- [Value Proposition](docs/WHY_THIS_MATTERS.md)

## Acknowledgments

This framework builds on and combines:

- [**Spec-Kit**](https://github.com/github/spec-kit) - Spec-driven development methodology
- [**Awesome-PM-Skills**](https://github.com/menkesu/awesome-pm-skills) - PM frameworks from Lenny's Podcast
- [**Ship-Fast**](https://shipfa.st) - Next.js SaaS boilerplate (optional integration)

## License

MIT License - See [LICENSE](LICENSE) for details.
