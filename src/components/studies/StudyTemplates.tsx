import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  BookOpen, 
  Sparkles, 
  Users, 
  ScrollText,
  User,
  Layers,
  MessageSquare,
  Building2,
  Flame,
  Crown,
  Compass
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  color: string;
  palaceRooms: string[];
  content: string;
}

const STUDY_TEMPLATES: Template[] = [
  {
    id: "verse-analysis",
    name: "Verse Analysis",
    description: "Deep dive into a single verse with observation, interpretation, and application",
    icon: BookOpen,
    color: "text-blue-500 bg-blue-500/10",
    palaceRooms: ["Observation", "Imagination", "Concentration"],
    content: `# Verse Analysis

**Verse:** [Book Chapter:Verse]

**Text:**
[Insert verse text here]

---

## 🔍 Observation (OR)
*What do I notice in this verse?*

**Key Words:**
- 

**Context:**
- What comes before?
- What comes after?

**Details I Notice:**
- 

---

## 💡 Interpretation (IR)
*What does this mean?*

**Original Meaning:**


**Cross-References:**
- 

---

## ✝️ Christ Connection (CR)
*How does this reveal Christ?*


---

## 🏛️ Palace Rooms Applied
- **OR (Observation):** 
- **IR (Imagination):** 
- **CR (Concentration):** 

---

## 🎯 Application
*How does this apply to my life today?*


---

## 🙏 Prayer
[Write a prayer based on this verse]`,
  },
  {
    id: "chapter-study",
    name: "Chapter Study",
    description: "Comprehensive analysis using the 5 Dimensions framework",
    icon: FileText,
    color: "text-purple-500 bg-purple-500/10",
    palaceRooms: ["Story", "Dimensions", "Connect-6"],
    content: `# Chapter Study

**Book & Chapter:** [Book Chapter]

---

## 📖 Overview
**Main Theme:**

**Key Events:**
1. 
2. 
3. 

**Important Characters:**
- 

---

## 📝 Verse-by-Verse Notes
[Take notes on key verses]

| Verse | Observation | Insight |
|-------|-------------|---------|
|       |             |         |

---

## 🔷 Five Dimensions (5D)
1. **Literal:** What actually happened?

2. **Christ:** How does this point to Christ?

3. **Personal:** What does this mean for me?

4. **Church:** What does this mean for the church?

5. **Heaven:** What does this reveal about eternity?

---

## 🔗 Cross-References
- 

---

## 💎 Key Takeaways
1. 
2. 
3. 

---

## 🎯 Application
*How will I apply this today?*`,
  },
  {
    id: "theme-study",
    name: "Theme Study",
    description: "Trace a biblical theme from Genesis to Revelation",
    icon: Flame,
    color: "text-amber-500 bg-amber-500/10",
    palaceRooms: ["Patterns", "Room 66", "Concentration"],
    content: `# Theme Study

**Theme:** [Your theme here]

---

## 📚 Definition
*What is this theme about?*


---

## 📜 Old Testament Foundation

### Genesis/Pentateuch
- 

### Historical Books
- 

### Prophets
- 

### Psalms/Wisdom
- 

---

## ✝️ New Testament Fulfillment

### Gospels
- 

### Acts/Epistles
- 

### Revelation
- 

---

## 🏛️ Christ Connection (CR)
*How does Christ fulfill or embody this theme?*


---

## 🔢 Key Verses (Room 66 Trace)
1. **Genesis:**
2. **Exodus:**
3. **Psalms:**
4. **Isaiah:**
5. **Gospels:**
6. **Revelation:**

---

## 🔷 Patterns Discovered
- 

---

## 🎯 Personal Application
*How does this theme apply to my life?*


---

## ❓ Questions to Explore
- 
- `,
  },
  {
    id: "prophecy-study",
    name: "Prophecy Study",
    description: "Analyze prophecy using the Vision Floor framework",
    icon: ScrollText,
    color: "text-red-500 bg-red-500/10",
    palaceRooms: ["Prophecy", "Sanctuary", "Three Heavens"],
    content: `# Prophecy Study

**Prophecy:** [Reference]
**Prophet:** [Name]

---

## 📖 The Text
[Insert the prophecy text]

---

## 🔍 Historical Context
**When was this written?**

**To whom?**

**Why?**

---

## 🏛️ Sanctuary Connection (Blue Room)
*How does this relate to the sanctuary?*

- **Outer Court:**
- **Holy Place:**
- **Most Holy Place:**

---

## ⏰ Three Heavens Framework
*Which "Day of the Lord" does this address?*

- [ ] **1H (DoL¹/NE¹):** Babylon/Restoration
- [ ] **2H (DoL²/NE²):** 70 AD/New Covenant
- [ ] **3H (DoL³/NE³):** Final New Creation

**Evidence:**


---

## ✝️ Christ Connection
*How is Christ revealed in this prophecy?*


---

## 🔗 Cross-References
- **Daniel:**
- **Revelation:**
- **Other:**

---

## 📝 Key Insights


---

## 🎯 Application
*What does this prophecy mean for us today?*`,
  },
  {
    id: "character-study",
    name: "Character Study",
    description: "Study a biblical figure as a type of Christ",
    icon: User,
    color: "text-green-500 bg-green-500/10",
    palaceRooms: ["Story", "Typology", "Parallels"],
    content: `# Character Study

**Character:** [Name]
**Key Passages:** [References]

---

## 📖 Story Summary
*Tell the story in your own words*


---

## 🏛️ Story Room (SR) - Key Events

| Event | Reference | Significance |
|-------|-----------|--------------|
|       |           |              |

---

## 👤 Character Traits
**Strengths:**
- 

**Weaknesses:**
- 

**Key Decisions:**
- 

---

## ✝️ Type of Christ (Typology)
*How does this person foreshadow Christ?*

| Aspect | Character | Christ |
|--------|-----------|--------|
|        |           |        |

---

## 🔄 Parallels with Other Figures
*Who else in Scripture mirrors this person?*

- **Parallel 1:**
- **Parallel 2:**

---

## 💎 Gems Discovered
*What insights stand out?*

1. 
2. 
3. 

---

## 🎯 Application
*What can I learn from this person's life?*`,
  },
  {
    id: "typology-study",
    name: "Typology Study",
    description: "Connect Old Testament types with New Testament fulfillment",
    icon: Layers,
    color: "text-indigo-500 bg-indigo-500/10",
    palaceRooms: ["Symbols/Types", "Parallels", "Concentration"],
    content: `# Typology Study

**Type:** [Old Testament element]
**Antitype:** [New Testament fulfillment]

---

## 📜 The Type (Shadow)
**Reference:** [OT Passage]

**Description:**


**Key Features:**
1. 
2. 
3. 

---

## ✝️ The Antitype (Reality)
**Reference:** [NT Passage]

**How Christ fulfills this:**


**Key Connections:**
1. 
2. 
3. 

---

## 🔷 Comparison Table

| Type (OT) | Antitype (Christ/NT) |
|-----------|---------------------|
|           |                     |
|           |                     |
|           |                     |

---

## 📖 Supporting Verses
- 

---

## 🏛️ Palace Rooms Applied
- **ST (Symbols/Types):**
- **P‖ (Parallels):**
- **CR (Concentration):**

---

## 💎 Key Insight
*What is the main takeaway?*


---

## 🎯 Application
*How does understanding this type deepen my faith?*`,
  },
  {
    id: "parable-study",
    name: "Parable Study",
    description: "Unpack Jesus' parables using multiple dimensions",
    icon: MessageSquare,
    color: "text-teal-500 bg-teal-500/10",
    palaceRooms: ["Imagination", "Dimensions", "Application"],
    content: `# Parable Study

**Parable:** [Name]
**Reference:** [Book Chapter:Verses]

---

## 📖 The Story
[Write out or summarize the parable]

---

## 🎭 Characters & Elements

| Element | What It Represents |
|---------|-------------------|
|         |                   |

---

## 🔍 Context
**Who was Jesus speaking to?**

**What prompted this parable?**

**Cultural background:**

---

## 🔷 Five Dimensions

1. **Surface Story:** What literally happened?

2. **Christ:** How does this reveal Christ?

3. **Personal:** What does this mean for me?

4. **Church:** What does this mean for God's people?

5. **Kingdom:** What does this teach about God's kingdom?

---

## 🏛️ Imagination Room (IR)
*Step inside the story. What do you see, hear, feel?*


---

## 🔗 Cross-References
- Other parables on same theme:
- OT connections:

---

## 💎 Main Teaching
*What is the central truth?*


---

## 🎯 Application
*How should I respond?*`,
  },
  {
    id: "palace-room-study",
    name: "Palace Room Deep Dive",
    description: "Master a specific Phototheology room through practice",
    icon: Building2,
    color: "text-primary bg-primary/10",
    palaceRooms: ["Any Room"],
    content: `# Palace Room Deep Dive

**Room:** [Room Name & Code]
**Floor:** [Floor Number]
**Passage:** [Scripture Reference]

---

## 🏛️ Room Overview
**Purpose of this room:**

**Key questions this room answers:**
1. 
2. 
3. 

---

## 📖 Selected Passage
[Insert passage text]

---

## 🔧 Applying the Room

### Step 1:

### Step 2:

### Step 3:

---

## 💎 Discoveries
*What did this room reveal about the passage?*

1. 
2. 
3. 

---

## 🔗 Connections Made
*What other verses/passages does this connect to?*

- 

---

## ✝️ Christ Connection
*How did this room help me see Christ?*


---

## 📈 Mastery Notes
*What did I learn about using this room?*

**What worked well:**

**What I'll try next time:**

---

## 🎯 Application
*How will I apply what I learned?*`,
  },
  {
    id: "sermon-notes",
    name: "Sermon Notes",
    description: "Capture and process sermon insights",
    icon: Users,
    color: "text-slate-500 bg-slate-500/10",
    palaceRooms: ["Listening", "Gems"],
    content: `# Sermon Notes

**Date:** [Date]
**Speaker:** [Name]
**Title:** [Sermon Title]
**Text:** [Scripture Reference]

---

## 📝 Main Points
1. 

2. 

3. 

---

## 💬 Key Quotes
> "[Quote 1]"

> "[Quote 2]"

---

## 📖 Scripture References
- 
- 

---

## 💡 Personal Insights
*What stood out to me:*


---

## 🏛️ Palace Rooms Activated
*Which rooms did this sermon touch?*

- 

---

## 💎 Gems (GR)
*Insights worth preserving:*

1. 
2. 

---

## 🎯 Application
*How will I apply this week:*


---

## 🙏 Prayer Requests
- `,
  },
  {
    id: "devotional",
    name: "Daily Devotional",
    description: "Simple format for daily quiet time",
    icon: Crown,
    color: "text-yellow-500 bg-yellow-500/10",
    palaceRooms: ["Fire", "Meditation"],
    content: `# Daily Devotional

**Date:** [Date]
**Passage:** [Reference]

---

## 📖 Read
[Write out or summarize the passage]

---

## 🔥 Fire Room (FRm)
*What moves my heart in this passage?*


---

## 💭 Meditation Room (MR)
*Slow down. What phrase or word stands out?*

**The phrase:**

**Why it stands out:**

---

## ✝️ See Christ
*Where is Jesus in this passage?*


---

## 🪞 Reflect
*What is God saying to me today?*


---

## 🎯 Respond
*What will I do differently today?*


---

## 🙏 Pray
[Write your prayer]`,
  },
  {
    id: "book-overview",
    name: "Book Overview",
    description: "Survey an entire book of the Bible",
    icon: Compass,
    color: "text-orange-500 bg-orange-500/10",
    palaceRooms: ["24FPS", "Bible Rendered", "Cycles"],
    content: `# Book Overview

**Book:** [Book Name]
**Author:** [Author]
**Date Written:** [Approximate date]
**Audience:** [Original audience]

---

## 📚 Overview
**Genre:** 

**Main Theme:**

**Key Verse:**

---

## 🎥 24FPS Summary
*Create a mental image for each chapter*

| Ch | Image/Symbol | Key Event |
|----|--------------|-----------|
| 1  |              |           |
| 2  |              |           |
| 3  |              |           |

---

## 📖 Structure/Outline
1. 
2. 
3. 

---

## 🔄 Cycle Placement
**Which cycle does this book belong to?**
- [ ] @Ad (Adamic)
- [ ] @No (Noahic)  
- [ ] @Ab (Abrahamic)
- [ ] @Mo (Mosaic)
- [ ] @Cy (Cyrusic)
- [ ] @CyC (Cyrus-Christ)
- [ ] @Sp (Holy Spirit)
- [ ] @Re (Remnant)

---

## ✝️ Christ in This Book
*How is Christ revealed?*


---

## 🔗 Connections
**Books it connects to:**
- 

**Key cross-references:**
- 

---

## 💎 Key Takeaways
1. 
2. 
3. 

---

## 🎯 Why This Book Matters Today`,
  },
];

interface StudyTemplatesProps {
  onSelect: (template: { name: string; content: string }) => void;
}

export const StudyTemplates = ({ onSelect }: StudyTemplatesProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (template: Template) => {
    onSelect({ name: template.name, content: template.content });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose a Study Template</DialogTitle>
          <p className="text-muted-foreground">
            Each template is designed around Phototheology principles and Palace Rooms
          </p>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid md:grid-cols-2 gap-3">
            {STUDY_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className="p-4 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all group"
                  onClick={() => handleSelect(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg ${template.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.palaceRooms.map((room) => (
                          <Badge key={room} variant="outline" className="text-xs py-0">
                            🏛️ {room}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
