import json
import os

from day1 import DAY_1
from day2 import DAY_2
from day3 import DAY_3
from day4 import DAY_4
from day5 import DAY_5
from day6 import DAY_6
from day7 import DAY_7

days_list = [DAY_1, DAY_2, DAY_3, DAY_4, DAY_5, DAY_6, DAY_7]
days_dict = {d["day"]: d for d in days_list}

print(f"Loaded {len(days_list)} complete days of devotional content.")

# Validation
for d in days_list:
    day_num = d["day"]
    assert "character" in d and d["character"], f"Day {day_num} missing character"
    assert "season" in d and d["season"], f"Day {day_num} missing season"
    assert "theme" in d and d["theme"], f"Day {day_num} missing theme"
    assert "memoryVerse" in d, f"Day {day_num} missing memoryVerse"
    assert "profile" in d, f"Day {day_num} missing profile"
    assert len(d["scripture"]) == 2, f"Day {day_num} scripture chapters count != 2"
    assert "whatGodIsSaying" in d, f"Day {day_num} missing whatGodIsSaying"
    assert len(d["lessons"]) >= 3, f"Day {day_num} lessons count < 3"
    assert len(d["quiz"]) == 5, f"Day {day_num} quiz count != 5"
    assert "closingPrayer" in d, f"Day {day_num} missing closingPrayer"
    
    # Check cram data
    mv = d["memoryVerse"]
    assert "cramData" in mv, f"Day {day_num} memory verse missing cramData"
    cd = mv["cramData"]
    assert cd["readTarget"] == 3
    assert len(cd["blankWords"]) >= 3
    assert cd["firstLetters"]
    
    # Check quiz questions
    for q in d["quiz"]:
        assert "question" in q and q["question"]
        assert "options" in q and len(q["options"]) >= 2
        assert "correctIndex" in q
        assert "reference" in q
        assert "explanation" in q

print("✅ All Day 1-7 structure checks passed successfully!")

# Output data/days_1_to_7.json
json_out = os.path.abspath("../../data/days_1_to_7.json")
with open(json_out, "w", encoding="utf-8") as f:
    json.dump(days_dict, f, indent=2, ensure_ascii=False)
print(f"Saved: {json_out} ({os.path.getsize(json_out):,} bytes)")

# Output data/days_content.js
js_out = os.path.abspath("../../data/days_content.js")
with open(js_out, "w", encoding="utf-8") as f:
    f.write("// Know Him More - Complete Days 1 to 7 Content\n")
    f.write("window.DAYS_CONTENT = ")
    json.dump(days_dict, f, indent=2, ensure_ascii=False)
    f.write(";\n")
print(f"Saved: {js_out} ({os.path.getsize(js_out):,} bytes)")

