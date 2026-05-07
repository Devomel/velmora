export type Locale = "de" | "no" | "ro" | "ru";

// Читається один раз при білді з env змінної
export const LOCALE = (process.env.NEXT_PUBLIC_LOCALE ?? "de") as Locale;

export const LOCALE_META: Record<Locale, { lang: string; dir: "ltr" | "rtl" }> = {
  de: { lang: "de", dir: "ltr" },
  no: { lang: "no", dir: "ltr" },
  ro: { lang: "ro", dir: "ltr" },
  ru: { lang: "ru", dir: "ltr" },
};

type Messages = {
  common: typeof import("../locales/de/common.json");
  home: typeof import("../locales/de/home.json");
  land1: typeof import("../locales/de/land1.json");
  land2: typeof import("../locales/de/land2.json");
};

// Завантажує всі namespace-и для поточної локалі
export async function getMessages(): Promise<Messages> {
  const [common, home, land1, land2] = await Promise.all([
    import(`../locales/${LOCALE}/common.json`),
    import(`../locales/${LOCALE}/home.json`),
    import(`../locales/${LOCALE}/land1.json`),
    import(`../locales/${LOCALE}/land2.json`),
  ]);
  return {
    common: common.default,
    home: home.default,
    land1: land1.default,
    land2: land2.default,
  };
}
