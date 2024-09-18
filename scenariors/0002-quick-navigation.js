// loads two websites one after other
export default async function (browser) {
  await browser.navigateTo("https://ghosterysearch.com/");
  await browser.navigateTo("https://facebook.com/");
  await browser.waitUntil(() => browser.$('.fb_logo'));
}
