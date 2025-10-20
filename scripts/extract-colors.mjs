import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGO_PATH = path.join(__dirname, "..", "public", "logo.png");

function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((value) => {
        const clamped = Math.max(0, Math.min(255, Math.round(value)));
        return clamped.toString(16).padStart(2, "0");
      })
      .join("")
  ).toUpperCase();
}

function mix(color, target, amount) {
  return color.map(
    (channel, index) => channel + (target[index] - channel) * amount,
  );
}

function lighten(color, amount = 0.2) {
  return mix(color, [255, 255, 255], amount);
}

function darken(color, amount = 0.2) {
  return mix(color, [0, 0, 0], amount);
}

function distanceSquared(a, b) {
  return (
    (a[0] - b[0]) * (a[0] - b[0]) +
    (a[1] - b[1]) * (a[1] - b[1]) +
    (a[2] - b[2]) * (a[2] - b[2])
  );
}

function pickInitialCentroids(pixels, k) {
  const centroids = [];
  const step = Math.max(1, Math.floor(pixels.length / k));

  for (let i = 0; i < k; i++) {
    const index = Math.min(pixels.length - 1, i * step);
    centroids.push([...pixels[index]]);
  }

  return centroids;
}

function kMeans(pixels, k = 5, iterations = 10) {
  let centroids = pickInitialCentroids(pixels, k);
  let assignments = new Array(pixels.length).fill(0);

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < pixels.length; i++) {
      let bestIndex = 0;
      let bestDistance = Infinity;
      for (let j = 0; j < centroids.length; j++) {
        const dist = distanceSquared(pixels[i], centroids[j]);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestIndex = j;
        }
      }
      assignments[i] = bestIndex;
    }

    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = Array.from({ length: k }, () => 0);

    for (let i = 0; i < pixels.length; i++) {
      const cluster = assignments[i];
      const pixel = pixels[i];
      sums[cluster][0] += pixel[0];
      sums[cluster][1] += pixel[1];
      sums[cluster][2] += pixel[2];
      counts[cluster] += 1;
    }

    for (let j = 0; j < k; j++) {
      if (counts[j] === 0) continue;
      centroids[j] = [
        sums[j][0] / counts[j],
        sums[j][1] / counts[j],
        sums[j][2] / counts[j],
      ];
    }
  }

  return centroids
    .map((centroid, index) => ({
      color: centroid,
      count: assignments.filter((assignment) => assignment === index).length,
    }))
    .filter((cluster) => cluster.count > 0)
    .sort((a, b) => b.count - a.count);
}

function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}

async function extractColors() {
  if (!fs.existsSync(LOGO_PATH)) {
    throw new Error(`Logo introuvable à l'emplacement: ${LOGO_PATH}`);
  }

  const { data, info } = await sharp(LOGO_PATH)
    .resize(300, 300, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = [];
  for (let i = 0; i < data.length; i += info.channels) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  const clusters = kMeans(pixels, 5, 15);

  if (clusters.length < 3) {
    throw new Error(
      `Palette insuffisante (${clusters.length} couleurs trouvées). Vérifiez le logo.`,
    );
  }

  const enriched = clusters.map((cluster) => {
    const hsl = rgbToHsl(cluster.color);
    return {
      ...cluster,
      hex: rgbToHex(cluster.color),
      hsl,
      saturation: hsl[1],
      lightness: hsl[2],
    };
  });

  const vivid = enriched.filter(
    (c) => c.saturation >= 0.15 && c.lightness >= 0.12 && c.lightness <= 0.85,
  );

  const withScores = vivid.map((color) => {
    const saturationScore = color.saturation;
    const balanceScore = Math.min(color.lightness, 1 - color.lightness);
    return {
      ...color,
      primaryScore: saturationScore * 0.7 + balanceScore * 0.3,
      secondaryScore: color.lightness,
    };
  });

  const primary =
    withScores.sort((a, b) => b.primaryScore - a.primaryScore)[0] ||
    enriched[0];

  const secondary =
    withScores
      .filter((c) => c !== primary)
      .sort((a, b) => {
        if (b.secondaryScore !== a.secondaryScore) {
          return b.secondaryScore - a.secondaryScore;
        }
        return b.saturation - a.saturation;
      })[0] || enriched.find((c) => c !== primary) || enriched[0];

  const accent =
    enriched
      .filter((c) => c !== primary && c !== secondary)
      .sort((a, b) => {
        if (b.lightness !== a.lightness) return b.lightness - a.lightness;
        return b.saturation - a.saturation;
      })[0] || secondary;

  const usedHex = new Set([primary.hex, secondary.hex, accent.hex]);

  const remainingNeutrals = enriched
    .filter((c) => c !== primary && c !== secondary && c !== accent)
    .sort((a, b) => a.lightness - b.lightness)
    .map((c) => c.hex)
    .filter((hex) => !usedHex.has(hex));

  const palette = {
    primary: primary.hex,
    primaryLight: rgbToHex(lighten(primary.color)),
    primaryDark: rgbToHex(darken(primary.color)),
    secondary: secondary.hex,
    secondaryLight: rgbToHex(lighten(secondary.color)),
    secondaryDark: rgbToHex(darken(secondary.color)),
    accent: accent.hex,
    accentLight: rgbToHex(lighten(accent.color)),
    accentDark: rgbToHex(darken(accent.color)),
    neutrals: remainingNeutrals,
  };

  console.log("Palette extraite :");
  console.table(palette);

  console.log("\nDistribution des couleurs (approximative) :");
  const total = pixels.length;
  clusters.slice(0, 5).forEach((cluster, index) => {
    const percentage = ((cluster.count / total) * 100).toFixed(2);
    console.log(
      `#${index + 1}`,
      rgbToHex(cluster.color),
      `${cluster.count} px (${percentage}%)`,
    );
  });

  return palette;
}

extractColors().catch((error) => {
  console.error("Erreur lors de l'extraction des couleurs :", error);
  process.exit(1);
});
