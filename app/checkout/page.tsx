'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { IS_RO } from '@/lib/i18n';
import { pushEvent, pushEventOnce, pushConversionEvent } from '@/lib/analytics';
import { sendOrder } from '@/lib/orders';

type CheckoutT = {
  title: string;
  backToCart: string;
  contact: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  subtotal: string;
  deliveryFee: string;
  total: string;
  placeOrder: string;
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
    subtotal: 'Zwischensumme',
    deliveryFee: 'Versandkosten',
    total: 'Gesamt',
    placeOrder: 'Zahlungspflichtig bestellen',
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
    free: 'Gratis',
    payment: 'Betalingsmetode',
    payCard: 'Kredittkort',
    payPaypal: 'PayPal',
    payKlarna: 'Klarna',
    payGooglePay: 'Google Pay',
    payApplePay: 'Apple Pay',
    payOr: 'eller',
    orderSummary: 'Ordresammendrag',
    subtotal: 'Delsum',
    deliveryFee: 'Fraktkostnad',
    total: 'Totalt',
    placeOrder: 'Legg inn bestilling',
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
    free: 'Gratuit',
    payment: 'Metodă de plată',
    payCard: 'Card de credit',
    payPaypal: 'PayPal',
    payKlarna: 'Klarna',
    payGooglePay: 'Google Pay',
    payApplePay: 'Apple Pay',
    payOr: 'sau',
    orderSummary: 'Rezumat comandă',
    subtotal: 'Subtotal',
    deliveryFee: 'Cost livrare',
    total: 'Total',
    placeOrder: 'Plasează comanda',
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
    free: 'Бесплатно',
    payment: 'Способ оплаты',
    payCard: 'Банковская карта',
    payPaypal: 'PayPal',
    payKlarna: 'Klarna',
    payGooglePay: 'Google Pay',
    payApplePay: 'Apple Pay',
    payOr: 'или',
    orderSummary: 'Состав заказа',
    subtotal: 'Сумма товаров',
    deliveryFee: 'Доставка',
    total: 'Итого',
    placeOrder: 'Оформить заказ',
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
};

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

function formatDeDeliveryDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
}

export default function CheckoutPage() {
  const { items, total } = useCart();
  const locale = (process.env.NEXT_PUBLIC_LOCALE ?? 'de') as string;
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.de;
  const deliveryPrices = DELIVERY_PRICES[locale] ?? DEFAULT_DELIVERY_PRICE;

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'klarna' | 'googlepay' | 'applepay' | 'sepa'>('card');
  const [showPopup, setShowPopup] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const postalRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    pushEventOnce('begin_checkout', { currency: 'EUR', value: total, items: items.map(i => ({ item_id: i.articleKey, item_name: i.name, price: i.price, quantity: i.qty })) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryMethod === 'express' ? deliveryPrices.express : deliveryPrices.standard;
  const fmt = (n: number) => IS_RO ? `${n.toFixed(2)} lei` : locale === 'de' ? `${n.toFixed(2).replace('.', ',')} €` : `€${n.toFixed(2)}`;
  const orderTotal = total + deliveryFee;

  // Upper bound of the "Werktage" range read as a concrete, safer-to-promise date
  const standardDeliveryDate = formatDeDeliveryDate(addBusinessDays(new Date(), 5));
  const expressDeliveryDate = formatDeDeliveryDate(addBusinessDays(new Date(), 2));

  const inputClass =
    'w-full border border-[#E8DDD4] px-3 py-2.5 text-sm focus:border-[#C4704F] outline-none bg-white transition-colors placeholder:text-[#C4B8AE]';
  const labelClass = 'block text-xs font-medium text-[#6B5B4E] uppercase tracking-wider mb-1';
  const sectionClass = 'mb-8';
  const sectionTitleClass = 'text-base font-semibold text-[#1A1410] mb-4 pb-2 border-b border-[#E8DDD4]';

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
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

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#9C8A7E] hover:text-[#C4704F] transition-colors mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t.backToCart}
          </Link>

          <h1 className="text-2xl font-light text-[#1A1410] mb-8">{t.title}</h1>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Left: Form */}
            <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
              {/* Contact */}
              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C4704F] text-white text-xs font-bold mr-2">1</span>
                  {t.contact}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.firstName}</label>
                    <input type="text" required ref={firstNameRef} className={inputClass} autoComplete="given-name" />
                  </div>
                  <div>
                    <label className={labelClass}>{t.lastName}</label>
                    <input type="text" required ref={lastNameRef} className={inputClass} autoComplete="family-name" />
                  </div>
                  <div>
                    <label className={labelClass}>{t.email}</label>
                    <input type="email" required ref={emailRef} className={inputClass} autoComplete="email" />
                  </div>
                  <div>
                    <label className={labelClass}>{t.phone}</label>
                    <input type="tel" required ref={phoneRef} className={inputClass} autoComplete="tel" />
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C4704F] text-white text-xs font-bold mr-2">2</span>
                  {t.shipping}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>{t.address}</label>
                    <input type="text" required ref={streetRef} className={inputClass} autoComplete="street-address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t.postalCode}</label>
                      <input type="text" required ref={postalRef} className={inputClass} autoComplete="postal-code" />
                    </div>
                    <div>
                      <label className={labelClass}>{t.city}</label>
                      <input type="text" required ref={cityRef} className={inputClass} autoComplete="address-level2" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery method */}
              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C4704F] text-white text-xs font-bold mr-2">3</span>
                  {t.delivery}
                </h2>
                <div className="space-y-3">
                  {(['standard', 'express'] as const).map(method => {
                    const isSelected = deliveryMethod === method;
                    const label = method === 'standard' ? t.standardDelivery : t.expressDelivery;
                    const desc = locale === 'de'
                      ? `Lieferung bis ${method === 'standard' ? standardDeliveryDate : expressDeliveryDate}`
                      : (method === 'standard' ? t.standardDeliveryDesc : t.expressDeliveryDesc);
                    const price = method === 'standard'
                      ? (total >= FREE_DELIVERY_THRESHOLD ? t.free : fmt(deliveryPrices.standard))
                      : fmt(deliveryPrices.express);

                    return (
                      <label
                        key={method}
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
              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C4704F] text-white text-xs font-bold mr-2">4</span>
                  {t.payment}
                </h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('googlepay')}
                      className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'googlepay' ? 'border-[#C4704F] bg-[#FFF5F0]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
                    >
                      <img src="/pay-google.svg" alt="Google Pay" className="h-7 w-auto" />
                      <span className="text-xs text-[#1A1410] font-medium">{t.payGooglePay}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('applepay')}
                      className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'applepay' ? 'border-[#C4704F] bg-[#FFF5F0]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
                    >
                      <img src="/pay-apple.svg" alt="Apple Pay" className="h-7 w-auto" />
                      <span className="text-xs text-[#1A1410] font-medium">{t.payApplePay}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#E8DDD4]" />
                    <span className="text-xs text-[#9C8A7E]">{t.payOr}</span>
                    <div className="flex-1 h-px bg-[#E8DDD4]" />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'card' ? 'border-[#C4704F] bg-[#FFF5F0]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
                    >
                      <img src="/pay-card.svg" alt="Card" className="h-7 w-auto" />
                      <span className="text-xs text-[#1A1410] font-medium">{t.payCard}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'paypal' ? 'border-[#C4704F] bg-[#FFF5F0]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
                    >
                      <img src="/pay-paypal.svg" alt="PayPal" className="h-7 w-auto" />
                      <span className="text-xs text-[#1A1410] font-medium">{t.payPaypal}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('klarna')}
                      className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'klarna' ? 'border-[#C4704F] bg-[#FFF5F0]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
                    >
                      <img src="/pay-klarna.svg" alt="Klarna" className="h-7 w-auto" />
                      <span className="text-xs text-[#1A1410] font-medium">{t.payKlarna}</span>
                    </button>

                    {locale === 'de' && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('sepa')}
                        className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'sepa' ? 'border-[#C4704F] bg-[#FFF5F0]' : 'border-[#E8DDD4] bg-white hover:border-[#C4B8AE]'}`}
                      >
                        <img src="/pay-sepa.svg" alt="SEPA-Lastschrift" className="h-7 w-auto" />
                        <span className="text-xs text-[#1A1410] font-medium">{t.paySepa}</span>
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Order summary */}
            <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 lg:sticky lg:top-6 h-fit">
              <div className="bg-white border border-[#E8DDD4] p-6">
                <h2 className="text-base font-semibold text-[#1A1410] mb-5">{t.orderSummary}</h2>

                {/* Items */}
                <div className="space-y-4 mb-5">
                  {items.length === 0 ? (
                    <p className="text-sm text-[#9C8A7E]">{t.backToCart}</p>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <Link href={`/product/${item.id}`} className="relative w-14 h-14 bg-[#F5F0EB] flex-shrink-0 overflow-hidden block">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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

                <button
                  type="submit"
                  className="w-full mt-6 bg-[#C4704F] hover:bg-[#A85A3A] text-white py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                  {t.placeOrder}
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-[10px] text-[#9C8A7E]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    SSL
                  </div>
                  <div className="w-px h-3 bg-[#E8DDD4]" />
                  <div className="flex items-center gap-1 text-[10px] text-[#9C8A7E]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    {t.secure}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
