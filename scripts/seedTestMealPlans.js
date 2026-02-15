// Seed script to create test meal plans without calling AI
// Usage: node scripts/seedTestMealPlans.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

// Import models
const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

// Define schemas inline (simpler for seed script)
const WeekPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  primaryGoal: { type: String, required: true },
  status: { type: String, default: 'incomplete' },
  profileSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

const DayPlanSchema = new mongoose.Schema({
  weekPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeekPlan', required: true },
  date: { type: Date, required: true },
  dailyTotals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
  },
}, { timestamps: true });

const MealSchema = new mongoose.Schema({
  dayPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'DayPlan', required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  ingredients: [{ name: String, quantity: String }],
  instructions: String,
  macros: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
  },
  nutritionalReasoning: String,
  scientificSources: [String],
  prepTimeMinutes: { type: Number, default: 30 },
  editHistory: [Object],
}, { timestamps: true });

const SnackSchema = new mongoose.Schema({
  dayPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'DayPlan', required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  ingredients: [{ name: String, quantity: String }],
  instructions: String,
  macros: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
  },
  nutritionalReasoning: String,
  scientificSources: [String],
  portability: { type: String, default: 'portable' },
  prepTimeMinutes: { type: Number, default: 10 },
  idealTiming: String,
  editHistory: [Object],
}, { timestamps: true });

const WeekPlan = mongoose.models.WeekPlan || mongoose.model('WeekPlan', WeekPlanSchema);
const DayPlan = mongoose.models.DayPlan || mongoose.model('DayPlan', DayPlanSchema);
const Meal = mongoose.models.Meal || mongoose.model('Meal', MealSchema);
const Snack = mongoose.models.Snack || mongoose.model('Snack', SnackSchema);
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', new mongoose.Schema({}, { strict: false }));

async function seedTestMealPlans() {
  try {
    await connectMongo();

    // Find first user and their profile
    const user = await User.findOne();
    if (!user) {
      console.error('❌ No users found. Please sign in first.');
      process.exit(1);
    }

    const profile = await UserProfile.findOne({ userId: user._id });
    if (!profile) {
      console.error('❌ No profile found. Please create a profile first.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email}`);
    console.log(`✅ Found profile for user`);

    // Create 3 test meal plans
    const goals = ['muscle_building', 'weight_loss', 'general_health'];

    for (let i = 0; i < 3; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (i * 7)); // Stagger by weeks
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);

      // Create WeekPlan
      const weekPlan = await WeekPlan.create({
        userId: user._id,
        userProfileId: profile._id,
        startDate,
        endDate,
        primaryGoal: goals[i],
        status: 'incomplete',
        profileSnapshot: {
          biometrics: profile.biometrics,
          dietaryRestrictions: profile.dietaryRestrictions,
          foodPreferences: profile.foodPreferences,
          culturalCuisines: profile.culturalCuisines,
          location: profile.location,
        },
      });

      console.log(`\n📅 Created WeekPlan ${i + 1}: ${goals[i]}`);

      // Create 1 DayPlan (for 1-day testing)
      const dayPlan = await DayPlan.create({
        weekPlanId: weekPlan._id,
        date: startDate,
        dailyTotals: {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 60,
          fiber: 30,
        },
      });

      console.log(`  ✅ Created DayPlan`);

      // Create 3 Meals
      const meals = [
        {
          type: 'breakfast',
          name: 'Test Protein Pancakes',
          ingredients: [
            { name: 'Oats', quantity: '50g' },
            { name: 'Eggs', quantity: '2 whole' },
            { name: 'Banana', quantity: '1 medium' },
          ],
          instructions: 'Mix ingredients, cook on griddle for 3 minutes each side.',
          macros: { calories: 400, protein: 25, carbs: 45, fat: 12, fiber: 6 },
          nutritionalReasoning: 'High protein breakfast to support muscle growth and satiety.',
          prepTimeMinutes: 15,
        },
        {
          type: 'lunch',
          name: 'Test Grilled Chicken Salad',
          ingredients: [
            { name: 'Chicken Breast', quantity: '150g' },
            { name: 'Mixed Greens', quantity: '2 cups' },
            { name: 'Olive Oil', quantity: '1 tbsp' },
          ],
          instructions: 'Grill chicken, toss with greens and dressing.',
          macros: { calories: 450, protein: 45, carbs: 20, fat: 22, fiber: 8 },
          nutritionalReasoning: 'Lean protein with healthy fats and fiber for sustained energy.',
          prepTimeMinutes: 25,
        },
        {
          type: 'dinner',
          name: 'Test Salmon with Sweet Potato',
          ingredients: [
            { name: 'Salmon Fillet', quantity: '180g' },
            { name: 'Sweet Potato', quantity: '1 medium' },
            { name: 'Broccoli', quantity: '1 cup' },
          ],
          instructions: 'Bake salmon at 400°F for 15 min, roast sweet potato and steam broccoli.',
          macros: { calories: 550, protein: 40, carbs: 50, fat: 18, fiber: 10 },
          nutritionalReasoning: 'Omega-3 rich fish with complex carbs and vegetables.',
          prepTimeMinutes: 35,
        },
      ];

      for (const mealData of meals) {
        await Meal.create({
          ...mealData,
          dayPlanId: dayPlan._id,
          editHistory: [],
          scientificSources: [],
        });
      }

      console.log(`  ✅ Created 3 Meals`);

      // Create 2 Snacks
      const snacks = [
        {
          type: 'morning_snack',
          name: 'Test Greek Yogurt & Berries',
          ingredients: [
            { name: 'Greek Yogurt', quantity: '150g' },
            { name: 'Mixed Berries', quantity: '50g' },
          ],
          instructions: 'Mix yogurt with berries.',
          macros: { calories: 180, protein: 15, carbs: 20, fat: 4, fiber: 3 },
          nutritionalReasoning: 'Protein-rich snack with antioxidants.',
          portability: 'portable',
          prepTimeMinutes: 5,
          idealTiming: '2 hours after breakfast',
        },
        {
          type: 'afternoon_snack',
          name: 'Test Protein Shake',
          ingredients: [
            { name: 'Protein Powder', quantity: '1 scoop' },
            { name: 'Almond Milk', quantity: '250ml' },
            { name: 'Peanut Butter', quantity: '1 tbsp' },
          ],
          instructions: 'Blend all ingredients.',
          macros: { calories: 250, protein: 25, carbs: 15, fat: 8, fiber: 3 },
          nutritionalReasoning: 'Quick protein boost for muscle recovery.',
          portability: 'semi_portable',
          prepTimeMinutes: 5,
          idealTiming: '1 hour before dinner',
        },
      ];

      for (const snackData of snacks) {
        await Snack.create({
          ...snackData,
          dayPlanId: dayPlan._id,
          editHistory: [],
          scientificSources: [],
        });
      }

      console.log(`  ✅ Created 2 Snacks`);
    }

    console.log(`\n✅ Successfully seeded 3 test meal plans!`);
    console.log(`\n🔗 Navigate to http://localhost:3000/dashboard to view them`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test meal plans:', error);
    process.exit(1);
  }
}

seedTestMealPlans();
