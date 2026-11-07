const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const base = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/";
const items = {
  "light-bulb": "Light bulb/3D/light_bulb_3d.png",
  rocket: "Rocket/3D/rocket_3d.png",
  megaphone: "Megaphone/3D/megaphone_3d.png",
  bullseye: "Bullseye/3D/bullseye_3d.png",
  "movie-camera": "Movie camera/3D/movie_camera_3d.png",
  "clapper-board": "Clapper board/3D/clapper_board_3d.png",
  "video-camera": "Video camera/3D/video_camera_3d.png",
  camera: "Camera/3D/camera_3d.png",
  palette: "Artist palette/3D/artist_palette_3d.png",
  "bar-chart": "Bar chart/3D/bar_chart_3d.png",
  pencil: "Pencil/3D/pencil_3d.png",
  eye: "Eye/3D/eye_3d.png",
  handshake: "Handshake/3D/handshake_3d.png",
  trophy: "Trophy/3D/trophy_3d.png",
  speech: "Speech balloon/3D/speech_balloon_3d.png",
  envelope: "Envelope/3D/envelope_3d.png",
  telephone: "Telephone/3D/telephone_3d.png",
  microphone: "Studio microphone/3D/studio_microphone_3d.png",
  "film-frames": "Film frames/3D/film_frames_3d.png",
  "framed-picture": "Framed picture/3D/framed_picture_3d.png",
  sparkles: "Sparkles/3D/sparkles_3d.png",
  star: "Star/3D/star_3d.png",
  briefcase: "Briefcase/3D/briefcase_3d.png",
  calendar: "Calendar/3D/calendar_3d.png",
  magnifier: "Magnifying glass tilted left/3D/magnifying_glass_tilted_left_3d.png",
  "chart-up": "Chart increasing/3D/chart_increasing_3d.png",
  "money-bag": "Money bag/3D/money_bag_3d.png",
};

const outDir = path.join("public", "images", "3d");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const [name, rel] of Object.entries(items)) {
    const url = base + encodeURI(rel);
    const res = await fetch(url);
    if (!res.ok) {
      console.log("FAIL", name, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const out = path.join(outDir, `${name}.webp`);
    await sharp(buf)
      .resize(256, 256, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 90, alphaQuality: 95 })
      .toFile(out);
    console.log("ok", name, fs.statSync(out).size);
  }
})();
