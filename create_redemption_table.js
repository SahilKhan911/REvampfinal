const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // Check if table already exists
  const { error: checkErr } = await supabase.from('RedemptionRequest').select('id').limit(1);
  
  if (!checkErr) {
    console.log('✅ RedemptionRequest table already exists!');
    process.exit(0);
  }
  
  if (checkErr.code === '42P01') {
    console.log('Table does not exist. Please create it in Supabase SQL editor with:');
    console.log(`
CREATE TABLE "RedemptionRequest" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  amount FLOAT NOT NULL,
  "upiId" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'INITIATED',
  "adminNote" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "processedAt" TIMESTAMPTZ
);
CREATE INDEX idx_redemption_user ON "RedemptionRequest" ("userId");
    `);
  } else {
    console.log('Unexpected error:', checkErr);
  }
})();
