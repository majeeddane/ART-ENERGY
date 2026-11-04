import {
  createDefaultSiteData,
  type SiteData,
} from "@content/site";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Merge saved content over the defaults.
 * Objects are merged (so new fields appear automatically), arrays are replaced
 * (so deleting list items in the dashboard works as expected).
 */
function merge(base: unknown, override: unknown): unknown {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = merge(base[key], override[key]);
    }
    return out;
  }

  if (typeof base === "number" && typeof override === "string") {
    const parsed = Number(override);
    return Number.isFinite(parsed) ? parsed : base;
  }

  if (override === undefined || override === null) return base;
  return override;
}

export function normalizeSiteData(input: unknown): SiteData {
  const defaults = createDefaultSiteData();
  if (!isPlainObject(input)) return defaults;
  return merge(defaults, input) as SiteData;
}

export function serialiseSiteData(data: SiteData) {
  return JSON.stringify(data);
}
