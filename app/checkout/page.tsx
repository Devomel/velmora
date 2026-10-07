'use client';

import { useState, useEffect, useRef, type InputHTMLAttributes, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { IS_RO } from '@/lib/i18n';
import { pushEvent, pushEventOnce, pushConversionEvent } from '@/lib/analytics';
import { sendOrder } from '@/lib/orders';
import { smallImage } from '@/lib/image-variants';

type CheckoutT = {
  title: string;
  backToCart: string;
  contact: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  optional: string;
  shipping: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  delivery: string;
  standardDelivery: string;
  standardDeliveryDesc: string;
  expressDelivery: string;
  expressDeliveryDesc: string;
  deliveryBy?: string;
  change: string;
  free: string;
  payment: string;
  payCard: string;
  payPaypal: string;
  payKlarna: string;
  payGooglePay: string;
  payApplePay: string;
  paySepa?: string;
  payOr: string;
  orderSummary: string;
  showSummary: string;
  hideSummary: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  placeOrder: string;
  errRequired: string;
  errEmail: string;
  errPhone: string;
  errPostal: string;
  errSummary: string;
  trustShipping: string;
  trustRefund: string;
  infoLink: string;
  plzSource?: string;
  unavailableTitle: string;
  unavailableText: string;
  unavailableClose: string;
  contactUs: string;
  secure: string;
  countries: string[];
};

// Inline translations keyed by locale env var
const TRANSLATIONS: Record<string, CheckoutT> = {
  de: {
    title: 'Kasse',
    backToCart: 'Zurück zum Warenkorb',
    contact: 'Kontaktdaten',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail-Adresse',
    phone: 'Telefonnummer',
    optional: 'optional',
    shipping: 'Lieferadresse',
    address: 'Straße und Hausnummer',
    city: 'Stadt',
    postalCode: 'Postleitzahl',
    country: 'Land',
    delivery: 'Versandart',
    standardDelivery: 'Standardversand',
    standardDeliveryDesc: '3–5 Werktage',
    expressDelivery: 'Expressversand',
    expressDeliveryDesc: '1–2 Werktage',
    deliveryBy: 'Lieferung bis',
    change: 'ändern',
    free: 'Kostenlos',
    payment: 'Zahlungsmethode',
    payCard: 'Kreditkarte',
    payPaypal: 'PayPal',
    payKlarna: 'Klarna',
    payGooglePay: 'Google Pay',
    payApplePay: 'Apple Pay',
    paySepa: 'SEPA-Lastschrift',
    payOr: 'oder',
    orderSummary: 'Bestellübersicht',
    showSummary: 'Bestellübersicht anzeigen',
    hideSummary: 'Bestellübersicht ausblenden',
    subtotal: 'Zwischensumme',
    deliveryFee: 'Versandkosten',
    total: 'Gesamt',
    placeOrder: 'Zahlungspflichtig bestellen',
    errRequired: 'Bitte füllen Sie dieses Feld aus.',
    errEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    errPhone: 'Bitte geben Sie eine gültige Telefonnummer ein.',
    errPostal: 'Bitte geben Sie eine gültige Postleitzahl ein.',
    errSummary: 'Bitte prüfen Sie die markierten Felder.',
    trustShipping: 'Kostenloser Versand ab {amount}',
    trustRefund: 'Rückerstattung innerhalb von 3 Werktagen nach Wareneingang',
    infoLink: 'Versand, Zahlung & Rückgabe',
    plzSource: 'PLZ-Daten',
    unavailableTitle: 'Zahlung vorübergehend nicht möglich',
    unavailableText: 'Wir nehmen derzeit keine Online-Zahlungen entgegen. Bitte kontaktieren Sie uns, um Ihre Bestellung abzuschließen.',
    unavailableClose: 'Schließen',
    contactUs: 'Kontakt aufnehmen',
    secure: 'Sichere Zahlung',
    countries: ['Deutschland', 'Österreich', 'Schweiz', 'Belgien', 'Niederlande', 'Luxemburg'],
  },
  no: {
    title: 'Kasse',
    backToCart: 'Tilbake til handlekurven',
    contact: 'Kontaktinformasjon',
    firstName: 'Fornavn',
    lastName: 'Etternavn',
    email: 'E-postadresse',
    phone: 'Telefonnummer',
    optional: 'valgfritt',
    shipping: 'Leveringsadresse',
    address: 'Gate og husnummer',
    city: 'By',
    postalCode: 'Postnummer',
    country: 'Land',
    delivery: 'Leveringsmetode',
    standardDelivery: 'Standardlevering',
    standardDeliveryDesc: '3–5 virkedager',
    expressDelivery: 'Expresslevering',
    expressDeliveryDesc: '1–2 virkedager',
    change: 'endre',
    free: 'Gratis',
    payment: 'Betalingsmetode',
    payCard: 'Kredittkort',
    payPaypal: 'PayPal',
    payKlarna: 'Klarna',
    payGooglePay: 'Google Pay',
    payApplePay: 'Apple Pay',
    payOr: 'eller',
    orderSummary: 'Ordresammendrag',
    showSummary: 'Vis ordresammendrag',
    hideSummary: 'Skjul ordresammendrag',
    subtotal: 'Delsum',
    deliveryFee: 'Fraktkostnad',
    total: 'Totalt',
    placeOrder: 'Legg inn bestilling',
    errRequired: 'Vennligst fyll ut dette feltet.',
    errEmail: 'Vennligst oppgi en gyldig e-postadresse.',
    errPhone: 'Vennligst oppgi et gyldig telefonnummer.',
    errPostal: 'Vennligst oppgi et gyldig postnummer.',
    errSummary: 'Vennligst sjekk de markerte feltene.',
    trustShipping: 'Gratis frakt fra {amount}',
    trustRefund: 'Refusjon innen 3 virkedager etter at vi har mottatt varene',
    infoLink: 'Frakt, betaling og retur',
    unavailableTitle: 'Betaling midlertidig utilgjengelig',
    unavailableText: 'Vi tar for øyeblikket ikke imot nettbetalinger. Vennligst kontakt oss for å fullføre bestillingen.',
    unavailableClose: 'Lukk',
    contactUs: 'Kontakt oss',
    secure: 'Sikker betaling',
    countries: ['Norge', 'Sverige', 'Danmark', 'Finland', 'Nederland', 'Belgia'],
  },
  ro: {
    title: 'Finalizare comandă',
    backToCart: 'Înapoi la coș',
    contact: 'Date de contact',
    firstName: 'Prenume',
    lastName: 'Nume de familie',
    email: 'Adresă de email',
    phone: 'Număr de telefon',
    optional: 'opțional',
    shipping: 'Adresă de livrare',
    address: 'Stradă și număr',
    city: 'Oraș',
    postalCode: 'Cod poștal',
    country: 'Țară',
    delivery: 'Metodă de livrare',
    standardDelivery: 'Livrare standard',
    standardDeliveryDesc: '3–5 zile lucrătoare',
    expressDelivery: 'Livrare express',
    expressDeliveryDesc: '1–2 zile lucrătoare',
    change: 'modifică',
    free: 'Gratuit',
    payment: 'Metodă de plată',
    payCard: 'Card de credit',
    payPaypal: 'PayPal',
    payKlarna: 'Klarna',
    payGooglePay: 'Google Pay',
    payApplePay: 'Apple Pay',
    payOr: 'sau',
    orderSummary: 'Rezumat comandă',
    showSummary: 'Afișează rezumatul comenzii',
    hideSummary: 'Ascunde rezumatul comenzii',
    subtotal: 'Subtotal',
    deliveryFee: 'Cost livrare',
    total: 'Total',
    placeOrder: 'Plasează comanda',
    errRequired: 'Vă rugăm să completați acest câmp.',
    errEmail: 'Vă rugăm să introduceți o adresă de email validă.',
    errPhone: 'Vă rugăm să introduceți un număr de telefon valid.',
    errPostal: 'Vă rugăm să introduceți un cod poștal valid.',
    errSummary: 'Vă rugăm să verificați câmpurile marcate.',
    trustShipping: 'Transport gratuit de la {amount}',
    trustRefund: 'Rambursare în 3 zile lucrătoare de la primirea produselor returnate',
    infoLink: 'Livrare, plată și retur',
    unavailableTitle: 'Plata temporar indisponibilă',
    unavailableText: 'În prezent nu acceptăm plăți online. Vă rugăm să ne contactați pentru a finaliza comanda.',
    unavailableClose: 'Închide',
    contactUs: 'Contactați-ne',
    secure: 'Plată securizată',
    countries: ['România', 'Germania', 'Austria', 'Franța', 'Italia', 'Spania'],
  },
  ru: {
    title: 'Оформление заказа',
    backToCart: 'Вернуться в корзину',
    contact: 'Контактные данные',
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'Электронная почта',
    phone: 'Номер телефона',
    optional: 'необязательно',
    shipping: 'Адрес доставки',
    address: 'Улица и номер дома',
    city: 'Город',
    postalCode: 'Почтовый индекс',
    country: 'Страна',
    delivery: 'Способ доставки',
    standardDelivery: 'Стандартная доставка',
    standardDeliveryDesc: '3–5 рабочих дней',
    expressDelivery: 'Экспресс-доставка',
    expressDeliveryDesc: '1–2 рабочих дня',
    deliveryBy: 'Доставка до',
    change: 'изменить',
    free: 'Бесплатно',
    payment: 'Способ оплаты',
    payCard: 'Банковская карта',
    payPaypal: 'PayPal',
    payKlarna: 'Klarna',
    payGooglePay: 'Google Pay',
    payApplePay: 'Apple Pay',
    paySepa: 'SEPA-списание',
    payOr: 'или',
    orderSummary: 'Состав заказа',
    showSummary: 'Показать состав заказа',
    hideSummary: 'Скрыть состав заказа',
    subtotal: 'Сумма товаров',
    deliveryFee: 'Доставка',
    total: 'Итого',
    placeOrder: 'Заказать с обязательством оплаты',
    errRequired: 'Пожалуйста, заполните это поле.',
    errEmail: 'Введите корректный адрес электронной почты.',
    errPhone: 'Введите корректный номер телефона.',
    errPostal: 'Введите корректный почтовый индекс.',
    errSummary: 'Проверьте отмеченные поля.',
    trustShipping: 'Бесплатная доставка от {amount}',
    trustRefund: 'Возврат денег в течение 3 рабочих дней после получения товара',
    infoLink: 'Доставка, оплата и возврат',
    plzSource: 'Почтовые индексы',
    unavailableTitle: 'Оплата временно недоступна',
    unavailableText: 'В данный момент мы не принимаем онлайн-платежи. Пожалуйста, свяжитесь с нами для завершения заказа.',
    unavailableClose: 'Закрыть',
    contactUs: 'Связаться с нами',
    secure: 'Безопасная оплата',
    countries: ['Германия', 'Австрия', 'Швейцария', 'Нидерланды', 'Бельгия', 'Люксембург'],
  },
};

const FREE_DELIVERY_THRESHOLD = 50;
const DEFAULT_DELIVERY_PRICE = { standard: 4.99, express: 9.99 };
// DE prices rounded to the ,90 pattern customers expect from German retailers
const DELIVERY_PRICES: Record<string, { standard: number; express: number }> = {
  de: { standard: 4.9, express: 9.9 },
  ru: { standard: 4.9, express: 9.9 },
};

// German-market storefronts: de, plus ru — the Russian-language shop for the
// same market (eu.cookware-market.com). They share the concrete delivery date,
// SEPA and "4,90 €" price formatting; only the date language differs.
const DE_MARKET_DATE_LOCALES: Record<string, string> = {
  de: 'de-DE',
  ru: 'ru-RU',
};

type Field = 'firstName' | 'lastName' | 'email' | 'phone' | 'street' | 'postalCode' | 'city';
type PaymentMethod = 'card' | 'paypal' | 'klarna' | 'googlepay' | 'applepay' | 'sepa';

// Page order: validation scrolls to the first invalid field in this order
const FIELD_ORDER: Field[] = ['firstName', 'lastName', 'email', 'phone', 'street', 'postalCode', 'city'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_RE = /^(?=.*\d)[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;

// public/plz-de.json (built by scripts/build-plz.mjs): one town, or several to pick from
type PlzMap = Record<string, string | string[]>;

function addBusinessDays(from: Date, days: number): Date {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date;
}

function formatDeliveryDate(date: Date, dateLocale: string): string {
  return new Intl.DateTimeFormat(dateLocale, { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
}

// 16px on phones so iOS Safari doesn't zoom into the field on focus
const inputClass =
  'w-full border px-3 py-2.5 text-base sm:text-sm outline-none transition-colors placeholder:text-[#C4B8AE]';
const inputOkClass = 'border-[#E8DDD4] focus:border-[#C4704F] bg-white';
const inputErrorClass = 'border-[#D93025] focus:border-[#D93025] bg-[#FFF8F7]';
const labelClass = 'block text-xs font-medium text-[#6B5B4E] uppercase tracking-wider mb-1';

type CheckoutFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: ReactNode;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
};

function CheckoutField({ id, label, error, inputRef, ...props }: CheckoutFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        {...props}
        id={id}
        ref={inputRef}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${error ? inputErrorClass : inputOkClass}`}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-[#C5221F]">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total } = useCart();
  const locale = (process.env.NEXT_PUBLIC_LOCALE ?? 'de') as string;
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.de;
  const deliveryPrices = DELIVERY_PRICES[locale] ?? DEFAULT_DELIVERY_PRICE;
  const deMarketDateLocale = DE_MARKET_DATE_LOCALES[locale];
  const isDeMarket = deMarketDateLocale !== undefined;

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const postalRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const plzMapRef = useRef<Promise<PlzMap | null> | null>(null);
  // Only overwrite the city we filled in ourselves, never one the customer typed
  const cityAutoFilledRef = useRef(false);

  const fieldRefs: Record<Field, typeof firstNameRef> = {
    firstName: firstNameRef,
    lastName: lastNameRef,
    email: emailRef,
    phone: phoneRef,
    street: streetRef,
    postalCode: postalRef,
    city: cityRef,
  };

  useEffect(() => {
    pushEventOnce('begin_checkout', { currency: 'EUR', value: total, items: items.map(i => ({ item_id: i.articleKey, item_name: i.name, price: i.price, quantity: i.qty })) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryMethod === 'express' ? deliveryPrices.express : deliveryPrices.standard;
  const fmt = (n: number) => IS_RO ? `${n.toFixed(2)} lei` : isDeMarket ? `${n.toFixed(2).replace('.', ',')} €` : `€${n.toFixed(2)}`;
  const fmtWhole = (n: number) => IS_RO ? `${n} lei` : isDeMarket ? `${n} €` : `€${n}`;
  const orderTotal = total + deliveryFee;
  const hasErrors = Object.keys(errors).length > 0;

  // Upper bound of the "Werktage" range read as a concrete, safer-to-promise date
  const standardDeliveryDate = isDeMarket ? formatDeliveryDate(addBusinessDays(new Date(), 5), deMarketDateLocale) : '';
  const expressDeliveryDate = isDeMarket ? formatDeliveryDate(addBusinessDays(new Date(), 2), deMarketDateLocale) : '';

  const sectionClass = 'mb-8';
  const sectionTitleClass = 'text-base font-semibold text-[#1A1410] mb-4 pb-2 border-b border-[#E8DDD4]';
  const stepClass = 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C4704F] text-white text-xs font-bold mr-2';

  const clearError = (field: Field) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    for (const field of FIELD_ORDER) {
      const value = fieldRefs[field].current?.value.trim() ?? '';
      if (!value) {
        if (field !== 'phone') next[field] = t.errRequired;
      } else if (field === 'email' && !EMAIL_RE.test(value)) {
        next[field] = t.errEmail;
      } else if (field === 'phone' && value.replace(/\D/g, '').length < 6) {
        next[field] = t.errPhone;
      } else if (field === 'postalCode' && !POSTAL_RE.test(value)) {
        next[field] = t.errPostal;
      }
    }
    return next;
  };

  const loadPlzMap = () => {
    plzMapRef.current ??= fetch('/plz-de.json')
      .then(res => (res.ok ? res.json() : null))
      .catch(() => null);
    return plzMapRef.current;
  };

  const lookupCity = async (plz: string) => {
    if (!isDeMarket) return;
    if (!/^\d{5}$/.test(plz)) {
      setCityOptions([]);
      return;
    }
    const map = await loadPlzMap();
    const city = cityRef.current;
    // The customer may have kept typing while the lookup table loaded
    if (!map || !city || postalRef.current?.value.trim() !== plz) return;
    const hit = map[plz];
    const canOverwrite = !city.value.trim() || cityAutoFilledRef.current;
    if (typeof hit === 'string') {
      setCityOptions([]);
      if (canOverwrite) {
        city.value = hit;
        cityAutoFilledRef.current = true;
        clearError('city');
      }
    } else {
      setCityOptions(hit ?? []);
      if (canOverwrite && cityAutoFilledRef.current) {
        city.value = '';
        cityAutoFilledRef.current = false;
      }
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find(field => nextErrors[field]);
    if (firstInvalid) {
      const input = fieldRefs[firstInvalid].current;
      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input?.focus({ preventScroll: true });
      pushEvent('checkout_validation_error', { field: firstInvalid, count: Object.keys(nextErrors).length });
      return;
    }

    sendOrder({
      source: 'checkout',
      name: firstNameRef.current?.value ?? null,
      lastName: lastNameRef.current?.value ?? null,
      email: emailRef.current?.value ?? null,
      phone: phoneRef.current?.value ?? null,
      address: streetRef.current?.value ?? null,
      postalCode: postalRef.current?.value ?? null,
      city: cityRef.current?.value ?? null,
      deliveryMethod,
      paymentMethod,
      product: items.map(i => `${i.name} ×${i.qty}`).join(', '),
      qty: items.reduce((s, i) => s + i.qty, 0),
      total: orderTotal,
      currency: IS_RO ? 'RON' : 'EUR',
    });
    pushConversionEvent(
      'purchase',
      {
        transaction_id: Date.now().toString(),
        currency: 'EUR',
        value: orderTotal,
        items: items.map(i => ({ item_id: i.articleKey, item_name: i.name, price: i.price, quantity: i.qty })),
      },
      { email: emailRef.current?.value ?? '', phone: phoneRef.current?.value ?? '' },
    );
    setShowPopup(true);
  };

  const renderPaymentOption = (method: PaymentMethod, icon: string, label: string) => {
    const isSelected = paymentMethod === method;
    return (
      <button
        key={method}
        type="button"
        aria-pressed={isSelected}
        onClick={() => setPaymentMethod(method)}
        className={`relative flex flex-col items-center justify-center gap-2 min-h-[88px] py-4 px-2 border transition-colors ${isSelected ? 'border-[#C4704F] bg-[#FFF5F0] ring-1 ring-[#C4704F]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
      >
        {isSelected && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C4704F] flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        )}
        <img src={icon} alt="" draggable={false} className="h-7 w-auto pointer-events-none select-none" />
        <span className="text-xs text-[#1A1410] font-medium pointer-events-none">{label}</span>
      </button>
    );
  };

  const renderSummaryBody = () => (
    <>
      <div className="space-y-4 mb-5">
        {items.length === 0 ? (
          <p className="text-sm text-[#9C8A7E]">{t.backToCart}</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex gap-3">
              <Link href={`/product/${item.id}`} className="relative w-14 h-14 bg-[#F5F0EB] flex-shrink-0 overflow-hidden block">
                {item.image ? (
                  <img src={smallImage(item.image)} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4B8AE" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                )}
                {item.qty > 1 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C4704F] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {item.qty}
                  </span>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.id}`} className="text-sm text-[#1A1410] truncate hover:text-[#C4704F] transition-colors block">{item.name}</Link>
                <p className="text-xs text-[#9C8A7E]">x{item.qty}</p>
              </div>
              <p className="text-sm font-medium text-[#1A1410] flex-shrink-0">
                {fmt(item.price * item.qty)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[#E8DDD4] pt-4 space-y-2">
        <div className="flex justify-between text-sm text-[#6B5B4E]">
          <span>{t.subtotal}</span>
          <span>{fmt(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#6B5B4E]">
          <span>{t.deliveryFee}</span>
          <span className={deliveryFee === 0 ? 'text-[#6B8F71] font-medium' : ''}>
            {deliveryFee === 0 ? t.free : fmt(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold text-[#1A1410] pt-2 border-t border-[#E8DDD4]">
          <span>{t.total}</span>
          <span>{fmt(orderTotal)}</span>
        </div>
      </div>
    </>
  );

  const renderPlaceOrder = () => (
    <>
      {hasErrors && (
        <p role="alert" className="mt-5 text-sm text-[#C5221F]">{t.errSummary}</p>
      )}
      <button
        type="submit"
        className="w-full mt-5 bg-[#C4704F] hover:bg-[#A85A3A] text-white py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
      >
        {t.placeOrder}
      </button>

      {/* Trust: only what the delivery page already promises */}
      <ul className="mt-4 space-y-1.5 text-xs text-[#6B5B4E]">
        <li className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          {t.trustShipping.replace('{amount}', fmtWhole(FREE_DELIVERY_THRESHOLD))}
        </li>
        <li className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          {t.trustRefund}
        </li>
        <li className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          {t.secure} · SSL
        </li>
      </ul>
      <Link
        href="/delivery"
        target="_blank"
        className="inline-block mt-3 text-xs text-[#9C8A7E] underline underline-offset-2 hover:text-[#C4704F] transition-colors"
      >
        {t.infoLink}
      </Link>
    </>
  );

  const visibleDeliveryMethods = deliveryOpen ? (['standard', 'express'] as const) : [deliveryMethod];

  return (
    <>
      {/* Payment unavailable popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          />
          <div className="relative bg-white rounded-sm shadow-2xl max-w-sm w-full p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-[#FFF5F0] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1A1410] mb-3">{t.unavailableTitle}</h3>
            <p className="text-sm text-[#6B5B4E] leading-relaxed mb-6">{t.unavailableText}</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/contacts"
                className="w-full bg-[#C4704F] hover:bg-[#A85A3A] text-white py-3 text-sm font-semibold uppercase tracking-wider transition-colors text-center"
              >
                {t.contactUs}
              </Link>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full border border-[#E8DDD4] text-[#6B5B4E] py-3 text-sm hover:border-[#C4704F] hover:text-[#C4704F] transition-colors"
              >
                {t.unavailableClose}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#FDFAF7]">
        {/* Minimal header */}
        <header className="bg-white border-b border-[#E8DDD4]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight text-[#1A1410]">
              Velmora
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#6B8F71]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              {t.secure}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#9C8A7E] hover:text-[#C4704F] transition-colors mb-6 lg:mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t.backToCart}
          </Link>

          <h1 className="text-2xl font-light text-[#1A1410] mb-6 lg:mb-8">{t.title}</h1>

          <form noValidate onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
            {/* Mobile: collapsed summary on top, the order button lives below the payment step */}
            <div className="lg:hidden bg-white border border-[#E8DDD4]">
              <button
                type="button"
                onClick={() => setSummaryOpen(open => !open)}
                aria-expanded={summaryOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-sm"
              >
                <span className="flex items-center gap-2 text-[#C4704F] font-medium">
                  {summaryOpen ? t.hideSummary : t.showSummary}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${summaryOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <span className="font-semibold text-[#1A1410]">{fmt(orderTotal)}</span>
              </button>
              {summaryOpen && (
                <div className="px-4 pt-4 pb-4 border-t border-[#E8DDD4]">{renderSummaryBody()}</div>
              )}
            </div>

            {/* Left: Form */}
            <div className="lg:col-start-1 lg:row-start-1">
              {/* Contact */}
              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className={stepClass}>1</span>
                  {t.contact}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-3 sm:contents">
                    <CheckoutField
                      id="checkout-firstName" label={t.firstName} error={errors.firstName} inputRef={firstNameRef}
                      onInput={() => clearError('firstName')}
                      type="text" required autoComplete="given-name"
                    />
                    <CheckoutField
                      id="checkout-lastName" label={t.lastName} error={errors.lastName} inputRef={lastNameRef}
                      onInput={() => clearError('lastName')}
                      type="text" required autoComplete="family-name"
                    />
                  </div>
                  <CheckoutField
                    id="checkout-email" label={t.email} error={errors.email} inputRef={emailRef}
                    onInput={() => clearError('email')}
                    type="email" required autoComplete="email"
                  />
                  <CheckoutField
                    id="checkout-phone"
                    label={<>{t.phone} <span className="normal-case tracking-normal font-normal text-[#9C8A7E]">({t.optional})</span></>}
                    error={errors.phone} inputRef={phoneRef}
                    onInput={() => clearError('phone')}
                    type="tel" autoComplete="tel"
                  />
                </div>
              </section>

              {/* Shipping */}
              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className={stepClass}>2</span>
                  {t.shipping}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <CheckoutField
                    id="checkout-street" label={t.address} error={errors.street} inputRef={streetRef}
                    onInput={() => clearError('street')}
                    type="text" required autoComplete="street-address"
                  />
                  <div className="grid grid-cols-[2fr_3fr] gap-3 sm:gap-4">
                    <CheckoutField
                      id="checkout-postalCode" label={t.postalCode} error={errors.postalCode} inputRef={postalRef}
                      onFocus={isDeMarket ? () => { loadPlzMap(); } : undefined}
                      onInput={e => {
                        clearError('postalCode');
                        lookupCity(e.currentTarget.value.trim());
                      }}
                      type="text" required autoComplete="postal-code" inputMode={isDeMarket ? 'numeric' : undefined}
                    />
                    <CheckoutField
                      id="checkout-city" label={t.city} error={errors.city} inputRef={cityRef}
                      onInput={() => {
                        clearError('city');
                        cityAutoFilledRef.current = false;
                      }}
                      type="text" required autoComplete="address-level2"
                      list={cityOptions.length > 0 ? 'checkout-city-options' : undefined}
                    />
                  </div>
                  <datalist id="checkout-city-options">
                    {cityOptions.map(city => <option key={city} value={city} />)}
                  </datalist>
                </div>
              </section>

              {/* Delivery method: standard is preselected, so it stays one line until "change" */}
              <section className={sectionClass}>
                <div className={`flex items-center justify-between ${sectionTitleClass}`}>
                  <h2 className="flex items-center">
                    <span className={stepClass}>3</span>
                    {t.delivery}
                  </h2>
                  {!deliveryOpen && (
                    <button
                      type="button"
                      onClick={() => setDeliveryOpen(true)}
                      className="text-xs font-normal text-[#C4704F] underline underline-offset-2 px-1 py-1"
                    >
                      {t.change}
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {visibleDeliveryMethods.map(method => {
                    const isSelected = deliveryMethod === method;
                    const label = method === 'standard' ? t.standardDelivery : t.expressDelivery;
                    const desc = isDeMarket
                      ? `${t.deliveryBy} ${method === 'standard' ? standardDeliveryDate : expressDeliveryDate}`
                      : (method === 'standard' ? t.standardDeliveryDesc : t.expressDeliveryDesc);
                    const price = method === 'standard'
                      ? (total >= FREE_DELIVERY_THRESHOLD ? t.free : fmt(deliveryPrices.standard))
                      : fmt(deliveryPrices.express);

                    return (
                      <label
                        key={method}
                        onClick={deliveryOpen ? undefined : () => setDeliveryOpen(true)}
                        className={`flex items-center justify-between px-4 py-4 border cursor-pointer transition-colors ${isSelected ? 'border-[#C4704F] bg-[#FFF5F0]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#C4704F]' : 'border-[#C4B8AE]'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#C4704F]" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1A1410]">{label}</p>
                            <p className="text-xs text-[#9C8A7E]">{desc}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${total >= FREE_DELIVERY_THRESHOLD && method === 'standard' ? 'text-[#6B8F71]' : 'text-[#1A1410]'}`}>
                          {price}
                        </span>
                        <input
                          type="radio"
                          name="delivery"
                          value={method}
                          checked={isSelected}
                          onChange={() => setDeliveryMethod(method)}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className={sectionTitleClass}>
                  <span className={stepClass}>4</span>
                  {t.payment}
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {renderPaymentOption('googlepay', '/pay-google.svg', t.payGooglePay)}
                    {renderPaymentOption('applepay', '/pay-apple.svg', t.payApplePay)}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#E8DDD4]" />
                    <span className="text-xs text-[#9C8A7E]">{t.payOr}</span>
                    <div className="flex-1 h-px bg-[#E8DDD4]" />
                  </div>

                  <div className={`grid gap-3 ${isDeMarket ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                    {renderPaymentOption('card', '/pay-card.svg', t.payCard)}
                    {renderPaymentOption('paypal', '/pay-paypal.svg', t.payPaypal)}
                    {renderPaymentOption('klarna', '/pay-klarna.svg', t.payKlarna)}
                    {isDeMarket && renderPaymentOption('sepa', '/pay-sepa.svg', t.paySepa ?? '')}
                  </div>
                </div>
              </section>
            </div>

            {/* Mobile: review + order button right after the last step */}
            <div className="lg:hidden bg-white border border-[#E8DDD4] p-5">
              <h2 className="text-base font-semibold text-[#1A1410] mb-5">{t.orderSummary}</h2>
              {renderSummaryBody()}
              {renderPlaceOrder()}
            </div>

            {/* Desktop: sticky order summary */}
            <div className="hidden lg:block lg:col-start-2 lg:row-start-1 lg:sticky lg:top-6 h-fit">
              <div className="bg-white border border-[#E8DDD4] p-6">
                <h2 className="text-base font-semibold text-[#1A1410] mb-5">{t.orderSummary}</h2>
                {renderSummaryBody()}
                {renderPlaceOrder()}
              </div>
            </div>
          </form>

          {isDeMarket && t.plzSource && (
            <p className="mt-10 text-[10px] text-[#C4B8AE]">
              {t.plzSource}: <a href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer" className="underline">GeoNames</a> (CC BY 4.0)
            </p>
          )}
        </div>
      </div>
    </>
  );
}
