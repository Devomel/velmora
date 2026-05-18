# Land1 — Emerald Craft Brandbook

## Концепція

**"Emerald Craft"** — палітра лендінгу land1. Глибокий смарагдово-зелений як основний колір, тепло-кремові фони та золоті акценти. Відчуття преміального, природного, ремісничого.

## Кольорова палітра

### Фони
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Deep | `#0E2318` | `bg-[#0E2318]` | Hero, Footer (темні секції) |
| Forest | `#1A3D2B` | `bg-[#1A3D2B]` | Offer CTA секція |
| Ivory | `#FDFCF8` | `bg-[#FDFCF8]` | Основний фон сторінки |
| Cream | `#F3EFE5` | `bg-[#F3EFE5]` | Альтернативний фон секцій |
| Card | `#FFFFFF` | `bg-white` | Картки товарів, відгуки |

### Основні кольори
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Sage | `#2D6A4F` | `text-[#2D6A4F]` / `bg-[#2D6A4F]` | Інтерактивні елементи, hover |
| Mint | `#52B788` | `text-[#52B788]` / `bg-[#52B788]` | Акцент, CTA кнопки |
| Mint Light | `#95D5B2` | `text-[#95D5B2]` | Допоміжні акценти |
| Gold | `#C9A84C` | `text-[#C9A84C]` | Бейджі, зірки рейтингу, виділення |

### Текст
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Primary | `#1A2520` | `text-[#1A2520]` | Основний текст |
| Secondary | `#3D5448` | `text-[#3D5448]` | Підзаголовки, описи |
| Muted | `#6B8070` | `text-[#6B8070]` | Підписи, metadata |
| On-dark | `#E8F5EE` | `text-[#E8F5EE]` | Текст на темному фоні |
| On-dark muted | `#8FB89F` | `text-[#8FB89F]` | Підписи на темному фоні |

### Межі та роздільники
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Border light | `#D8E8DC` | `border-[#D8E8DC]` | Межі карток на світлому фоні |
| Border dark | `#2D5040` | `border-[#2D5040]` | Межі на темному фоні |

## Типографіка

- **Шрифт:** `Inter, system-ui, -apple-system, sans-serif` (успадкований)
- **Заголовки секцій:** `text-3xl md:text-4xl font-light` — легкі, елегантні
- **Hero заголовок:** `text-5xl md:text-6xl font-light`
- **Підзаголовки:** `text-base text-[#6B8070]`
- **Бейджі:** `text-xs uppercase tracking-widest`

## CTA кнопки

### Основна (Mint)
```html
<button class="bg-[#52B788] hover:bg-[#2D6A4F] text-white px-10 py-4 text-sm font-semibold uppercase tracking-wider transition-colors">
```

### Вторинна (outline)
```html
<button class="border border-[#E8F5EE] text-[#E8F5EE] hover:bg-[#E8F5EE] hover:text-[#0E2318] px-8 py-3 text-sm transition-colors">
```

### На світлому фоні (outline sage)
```html
<button class="border border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white px-8 py-3 text-sm transition-colors">
```

## Бейджі

```html
<!-- Акційний бейдж -->
<span class="bg-[#C9A84C] text-white text-xs font-bold px-2 py-0.5">−20%</span>

<!-- Секційний бейдж -->
<span class="text-[#52B788] text-xs uppercase tracking-widest">Назва секції</span>
```

## Картки товарів

- Фон: `bg-white`
- Межа: `border border-[#D8E8DC]`
- Hover: `hover:shadow-lg hover:border-[#52B788]`
- Зображення-placeholder: градієнт `from-[#1A3D2B] to-[#2D6A4F]` з іконкою

## Зірки рейтингу

Колір: `text-[#C9A84C]` (gold)

## Таймер зворотнього відліку

- Фон блоку: `bg-[#1A3D2B]`
- Число: `text-4xl font-light text-[#E8F5EE]`
- Підпис: `text-xs text-[#8FB89F] uppercase tracking-wider`

## Секції — чергування фонів

1. **Hero** — `bg-[#0E2318]` (темний)
2. **Stats** — `bg-[#F3EFE5]` (кремовий)
3. **USP** — `bg-[#FDFCF8]` (айворі)
4. **Benefits** — `bg-[#0E2318]` (темний)
5. **Catalog** — `bg-[#F3EFE5]` (кремовий)
6. **Reviews** — `bg-[#FDFCF8]` (айворі)
7. **Offer CTA** — `bg-[#1A3D2B]` (forest)
8. **Footer** — `bg-[#0E2318]` (темний)
