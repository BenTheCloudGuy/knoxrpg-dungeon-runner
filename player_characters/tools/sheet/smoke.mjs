import { chromium } from "playwright";

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  @page { size: 148mm 210mm; margin: 0; }
  html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .page{width:148mm;height:210mm;background:linear-gradient(#f4ecd6,#e7d7ad);box-sizing:border-box;padding:8mm;font-family:Georgia,serif;}
  h1{color:#7a2018;border-bottom:3px solid #7a2018;}
  .box{background:#fff;border:1.5px solid #7a2018;border-radius:3mm;padding:3mm;}
</style></head>
<body><div class="page"><h1>A5 SMOKE TEST</h1><div class="box">Background color + vector text render check.</div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.pdf({ path: "smoke-a5.pdf", width: "148mm", height: "210mm", printBackground: true, pageRanges: "1" });
await browser.close();
console.log("wrote smoke-a5.pdf");
