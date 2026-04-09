export interface PodcastEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  audioFile: string;
  duration: string;
  floor?: number;
}

export const PODCAST_EPISODES: PodcastEpisode[] = [
  // ── Floor 1: Furnishing ──
  {
    id: "ep-01",
    episodeNumber: 1,
    title: "The Eight-Floor Biblical Memory Palace",
    description:
      "Discover the architecture of the eight-floor memory palace and how each floor maps to a distinct layer of biblical study and spiritual growth.",
    audioFile: "The_eight_floor_biblical_memory_palace.m4a",
    duration: "48 min",
    floor: 1,
  },
  {
    id: "ep-02",
    episodeNumber: 2,
    title: "Building Your Mental Story Room",
    description:
      "Step inside Floor 1's Story Room and learn how to store Bible narratives as vivid mental movies you can recall on command.",
    audioFile: "Building_your_mental_story_room.m4a",
    duration: "35 min",
    floor: 1,
  },
  {
    id: "ep-03",
    episodeNumber: 3,
    title: "Inhabit the Biblical Imagination Room",
    description:
      "Enter the Imagination Room and learn to inhabit biblical scenes — placing yourself inside the text to unlock deeper understanding.",
    audioFile: "Inhabit_the_biblical_imagination_room.m4a",
    duration: "54 min",
    floor: 1,
  },
  {
    id: "ep-04",
    episodeNumber: 4,
    title: "Turning Scripture into 24FPS Mental Movies",
    description:
      "Master the technique of converting Scripture passages into smooth, cinematic mental movies that play at 24 frames per second in your mind's eye.",
    audioFile: "Turning_scripture_into_24FPS_mental_movies.m4a",
    duration: "19 min",
    floor: 1,
  },
  {
    id: "ep-05",
    episodeNumber: 5,
    title: "Map the Bible in 51 Symbols",
    description:
      "Learn the 51 core biblical symbols that form a visual shorthand for the entire narrative arc of Scripture — from Genesis to Revelation.",
    audioFile: "Map_the_Bible_in_51_symbols.m4a",
    duration: "54 min",
    floor: 1,
  },
  {
    id: "ep-06",
    episodeNumber: 6,
    title: "Visualizing Text for a Living Library",
    description:
      "Transform written text into a living library of visual memories — techniques for long-term retention and instant recall of biblical content.",
    audioFile: "Visualizing_text_for_a_living_library.m4a",
    duration: "37 min",
    floor: 1,
  },
  {
    id: "ep-07",
    episodeNumber: 7,
    title: "Archiving Sacred Insights in the Gems Room",
    description:
      "Learn to capture and archive your most precious biblical insights in the Gems Room — a personal treasury of spiritual discoveries.",
    audioFile: "Archiving_Sacred_Insights_in_the_Gems_Room.m4a",
    duration: "46 min",
    floor: 1,
  },
  // ── Floor 2: Investigation ──
  {
    id: "ep-08",
    episodeNumber: 8,
    title: "Forensic Methods for Precise Scriptural Meaning",
    description:
      "Dive into Floor 2's investigative approach — learn forensic methods for extracting precise meaning from biblical texts through careful analysis.",
    audioFile: "Forensic_Methods_for_Precise_Scriptural_Meaning.m4a",
    duration: "40 min",
    floor: 2,
  },
  {
    id: "ep-09",
    episodeNumber: 9,
    title: "Biblical Symbols and the Prophetic Blueprint",
    description:
      "Explore how biblical symbols weave together into a prophetic blueprint — connecting typology, imagery, and prophetic patterns across Scripture.",
    audioFile: "Biblical_Symbols_and_the_Prophetic_Blueprint.m4a",
    duration: "40 min",
    floor: 2,
  },
  {
    id: "ep-10",
    episodeNumber: 10,
    title: "Building Unbreakable Logical Chains",
    description:
      "Learn to construct airtight logical chains from Scripture — linking verses, contexts, and principles into arguments that hold under scrutiny.",
    audioFile: "Building_Unbreakable_Logical_Chains.m4a",
    duration: "40 min",
    floor: 2,
  },
  {
    id: "ep-11",
    episodeNumber: 11,
    title: "Reading Like a Crime Scene Detective",
    description:
      "Approach every passage like a crime scene — gather evidence, question assumptions, and reconstruct meaning with investigative precision.",
    audioFile: "Reading_Like_a_Crime_Scene_Detective.m4a",
    duration: "40 min",
    floor: 2,
  },
  {
    id: "ep-12",
    episodeNumber: 12,
    title: "Interrogate the Text Like a Hostile Witness",
    description:
      "Push past surface readings by treating every text as a hostile witness — ask hard questions, press for details, and uncover what the passage is really saying.",
    audioFile: "Interrogate_the_text_like_a_hostile_witness.m4a",
    duration: "40 min",
    floor: 2,
  },
];
