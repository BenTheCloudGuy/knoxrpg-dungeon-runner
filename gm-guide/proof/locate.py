import pymupdf
doc = pymupdf.open(r"GM-Guide-A5.pdf")
targets = ["Vos'sykriss", "BOSS: The Statue", "Drider Priestess", "Hob Gob, the Goblin King",
           "The Cells (D1)", "Dungeon Ruins (R1", "Caverns - Area 1", "Caverns - Area 2",
           "Caverns - Area 3", "Goblin Tunnels", "Goblin Camp", "The Crypts",
           "Serpents Lair (D8", "Alchemists Lab (D7)", "Floor Puzzle Hall",
           "Portal Room [Exit]", "Library & Workshop", "Grovlikk's Last Laugh",
           "The Old Cells (D10)", "The Gauntlet (D11)", "Portal Room [Exit] (D4)"]
for t in targets:
    hits = []
    for i, p in enumerate(doc):
        txt = p.get_text()
        if t in txt:
            hits.append(i+1)
    print(f"{t!r:40} -> pages {hits}")
# Also: detect a split for each boss: does 'Tactics' appear on a different page than the AC line?
print("\n--- boss split check (AC page vs Tactics page) ---")
for boss, acsnippet in [("Vos'sykriss","Armor Class 15 Hit Points 85"),
                        ("The Statue","Armor Class 19"),
                        ("Drider","Armor Class 19 (natural armor) Hit Points 123"),
                        ("Hob Gob","Armor Class 14 (natural armor) Hit Points 178")]:
    acpage=None; tacpages=[]
    for i,p in enumerate(doc):
        txt=p.get_text()
        if acsnippet in txt: acpage=i+1
    print(f"{boss:12} AC line on page {acpage}")
