
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { servicesPart1 } from './servicesData1.js';
import { servicesPart2 } from './servicesData2.js';
import { servicesPart3 } from './servicesData3.js';

// Load env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Starting database seed...');

    // Combine all data
    const allServices = [...servicesPart1, ...servicesPart2, ...servicesPart3];
    console.log(`📦 Found ${allServices.length} services to seed.`);

    // Check if columns exist by trying to select one
    const { error: checkError } = await supabase.from('services').select('name_hi').limit(1);
    if (checkError && checkError.message.includes('column "name_hi" does not exist')) {
        console.error('\n❌ ERROR: Database migration not applied yet!');
        console.error('⚠️  Please run e:\\panditji\\database\\migration_bilingual.sql in your Supabase SQL Editor first.\n');
        process.exit(1);
    }

    // 1. Get all existing service names to avoid duplicates
    const { data: existingServices, error: fetchError } = await supabase
        .from('services')
        .select('name');

    if (fetchError) {
        console.error('❌ Error fetching existing services:', fetchError.message);
        process.exit(1);
    }

    // Create a Set of existing names for O(1) lookup
    const existingNames = new Set(existingServices?.map((s: any) => s.name) || []);
    console.log(`ℹ️  Found ${existingNames.size} existing services in DB.`);

    // 2. Filter out services that already exist
    const newServices = allServices.filter(s => !existingNames.has(s.name));

    if (newServices.length === 0) {
        console.log('✅ All services already exist. Skipping seed.');
        return;
    }

    console.log(`🚀 Inserting ${newServices.length} new services...`);

    // 3. Insert new services in batches
    const batchSize = 10;
    for (let i = 0; i < newServices.length; i += batchSize) {
        const batch = newServices.slice(i, i + batchSize);
        // Use standard insert since we filtered duplicates
        const { error } = await supabase.from('services').insert(batch);

        if (error) {
            console.error(`❌ Error seeding batch ${i / batchSize + 1}:`, error.message);
        } else {
            console.log(`✅ Seeded batch ${i / batchSize + 1} (${batch.length} items)`);
        }
    }

    console.log('\n✨ Seeding completed!');
}

seed().catch(err => console.error(err));
