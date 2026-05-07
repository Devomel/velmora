# Tableware Store — Next.js SSG, locale via env

## Концепція

Один репозиторій, 4 окремих CF Pages проекти (по одному на субдомен).
Локаль передається через env змінну `NEXT_PUBLIC_LOCALE` при білді.
Підпапок в URL немає — `de.domain.com/` а не `de.domain.com/de/`.

## Структура

```
app/
  layout.tsx          ← lang= береться з NEXT_PUBLIC_LOCALE
  page.tsx            ← головна
  about/page.tsx
  cart/page.tsx
  land1/page.tsx      ← лендінг без хедера
  land2/page.tsx
lib/
  i18n.ts             ← читає NEXT_PUBLIC_LOCALE, завантажує JSON
locales/
  de/  no/  ro/  ru/
    common.json
    home.json
    land1.json
    land2.json
components/layout/
  Header.tsx
  Footer.tsx
```

## Локальна розробка

```bash
NEXT_PUBLIC_LOCALE=de npm run dev    # німецька
NEXT_PUBLIC_LOCALE=no npm run dev    # норвезька
NEXT_PUBLIC_LOCALE=ro npm run dev    # румунська
NEXT_PUBLIC_LOCALE=ru npm run dev    # російська
```

## Cloudflare Pages — налаштування (4 проекти)

Для кожного субдомену створюєш окремий CF Pages проект і вказуєш:

| Проект       | Субдомен        | Build command                              | Output dir |
|--------------|-----------------|---------------------------------------------|------------|
| store-de     | de.domain.com   | NEXT_PUBLIC_LOCALE=de npm run build         | out        |
| store-no     | no.domain.com   | NEXT_PUBLIC_LOCALE=no npm run build         | out        |
| store-ro     | ro.domain.com   | NEXT_PUBLIC_LOCALE=ro npm run build         | out        |
| store-ru     | ru.domain.com   | NEXT_PUBLIC_LOCALE=ru npm run build         | out        |

Або замість build command в полі — додай Environment Variable:
  Key: NEXT_PUBLIC_LOCALE
  Value: de   (для кожного проекту своє значення)
  Build command: npm run build

## Додати нову локаль (fr)

1. Створи папку locales/fr/ зі всіма JSON файлами
2. Додай "fr" в тип Locale та LOCALE_META в lib/i18n.ts
3. Створи новий CF Pages проект з NEXT_PUBLIC_LOCALE=fr
4. Прив'яжи fr.domain.com
