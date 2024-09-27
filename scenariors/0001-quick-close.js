// opens a page a closes it after the load
export default async function (browser) {
  const page = await browser.newPage();
  await page.goto("https://ghosterysearch.com/");
}
