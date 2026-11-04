import type { Locale } from "@content/model";

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function money(value: number, locale: Locale) {
  return locale === "ar"
    ? `${formatNumber(value, locale)} ريال`
    : `${formatNumber(value, locale)} SAR`;
}
