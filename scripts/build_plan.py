import json
import sys
import os

from plan_data.part1_genesis_patriarchs import DAYS_PART_1
from plan_data.part2_exodus_wilderness import DAYS_PART_2
from plan_data.part3_conquest_judges import DAYS_PART_3
from plan_data.part4_united_kingdom import DAYS_PART_4
from plan_data.part5_divided_kingdom import DAYS_PART_5
from plan_data.part6_exile_prophets import DAYS_PART_6
from plan_data.part7_return_dawn import DAYS_PART_7
from plan_data.part8_gospels_messiah import DAYS_PART_8
from plan_data.part9_acts_early_church import DAYS_PART_9
from plan_data.part10_epistles_revelation import DAYS_PART_10

all_parts = [
    ("Part 1: The Foundations & The Patriarchs", DAYS_PART_1),
    ("Part 2: The Exodus, Wilderness & Covenant at Sinai", DAYS_PART_2),
    ("Part 3: Conquest, Judges & The Kinsman Redeemer", DAYS_PART_3),
    ("Part 4: The Kingdom Established: Samuel, Saul, David & Solomon", DAYS_PART_4),
    ("Part 5: The Divided Kingdom & The Prophetic Fire", DAYS_PART_5),
    ("Part 6: The Fall of Jerusalem, Exile & Prophetic Visions", DAYS_PART_6),
    ("Part 7: The Return from Exile & The Dawn of the New Covenant", DAYS_PART_7),
    ("Part 8: Walking with the Messiah: His Miracles, Ministry & Passion", DAYS_PART_8),
    ("Part 9: Resurrection, Pentecost & The Wildfire of Acts", DAYS_PART_9),
    ("Part 10: The Epistles, Final Witnesses & The Eternal City", DAYS_PART_10),
]

full_plan = []
for name, part in all_parts:
    print(f"Loading {name}: {len(part)} days")
    full_plan.extend(part)

print(f"\nTotal loaded days: {len(full_plan)}")

# Validation checks
errors = []

# 1. Count
if len(full_plan) != 365:
    errors.append(f"Expected 365 days, but found {len(full_plan)}")

# 2. Sequential day numbers
day_nums = [d["day"] for d in full_plan]
expected_nums = list(range(1, 366))
if day_nums != expected_nums:
    missing = set(expected_nums) - set(day_nums)
    dups = [x for x in day_nums if day_nums.count(x) > 1]
    errors.append(f"Day numbers are not 1..365! Missing: {missing}, Duplicates: {dups}")

# 3. Exactly 2 chapters per day
for d in full_plan:
    ch = d.get("chapters", [])
    if len(ch) != 2:
        errors.append(f"Day {d.get('day')} has {len(ch)} chapters (expected 2): {ch}")

# 4. Unique memory verse references
seen_verses = {}
for d in full_plan:
    v_ref = d.get("memoryVerse", {}).get("reference", "").strip()
    if not v_ref:
        errors.append(f"Day {d.get('day')} has no memory verse reference")
    elif v_ref in seen_verses:
        errors.append(f"Duplicate memory verse reference '{v_ref}' on Day {d.get('day')} (first seen on Day {seen_verses[v_ref]})")
    else:
        seen_verses[v_ref] = d.get("day")

# 5. Required non-empty fields
for d in full_plan:
    day = d.get("day")
    for f in ["character", "season", "theme"]:
        if not d.get(f) or not str(d.get(f)).strip():
            errors.append(f"Day {day} missing field: {f}")
    mv = d.get("memoryVerse", {})
    for f in ["reference", "text", "whyItMatters"]:
        if not mv.get(f) or not str(mv.get(f)).strip():
            errors.append(f"Day {day} memoryVerse missing field: {f}")

if errors:
    print(f"\n❌ VALIDATION FAILED with {len(errors)} errors:")
    for err in errors[:20]:
        print("  -", err)
    if len(errors) > 20:
        print(f"  ... and {len(errors)-20} more errors")
    sys.exit(1)
else:
    print("✅ All validation checks passed successfully!")

# Ensure data directory exists
os.makedirs("../data", exist_ok=True)

# Write data/plan365.json
json_path = os.path.abspath("../data/plan365.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(full_plan, f, indent=2, ensure_ascii=False)
print(f"Saved: {json_path} ({os.path.getsize(json_path):,} bytes)")

# Write data/plan365.js (for direct client-side script tag usage)
js_path = os.path.abspath("../data/plan365.js")
with open(js_path, "w", encoding="utf-8") as f:
    f.write("// Know Him More - Full 365-Day Character Study Plan\n")
    f.write("window.PLAN_365 = ")
    json.dump(full_plan, f, indent=2, ensure_ascii=False)
    f.write(";\n")
print(f"Saved: {js_path} ({os.path.getsize(js_path):,} bytes)")

