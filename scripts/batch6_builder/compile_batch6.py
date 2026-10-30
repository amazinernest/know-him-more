import json
import os
import sys

# Add scripts directory
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from days_158_to_165 import DAYS_158_TO_165
from days_166_to_172 import DAYS_166_TO_172
from days_173_to_179 import DAYS_173_TO_179
from days_180_to_187 import DAYS_180_TO_187

# Load Days 1 to 157
data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
days_1_to_157_path = os.path.join(data_dir, "days_1_to_157.json")

with open(days_1_to_157_path, "r", encoding="utf-8") as f:
    days_1_to_157_dict = json.load(f)

days_1_to_157_list = [days_1_to_157_dict[str(i)] for i in range(1, 158)]
batch6_list = DAYS_158_TO_165 + DAYS_166_TO_172 + DAYS_173_TO_179 + DAYS_180_TO_187

all_days = days_1_to_157_list + batch6_list

print(f"Total days collected: {len(all_days)}")
day_numbers = [d["day"] for d in all_days]
print(f"Day range: {min(day_numbers)} to {max(day_numbers)}")
assert day_numbers == list(range(1, 188)), f"Days are not strictly sequential 1 to 187! Found: {day_numbers}"

# Master plan verification
plan_path = os.path.join(data_dir, "plan365.json")
with open(plan_path, "r", encoding="utf-8") as f:
    master_plan = json.load(f)

plan_map = {d["day"]: d for d in master_plan}

# Rigorous validation across all 187 days
for d in all_days:
    day_num = d["day"]
    assert day_num in plan_map, f"Day {day_num} not found in master plan"
    plan_entry = plan_map[day_num]
    
    # Check character
    assert d["character"].strip() == plan_entry["character"].strip(), f"Day {day_num} character mismatch: '{d['character']}' vs '{plan_entry['character']}'"
    
    # Check scripture chapters
    assert len(d["scripture"]) == 2, f"Day {day_num} does not have exactly 2 scripture chapters"
    for i, chap in enumerate(d["scripture"]):
        assert chap["reference"].strip() == plan_entry["chapters"][i].strip(), f"Day {day_num} chapter {i+1} mismatch: '{chap['reference']}' vs '{plan_entry['chapters'][i]}'"
        assert len(chap["verses"]) >= 3, f"Day {day_num} chapter '{chap['reference']}' has fewer than 3 verses"
        for v in chap["verses"]:
            assert "number" in v and "text" in v and v["text"], f"Day {day_num} invalid verse: {v}"
            
    # Check memory verse
    mv = d["memoryVerse"]
    assert mv["reference"].strip() == plan_entry["memoryVerse"]["reference"].strip(), f"Day {day_num} memory verse reference mismatch: '{mv['reference']}' vs '{plan_entry['memoryVerse']['reference']}'"
    assert "whyItMatters" in mv and len(mv["whyItMatters"]) >= 15, f"Day {day_num} missing whyItMatters"
    cd = mv["cramData"]
    assert cd["readTarget"] == 3, f"Day {day_num} cramData readTarget != 3"
    assert len(cd["blankWords"]) >= 3, f"Day {day_num} cramData blankWords < 3"
    assert cd["firstLetters"], f"Day {day_num} missing firstLetters"
    
    # Check profile
    prof = d["profile"]
    for field in ["title", "who", "whenAndWhere", "family", "keyMoments", "strengths", "failures"]:
        assert field in prof and prof[field], f"Day {day_num} profile missing {field}"
    assert len(prof["keyMoments"]) >= 3, f"Day {day_num} keyMoments < 3"
    
    # Check reflection & lessons
    wg = d["whatGodIsSaying"]
    assert isinstance(wg, dict), f"Day {day_num} whatGodIsSaying is not a dict"
    assert "headline" in wg and wg["headline"], f"Day {day_num} whatGodIsSaying missing headline"
    assert "reflection" in wg and len(wg["reflection"]) >= 100, f"Day {day_num} whatGodIsSaying reflection too short"
    assert len(d["lessons"]) >= 3, f"Day {day_num} lessons < 3"
    for l in d["lessons"]:
        assert "lesson" in l and "verse" in l and "detail" in l and "question" in l, f"Day {day_num} incomplete lesson: {l}"
        
    # Check quiz
    assert len(d["quiz"]) == 5, f"Day {day_num} quiz count != 5"
    for q in d["quiz"]:
        assert "question" in q and q["question"], f"Day {day_num} quiz missing question"
        assert "options" in q and len(q["options"]) >= 2, f"Day {day_num} quiz options < 2"
        assert 0 <= q["correctIndex"] < len(q["options"]), f"Day {day_num} quiz invalid correctIndex: {q['correctIndex']}"
        assert "reference" in q and q["reference"], f"Day {day_num} quiz missing reference"
        assert "explanation" in q and q["explanation"], f"Day {day_num} quiz missing explanation"
        
    # Check prayer
    cp = d["closingPrayer"]
    assert isinstance(cp, dict), f"Day {day_num} closingPrayer is not a dict"
    assert "guidedPrayer" in cp and len(cp["guidedPrayer"]) >= 50, f"Day {day_num} guidedPrayer too short"
    assert "versePrayerLine" in cp and cp["versePrayerLine"], f"Day {day_num} missing versePrayerLine"
    assert "prompt" in cp and cp["prompt"], f"Day {day_num} missing prompt"

print(f"🎉 All {len(all_days)} days passed 100% of validation checks!")

# Save to data/days_1_to_187.json
days_dict = {str(d["day"]): d for d in all_days}

json_187_path = os.path.join(data_dir, "days_1_to_187.json")
with open(json_187_path, "w", encoding="utf-8") as f:
    json.dump(days_dict, f, indent=2, ensure_ascii=False)
print(f"Saved: {json_187_path} ({os.path.getsize(json_187_path):,} bytes)")

# Update data/days_content.json
json_content_path = os.path.join(data_dir, "days_content.json")
with open(json_content_path, "w", encoding="utf-8") as f:
    json.dump(days_dict, f, indent=2, ensure_ascii=False)
print(f"Saved: {json_content_path} ({os.path.getsize(json_content_path):,} bytes)")

# Update data/days_content.js
js_content_path = os.path.join(data_dir, "days_content.js")
with open(js_content_path, "w", encoding="utf-8") as f:
    f.write("// Know Him More - Complete Days 1 to 187 Content (Batches 1 to 6 Complete)\n")
    f.write("window.DAYS_CONTENT = ")
    json.dump(days_dict, f, indent=2, ensure_ascii=False)
    f.write(";\n")
print(f"Saved: {js_content_path} ({os.path.getsize(js_content_path):,} bytes)")

