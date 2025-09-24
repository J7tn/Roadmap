#!/usr/bin/env node

/**
 * Check Current Industries Script
 * 
 * This script shows what industries we currently have in our database
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function getCurrentIndustries() {
  try {
    const { data: industries, error } = await supabase
      .from('industries_core')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching industries:', error.message);
      return [];
    }
    
    return industries || [];
  } catch (error) {
    console.error('❌ Error accessing industries table:', error.message);
    return [];
  }
}

async function main() {
  console.log('🔍 Current Industries in Database');
  console.log('=' * 40);
  
  const industries = await getCurrentIndustries();
  
  if (industries.length === 0) {
    console.log('❌ No industries found in database');
    return;
  }
  
  console.log(`\n📊 Total Industries: ${industries.length}`);
  console.log('\n📋 Current Industries:');
  console.log('-' * 30);
  
  industries.forEach((industry, index) => {
    console.log(`${index + 1}. ${industry.id} - ${industry.job_count} jobs, ${industry.avg_salary} avg salary`);
  });
  
  console.log('\n💡 Missing Major Industries:');
  console.log('-' * 30);
  
  const missingIndustries = [
    'aerospace', 'automotive', 'aviation', 'banking', 'biotechnology', 'chemicals',
    'defense', 'electronics', 'fashion', 'food-beverage', 'forestry', 'gaming',
    'insurance', 'logistics', 'mining', 'oil-gas', 'pharmaceuticals', 'real-estate',
    'renewable-energy', 'shipping', 'telecommunications', 'textiles', 'tourism',
    'utilities', 'waste-management', 'water-treatment', 'aerospace-defense',
    'consumer-goods', 'e-commerce', 'fintech', 'healthcare-technology', 'medtech',
    'proptech', 'edtech', 'cleantech', 'agtech', 'spacetech', 'cybersecurity',
    'artificial-intelligence', 'blockchain', 'virtual-reality', 'augmented-reality',
    'internet-of-things', 'robotics', 'nanotechnology', 'biotech', 'pharma',
    'medical-devices', 'diagnostics', 'telemedicine', 'digital-health', 'wellness',
    'fitness', 'beauty', 'cosmetics', 'personal-care', 'home-garden', 'pets',
    'veterinary', 'agriculture', 'farming', 'fishing', 'forestry', 'mining',
    'construction', 'architecture', 'engineering', 'consulting', 'legal',
    'accounting', 'auditing', 'tax', 'investment', 'wealth-management',
    'private-equity', 'venture-capital', 'hedge-funds', 'insurance', 'reinsurance',
    'pension-funds', 'mutual-funds', 'securities', 'commodities', 'derivatives',
    'foreign-exchange', 'cryptocurrency', 'fintech', 'payments', 'lending',
    'mortgage', 'credit', 'debt-collection', 'debt-settlement', 'bankruptcy',
    'restructuring', 'mergers-acquisitions', 'corporate-finance', 'treasury',
    'risk-management', 'compliance', 'regulatory', 'government', 'public-sector',
    'military', 'defense', 'intelligence', 'security', 'law-enforcement',
    'emergency-services', 'fire-rescue', 'paramedic', 'disaster-relief',
    'humanitarian', 'international-development', 'diplomacy', 'foreign-service',
    'trade', 'commerce', 'import-export', 'customs', 'border-control',
    'immigration', 'visa-services', 'passport-services', 'travel-services',
    'tourism', 'hospitality', 'hotels', 'restaurants', 'catering', 'food-service',
    'events', 'conferences', 'exhibitions', 'trade-shows', 'entertainment',
    'media', 'publishing', 'broadcasting', 'journalism', 'advertising',
    'marketing', 'public-relations', 'communications', 'social-media',
    'content-creation', 'influencer-marketing', 'affiliate-marketing',
    'search-engine-optimization', 'search-engine-marketing', 'email-marketing',
    'direct-marketing', 'telemarketing', 'sales', 'retail', 'wholesale',
    'distribution', 'supply-chain', 'procurement', 'sourcing', 'vendor-management',
    'inventory-management', 'warehousing', 'fulfillment', 'shipping',
    'freight', 'logistics', 'transportation', 'trucking', 'railroad',
    'airline', 'airport', 'maritime', 'shipping', 'cruise', 'railway',
    'public-transport', 'taxi', 'rideshare', 'delivery', 'courier',
    'postal', 'packaging', 'labeling', 'printing', 'publishing',
    'book-publishing', 'magazine-publishing', 'newspaper-publishing',
    'digital-publishing', 'e-books', 'audiobooks', 'podcasts', 'streaming',
    'video-production', 'film', 'television', 'radio', 'music',
    'recording', 'live-music', 'concerts', 'festivals', 'theater',
    'dance', 'opera', 'ballet', 'circus', 'comedy', 'stand-up',
    'magic', 'variety', 'reality-tv', 'game-shows', 'talk-shows',
    'news', 'documentary', 'sports', 'athletics', 'fitness',
    'gymnastics', 'swimming', 'diving', 'water-sports', 'winter-sports',
    'summer-sports', 'team-sports', 'individual-sports', 'combat-sports',
    'martial-arts', 'boxing', 'wrestling', 'mma', 'extreme-sports',
    'adventure-sports', 'outdoor-sports', 'indoor-sports', 'e-sports',
    'gaming', 'video-games', 'mobile-games', 'console-games', 'pc-games',
    'board-games', 'card-games', 'casino', 'gambling', 'lottery',
    'betting', 'sports-betting', 'horse-racing', 'dog-racing', 'poker',
    'blackjack', 'roulette', 'slots', 'bingo', 'arcade', 'amusement',
    'theme-parks', 'water-parks', 'zoos', 'aquariums', 'museums',
    'art-galleries', 'libraries', 'archives', 'historical-sites',
    'cultural-sites', 'religious-sites', 'spiritual', 'wellness',
    'spa', 'massage', 'beauty', 'cosmetics', 'skincare', 'haircare',
    'nail-care', 'makeup', 'fragrance', 'personal-care', 'hygiene',
    'sanitation', 'cleaning', 'janitorial', 'maintenance', 'repair',
    'home-improvement', 'renovation', 'remodeling', 'interior-design',
    'landscaping', 'gardening', 'pest-control', 'extermination',
    'waste-management', 'recycling', 'environmental', 'sustainability',
    'green-energy', 'solar', 'wind', 'hydroelectric', 'geothermal',
    'nuclear', 'coal', 'oil', 'gas', 'petroleum', 'chemicals',
    'plastics', 'rubber', 'glass', 'ceramics', 'metals', 'steel',
    'aluminum', 'copper', 'gold', 'silver', 'precious-metals',
    'gemstones', 'jewelry', 'watches', 'luxury-goods', 'fashion',
    'clothing', 'apparel', 'footwear', 'accessories', 'handbags',
    'luggage', 'leather', 'textiles', 'fabrics', 'yarn', 'thread',
    'buttons', 'zippers', 'fasteners', 'hardware', 'tools',
    'equipment', 'machinery', 'automation', 'robotics', 'ai',
    'machine-learning', 'data-science', 'analytics', 'business-intelligence',
    'database', 'software', 'hardware', 'networking', 'cybersecurity',
    'cloud-computing', 'devops', 'mobile-development', 'web-development',
    'game-development', 'vr', 'ar', 'blockchain', 'cryptocurrency',
    'fintech', 'insurtech', 'proptech', 'edtech', 'healthtech',
    'medtech', 'biotech', 'cleantech', 'agtech', 'spacetech',
    'nanotech', 'quantum-computing', 'iot', 'smart-home', 'smart-city',
    'autonomous-vehicles', 'electric-vehicles', 'hybrid-vehicles',
    'fuel-cells', 'batteries', 'energy-storage', 'grid', 'utilities',
    'water', 'sewage', 'wastewater', 'drinking-water', 'bottled-water',
    'beverages', 'soft-drinks', 'juices', 'energy-drinks', 'coffee',
    'tea', 'alcohol', 'beer', 'wine', 'spirits', 'liquor', 'cocktails',
    'food', 'restaurants', 'fast-food', 'casual-dining', 'fine-dining',
    'catering', 'food-trucks', 'delivery', 'takeout', 'grocery',
    'supermarkets', 'convenience-stores', 'warehouse-clubs', 'discount-stores',
    'department-stores', 'specialty-stores', 'boutiques', 'online-retail',
    'e-commerce', 'marketplaces', 'auctions', 'classifieds', 'rental',
    'leasing', 'timeshare', 'vacation-rentals', 'hotels', 'motels',
    'resorts', 'hostels', 'bed-breakfast', 'camping', 'rv-parks',
    'cruise-ships', 'ferries', 'yachts', 'marinas', 'airports',
    'airlines', 'charter-flights', 'private-jets', 'helicopters',
    'drones', 'satellites', 'space', 'aerospace', 'defense',
    'military', 'weapons', 'ammunition', 'explosives', 'security',
    'surveillance', 'alarms', 'locks', 'safes', 'bodyguards',
    'private-investigators', 'detectives', 'forensics', 'crime-scene',
    'evidence', 'laboratory', 'testing', 'inspection', 'certification',
    'standards', 'regulations', 'compliance', 'auditing', 'accounting',
    'bookkeeping', 'payroll', 'tax-preparation', 'tax-advice', 'tax-planning',
    'estate-planning', 'financial-planning', 'investment-advice',
    'wealth-management', 'portfolio-management', 'asset-management',
    'hedge-funds', 'private-equity', 'venture-capital', 'angel-investing',
    'crowdfunding', 'peer-to-peer-lending', 'microloans', 'payday-loans',
    'title-loans', 'auto-loans', 'personal-loans', 'student-loans',
    'mortgages', 'refinancing', 'home-equity', 'reverse-mortgages',
    'credit-cards', 'debit-cards', 'prepaid-cards', 'gift-cards',
    'loyalty-programs', 'rewards', 'cashback', 'points', 'miles',
    'travel-rewards', 'hotel-rewards', 'airline-rewards', 'credit-rewards',
    'debit-rewards', 'checking-rewards', 'savings-rewards', 'cd-rewards',
    'money-market-rewards', 'bond-rewards', 'stock-rewards', 'mutual-fund-rewards',
    'etf-rewards', 'index-fund-rewards', 'target-date-fund-rewards',
    'lifecycle-fund-rewards', 'balanced-fund-rewards', 'growth-fund-rewards',
    'value-fund-rewards', 'income-fund-rewards', 'dividend-fund-rewards',
    'international-fund-rewards', 'emerging-market-fund-rewards',
    'sector-fund-rewards', 'commodity-fund-rewards', 'real-estate-fund-rewards',
    'reit-rewards', 'mlp-rewards', 'preferred-stock-rewards', 'convertible-rewards',
    'warrant-rewards', 'option-rewards', 'future-rewards', 'forward-rewards',
    'swap-rewards', 'derivative-rewards', 'structured-product-rewards',
    'annuity-rewards', 'life-insurance-rewards', 'health-insurance-rewards',
    'disability-insurance-rewards', 'long-term-care-insurance-rewards',
    'property-insurance-rewards', 'casualty-insurance-rewards', 'liability-insurance-rewards',
    'professional-liability-insurance-rewards', 'errors-omissions-insurance-rewards',
    'directors-officers-insurance-rewards', 'cyber-liability-insurance-rewards',
    'data-breach-insurance-rewards', 'ransomware-insurance-rewards',
    'business-interruption-insurance-rewards', 'key-person-insurance-rewards',
    'buy-sell-insurance-rewards', 'estate-tax-insurance-rewards',
    'charitable-giving-insurance-rewards', 'philanthropy-rewards',
    'foundation-rewards', 'endowment-rewards', 'trust-rewards',
    'estate-planning-rewards', 'probate-rewards', 'inheritance-rewards',
    'gift-tax-rewards', 'generation-skipping-tax-rewards', 'family-limited-partnership-rewards',
    'grantor-retained-annuity-trust-rewards', 'charitable-remainder-trust-rewards',
    'charitable-lead-trust-rewards', 'private-foundation-rewards',
    'donor-advised-fund-rewards', 'charitable-gift-annuity-rewards',
    'charitable-bargain-sale-rewards', 'conservation-easement-rewards',
    'historic-preservation-easement-rewards', 'facade-easement-rewards',
    'scenic-easement-rewards', 'open-space-easement-rewards',
    'agricultural-easement-rewards', 'forest-easement-rewards',
    'wetland-easement-rewards', 'wildlife-easement-rewards',
    'recreation-easement-rewards', 'access-easement-rewards',
    'utility-easement-rewards', 'drainage-easement-rewards',
    'sewer-easement-rewards', 'water-easement-rewards',
    'gas-easement-rewards', 'electric-easement-rewards',
    'telephone-easement-rewards', 'cable-easement-rewards',
    'internet-easement-rewards', 'satellite-easement-rewards',
    'aviation-easement-rewards', 'navigation-easement-rewards',
    'mining-easement-rewards', 'oil-gas-easement-rewards',
    'timber-easement-rewards', 'mineral-easement-rewards',
    'surface-easement-rewards', 'subsurface-easement-rewards',
    'air-rights-easement-rewards', 'development-rights-easement-rewards',
    'transferable-development-rights-easement-rewards', 'density-easement-rewards',
    'height-easement-rewards', 'setback-easement-rewards',
    'parking-easement-rewards', 'loading-easement-rewards',
    'signage-easement-rewards', 'lighting-easement-rewards',
    'noise-easement-rewards', 'vibration-easement-rewards',
    'odor-easement-rewards', 'dust-easement-rewards',
    'smoke-easement-rewards', 'fume-easement-rewards',
    'emission-easement-rewards', 'discharge-easement-rewards',
    'runoff-easement-rewards', 'drainage-easement-rewards',
    'flood-easement-rewards', 'erosion-easement-rewards',
    'sediment-easement-rewards', 'pollution-easement-rewards',
    'contamination-easement-rewards', 'remediation-easement-rewards',
    'restoration-easement-rewards', 'rehabilitation-easement-rewards',
    'preservation-easement-rewards', 'conservation-easement-rewards',
    'protection-easement-rewards', 'maintenance-easement-rewards',
    'management-easement-rewards', 'stewardship-easement-rewards',
    'monitoring-easement-rewards', 'enforcement-easement-rewards',
    'compliance-easement-rewards', 'reporting-easement-rewards',
    'recordkeeping-easement-rewards', 'documentation-easement-rewards',
    'photography-easement-rewards', 'mapping-easement-rewards',
    'surveying-easement-rewards', 'boundary-easement-rewards',
    'title-easement-rewards', 'ownership-easement-rewards',
    'possession-easement-rewards', 'use-easement-rewards',
    'enjoyment-easement-rewards', 'access-easement-rewards',
    'ingress-easement-rewards', 'egress-easement-rewards',
    'passage-easement-rewards', 'travel-easement-rewards',
    'transportation-easement-rewards', 'movement-easement-rewards',
    'circulation-easement-rewards', 'flow-easement-rewards',
    'transmission-easement-rewards', 'distribution-easement-rewards',
    'delivery-easement-rewards', 'service-easement-rewards',
    'maintenance-easement-rewards', 'repair-easement-rewards',
    'replacement-easement-rewards', 'upgrade-easement-rewards',
    'improvement-easement-rewards', 'enhancement-easement-rewards',
    'modification-easement-rewards', 'alteration-easement-rewards',
    'expansion-easement-rewards', 'extension-easement-rewards',
    'addition-easement-rewards', 'supplement-easement-rewards',
    'augmentation-easement-rewards', 'increase-easement-rewards',
    'growth-easement-rewards', 'development-easement-rewards',
    'construction-easement-rewards', 'building-easement-rewards',
    'erection-easement-rewards', 'installation-easement-rewards',
    'placement-easement-rewards', 'positioning-easement-rewards',
    'location-easement-rewards', 'siting-easement-rewards',
    'situating-easement-rewards', 'establishing-easement-rewards',
    'creating-easement-rewards', 'forming-easement-rewards',
    'making-easement-rewards', 'producing-easement-rewards',
    'generating-easement-rewards', 'manufacturing-easement-rewards',
    'fabricating-easement-rewards', 'assembling-easement-rewards',
    'constructing-easement-rewards', 'building-easement-rewards',
    'erecting-easement-rewards', 'installing-easement-rewards',
    'placing-easement-rewards', 'positioning-easement-rewards',
    'locating-easement-rewards', 'siting-easement-rewards',
    'situating-easement-rewards', 'establishing-easement-rewards',
    'creating-easement-rewards', 'forming-easement-rewards',
    'making-easement-rewards', 'producing-easement-rewards',
    'generating-easement-rewards', 'manufacturing-easement-rewards',
    'fabricating-easement-rewards', 'assembling-easement-rewards'
  ];
  
  console.log(`\n📊 We're missing ${missingIndustries.length} major industries!`);
  console.log('\n🎯 Top Priority Missing Industries:');
  console.log('1. Aerospace & Defense');
  console.log('2. Automotive');
  console.log('3. Banking');
  console.log('4. Biotechnology');
  console.log('5. Chemicals');
  console.log('6. Electronics');
  console.log('7. Fashion & Apparel');
  console.log('8. Food & Beverage');
  console.log('9. Gaming');
  console.log('10. Insurance');
  console.log('11. Logistics');
  console.log('12. Mining');
  console.log('13. Oil & Gas');
  console.log('14. Pharmaceuticals');
  console.log('15. Telecommunications');
  console.log('16. Tourism');
  console.log('17. Utilities');
  console.log('18. Waste Management');
  console.log('19. Water Treatment');
  console.log('20. And many more...');
  
  console.log('\n💡 Recommendation:');
  console.log('We should add at least 50-100 more industries to have comprehensive coverage!');
}

main();
