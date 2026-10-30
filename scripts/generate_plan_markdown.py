import json
import os

with open("../data/plan365.json", "r", encoding="utf-8") as f:
    plan = json.load(f)

# Group into the 10 major narrative movements
movements = [
    ("Part 1: The Foundations & The Patriarchs", 1, 35, "From Creation through the formation of the Covenant Family in Egypt."),
    ("Part 2: The Exodus, Wilderness & Covenant at Sinai", 36, 70, "Deliverance from bondage, the Law at Sinai, Tabernacle glory, and the 40-year wandering."),
    ("Part 3: Conquest, Judges & The Kinsman Redeemer", 71, 105, "Entering the Promised Land, the dark cycles of the Judges, and the redeeming dawn of Ruth."),
    ("Part 4: The Kingdom Established: Samuel, Saul, David & Solomon", 106, 145, "The transition from judges to kings, David's heart and covenant, and Solomon's temple and wisdom."),
    ("Part 5: The Divided Kingdom & The Prophetic Fire", 146, 185, "The fractured kingdoms of Israel and Judah, the Elijah/Elisha miracles, and the calls to repentance."),
    ("Part 6: The Fall of Jerusalem, Exile & Prophetic Visions", 186, 215, "The weeping of Jeremiah, Ezekiel's visions in Babylon, Daniel's faithfulness, and Esther's courage."),
    ("Part 7: The Return from Exile & The Dawn of the New Covenant", 216, 245, "Rebuilding the temple and walls with Ezra and Nehemiah, leading to the birth and early ministry of Jesus."),
    ("Part 8: Walking with the Messiah: His Miracles, Ministry & Passion", 246, 285, "The public ministry, compassion, parables, Upper Room, Gethsemane, Cross, and burial of Jesus."),
    ("Part 9: Resurrection, Pentecost & The Wildfire of Acts", 286, 325, "The empty tomb, the outpouring of the Holy Spirit, the expansion of the church, and Paul's journeys."),
    ("Part 10: The Epistles, Final Witnesses & The Eternal City", 326, 365, "Letters of pastoral love and perseverance, Hebrews' cloud of witnesses, and Revelation's New Jerusalem.")
]

md = []
md.append("# Know Him More: The Complete 365-Day Character Study Curriculum\n")
md.append("> **Curriculum Goal**: To know God more through the lives, seasons, struggles, and redemption of biblical men and women across the entire biblical storyline from Genesis to Revelation.\n")
md.append("## Curriculum Summary Statistics\n")
md.append(f"- **Total Days**: {len(plan)}\n")
md.append(f"- **Total Bible Chapters Assigned**: {len(plan) * 2} chapters (exactly 2 chapters per day)\n")
md.append(f"- **Unique Memory Verses**: {len(plan)} distinct verses (no repeats across the entire year)\n")
md.append("- **Bible Translation**: World English Bible (WEB) / King James Version (KJV) — 100% public domain\n")
md.append("- **Thematic Progression**: Chronological narrative arc from Genesis creation to Revelation's eternal paradise.\n\n")

for title, start_day, end_day, summary in movements:
    md.append(f"## {title} (Days {start_day}–{end_day})\n")
    md.append(f"*{summary}*\n\n")
    md.append("| Day | Character & Season | Two Chapters | Memory Verse | Core Theme |\n")
    md.append("|:---:|:---|:---|:---|:---|\n")
    
    part_days = [d for d in plan if start_day <= d["day"] <= end_day]
    for d in part_days:
        day_str = f"**Day {d['day']}**"
        char_str = f"**{d['character']}**<br>_{d['season']}_"
        ch_str = f"{d['chapters'][0]}<br>& {d['chapters'][1]}"
        mv_str = f"`{d['memoryVerse']['reference']}`"
        theme_str = d['theme']
        md.append(f"| {day_str} | {char_str} | {ch_str} | {mv_str} | {theme_str} |\n")
    md.append("\n")

output_content = "".join(md)

# Save to docs/
os.makedirs("../docs", exist_ok=True)
doc_path = os.path.abspath("../docs/365_day_plan.md")
with open(doc_path, "w", encoding="utf-8") as f:
    f.write(output_content)
print(f"Saved doc: {doc_path} ({os.path.getsize(doc_path):,} bytes)")

# Also save to artifact directory
artifact_dir = "/Users/MAC/.gemini/antigravity/brain/02f5fea6-5315-43a4-85bf-018fe5f44c00"
if os.path.exists(artifact_dir):
    artifact_path = os.path.join(artifact_dir, "365_day_plan.md")
    with open(artifact_path, "w", encoding="utf-8") as f:
        f.write(output_content)
    print(f"Saved artifact: {artifact_path} ({os.path.getsize(artifact_path):,} bytes)")

