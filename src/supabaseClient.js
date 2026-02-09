import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ytbvtbhjqkwayblcttzu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QlVrBvDPwDZs2cfkb0qSuQ_LtBhjluU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
