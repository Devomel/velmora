#!/usr/bin/env python3
"""Update CSV: add стара_ціна, ціна_лей, стара_ціна_лей columns after ціна."""
import csv, io, os

PRICES = {
    "55-333-477": {"new_eur": 30,  "old_eur": 50,  "new_lei": 155, "old_lei": 264},
    "55-333-527": {"new_eur": 22,  "old_eur": 37,  "new_lei": 114, "old_lei": 194},
    "28546":      {"new_eur": 47,  "old_eur": 79,  "new_lei": 245, "old_lei": 416},
    "55-333-675": {"new_eur": 52,  "old_eur": 89,  "new_lei": 273, "old_lei": 464},
    "55-333-644": {"new_eur": 106, "old_eur": 179, "new_lei": 553, "old_lei": 940},
    "28473":      {"new_eur": 65,  "old_eur": 111, "new_lei": 342, "old_lei": 581},
    "28567":      {"new_eur": 70,  "old_eur": 119, "new_lei": 367, "old_lei": 624},
    "55-333-554": {"new_eur": 84,  "old_eur": 143, "new_lei": 441, "old_lei": 750},
    "28460":      {"new_eur": 129, "old_eur": 220, "new_lei": 677, "old_lei": 1152},
    "55-333-535": {"new_eur": 38,  "old_eur": 64,  "new_lei": 198, "old_lei": 337},
    "28480":      {"new_eur": 22,  "old_eur": 38,  "new_lei": 118, "old_lei": 200},
    "55-333-419": {"new_eur": 49,  "old_eur": 83,  "new_lei": 256, "old_lei": 436},
    "55-333-462": {"new_eur": 89,  "old_eur": 152, "new_lei": 468, "old_lei": 795},
    "28827":      {"new_eur": 29,  "old_eur": 49,  "new_lei": 151, "old_lei": 256},
    "55-333-641": {"new_eur": 51,  "old_eur": 87,  "new_lei": 267, "old_lei": 454},
    "55-333-571": {"new_eur": 47,  "old_eur": 79,  "new_lei": 245, "old_lei": 417},
    "55-333-387": {"new_eur": 39,  "old_eur": 66,  "new_lei": 204, "old_lei": 346},
    "28483":      {"new_eur": 41,  "old_eur": 69,  "new_lei": 213, "old_lei": 362},
    "55-333-621": {"new_eur": 78,  "old_eur": 132, "new_lei": 407, "old_lei": 691},
    "28471":      {"new_eur": 39,  "old_eur": 67,  "new_lei": 206, "old_lei": 350},
    "28528":      {"new_eur": 32,  "old_eur": 55,  "new_lei": 170, "old_lei": 289},
    "55-333-464": {"new_eur": 66,  "old_eur": 113, "new_lei": 348, "old_lei": 591},
    "28718":      {"new_eur": 119, "old_eur": 203, "new_lei": 626, "old_lei": 1064},
    "28719":      {"new_eur": 101, "old_eur": 171, "new_lei": 528, "old_lei": 898},
    "28729":      {"new_eur": 39,  "old_eur": 66,  "new_lei": 204, "old_lei": 347},
    "55-333-374": {"new_eur": 38,  "old_eur": 65,  "new_lei": 202, "old_lei": 343},
    "55-333-400": {"new_eur": 45,  "old_eur": 76,  "new_lei": 235, "old_lei": 400},
    "55-333-410": {"new_eur": 48,  "old_eur": 82,  "new_lei": 254, "old_lei": 431},
    "55-333-418": {"new_eur": 46,  "old_eur": 78,  "new_lei": 239, "old_lei": 407},
    "55-333-635": {"new_eur": 60,  "old_eur": 102, "new_lei": 313, "old_lei": 532},
    "55-333-562": {"new_eur": 45,  "old_eur": 77,  "new_lei": 237, "old_lei": 403},
    "28252":      {"new_eur": 63,  "old_eur": 107, "new_lei": 331, "old_lei": 562},
    "55-333-676": {"new_eur": 29,  "old_eur": 49,  "new_lei": 152, "old_lei": 259},
    "55-333-351": {"new_eur": 30,  "old_eur": 52,  "new_lei": 160, "old_lei": 272},
    "55-333-524": {"new_eur": 29,  "old_eur": 49,  "new_lei": 152, "old_lei": 259},
    "кераміка_1": {"new_eur": 68, "old_eur": 116, "new_lei": 356, "old_lei": 606},
    "кераміка_2": {"new_eur": 68, "old_eur": 116, "new_lei": 356, "old_lei": 606},
}

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "products", "Text_content_translated.csv")

with open(CSV_PATH, encoding="utf-8-sig") as f:
    raw = f.read()

reader = csv.reader(io.StringIO(raw))
rows = list(reader)

# Header: insert 3 cols after index 3
header = rows[0]
new_header = header[:4] + ["стара_ціна", "ціна_лей", "стара_ціна_лей"] + header[4:]

new_rows = [new_header]
for row in rows[1:]:
    if len(row) < 4:
        new_rows.append(row)
        continue
    article = row[2].strip()
    p = PRICES.get(article)
    if p:
        new_row = row[:3] + [str(p["new_eur"]), str(p["old_eur"]), str(p["new_lei"]), str(p["old_lei"])] + row[4:]
    else:
        new_row = row[:4] + ["", "", ""] + row[4:]
    new_rows.append(new_row)

out = io.StringIO()
writer = csv.writer(out, lineterminator="\n")
writer.writerows(new_rows)

with open(CSV_PATH, "w", encoding="utf-8") as f:
    f.write(out.getvalue())

print(f"Updated {len(new_rows)-1} rows.")
