// opens a page a closes it after the load
export default async function (browser) {
  await browser.navigateTo("https://www.theguardian.com/football/2024/sep/30/bryan-zaragoza-osasuna-barcelona-la-liga");
}
