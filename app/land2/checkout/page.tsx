'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useL2Cart } from '../components/L2CartProvider';
import { IS_RO } from '@/lib/i18n';

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
    orderSummary: 'Bestellübersicht',
    subtotal: 'Zwischensumme',
    deliveryFee: 'Versandkosten',
    total: 'Gesamt',
    placeOrder: 'Bestellung aufgeben',
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
const EXPRESS_PRICE = 9.99;

export default function L2CheckoutPage() {
  const { items, total } = useL2Cart();
  const locale = (process.env.NEXT_PUBLIC_LOCALE ?? 'de') as string;
  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.de;

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'klarna'>('card');
  const [showPopup, setShowPopup] = useState(false);

  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryMethod === 'express' ? EXPRESS_PRICE : 4.99;
  const fmt = (n: number) => IS_RO ? `${n.toFixed(2)} lei` : `€${n.toFixed(2)}`;
  const orderTotal = total + deliveryFee;

  const inputClass =
    'w-full border border-[#FECACA] px-3 py-2.5 text-sm focus:border-[#DC2626] outline-none bg-white transition-colors placeholder:text-[#D1A0A0]';
  const labelClass = 'block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1';
  const sectionClass = 'mb-8';
  const sectionTitleClass = 'text-base font-semibold text-[#111827] mb-4 pb-2 border-b border-[#FECACA]';

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          />
          <div className="relative bg-white rounded-sm shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-3">{t.unavailableTitle}</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-6">{t.unavailableText}</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/contacts"
                className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white py-3 text-sm font-semibold uppercase tracking-wider transition-colors text-center"
              >
                {t.contactUs}
              </Link>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full border border-[#FECACA] text-[#6B7280] py-3 text-sm hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
              >
                {t.unavailableClose}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#FEF2F2]">
        <header className="bg-white border-b border-[#FECACA]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/land2" className="text-lg font-semibold tracking-tight text-[#111827]">
              Velmora
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              {t.secure}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <Link
            href="/land2"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#DC2626] transition-colors mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t.backToCart}
          </Link>

          <h1 className="text-2xl font-light text-[#111827] mb-8">{t.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Left: Form */}
            <div>
              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#DC2626] text-white text-xs font-bold mr-2">1</span>
                  {t.contact}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.firstName}</label>
                    <input type="text" className={inputClass} autoComplete="given-name" />
                  </div>
                  <div>
                    <label className={labelClass}>{t.lastName}</label>
                    <input type="text" className={inputClass} autoComplete="family-name" />
                  </div>
                  <div>
                    <label className={labelClass}>{t.email}</label>
                    <input type="email" className={inputClass} autoComplete="email" />
                  </div>
                  <div>
                    <label className={labelClass}>{t.phone}</label>
                    <input type="tel" className={inputClass} autoComplete="tel" />
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#DC2626] text-white text-xs font-bold mr-2">2</span>
                  {t.shipping}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>{t.address}</label>
                    <input type="text" className={inputClass} autoComplete="street-address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t.postalCode}</label>
                      <input type="text" className={inputClass} autoComplete="postal-code" />
                    </div>
                    <div>
                      <label className={labelClass}>{t.city}</label>
                      <input type="text" className={inputClass} autoComplete="address-level2" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t.country}</label>
                    <select className={inputClass + ' cursor-pointer'} autoComplete="country-name" defaultValue="">
                      <option value="" disabled />
                      {t.countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#DC2626] text-white text-xs font-bold mr-2">3</span>
                  {t.delivery}
                </h2>
                <div className="space-y-3">
                  {(['standard', 'express'] as const).map(method => {
                    const isSelected = deliveryMethod === method;
                    const label = method === 'standard' ? t.standardDelivery : t.expressDelivery;
                    const desc = method === 'standard' ? t.standardDeliveryDesc : t.expressDeliveryDesc;
                    const price = method === 'standard'
                      ? (total >= FREE_DELIVERY_THRESHOLD ? t.free : fmt(4.99))
                      : fmt(EXPRESS_PRICE);

                    return (
                      <label
                        key={method}
                        className={`flex items-center justify-between px-4 py-4 border cursor-pointer transition-colors ${isSelected ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#FECACA] bg-white hover:border-[#FCA5A5]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#DC2626]' : 'border-[#FCA5A5]'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#DC2626]" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#111827]">{label}</p>
                            <p className="text-xs text-[#6B7280]">{desc}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${total >= FREE_DELIVERY_THRESHOLD && method === 'standard' ? 'text-green-600' : 'text-[#111827]'}`}>
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

              <section className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#DC2626] text-white text-xs font-bold mr-2">4</span>
                  {t.payment}
                </h2>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'card' ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#FECACA] bg-white hover:border-[#FCA5A5]'}`}
                  >
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                      <rect width="28" height="20" rx="3" fill="#FEF2F2" />
                      <rect y="5" width="28" height="5" fill="#DC2626" opacity="0.4" />
                      <rect x="3" y="13" width="8" height="3" rx="1" fill="#DC2626" opacity="0.6" />
                    </svg>
                    <span className="text-xs text-[#111827] font-medium">{t.payCard}</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'paypal' ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#FECACA] bg-white hover:border-[#FCA5A5]'}`}
                  >
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                      <rect width="28" height="20" rx="3" fill="#FEF2F2" />
                      <text x="5" y="14" fontSize="9" fontWeight="700" fill="#003087" fontFamily="Arial">Pay</text>
                      <text x="14" y="14" fontSize="9" fontWeight="700" fill="#009CDE" fontFamily="Arial">Pal</text>
                    </svg>
                    <span className="text-xs text-[#111827] font-medium">{t.payPaypal}</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('klarna')}
                    className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 border transition-colors ${paymentMethod === 'klarna' ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#FECACA] bg-white hover:border-[#FCA5A5]'}`}
                  >
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                      <rect width="28" height="20" rx="3" fill="#FFB3C7" />
                      <text x="4" y="14" fontSize="8" fontWeight="700" fill="#17120E" fontFamily="Arial">Klarna</text>
                    </svg>
                    <span className="text-xs text-[#111827] font-medium">{t.payKlarna}</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3 mt-4 p-4 bg-white border border-[#FECACA]">
                    <div>
                      <label className={labelClass}>Kartennummer</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={inputClass}
                        autoComplete="cc-number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>MM / JJ</label>
                        <input type="text" placeholder="MM / JJ" maxLength={7} className={inputClass} autoComplete="cc-exp" />
                      </div>
                      <div>
                        <label className={labelClass}>CVV</label>
                        <input type="text" placeholder="123" maxLength={4} className={inputClass} autoComplete="cc-csc" />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right: Order summary */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white border border-[#FECACA] p-6">
                <h2 className="text-base font-semibold text-[#111827] mb-5">{t.orderSummary}</h2>

                <div className="space-y-4 mb-5">
                  {items.length === 0 ? (
                    <p className="text-sm text-[#6B7280]">{t.backToCart}</p>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <Link href={`/land2/product/${item.id}`} className="relative w-14 h-14 bg-[#FEF2F2] flex-shrink-0 overflow-hidden block">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          {item.qty > 1 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#DC2626] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                              {item.qty}
                            </span>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/land2/product/${item.id}`} className="text-sm text-[#111827] truncate hover:text-[#DC2626] transition-colors block">{item.name}</Link>
                          <p className="text-xs text-[#6B7280]">x{item.qty}</p>
                        </div>
                        <p className="text-sm font-medium text-[#111827] flex-shrink-0">
                          {fmt(item.price * item.qty)}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-[#FECACA] pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-[#6B7280]">
                    <span>{t.subtotal}</span>
                    <span>{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6B7280]">
                    <span>{t.deliveryFee}</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryFee === 0 ? t.free : fmt(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#111827] pt-2 border-t border-[#FECACA]">
                    <span>{t.total}</span>
                    <span>{fmt(orderTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPopup(true)}
                  className="w-full mt-6 bg-[#DC2626] hover:bg-[#B91C1C] text-white py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                  {t.placeOrder}
                </button>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    SSL
                  </div>
                  <div className="w-px h-3 bg-[#FECACA]" />
                  <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    {t.secure}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
