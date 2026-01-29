const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: fs.existsSync(envLocalPath) ? envLocalPath : envPath });
const mongoose = require('mongoose');
const Beer = require('./models/Beer');

const nepaliBeers = [
  {
    name: "Everest Premium Lager",
    brewery: "Himalayan Breweries",
    style: "Pilsner Lager",
    description:
      "Nepal's most iconic beer with a crisp, clean finish. Brewed from pure Himalayan water with balanced hop character.",
    rating: 4.6,
    abv: 5.0,
    image: "/images/beer-1.svg",
    price: 4.99,
  },
  {
    name: "Gorkha Gold",
    brewery: "Gorkha Brewery",
    style: "Golden Lager",
    description:
      "A smooth golden lager with hints of malt sweetness. Perfect for celebrations and everyday enjoyment in Nepal.",
    rating: 4.4,
    abv: 4.8,
    image: "/images/beer-2.svg",
    price: 4.49,
  },
  {
    name: "Kathmandu Dark",
    brewery: "Nepal Breweries Ltd",
    style: "Dark Ale",
    description:
      "Rich and full-bodied dark ale with roasted malt flavors and hints of chocolate, brewed in the heart of Kathmandu.",
    rating: 4.5,
    abv: 5.8,
    image: "/images/beer-3.svg",
    price: 5.49,
  },
  {
    name: "Pokhara Ale",
    brewery: "Annapurna Brewing Co.",
    style: "Amber Ale",
    description:
      "A smooth amber ale inspired by the beautiful landscapes of Pokhara. Balanced malt with gentle hop bitterness.",
    rating: 4.3,
    abv: 5.2,
    image: "/images/beer-4.svg",
    price: 4.75,
  },
  {
    name: "Sherpa's Peak IPA",
    brewery: "Mountain Craft Nepal",
    style: "India Pale Ale",
    description:
      "A bold IPA crafted for the adventurous spirit. Fruity hops with a clean finish, paying homage to Nepal's mountain heritage.",
    rating: 4.7,
    abv: 6.5,
    image: "/images/beer-5.svg",
    price: 5.99,
  },
  {
    name: "Pashupatinath Special",
    brewery: "Heritage Breweries Nepal",
    style: "Strong Lager",
    description:
      "A premium strong lager with a rich, complex flavor profile. Brewed with traditional Nepali brewing methods and local ingredients.",
    rating: 4.8,
    abv: 7.2,
    image: "/images/beer-6.svg",
    price: 6.49,
  },
];

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  // Check MongoDB URI
  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not set in .env.local');
    console.error('\nTo fix this:');
    console.error('1. Read MONGODB_ATLAS_SETUP.md');
    console.error('2. Create a free MongoDB Atlas account');
    console.error('3. Update backend/.env.local with your connection string');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing beers
    console.log('🗑️  Clearing existing beers...');
    await Beer.deleteMany({});
    console.log('✅ Cleared existing beers');

    // Insert new beers
    console.log('📝 Seeding 6 Nepali beers...');
    const insertedBeers = await Beer.insertMany(nepaliBeers);
    console.log(`✅ Successfully seeded ${insertedBeers.length} beers`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now start the backend with: npm start\n');

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check MONGODB_URI in backend/.env.local');
    console.error('2. Replace "your_password_here" with your actual password');
    console.error('3. Make sure Network Access includes "Allow Access from Anywhere"');
    console.error('4. Read MONGODB_ATLAS_SETUP.md for detailed instructions');
    process.exit(1);
  }
}

seedDatabase();
