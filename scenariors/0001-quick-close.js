// opens a page a closes it after the load
export default async function (browser) {
  await browser.navigateTo("https://ghosterysearch.com/");
}
