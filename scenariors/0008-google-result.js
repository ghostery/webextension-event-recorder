// searches google.com for "ghostery" and clicks on first results
export default async function (browser) {
  await browser.navigateTo("https://www.google.com/search?q=ghostery");
  await (await browser.$('#L2AGLb')).click(); // accept consent
  const result = await browser.$("[jsname=UWckNb]"); // get first result
  await result.click();
  await browser.waitUntil(async function () {
    return await browser.execute(() => window.location.href === "https://www.ghostery.com/");
  });
}
