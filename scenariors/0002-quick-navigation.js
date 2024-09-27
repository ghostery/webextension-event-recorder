// loads two websites one after other
export default async function (browser) {
  const page = await browser.newPage();
  await page.goto("https://ghosterysearch.com/");
  await page.goto("https://facebook.com/");
  await page.waitForSelector('.fb_logo');
}
