# 🍽️ AI-Powered Personalized Meal Planner

A science-backed meal planning application that generates personalized nutrition plans using AI, tailored to your health goals, biometrics, cultural preferences, and dietary restrictions.

## ✨ Features

### ✅ Phase 1: Health Profile Setup
- **Goal Selection**: Muscle building, weight loss, gut health, mental performance, or general health
- **Biometric Input**: Age, weight, height, biological sex with unit conversion (kg/lbs, cm/inches)
- **Cultural Preferences**: 20+ cuisine types with custom options
- **Dietary Restrictions**: Vegetarian, vegan, gluten-free, allergies, and custom restrictions
- **Location-Based**: Ingredient availability based on your location

### ✅ Phase 2: AI Meal Plan Generation
- **Personalized Meals**: 3 meals (breakfast, lunch, dinner) per day
- **Science-Backed**: Nutritional reasoning for each meal with optional scientific sources
- **Macro Tracking**: Complete breakdown of calories, protein, carbs, fat, and fiber
- **BMR Calculation**: Uses Mifflin-St Jeor equation for accurate calorie targets
- **Goal-Specific Macros**: Automatically adjusted for your health goal

### ✅ Phase 3: Per-Meal Editing
- **Individual Meal Regeneration**: Edit any meal with natural language instructions
- **Edit History**: Track all changes with undo functionality
- **Real-Time Updates**: Daily totals automatically recalculated
- **Context-Aware**: Maintains your goals and restrictions during edits

### ✅ Phase 4: Optional Snacks
- **Add Snacks**: Morning, afternoon, or evening snacks
- **Calorie Target**: Adjustable snack calorie slider (50-500 kcal)
- **Preference-Based**: Specify preferences like "high protein" or "fruit-based"
- **Gap Filling**: Helps meet daily macro targets

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key ([get one here](https://openrouter.ai/keys))
- Tavily API key ([get one here](https://tavily.com)) - optional for scientific validation

### Installation

```bash
# Clone the repository
git clone https://github.com/Monti-3-point-14-thon/meal-planner.git
cd meal-planner

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your API keys
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# OpenRouter Model (configurable)
OPENROUTER_MODEL=google/gemini-flash-1.5-8b

# Tavily API (optional, for scientific validation)
TAVILY_API_KEY=your_tavily_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **AI**: OpenRouter API (configurable models)
- **Validation**: Tavily API for scientific sources
- **Storage**: localStorage (MVP)
- **Calculations**: Mifflin-St Jeor BMR equation

## 📊 Supported AI Models

The app is configured to use any OpenRouter model. Free options include:

- `google/gemini-flash-1.5-8b` (default, free)
- `meta-llama/llama-3.1-8b-instruct:free`
- `mistralai/mistral-7b-instruct:free`

Premium models (requires credits):
- `anthropic/claude-3.5-sonnet`
- `openai/gpt-4-turbo`

Change the model in `.env.local`:
```env
OPENROUTER_MODEL=your-preferred-model
```

## 🎯 How It Works

1. **Profile Setup**: User enters health goals, biometrics, cultural preferences, and restrictions
2. **AI Generation**: OpenRouter AI generates 3 personalized meals based on user profile
3. **Scientific Validation**: Tavily optionally validates nutritional claims with scientific sources
4. **Display & Edit**: Meals displayed with macros, reasoning, and edit options
5. **Refinement**: User can edit individual meals with natural language instructions
6. **Snack Addition**: Optional snacks can be added between meals

## 📁 Project Structure

```
meal-planner/
├── app/
│   ├── api/                    # API routes
│   │   ├── generate-meal-plan/ # Meal plan generation
│   │   ├── edit-meal/          # Meal editing
│   │   └── generate-snack/     # Snack generation
│   ├── components/             # React components
│   │   ├── GoalSelector.tsx
│   │   ├── BiometricsInput.tsx
│   │   ├── MealCard.tsx
│   │   └── ...
│   ├── settings/               # Settings page
│   ├── generate/               # Generation page
│   └── meal-plan/              # Meal plan display
├── lib/
│   ├── ai/                     # AI integration
│   │   ├── openrouter.ts       # OpenRouter wrapper
│   │   ├── tavily.ts           # Tavily validation
│   │   └── prompts.ts          # Prompt builders
│   ├── types.ts                # TypeScript types
│   └── storage.ts              # localStorage utilities
└── .vibecode/                  # Development framework
```

## 🧪 Testing Status

### ✅ Completed (Tasks T001-T039)
- Environment setup and configuration
- All UI components and forms
- AI integration (OpenRouter + Tavily)
- Meal plan generation
- Per-meal editing
- Snack support
- localStorage persistence

### ⏳ Pending (Tasks T040-T045)
- Dietary restrictions enforcement testing
- Cultural cuisine reflection testing
- Macro calculation accuracy testing
- Error handling testing
- Mobile responsiveness
- Performance optimization

## 🐛 Known Issues

- **Model Configuration**: Some OpenRouter models may not be available. Update `OPENROUTER_MODEL` in `.env.local` if you encounter 404 errors.
- **localStorage Only**: Data is stored locally in the browser. Clearing browser data will delete meal plans.
- **No Authentication**: MVP version doesn't include user accounts or cloud storage.

## 🚧 Roadmap

- [ ] User authentication and cloud storage
- [ ] Multi-day meal plans (7-day, 14-day)
- [ ] Grocery list generation
- [ ] Meal plan export (PDF, print)
- [ ] Recipe instructions and cooking times
- [ ] Meal prep planning
- [ ] Integration with fitness trackers
- [ ] Social sharing and meal plan templates

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/Monti-3-point-14-thon/meal-planner/issues)
- Check existing issues for solutions

## 🙏 Acknowledgments

Built using:
- [OpenRouter](https://openrouter.ai) - Multi-model AI API
- [Tavily](https://tavily.com) - Scientific search API
- [Next.js](https://nextjs.org) - React framework
- [DaisyUI](https://daisyui.com) - Tailwind CSS components
- [Vibecoding Framework](https://github.com/adrienmuller/abe) - Development methodology

---

**Built with ❤️ by Claude Sonnet 4.5**
