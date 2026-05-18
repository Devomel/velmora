# Land2 — Scarlet Table Brandbook

## Концепція

**"Scarlet Table"** — палітра лендінгу land2. Чисто-білий фон з яскравими червоними акцентами та темно-червоними фонами. Відчуття святковості, сміливості, преміальності. Повна протилежність смарагдово-темному land1.

## Кольорова палітра

### Фони
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Crimson | `#991B1B` | `bg-[#991B1B]` | Stats, Benefits секції |
| Scarlet | `#B91C1C` | `bg-[#B91C1C]` | Offer CTA секція |
| Deep Red | `#7F1D1D` | `bg-[#7F1D1D]` | Footer |
| White | `#FFFFFF` | `bg-white` | Основний фон сторінки, картки |
| Blush | `#FEF2F2` | `bg-[#FEF2F2]` | Альтернативний фон секцій |
| Snow | `#FFFBFB` | `bg-[#FFFBFB]` | Ледь рожевий фон секцій |

### Основні кольори
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Red | `#DC2626` | `text-[#DC2626]` / `bg-[#DC2626]` | Основний акцент, CTA кнопки |
| Red Dark | `#B91C1C` | `text-[#B91C1C]` / `bg-[#B91C1C]` | Hover стани |
| Red Light | `#EF4444` | `text-[#EF4444]` | Додаткові акценти |
| Gold | `#D97706` | `text-[#D97706]` | Бейджі "Flash Sale", зірки |

### Текст
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Primary | `#111827` | `text-[#111827]` | Основний текст |
| Secondary | `#374151` | `text-[#374151]` | Підзаголовки |
| Muted | `#6B7280` | `text-[#6B7280]` | Підписи, metadata |
| On-red | `#FFFFFF` | `text-white` | Текст на червоному фоні |
| On-red muted | `#FECACA` | `text-[#FECACA]` | Підписи на червоному |

### Межі
| Назва | HEX | Tailwind | Застосування |
|---|---|---|---|
| Border light | `#FECACA` | `border-[#FECACA]` | Межі на білому/рожевому фоні |
| Border red | `#DC2626` | `border-[#DC2626]` | Акцентні межі |
| Border dark | `#7F1D1D` | `border-[#7F1D1D]` | Межі на темному фоні |

## Типографіка

- **Шрифт:** `Inter, system-ui, -apple-system, sans-serif`
- **Hero заголовок:** `text-5xl md:text-7xl font-light` (більший, ніж у land1)
- **Заголовки секцій:** `text-3xl md:text-4xl font-light`
- **Акцентний текст:** `text-[#DC2626]` (червоний замість зеленого)
- **Бейджі:** `text-xs uppercase tracking-widest`

## Hero — ключова відмінність від land1

Land2 має **світлий hero** (білий фон) з червоним акцентним кольором.
- Фон: `bg-white` або `bg-[#FEF2F2]`
- Заголовок: великий, темний, з червоним виділенням
- Таймер: червона горизонтальна смуга зверху
- CTA: яскраво-червона кнопка

## CTA кнопки

### Основна (червона)
```html
<button class="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-10 py-4 text-sm font-semibold uppercase tracking-wider transition-colors">
```

### Вторинна (outline)
```html
<button class="border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-8 py-3 text-sm transition-colors">
```

### На червоному фоні
```html
<button class="bg-white text-[#DC2626] hover:bg-[#FEF2F2] px-10 py-4 text-sm font-semibold transition-colors">
```

## Бейджі

```html
<!-- Flash Sale -->
<span class="bg-[#D97706] text-white text-xs font-bold px-2 py-0.5">Flash Sale</span>

<!-- Знижка -->
<span class="bg-[#DC2626] text-white text-xs font-bold px-2 py-0.5">−20%</span>

<!-- Секційний бейдж -->
<span class="text-[#DC2626] text-xs uppercase tracking-widest">Назва секції</span>
```

## Картки товарів

- Фон: `bg-white`
- Межа: `border border-[#FECACA]`
- Hover: `hover:border-[#DC2626] hover:shadow-lg`
- Image placeholder: `bg-[#FEF2F2]` з червоним SVG або `bg-gradient-to-br from-[#991B1B] to-[#DC2626]`

## Секції — чергування фонів

1. **Timer bar** — `bg-[#DC2626]` (червоний, вузький)
2. **Hero** — `bg-white` (білий)
3. **Stats** — `bg-[#991B1B]` (темно-червоний)
4. **USP** — `bg-[#FEF2F2]` (блідо-рожевий)
5. **Benefits** — `bg-white` (білий)
6. **Catalog** — `bg-[#FEF2F2]` (блідо-рожевий)
7. **Reviews** — `bg-white` (білий)
8. **Offer CTA** — `bg-[#B91C1C]` (червоний)
9. **Footer** — `bg-[#7F1D1D]` (дуже темний червоний)
