export type Locale = "de" | "no" | "ro" | "ru";

export const LOCALE = (process.env.NEXT_PUBLIC_LOCALE ?? "de") as Locale;

export const LOCALE_META: Record<Locale, { lang: string; dir: "ltr" | "rtl" }> = {
  de: { lang: "de", dir: "ltr" },
  no: { lang: "no", dir: "ltr" },
  ro: { lang: "ro", dir: "ltr" },
  ru: { lang: "ru", dir: "ltr" },
};

type CheckoutT = {
  title: string; backToCart: string; contact: string; firstName: string; lastName: string;
  email: string; phone: string; shipping: string; address: string; city: string;
  postalCode: string; country: string; delivery: string; standardDelivery: string;
  standardDeliveryDesc: string; expressDelivery: string; expressDeliveryDesc: string;
  free: string; payment: string; payCard: string; payPaypal: string; payKlarna: string;
  orderSummary: string; subtotal: string; deliveryFee: string; total: string;
  placeOrder: string; unavailableTitle: string; unavailableText: string;
  unavailableClose: string; contactUs: string; secure: string; countries: string[];
};

type Messages = {
  common: typeof import("../locales/de/common.json") & {
    reviews: { title: string; average: string; basedOn: string; verifiedPurchase: string };
    checkout: CheckoutT;
  };
  home: typeof import("../locales/de/home.json");
  about: typeof import("../locales/de/about.json");
  delivery: typeof import("../locales/de/delivery.json");
  contacts: typeof import("../locales/de/contacts.json");
  land1: typeof import("../locales/de/land1.json");
  land2: typeof import("../locales/de/land2.json");
  mono1: typeof import("../locales/de/mono1.json");
  mono2: typeof import("../locales/de/mono2.json");
};

export type MonoT = Messages["mono1"];

export type HomeT = Messages["home"];
export type CommonT = Messages["common"];
export type AboutT = Messages["about"];
export type DeliveryT = Messages["delivery"];
export type ContactsT = Messages["contacts"];

export async function getMessages(): Promise<Messages> {
  const [common, home, about, delivery, contacts, land1, land2, mono1, mono2] = await Promise.all([
    import(`../locales/${LOCALE}/common.json`),
    import(`../locales/${LOCALE}/home.json`),
    import(`../locales/${LOCALE}/about.json`),
    import(`../locales/${LOCALE}/delivery.json`),
    import(`../locales/${LOCALE}/contacts.json`),
    import(`../locales/${LOCALE}/land1.json`),
    import(`../locales/${LOCALE}/land2.json`),
    import(`../locales/${LOCALE}/mono1.json`),
    import(`../locales/${LOCALE}/mono2.json`),
  ]);
  return {
    common: common.default,
    home: home.default,
    about: about.default,
    delivery: delivery.default,
    contacts: contacts.default,
    land1: land1.default,
    land2: land2.default,
    mono1: mono1.default,
    mono2: mono2.default,
  };
}
