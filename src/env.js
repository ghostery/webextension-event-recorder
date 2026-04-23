export const ONLY = process.argv.includes('--only') ? process.argv[process.argv.findIndex(o => o === '--only') + 1] : false;
export const SCENARIO = process.argv.includes('--scenario') ? process.argv[process.argv.findIndex(o => o === '--scenario') + 1] : false;
export const BROWSER = process.argv.includes('firefox') ? 'firefox' : 'chrome';
export const COMPRESS = process.argv.includes('--compress');

if (ONLY && ONLY.startsWith('--')) {
  throw new Error('--only needs an argument <SCENARIOR_NAME>');
}
