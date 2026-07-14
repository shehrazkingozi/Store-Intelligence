const gplay = require('google-play-scraper').default;
const { createClient } = require('@supabase/supabase-js');

// Verify environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define categories to track
const CATEGORIES = [
  gplay.category.GAME_ACTION,
  gplay.category.GAME_CASUAL,
  gplay.category.GAME_PUZZLE,
  gplay.category.GAME_RACING,
  gplay.category.GAME_SIMULATION
];

const NUM_APPS_PER_CATEGORY = 50;

async function trackApps() {
  console.log(`Starting daily scrape for ${CATEGORIES.length} categories...`);
  
  for (const category of CATEGORIES) {
    console.log(`Fetching top ${NUM_APPS_PER_CATEGORY} for ${category}...`);
    try {
      const topApps = await gplay.list({
        category: category,
        collection: gplay.collection.TOP_FREE,
        num: NUM_APPS_PER_CATEGORY
      });

      console.log(`Found ${topApps.length} apps in ${category}. Fetching full details...`);

      for (let i = 0; i < topApps.length; i++) {
        const appInfo = topApps[i];
        try {
          // Add a small delay to avoid rate limiting
          await new Promise(r => setTimeout(r, 1000));
          
          const fullData = await gplay.app({ appId: appInfo.appId });
          
          const record = {
            app_id: fullData.appId,
            title: fullData.title,
            installs: fullData.installs,
            max_installs: fullData.maxInstalls,
            score: fullData.score,
            ratings: fullData.ratings,
            reviews: fullData.reviews,
            category: category,
            category_rank: i + 1,
            // Date is automatically set by the database
          };

          // Save to Supabase
          const { error } = await supabase.from('daily_stats').insert(record);
          if (error) {
            console.error(`Error saving ${fullData.appId}:`, error.message);
          } else {
            console.log(`Saved: #${i+1} ${fullData.appId}`);
          }
        } catch (err) {
          console.error(`Failed to fetch full details for ${appInfo.appId}:`, err.message);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch list for category ${category}:`, err.message);
    }
  }
  
  console.log("Daily scrape completed!");
}

trackApps();
