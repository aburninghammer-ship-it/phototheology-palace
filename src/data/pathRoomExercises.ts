/**
 * Path-specific exercises for each room
 * These are the exercises users see when directed to a room from their path training
 */

import { PathType } from "@/hooks/usePath";

export interface PathRoomExercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  duration: string;
  type: "drill" | "reflection" | "practice" | "challenge";
  icon: string;
}

export interface RoomPathExercises {
  roomId: string;
  exercises: Record<PathType, PathRoomExercise[]>;
}

// Path-specific exercises for each room
export const pathRoomExercises: Record<string, Record<PathType, PathRoomExercise[]>> = {
  // Floor 1 - Story Room
  sr: {
    visual: [
      {
        id: "sr-v-1",
        title: "Scene Builder",
        description: "Create vivid mental images of 3 Bible stories",
        instructions: [
          "Pick 3 stories from Genesis 1-11",
          "For each story, imagine the setting with colors, sounds, and textures",
          "Draw a simple sketch or describe the scene in detail",
          "Connect visual elements to key theological points"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🎨"
      },
      {
        id: "sr-v-2",
        title: "Story Sequence Gallery",
        description: "Build a visual timeline of story events",
        instructions: [
          "Choose one chapter from Genesis",
          "Create 5 distinct 'frames' for major events",
          "Add symbolic visual elements to each frame",
          "Practice recalling the story through your images"
        ],
        duration: "20 min",
        type: "drill",
        icon: "🖼️"
      },
      {
        id: "sr-v-3",
        title: "Character Portrait",
        description: "Visualize Bible characters in detail",
        instructions: [
          "Select a character from the current reading",
          "Imagine their appearance, clothing, expression",
          "Picture their environment and circumstances",
          "Link visual details to character traits"
        ],
        duration: "10 min",
        type: "reflection",
        icon: "👤"
      },
      {
        id: "sr-v-4",
        title: "Story Map Creation",
        description: "Draw a geographic or conceptual map of the story",
        instructions: [
          "Identify key locations in the story",
          "Sketch a simple map showing movement",
          "Add symbols for important events at each location",
          "Use the map to retell the story"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🗺️"
      },
      {
        id: "sr-v-5",
        title: "Color-Coded Themes",
        description: "Assign colors to recurring themes",
        instructions: [
          "Identify 3-5 themes in today's passage",
          "Assign a meaningful color to each theme",
          "Highlight or mark the text using these colors",
          "Notice patterns in theme distribution"
        ],
        duration: "12 min",
        type: "practice",
        icon: "🌈"
      }
    ],
    analytical: [
      {
        id: "sr-a-1",
        title: "Story Structure Analysis",
        description: "Break down the narrative structure",
        instructions: [
          "Identify the exposition, rising action, climax, resolution",
          "List key characters and their roles",
          "Note cause-and-effect relationships",
          "Create an outline of the story structure"
        ],
        duration: "20 min",
        type: "drill",
        icon: "📊"
      },
      {
        id: "sr-a-2",
        title: "Pattern Hunter",
        description: "Find repeated patterns in story sequences",
        instructions: [
          "Compare this story to 2 similar stories",
          "Identify 5 common structural elements",
          "Note variations and their significance",
          "Document the pattern formula"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🔍"
      },
      {
        id: "sr-a-3",
        title: "Timeline Constructor",
        description: "Build a chronological framework",
        instructions: [
          "List all events in chronological order",
          "Note time markers or transitions",
          "Identify any chronological gaps",
          "Connect to the broader biblical timeline"
        ],
        duration: "15 min",
        type: "drill",
        icon: "📅"
      },
      {
        id: "sr-a-4",
        title: "Character Relationship Map",
        description: "Analyze character connections",
        instructions: [
          "List all characters mentioned",
          "Draw lines showing relationships",
          "Label relationships (family, enemy, ally)",
          "Identify the protagonist's network"
        ],
        duration: "12 min",
        type: "practice",
        icon: "🕸️"
      },
      {
        id: "sr-a-5",
        title: "Cause-Effect Chain",
        description: "Trace the logic of narrative events",
        instructions: [
          "Pick the main conflict or problem",
          "List 5 events leading to the climax",
          "Show how each event causes the next",
          "Predict what would change if one link broke"
        ],
        duration: "15 min",
        type: "challenge",
        icon: "⛓️"
      }
    ],
    devotional: [
      {
        id: "sr-d-1",
        title: "Story Immersion Prayer",
        description: "Prayerfully enter the story as a witness",
        instructions: [
          "Read the passage slowly, pausing between verses",
          "Imagine yourself present in the scene",
          "Ask God what He wants you to see and feel",
          "Write a prayer response to what you experienced"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "🙏"
      },
      {
        id: "sr-d-2",
        title: "Character Heart Check",
        description: "Reflect on a character's inner journey",
        instructions: [
          "Choose one character from the story",
          "What emotions might they have felt?",
          "Where do you see yourself in their struggle?",
          "Pray for areas where you relate to them"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "💖"
      },
      {
        id: "sr-d-3",
        title: "God's Voice in the Story",
        description: "Listen for what God is saying through the narrative",
        instructions: [
          "Read the story asking 'What is God doing here?'",
          "Note moments of grace, judgment, or guidance",
          "Write down what God might be saying to you today",
          "End with 5 minutes of silent listening"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "👂"
      },
      {
        id: "sr-d-4",
        title: "Gratitude Discovery",
        description: "Find reasons to thank God in the story",
        instructions: [
          "List 5 things to be thankful for in this passage",
          "Connect each to something in your own life",
          "Offer specific thanksgiving prayers",
          "Journal one insight about God's character"
        ],
        duration: "12 min",
        type: "reflection",
        icon: "🌟"
      },
      {
        id: "sr-d-5",
        title: "Life Application Bridge",
        description: "Connect ancient story to modern life",
        instructions: [
          "Summarize the story in one sentence",
          "What situation in your life mirrors this story?",
          "What would faithful obedience look like today?",
          "Write a commitment statement"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🌉"
      }
    ],
    warrior: [
      {
        id: "sr-w-1",
        title: "Speed Recall Challenge",
        description: "Recall story details under time pressure",
        instructions: [
          "Read the story once (3 minutes max)",
          "Close your Bible and list 10 facts",
          "Check accuracy and note gaps",
          "Beat your score on the next attempt"
        ],
        duration: "10 min",
        type: "challenge",
        icon: "⚡"
      },
      {
        id: "sr-w-2",
        title: "Story Sequence Battle",
        description: "Put events in correct order as fast as possible",
        instructions: [
          "Write 8 story events on separate cards",
          "Shuffle and time yourself ordering them",
          "Target: Under 60 seconds",
          "Repeat until you achieve target"
        ],
        duration: "8 min",
        type: "drill",
        icon: "🏃"
      },
      {
        id: "sr-w-3",
        title: "Memory Verse Sprint",
        description: "Memorize a key verse from the story",
        instructions: [
          "Select one verse to memorize",
          "Read it 5 times out loud",
          "Write it from memory (timed)",
          "Achieve 100% accuracy in under 2 minutes"
        ],
        duration: "10 min",
        type: "challenge",
        icon: "🎯"
      },
      {
        id: "sr-w-4",
        title: "Character Quiz Blitz",
        description: "Answer rapid-fire character questions",
        instructions: [
          "Set a 3-minute timer",
          "Write as many character facts as possible",
          "Include names, actions, relationships",
          "Score: 1 point per accurate fact"
        ],
        duration: "5 min",
        type: "challenge",
        icon: "💥"
      },
      {
        id: "sr-w-5",
        title: "Story Retelling Race",
        description: "Retell the complete story in under 2 minutes",
        instructions: [
          "Record yourself retelling the story",
          "Must hit all major plot points",
          "No pauses longer than 3 seconds",
          "Review and identify gaps to improve"
        ],
        duration: "8 min",
        type: "challenge",
        icon: "🏆"
      }
    ]
  },
  
  // Floor 1 - Imagination Room
  ir: {
    visual: [
      {
        id: "ir-v-1",
        title: "Sensory Scene Building",
        description: "Engage all 5 senses in imagination",
        instructions: [
          "Pick a scene from today's reading",
          "List what you would SEE, HEAR, SMELL, TOUCH, TASTE",
          "Spend 2 minutes on each sense",
          "Write a paragraph using all senses"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🌅"
      },
      {
        id: "ir-v-2",
        title: "Emotional Color Mapping",
        description: "Visualize emotions as colors in scenes",
        instructions: [
          "Identify the dominant emotion in the passage",
          "Assign a color to that emotion",
          "Imagine the scene bathed in that color",
          "Note how color changes as emotion shifts"
        ],
        duration: "12 min",
        type: "reflection",
        icon: "🎨"
      },
      {
        id: "ir-v-3",
        title: "Camera Angle Meditation",
        description: "View the scene from different perspectives",
        instructions: [
          "Imagine the scene from above (bird's eye)",
          "Now from ground level",
          "From the protagonist's eyes",
          "From God's perspective"
        ],
        duration: "15 min",
        type: "practice",
        icon: "📷"
      },
      {
        id: "ir-v-4",
        title: "Before & After Visualization",
        description: "Imagine what happened before and after the text",
        instructions: [
          "Picture the scene 1 hour before the passage",
          "Then 1 hour after",
          "What changed? What stayed the same?",
          "Draw or write both scenes"
        ],
        duration: "15 min",
        type: "practice",
        icon: "⏳"
      },
      {
        id: "ir-v-5",
        title: "Symbol Spotting",
        description: "Find and visualize symbolic elements",
        instructions: [
          "Identify 3 potential symbols in the passage",
          "Create a vivid mental image for each",
          "Connect symbol to deeper meaning",
          "Sketch your symbolic images"
        ],
        duration: "12 min",
        type: "drill",
        icon: "🔮"
      }
    ],
    analytical: [
      {
        id: "ir-a-1",
        title: "Detail Catalogue",
        description: "Systematically list all imaginable details",
        instructions: [
          "Create categories: People, Places, Objects, Actions",
          "Fill each category with textual details",
          "Note what the text emphasizes vs. what it omits",
          "Analyze why certain details are included"
        ],
        duration: "15 min",
        type: "drill",
        icon: "📋"
      },
      {
        id: "ir-a-2",
        title: "Comparison Grid",
        description: "Compare imagined scenes with parallel passages",
        instructions: [
          "Find a parallel passage with similar imagery",
          "Create a comparison table",
          "Note similarities and differences",
          "Draw conclusions about author intent"
        ],
        duration: "20 min",
        type: "practice",
        icon: "📊"
      },
      {
        id: "ir-a-3",
        title: "Historical Context Layer",
        description: "Add accurate historical details to imagination",
        instructions: [
          "Research 3 historical facts about the setting",
          "Add these to your mental picture",
          "How does historical context change meaning?",
          "Document your enriched understanding"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🏛️"
      },
      {
        id: "ir-a-4",
        title: "Logical Gap Analysis",
        description: "Identify what's not said but implied",
        instructions: [
          "List what the text explicitly states",
          "List what must have happened but isn't stated",
          "Analyze why gaps exist",
          "How do gaps create meaning?"
        ],
        duration: "15 min",
        type: "drill",
        icon: "🔍"
      },
      {
        id: "ir-a-5",
        title: "Imagination Accuracy Check",
        description: "Test your mental images against the text",
        instructions: [
          "Write down your imagined scene in detail",
          "Re-read the passage carefully",
          "Mark what's supported by text vs. added",
          "Refine imagination to match evidence"
        ],
        duration: "12 min",
        type: "challenge",
        icon: "✅"
      }
    ],
    devotional: [
      {
        id: "ir-d-1",
        title: "Ignatian Contemplation",
        description: "Traditional imaginative prayer method",
        instructions: [
          "Ask the Holy Spirit to guide your imagination",
          "Place yourself in the scene as a bystander",
          "Watch Jesus/God at work",
          "Dialogue with Him about what you see"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "🕯️"
      },
      {
        id: "ir-d-2",
        title: "Emotional Echo",
        description: "Feel what characters felt",
        instructions: [
          "Choose one character to embody",
          "Imagine their thoughts and feelings",
          "Where does their experience touch yours?",
          "Bring those feelings to God in prayer"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "💭"
      },
      {
        id: "ir-d-3",
        title: "Divine Presence Awareness",
        description: "Imagine God's perspective in the scene",
        instructions: [
          "Picture the scene from heaven's viewpoint",
          "What does God see that characters don't?",
          "How is God working behind the scenes?",
          "Thank God for His unseen faithfulness"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "☁️"
      },
      {
        id: "ir-d-4",
        title: "Personal Scene Insertion",
        description: "Place yourself in the biblical scene",
        instructions: [
          "Imagine yourself physically present",
          "What would you say to Jesus?",
          "What would He say to you?",
          "Journal your conversation"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "🪞"
      },
      {
        id: "ir-d-5",
        title: "Healing Imagination",
        description: "Let God speak to a wound through the story",
        instructions: [
          "Ask God to bring a need to mind",
          "Read the passage with that need present",
          "How does God's action in the story speak?",
          "Receive His word for your situation"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "💝"
      }
    ],
    warrior: [
      {
        id: "ir-w-1",
        title: "60-Second Scene Build",
        description: "Construct a vivid scene in 60 seconds",
        instructions: [
          "Read a short passage",
          "Start timer: 60 seconds",
          "Write down every detail you can imagine",
          "Score: 1 point per unique, accurate detail"
        ],
        duration: "5 min",
        type: "challenge",
        icon: "⏱️"
      },
      {
        id: "ir-w-2",
        title: "Detail Retention Test",
        description: "Memorize imagined details, then recall",
        instructions: [
          "Spend 3 minutes building the scene mentally",
          "Turn away and list 15 details",
          "Check against text for accuracy",
          "Target: 12+ accurate details"
        ],
        duration: "8 min",
        type: "challenge",
        icon: "🧠"
      },
      {
        id: "ir-w-3",
        title: "Multi-Sense Speed Run",
        description: "Quickly engage all 5 senses",
        instructions: [
          "Read passage once",
          "60 seconds: list one thing for each sense",
          "Make each vivid and specific",
          "Time yourself and improve each round"
        ],
        duration: "6 min",
        type: "drill",
        icon: "👁️"
      },
      {
        id: "ir-w-4",
        title: "Scene Comparison Race",
        description: "Compare two scenes quickly",
        instructions: [
          "Read two short passages",
          "List 5 similarities and 5 differences",
          "Target time: Under 4 minutes",
          "Accuracy counts - verify each point"
        ],
        duration: "8 min",
        type: "challenge",
        icon: "⚔️"
      },
      {
        id: "ir-w-5",
        title: "Imagination Storytelling Sprint",
        description: "Retell with vivid details under pressure",
        instructions: [
          "Read the passage",
          "Record a 90-second retelling",
          "Must include 3+ sensory details",
          "Review for accuracy and vividness"
        ],
        duration: "5 min",
        type: "challenge",
        icon: "🎙️"
      }
    ]
  },

  // Floor 1 - 24FPS Room
  "24fps": {
    visual: [
      {
        id: "24fps-v-1",
        title: "Chapter Frame Creation",
        description: "Create one memorable image per chapter",
        instructions: [
          "Read the assigned chapter",
          "Identify the ONE most important moment",
          "Create a vivid, strange, memorable image for it",
          "Practice recalling the chapter by the image"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🎬"
      },
      {
        id: "24fps-v-2",
        title: "Frame Sequence Practice",
        description: "Build a strip of connected images",
        instructions: [
          "Create frames for 3 consecutive chapters",
          "Make each frame connect visually to the next",
          "Use visual transitions (color, symbol, movement)",
          "Recall all 3 in sequence"
        ],
        duration: "20 min",
        type: "drill",
        icon: "🎞️"
      },
      {
        id: "24fps-v-3",
        title: "Symbol Integration",
        description: "Embed symbols into frame images",
        instructions: [
          "Your frame must include: main event + Christ symbol",
          "Make the symbol natural to the scene",
          "The stranger the combination, the better",
          "Test: can you recall both from one prompt?"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🔗"
      },
      {
        id: "24fps-v-4",
        title: "Book Overview Frames",
        description: "Create frames for an entire book",
        instructions: [
          "Choose a short book (Ruth, Jonah, Philemon)",
          "Create 1 frame per chapter",
          "Each frame must be instantly recognizable",
          "Practice: random chapter, recall frame"
        ],
        duration: "25 min",
        type: "drill",
        icon: "📖"
      },
      {
        id: "24fps-v-5",
        title: "Cross-Reference Frame Link",
        description: "Link frames from different books",
        instructions: [
          "Find two chapters with thematic connection",
          "Create frames that visually echo each other",
          "The visual link should show the theological connection",
          "Practice recalling one when you see the other"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🔄"
      }
    ],
    analytical: [
      {
        id: "24fps-a-1",
        title: "Frame Logic Map",
        description: "Analyze why certain images work",
        instructions: [
          "Review your last 5 created frames",
          "Rate each for memorability (1-10)",
          "Identify patterns in successful frames",
          "Create rules for effective frame design"
        ],
        duration: "15 min",
        type: "drill",
        icon: "📊"
      },
      {
        id: "24fps-a-2",
        title: "Keyword-to-Frame Algorithm",
        description: "Develop a systematic approach",
        instructions: [
          "Extract 3 keywords from the chapter",
          "Convert each to an image",
          "Combine into one composite scene",
          "Document your conversion method"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🔧"
      },
      {
        id: "24fps-a-3",
        title: "Frame Optimization",
        description: "Refine existing frames for better recall",
        instructions: [
          "Select a frame you've struggled to remember",
          "Analyze what makes it weak",
          "Apply 3 memory principles to strengthen it",
          "Test recall before and after"
        ],
        duration: "12 min",
        type: "drill",
        icon: "⚙️"
      },
      {
        id: "24fps-a-4",
        title: "Category Frame System",
        description: "Create consistent frame patterns by book type",
        instructions: [
          "Choose a category: History, Poetry, Prophecy, or Epistle",
          "Identify 3 visual conventions for that category",
          "Apply conventions to 3 chapter frames",
          "Test if conventions aid memory"
        ],
        duration: "20 min",
        type: "practice",
        icon: "📁"
      },
      {
        id: "24fps-a-5",
        title: "Recall Failure Analysis",
        description: "Study and fix memory failures",
        instructions: [
          "Test yourself on 10 frames",
          "Note which you forgot or confused",
          "Identify common failure patterns",
          "Redesign failing frames"
        ],
        duration: "15 min",
        type: "challenge",
        icon: "🔬"
      }
    ],
    devotional: [
      {
        id: "24fps-d-1",
        title: "Christ Frame Focus",
        description: "Ensure Christ is central in every frame",
        instructions: [
          "Review the chapter for Christ-connections",
          "Your frame must point to Jesus",
          "Pray: 'Lord, show me Christ here'",
          "Let your frame become a worship response"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "✝️"
      },
      {
        id: "24fps-d-2",
        title: "Frame as Prayer Anchor",
        description: "Use your frame as a prayer prompt",
        instructions: [
          "Create your frame",
          "Spend 5 minutes praying through the image",
          "Let each visual element spark prayer",
          "Journal insights that emerge"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "🙏"
      },
      {
        id: "24fps-d-3",
        title: "Gratitude Frame",
        description: "Build frame around thankfulness",
        instructions: [
          "What in this chapter makes you grateful?",
          "Build your frame around that gratitude",
          "Make the feeling part of the image",
          "Return to this frame when you need encouragement"
        ],
        duration: "12 min",
        type: "reflection",
        icon: "🌟"
      },
      {
        id: "24fps-d-4",
        title: "Frame Meditation Walk",
        description: "Walk through frames in contemplative sequence",
        instructions: [
          "Select a book you've framed",
          "Slowly walk through each frame mentally",
          "Pause at each one to pray",
          "Notice what the Spirit highlights"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "🚶"
      },
      {
        id: "24fps-d-5",
        title: "Personal Application Frame",
        description: "Include yourself in the frame",
        instructions: [
          "Where does this chapter touch your life?",
          "Place yourself in the frame somehow",
          "How does God's message become personal?",
          "Commit to one action from this frame"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "🪞"
      }
    ],
    warrior: [
      {
        id: "24fps-w-1",
        title: "Speed Frame Challenge",
        description: "Create a frame in under 3 minutes",
        instructions: [
          "Read chapter summary (30 seconds)",
          "Create frame (2 minutes)",
          "Write description (30 seconds)",
          "Test recall 1 hour later"
        ],
        duration: "5 min",
        type: "challenge",
        icon: "⚡"
      },
      {
        id: "24fps-w-2",
        title: "Frame Battle",
        description: "Create frames faster than your best time",
        instructions: [
          "Set timer",
          "Create 3 frames for 3 chapters",
          "Record time",
          "Try to beat it tomorrow"
        ],
        duration: "10 min",
        type: "challenge",
        icon: "⚔️"
      },
      {
        id: "24fps-w-3",
        title: "Random Recall Test",
        description: "Test frame recall under pressure",
        instructions: [
          "Have someone call out random chapter numbers",
          "Recall frame in 5 seconds or less",
          "Score: correct recalls / attempts",
          "Target: 80%+ accuracy"
        ],
        duration: "8 min",
        type: "challenge",
        icon: "🎯"
      },
      {
        id: "24fps-w-4",
        title: "Book Speed Run",
        description: "Create all frames for a book quickly",
        instructions: [
          "Choose a short book",
          "Create ALL chapter frames",
          "Time limit: 30 seconds per chapter",
          "Test full book recall"
        ],
        duration: "15 min",
        type: "drill",
        icon: "🏃"
      },
      {
        id: "24fps-w-5",
        title: "Frame Chain Challenge",
        description: "Link frames in unbroken sequence",
        instructions: [
          "Choose 5 consecutive chapters",
          "Recall all 5 frames in order",
          "No pauses longer than 3 seconds",
          "Restart if chain breaks"
        ],
        duration: "8 min",
        type: "challenge",
        icon: "🔗"
      }
    ]
  },

  // Floor 2 - Observation Room
  or: {
    visual: [
      {
        id: "or-v-1",
        title: "Visual Detail Hunt",
        description: "Find and illustrate textual details",
        instructions: [
          "Read the passage once",
          "List every visual detail mentioned",
          "Create a sketch including all details",
          "Compare sketch to mental image"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🔍"
      },
      {
        id: "or-v-2",
        title: "Color Observation Log",
        description: "Note all color and light references",
        instructions: [
          "Scan passage for color words",
          "Note implied colors (gold = wealth, etc.)",
          "Create a color palette for the passage",
          "What mood does this palette create?"
        ],
        duration: "12 min",
        type: "drill",
        icon: "🎨"
      },
      {
        id: "or-v-3",
        title: "Movement Mapping",
        description: "Track all physical movements in text",
        instructions: [
          "List every verb of motion",
          "Draw movement paths on a scene sketch",
          "Note direction, speed, purpose",
          "What do movements reveal?"
        ],
        duration: "15 min",
        type: "practice",
        icon: "➡️"
      },
      {
        id: "or-v-4",
        title: "Setting Snapshot",
        description: "Observe and capture the physical setting",
        instructions: [
          "List all location details",
          "Indoor/outdoor? Time of day?",
          "Physical objects present?",
          "Draw or describe the complete setting"
        ],
        duration: "12 min",
        type: "drill",
        icon: "📍"
      },
      {
        id: "or-v-5",
        title: "Character Appearance Notes",
        description: "Observe physical descriptions",
        instructions: [
          "List any physical details about characters",
          "Note clothing, posture, expressions",
          "What's NOT described that you'd expect?",
          "Sketch character based only on text"
        ],
        duration: "15 min",
        type: "practice",
        icon: "👤"
      }
    ],
    analytical: [
      {
        id: "or-a-1",
        title: "50 Observations Challenge",
        description: "List 50 distinct observations",
        instructions: [
          "Read passage carefully",
          "List 50 separate observations",
          "No interpretation - just facts",
          "Categorize: Who, What, When, Where, How"
        ],
        duration: "25 min",
        type: "drill",
        icon: "📝"
      },
      {
        id: "or-a-2",
        title: "Word Frequency Analysis",
        description: "Track repeated words and phrases",
        instructions: [
          "List every word that appears 2+ times",
          "Count occurrences",
          "Why might these be repeated?",
          "Note root word variations"
        ],
        duration: "15 min",
        type: "drill",
        icon: "📊"
      },
      {
        id: "or-a-3",
        title: "Structural Observation",
        description: "Observe how the text is organized",
        instructions: [
          "Note paragraph/section breaks",
          "Identify transitional words",
          "Find lists, contrasts, parallels",
          "Create a structural outline"
        ],
        duration: "15 min",
        type: "practice",
        icon: "🏗️"
      },
      {
        id: "or-a-4",
        title: "Grammar Detective",
        description: "Observe grammatical features",
        instructions: [
          "Note verb tenses used",
          "Identify pronouns and their referents",
          "Find conjunctions and their function",
          "What do grammar choices reveal?"
        ],
        duration: "15 min",
        type: "drill",
        icon: "📖"
      },
      {
        id: "or-a-5",
        title: "Comparison Observation",
        description: "Compare text across translations",
        instructions: [
          "Read in 3 different translations",
          "Note differences in word choice",
          "List variations in structure",
          "What do differences highlight?"
        ],
        duration: "20 min",
        type: "practice",
        icon: "⚖️"
      }
    ],
    devotional: [
      {
        id: "or-d-1",
        title: "Slow Reading Practice",
        description: "Read with prayerful attention",
        instructions: [
          "Read one verse at a time",
          "Pause after each to ask: 'What do I notice?'",
          "Thank God for each observation",
          "Journal what stands out most"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "🐢"
      },
      {
        id: "or-d-2",
        title: "Divine Details",
        description: "Notice what God chose to include",
        instructions: [
          "List 10 specific details in the text",
          "For each: 'Why might God include this?'",
          "What does this detail teach about God?",
          "Praise God for His intentionality"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "✨"
      },
      {
        id: "or-d-3",
        title: "Personal Spotlight",
        description: "Notice what speaks to you personally",
        instructions: [
          "Read through once normally",
          "What phrase 'glows' or stands out?",
          "Why might God be highlighting this?",
          "Pray about what you've noticed"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "💡"
      },
      {
        id: "or-d-4",
        title: "Observation to Worship",
        description: "Turn observations into praise",
        instructions: [
          "Make 20 observations",
          "Convert 5 into statements of praise",
          "Convert 5 into prayers of thanks",
          "Speak them aloud to God"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "🙌"
      },
      {
        id: "or-d-5",
        title: "Observation Journal",
        description: "Create a devotional observation log",
        instructions: [
          "Create two columns: 'I Notice' and 'I Wonder'",
          "Fill 10 rows",
          "Bring your 'I Wonder' items to God",
          "Listen for His response"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "📓"
      }
    ],
    warrior: [
      {
        id: "or-w-1",
        title: "Observation Sprint",
        description: "List as many observations as possible in 5 minutes",
        instructions: [
          "Read passage once (2 minutes)",
          "Set 5-minute timer",
          "Write observations continuously",
          "Score: total unique, accurate observations"
        ],
        duration: "8 min",
        type: "challenge",
        icon: "⏱️"
      },
      {
        id: "or-w-2",
        title: "Detail Accuracy Test",
        description: "Test observation precision",
        instructions: [
          "Read passage once",
          "Close Bible and answer 10 detail questions",
          "Check answers for accuracy",
          "Target: 90%+ correct"
        ],
        duration: "10 min",
        type: "challenge",
        icon: "🎯"
      },
      {
        id: "or-w-3",
        title: "Observation Categories Race",
        description: "Fill each category fastest",
        instructions: [
          "Categories: People, Places, Actions, Objects, Time",
          "Fill each with 3+ observations",
          "Time yourself",
          "Beat your record each attempt"
        ],
        duration: "8 min",
        type: "drill",
        icon: "🏃"
      },
      {
        id: "or-w-4",
        title: "Missing Detail Challenge",
        description: "Find what others miss",
        instructions: [
          "After normal observation session",
          "Find 10 MORE details you missed",
          "These should be genuinely new",
          "The deeper you go, the more you find"
        ],
        duration: "10 min",
        type: "challenge",
        icon: "🔬"
      },
      {
        id: "or-w-5",
        title: "Observation Battle",
        description: "Compete for most observations",
        instructions: [
          "With a partner, read same passage",
          "Each makes independent list",
          "Compare: unique observations score points",
          "Shared observations = 0 points"
        ],
        duration: "12 min",
        type: "challenge",
        icon: "⚔️"
      }
    ]
  },

  // Floor 4 - Concentration Room (Christ in Every Chapter)
  cr: {
    visual: [
      {
        id: "cr-v-1",
        title: "Christ Portrait Gallery",
        description: "Visualize Christ in the passage",
        instructions: [
          "Read asking: 'Where is Christ here?'",
          "Create a visual of Christ's role/presence",
          "Make it memorable and vivid",
          "Connect visual to specific verses"
        ],
        duration: "15 min",
        type: "practice",
        icon: "👑"
      },
      {
        id: "cr-v-2",
        title: "Type-Shadow Visualization",
        description: "See Christ in Old Testament types",
        instructions: [
          "Identify a type of Christ in the passage",
          "Create parallel images: type and fulfillment",
          "Visual should show the connection",
          "Practice seeing the shadow pointing forward"
        ],
        duration: "15 min",
        type: "drill",
        icon: "🪞"
      },
      {
        id: "cr-v-3",
        title: "Christ's Actions Illustrated",
        description: "Visualize what Christ does in/through the text",
        instructions: [
          "What action of Christ is shown or implied?",
          "Create an action scene visualization",
          "Include before/after state",
          "Make Christ central in the composition"
        ],
        duration: "15 min",
        type: "practice",
        icon: "⚡"
      },
      {
        id: "cr-v-4",
        title: "Gospel Connection Map",
        description: "Visual map from text to Gospel",
        instructions: [
          "Draw the passage's main theme as an image",
          "Draw the Gospel core as another image",
          "Create visual bridges between them",
          "The bridge IS your Christ connection"
        ],
        duration: "20 min",
        type: "practice",
        icon: "🌉"
      },
      {
        id: "cr-v-5",
        title: "Christ's Names Visualization",
        description: "Picture Christ's names and titles",
        instructions: [
          "What name/title of Christ fits this passage?",
          "Create an image that embodies that name",
          "Root it in specific textual evidence",
          "Build a gallery of Christ's names"
        ],
        duration: "12 min",
        type: "drill",
        icon: "📛"
      }
    ],
    analytical: [
      {
        id: "cr-a-1",
        title: "Christological Analysis Grid",
        description: "Systematic Christ-finding method",
        instructions: [
          "Categories: Type, Promise, Attribute, Work, Word",
          "Find Christ in each category if present",
          "Document verse references",
          "Note which categories are strongest"
        ],
        duration: "20 min",
        type: "drill",
        icon: "📊"
      },
      {
        id: "cr-a-2",
        title: "Cross-Reference Chain",
        description: "Build a chain of Christ connections",
        instructions: [
          "Find Christ reference in passage",
          "Find 3 NT verses that connect",
          "Create a logical chain of evidence",
          "Document the christological argument"
        ],
        duration: "20 min",
        type: "practice",
        icon: "🔗"
      },
      {
        id: "cr-a-3",
        title: "Before-Christ / After-Christ",
        description: "Analyze how Christ transforms meaning",
        instructions: [
          "How did original audience understand this?",
          "How does Christ's coming change meaning?",
          "What new dimensions does the Gospel add?",
          "Document the transformation"
        ],
        duration: "15 min",
        type: "drill",
        icon: "⏳"
      },
      {
        id: "cr-a-4",
        title: "Redemptive-Historical Placement",
        description: "Place text in redemption timeline",
        instructions: [
          "Where does this text sit in redemption history?",
          "What came before pointing to Christ?",
          "What comes after that Christ fulfills?",
          "Map the text's place in the grand story"
        ],
        duration: "15 min",
        type: "practice",
        icon: "📅"
      },
      {
        id: "cr-a-5",
        title: "Multiple Christ Connections",
        description: "Find every possible connection",
        instructions: [
          "Challenge: find 5+ Christ connections",
          "Each must be textually defensible",
          "Rate each connection's strength",
          "Present your strongest case"
        ],
        duration: "20 min",
        type: "challenge",
        icon: "🎯"
      }
    ],
    devotional: [
      {
        id: "cr-d-1",
        title: "Christ Encounter Prayer",
        description: "Meet Jesus in the passage",
        instructions: [
          "Read asking: 'Lord, show me Yourself'",
          "When you find Christ, pause",
          "Spend time in worship and thanks",
          "Journal your encounter"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "🙏"
      },
      {
        id: "cr-d-2",
        title: "Gospel Gratitude",
        description: "Thank God for Christ in the text",
        instructions: [
          "Identify how Christ appears in the passage",
          "Write 5 thanksgiving statements",
          "Pray each one aloud",
          "End with a song of praise"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "🎵"
      },
      {
        id: "cr-d-3",
        title: "Personal Gospel Application",
        description: "Apply Christ's work to your life",
        instructions: [
          "Where does this passage show Christ's work?",
          "How does that work apply to you today?",
          "What does Christ's presence mean for your situation?",
          "Respond with commitment or surrender"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "💖"
      },
      {
        id: "cr-d-4",
        title: "Cross-Centered Meditation",
        description: "Trace everything to the cross",
        instructions: [
          "Find the passage's main theme",
          "How does this connect to Calvary?",
          "Spend 10 minutes at the cross mentally",
          "What does the cross accomplish for you here?"
        ],
        duration: "20 min",
        type: "reflection",
        icon: "✝️"
      },
      {
        id: "cr-d-5",
        title: "Christ's Love Letter",
        description: "Hear Christ speaking through the text",
        instructions: [
          "Read as if Christ is speaking to you",
          "What is He saying about His love?",
          "Write a response letter to Jesus",
          "Read both aloud as a dialogue"
        ],
        duration: "15 min",
        type: "reflection",
        icon: "💌"
      }
    ],
    warrior: [
      {
        id: "cr-w-1",
        title: "Christ-Finding Speed Run",
        description: "Find Christ connections quickly",
        instructions: [
          "Read any chapter",
          "Find 3 Christ connections in 5 minutes",
          "Each must be specific and defensible",
          "Time pressure reveals true understanding"
        ],
        duration: "8 min",
        type: "challenge",
        icon: "⚡"
      },
      {
        id: "cr-w-2",
        title: "Concentration Drill",
        description: "Rapid-fire Christ identification",
        instructions: [
          "Someone reads 5 random verses",
          "For each: state Christ connection in 30 seconds",
          "Score: valid connections / attempts",
          "Target: 80%+ hit rate"
        ],
        duration: "10 min",
        type: "drill",
        icon: "🎯"
      },
      {
        id: "cr-w-3",
        title: "Book Sweep Challenge",
        description: "Find Christ in every chapter of a book",
        instructions: [
          "Choose a short book",
          "Find one Christ connection per chapter",
          "Time limit: 2 minutes per chapter",
          "Review for quality and accuracy"
        ],
        duration: "20 min",
        type: "challenge",
        icon: "📚"
      },
      {
        id: "cr-w-4",
        title: "Defense Battle",
        description: "Defend your Christ connection",
        instructions: [
          "State your Christ connection",
          "Partner challenges: 'Prove it!'",
          "Give 3 supporting points",
          "Partner rates strength 1-10"
        ],
        duration: "10 min",
        type: "challenge",
        icon: "⚔️"
      },
      {
        id: "cr-w-5",
        title: "Christ Connection Competition",
        description: "Most connections wins",
        instructions: [
          "Same passage, same time limit",
          "List as many Christ connections as possible",
          "Quality counts: weak connections = 0.5 points",
          "Most points wins"
        ],
        duration: "12 min",
        type: "challenge",
        icon: "🏆"
      }
    ]
  }
};

// Default exercises for rooms not yet specifically defined
export const getDefaultPathExercises = (roomId: string, roomName: string): Record<PathType, PathRoomExercise[]> => ({
  visual: [
    {
      id: `${roomId}-v-default-1`,
      title: `${roomName} Visual Practice`,
      description: `Apply visual learning techniques to ${roomName} content`,
      instructions: [
        "Read the assigned material",
        "Create a vivid mental image of key concepts",
        "Draw or sketch your understanding",
        "Practice recalling through visualization"
      ],
      duration: "15 min",
      type: "practice",
      icon: "🎨"
    }
  ],
  analytical: [
    {
      id: `${roomId}-a-default-1`,
      title: `${roomName} Analysis`,
      description: `Apply analytical methods to ${roomName} content`,
      instructions: [
        "Read the assigned material systematically",
        "Identify patterns and structures",
        "Create logical connections",
        "Document your analysis"
      ],
      duration: "15 min",
      type: "drill",
      icon: "🔬"
    }
  ],
  devotional: [
    {
      id: `${roomId}-d-default-1`,
      title: `${roomName} Devotional Study`,
      description: `Apply prayerful reflection to ${roomName} content`,
      instructions: [
        "Begin with prayer for understanding",
        "Read slowly and contemplatively",
        "Journal your reflections",
        "End with prayer response"
      ],
      duration: "15 min",
      type: "reflection",
      icon: "🙏"
    }
  ],
  warrior: [
    {
      id: `${roomId}-w-default-1`,
      title: `${roomName} Challenge`,
      description: `Apply speed and precision to ${roomName} content`,
      instructions: [
        "Set a timer for the exercise",
        "Complete the assigned task quickly",
        "Check for accuracy",
        "Beat your previous time"
      ],
      duration: "10 min",
      type: "challenge",
      icon: "⚔️"
    }
  ]
});

// Get exercises for a specific room and path
export const getRoomExercisesForPath = (roomId: string, pathType: PathType, roomName: string): PathRoomExercise[] => {
  const roomExercises = pathRoomExercises[roomId];
  if (roomExercises && roomExercises[pathType]) {
    return roomExercises[pathType];
  }
  return getDefaultPathExercises(roomId, roomName)[pathType];
};

// Get all exercises for a room (all paths)
export const getAllRoomExercises = (roomId: string, roomName: string): Record<PathType, PathRoomExercise[]> => {
  return pathRoomExercises[roomId] || getDefaultPathExercises(roomId, roomName);
};
