const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const out = path.join("public", "images", "photos");
fs.mkdirSync(out, { recursive: true });

const jobs = [
  { name: "campaign", id: 3379942, w: 1400, h: 1700, fit: "cover" },
  { name: "work-1", id: 590016, w: 1200, h: 900, fit: "cover" },
  { name: "work-2", id: 3861969, w: 1200, h: 900, fit: "cover" },
  { name: "work-3", id: 66134, w: 1200, h: 900, fit: "cover" },
  { name: "work-4", id: 6476588, w: 1200, h: 900, fit: "cover" },
  { name: "work-5", id: 1763075, w: 1200, h: 900, fit: "cover" },
  { name: "work-6", id: 1117132, w: 1200, h: 900, fit: "cover" },
  { name: "team-1", id: 220453, w: 800, h: 960, fit: "cover" },
  { name: "team-2", id: 774909, w: 800, h: 960, fit: "cover" },
  { name: "team-3", id: 614810, w: 800, h: 960, fit: "cover" },
  { name: "team-4", id: 733872, w: 800, h: 960, fit: "cover" },
  { name: "journal-1", id: 3184465, w: 1000, h: 720, fit: "cover" },
  { name: "journal-2", id: 3184360, w: 1000, h: 720, fit: "cover" },
  { name: "journal-3", id: 3184339, w: 1000, h: 720, fit: "cover" },
  { name: "journal-4", id: 3184291, w: 1000, h: 720, fit: "cover" },
];

(async () => {
  for (const job of jobs) {
    const url =
      `https://images.pexels.com/photos/${job.id}/pexels-photo-${job.id}.jpeg` +
      `?auto=compress&cs=tinysrgb&w=1600`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log("FAIL", job.name, job.id, res.status);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const file = path.join(out, `${job.name}.webp`);
      await sharp(buf)
        .resize(job.w, job.h, { fit: job.fit, position: "attention" })
        .webp({ quality: 84 })
        .toFile(file);
      console.log("ok", job.name, fs.statSync(file).size);
    } catch (e) {
      console.log("ERR", job.name, e.message);
    }
  }
})();
