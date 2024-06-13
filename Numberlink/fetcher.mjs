#!/usr/bin/env zx
const ROOT = 'https://www.janko.at/Raetsel/Arukone-3/';

const rx = /<script\s+id="data"\s+type="application\/x-janko"\s*>(.*\[end\])/is;

await fs.ensureDir('./janko');
for (let i = 1; i <= 280; i++) {
  console.log(i);
  const response = await fetch(
    `https://www.janko.at/Raetsel/Arukone-3/${String(i).padStart(3, 0)}.a.htm`
  );
  if (response.ok) {
    const html = await response.text();
    const data = html.match(rx);
    if (data) {
      await fs.writeFile(`janko/a${String(i).padStart(3, 0)}.txt`, data[1]);
      sleep(1000);
    } else {
      console.error(i, data);
    }
  }
}
