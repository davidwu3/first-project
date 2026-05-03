/**
 * Convert.com A/B Test Setup Script
 * Requires Node.js v18+ (uses built-in fetch) or v14+ (uses https module fallback).
 *
 * Before running:
 *   1. Fill in the CONFIG block below
 *   2. node setup-convert.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// ─── CONFIG — fill these in before running ───────────────────────────────────
const CONFIG = {
  API_KEY:           'YOUR_CONVERT_API_KEY',       // Account → API Keys
  PROJECT_ID:        'YOUR_PROJECT_ID',             // Projects → your project ID
  TARGET_URL:        'https://example.com/your-page', // Page to run the test on
  TARGET_SELECTOR:   '#some-element',              // CSS selector to insert after
  EXPERIMENT_NAME:   'FAQ Carousel — BFRBs',
  TRAFFIC_SPLIT:     50,                           // % of visitors who see the variant
};
// ─────────────────────────────────────────────────────────────────────────────

const CAROUSEL_FILE = path.join(__dirname, 'faq-carousel.js');
const BASE_URL = 'api.convert.com';
const BASE_PATH = `/api/v3/projects/${CONFIG.PROJECT_ID}`;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: BASE_URL,
      path,
      method,
      headers: {
        'Authorization': 'Bearer ' + CONFIG.API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch (e) { resolve(data); }
        } else {
          reject(new Error(`HTTP ${res.statusCode} on ${method} ${path}\n${data}`));
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  // Validate config
  const missing = Object.entries(CONFIG)
    .filter(([k, v]) => typeof v === 'string' && v.startsWith('YOUR_'))
    .map(([k]) => k);
  if (missing.length) {
    console.error('ERROR: Fill in these CONFIG values before running:\n  ' + missing.join('\n  '));
    process.exit(1);
  }

  if (!fs.existsSync(CAROUSEL_FILE)) {
    console.error('ERROR: faq-carousel.js not found at ' + CAROUSEL_FILE);
    process.exit(1);
  }

  let carouselJS = fs.readFileSync(CAROUSEL_FILE, 'utf8');
  carouselJS = carouselJS.replace(
    "'CONVERT_TARGET_SELECTOR_PLACEHOLDER'",
    JSON.stringify(CONFIG.TARGET_SELECTOR)
  );

  console.log('\n[1/5] Creating experiment...');
  const experiment = await request('POST', `${BASE_PATH}/experiments`, {
    name: CONFIG.EXPERIMENT_NAME,
    type: 'a/b',
    status: 'draft',
    url: CONFIG.TARGET_URL,
    variations: [
      { name: 'Control', percentage: 100 - CONFIG.TRAFFIC_SPLIT },
      { name: 'FAQ Carousel', percentage: CONFIG.TRAFFIC_SPLIT }
    ]
  });

  const experimentId = experiment.id || experiment.data?.id;
  if (!experimentId) throw new Error('Could not read experiment ID from response:\n' + JSON.stringify(experiment, null, 2));
  console.log('    Experiment created. ID:', experimentId);

  console.log('\n[2/5] Fetching variation IDs...');
  const expDetails = await request('GET', `${BASE_PATH}/experiments/${experimentId}`, null);
  const variations = expDetails.variations || expDetails.data?.variations || [];
  const variant = variations.find(v => v.name === 'FAQ Carousel' || v.percentage === CONFIG.TRAFFIC_SPLIT);
  if (!variant) throw new Error('Could not find FAQ Carousel variation in:\n' + JSON.stringify(variations, null, 2));
  const variationId = variant.id;
  console.log('    Variation ID:', variationId);

  console.log('\n[3/5] Uploading carousel JS to variation...');
  await request('PUT', `${BASE_PATH}/experiments/${experimentId}/variations/${variationId}`, {
    js_code: carouselJS
  });
  console.log('    Carousel JS uploaded.');

  console.log('\n[4/5] Creating click goal...');
  const goal = await request('POST', `${BASE_PATH}/goals`, {
    name: 'FAQ Carousel Interaction',
    type: 'click',
    selector: '#faq-carousel-module button, #faq-carousel-module .fcm-dot'
  });

  const goalId = goal.id || goal.data?.id;
  if (!goalId) throw new Error('Could not read goal ID from response:\n' + JSON.stringify(goal, null, 2));
  console.log('    Goal created. ID:', goalId);

  console.log('\n[5/5] Attaching goal to experiment and patching goal ID into variation JS...');
  const patchedJS = carouselJS.replace("'CONVERT_GOAL_ID_PLACEHOLDER'", JSON.stringify(String(goalId)));

  await request('PUT', `${BASE_PATH}/experiments/${experimentId}`, {
    goals: [goalId]
  });

  await request('PUT', `${BASE_PATH}/experiments/${experimentId}/variations/${variationId}`, {
    js_code: patchedJS
  });

  console.log('\n✓ Done!\n');
  console.log('  Experiment ID :', experimentId);
  console.log('  Goal ID       :', goalId);
  console.log('  Dashboard     : https://app.convert.com/experiments/' + experimentId);
  console.log('\nNext steps:');
  console.log('  1. Preview the variation at: ' + CONFIG.TARGET_URL + '?convert_action=preview');
  console.log('  2. Verify the carousel appears and clicks register in Convert\'s debug panel');
  console.log('  3. Set the experiment to Active in the Convert dashboard when ready to launch');
}

main().catch(err => {
  console.error('\nERROR:', err.message);
  process.exit(1);
});
