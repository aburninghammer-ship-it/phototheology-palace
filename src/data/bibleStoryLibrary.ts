// Bible Story Library - Complete Coverage of All 66 Books
// Brief summaries with verse references (not full text)

export interface BibleStory {
  id: string;
  title: string;
  reference: string;
  summary: string;
  characters: string[];
  themes: string[];
  lessonLearned?: string;
}

export interface BookStories {
  book: string;
  testament: "old" | "new";
  stories: BibleStory[];
}

export const bibleStoryLibrary: BookStories[] = [
  // ============================================
  // OLD TESTAMENT
  // ============================================

  // GENESIS
  {
    book: "Genesis",
    testament: "old",
    stories: [
      { id: "gen-1", title: "Creation", reference: "Genesis 1-2", summary: "God creates the heavens, earth, and all life in six days, resting on the seventh. Adam and Eve are placed in Eden.", characters: ["God", "Adam", "Eve"], themes: ["Creation", "Rest", "Image of God"], lessonLearned: "God is the sovereign Creator who made everything good." },
      { id: "gen-2", title: "The Fall", reference: "Genesis 3", summary: "The serpent deceives Eve; Adam and Eve eat forbidden fruit, bringing sin and death into the world.", characters: ["Adam", "Eve", "Serpent"], themes: ["Temptation", "Sin", "Consequences"], lessonLearned: "Disobedience separates us from God." },
      { id: "gen-3", title: "Cain and Abel", reference: "Genesis 4:1-16", summary: "Cain murders his brother Abel out of jealousy over God accepting Abel's offering.", characters: ["Cain", "Abel", "God"], themes: ["Jealousy", "Murder", "Worship"], lessonLearned: "Sin crouches at the door but we must master it." },
      { id: "gen-3b", title: "Seth: A New Beginning", reference: "Genesis 4:25-26", summary: "Eve bears Seth as a replacement for Abel; men begin to call on the name of the Lord.", characters: ["Adam", "Eve", "Seth"], themes: ["Hope", "Lineage", "Worship"], lessonLearned: "God preserves a godly line through tragedy." },
      { id: "gen-3c", title: "Enoch Walks with God", reference: "Genesis 5:21-24", summary: "Enoch walks faithfully with God for 300 years and is taken without dying.", characters: ["Enoch", "God"], themes: ["Faithfulness", "Translation", "Intimacy"], lessonLearned: "Walking with God leads to eternal life." },
      { id: "gen-4", title: "Noah's Ark", reference: "Genesis 6-9", summary: "God floods the earth due to wickedness, saving righteous Noah and his family on the ark.", characters: ["Noah", "God"], themes: ["Judgment", "Salvation", "Covenant"], lessonLearned: "God judges sin but provides a way of escape." },
      { id: "gen-4b", title: "The Rainbow Covenant", reference: "Genesis 9:8-17", summary: "God sets a rainbow in the sky as a sign of His covenant never to destroy earth by flood again.", characters: ["Noah", "God"], themes: ["Covenant", "Promise", "Mercy"], lessonLearned: "God seals His promises with visible signs." },
      { id: "gen-5", title: "Tower of Babel", reference: "Genesis 11:1-9", summary: "Humanity builds a tower to reach heaven; God confuses their languages and scatters them.", characters: ["Builders", "God"], themes: ["Pride", "Unity against God", "Scattering"], lessonLearned: "Human pride apart from God leads to confusion." },
      { id: "gen-6", title: "Call of Abram", reference: "Genesis 12:1-9", summary: "God calls Abram to leave his homeland with promises of land, descendants, and blessing.", characters: ["Abram", "Sarai", "God"], themes: ["Faith", "Obedience", "Promise"], lessonLearned: "Faith requires leaving the familiar for God's promise." },
      { id: "gen-6b", title: "Abram and Lot Separate", reference: "Genesis 13", summary: "Abram and Lot's herdsmen quarrel; Abram generously lets Lot choose first, and Lot chooses Sodom.", characters: ["Abram", "Lot"], themes: ["Generosity", "Worldliness", "Choice"], lessonLearned: "Generosity trusts God with the outcome." },
      { id: "gen-6c", title: "Melchizedek Blesses Abram", reference: "Genesis 14:17-24", summary: "After rescuing Lot, Abram is blessed by Melchizedek, king of Salem and priest of God Most High.", characters: ["Abram", "Melchizedek"], themes: ["Blessing", "Priesthood", "Tithe"], lessonLearned: "Christ's priesthood predates the Levitical order." },
      { id: "gen-6d", title: "Covenant of the Pieces", reference: "Genesis 15", summary: "God makes a covenant with Abram, promising descendants like the stars; Abram believes and is counted righteous.", characters: ["Abram", "God"], themes: ["Faith", "Righteousness", "Covenant"], lessonLearned: "Faith in God's promises is counted as righteousness." },
      { id: "gen-6e", title: "Hagar and Ishmael", reference: "Genesis 16", summary: "Sarai gives Hagar to Abram; Hagar conceives Ishmael and flees, but the Angel of the Lord sends her back.", characters: ["Abram", "Sarai", "Hagar", "Ishmael"], themes: ["Impatience", "Providence", "Promise"], lessonLearned: "Running ahead of God creates complications." },
      { id: "gen-6f", title: "Abraham's Circumcision Covenant", reference: "Genesis 17", summary: "God changes Abram's name to Abraham and establishes circumcision as the covenant sign.", characters: ["Abraham", "Sarah", "God"], themes: ["Covenant", "Identity", "Promise"], lessonLearned: "God gives new identity to His covenant people." },
      { id: "gen-7", title: "Sodom and Gomorrah", reference: "Genesis 18-19", summary: "God destroys the wicked cities after Abraham intercedes; Lot's family escapes but his wife looks back.", characters: ["Abraham", "Lot", "Angels"], themes: ["Judgment", "Intercession", "Deliverance"], lessonLearned: "God rescues the righteous from judgment." },
      { id: "gen-7b", title: "Birth of Isaac", reference: "Genesis 21:1-7", summary: "Sarah bears Isaac in her old age as God promised; laughter fills the household.", characters: ["Abraham", "Sarah", "Isaac"], themes: ["Miracle", "Fulfillment", "Joy"], lessonLearned: "God fulfills impossible promises in His timing." },
      { id: "gen-8", title: "Sacrifice of Isaac", reference: "Genesis 22:1-19", summary: "God tests Abraham by asking him to sacrifice Isaac; God provides a ram as substitute.", characters: ["Abraham", "Isaac", "God"], themes: ["Faith", "Obedience", "Provision"], lessonLearned: "God provides when we trust and obey." },
      { id: "gen-8b", title: "Isaac and Rebekah", reference: "Genesis 24", summary: "Abraham's servant finds Rebekah at the well; she becomes Isaac's wife through divine guidance.", characters: ["Abraham's Servant", "Rebekah", "Isaac"], themes: ["Providence", "Prayer", "Marriage"], lessonLearned: "God guides those who seek His direction." },
      { id: "gen-9", title: "Jacob and Esau", reference: "Genesis 25-27", summary: "Jacob deceives his father Isaac to steal Esau's blessing, causing family division.", characters: ["Jacob", "Esau", "Isaac", "Rebekah"], themes: ["Deception", "Blessing", "Consequences"], lessonLearned: "Deception brings conflict even when God's will prevails." },
      { id: "gen-9b", title: "Jacob's Ladder", reference: "Genesis 28:10-22", summary: "Fleeing Esau, Jacob dreams of a stairway to heaven with angels ascending and descending.", characters: ["Jacob", "God", "Angels"], themes: ["Revelation", "Promise", "Encounter"], lessonLearned: "God meets us in unexpected places." },
      { id: "gen-9c", title: "Jacob Serves for Rachel", reference: "Genesis 29:1-30", summary: "Jacob works seven years for Rachel but is tricked into marrying Leah first.", characters: ["Jacob", "Laban", "Rachel", "Leah"], themes: ["Love", "Deception", "Perseverance"], lessonLearned: "The deceiver becomes the deceived." },
      { id: "gen-10", title: "Jacob Wrestles God", reference: "Genesis 32:22-32", summary: "Jacob wrestles with a divine being all night and is renamed Israel.", characters: ["Jacob", "Angel of the Lord"], themes: ["Transformation", "Persistence", "Blessing"], lessonLearned: "God transforms us through struggle." },
      { id: "gen-10b", title: "Jacob and Esau Reconcile", reference: "Genesis 33", summary: "After years of separation, Jacob bows before Esau who embraces him in forgiveness.", characters: ["Jacob", "Esau"], themes: ["Reconciliation", "Forgiveness", "Fear"], lessonLearned: "God can turn enemies into friends." },
      { id: "gen-11", title: "Joseph Sold into Slavery", reference: "Genesis 37", summary: "Joseph's brothers sell him into slavery out of jealousy over his dreams and favored status.", characters: ["Joseph", "Brothers", "Jacob"], themes: ["Jealousy", "Betrayal", "Providence"], lessonLearned: "God uses even evil intentions for His purposes." },
      { id: "gen-11b", title: "Judah and Tamar", reference: "Genesis 38", summary: "Tamar disguises herself to secure her rights; she becomes an ancestor of Christ.", characters: ["Judah", "Tamar"], themes: ["Justice", "Lineage", "Redemption"], lessonLearned: "God works through imperfect people in His plan." },
      { id: "gen-12", title: "Joseph in Egypt", reference: "Genesis 39-41", summary: "Joseph rises from slave to prisoner to Pharaoh's second-in-command through faithfulness.", characters: ["Joseph", "Potiphar", "Pharaoh"], themes: ["Faithfulness", "Integrity", "Promotion"], lessonLearned: "Faithfulness in trials leads to exaltation." },
      { id: "gen-12b", title: "Joseph Tests His Brothers", reference: "Genesis 42-44", summary: "Joseph tests his brothers' character by accusing them of being spies and holding Benjamin.", characters: ["Joseph", "Brothers", "Benjamin"], themes: ["Testing", "Repentance", "Change"], lessonLearned: "True repentance is proven by changed behavior." },
      { id: "gen-13", title: "Joseph Reveals Himself", reference: "Genesis 45", summary: "Joseph reveals his identity to his brothers and forgives them, seeing God's providence.", characters: ["Joseph", "Brothers"], themes: ["Forgiveness", "Reconciliation", "Providence"], lessonLearned: "What others meant for evil, God uses for good." },
      { id: "gen-14", title: "Jacob Blesses the Twelve", reference: "Genesis 49", summary: "Dying Jacob prophesies over each of his twelve sons, including the Lion of Judah.", characters: ["Jacob", "Twelve Sons"], themes: ["Prophecy", "Blessing", "Messiah"], lessonLearned: "God reveals the future through His servants." },
      { id: "gen-15", title: "Jacob's Journey to Egypt", reference: "Genesis 46", summary: "God assures Jacob at Beersheba; the whole family of 70 persons journeys to Egypt.", characters: ["Jacob", "Joseph", "Family"], themes: ["Providence", "Reunion", "Promise"], lessonLearned: "God orchestrates family reunions for His purposes." },
      { id: "gen-16", title: "Joseph's Bones Promise", reference: "Genesis 50:22-26", summary: "Joseph makes Israel swear to carry his bones out of Egypt when God visits them.", characters: ["Joseph", "Brothers"], themes: ["Faith", "Promise", "Future Hope"], lessonLearned: "Faith looks beyond death to God's promises." }
    ]
  },

  // EXODUS
  {
    book: "Exodus",
    testament: "old",
    stories: [
      { id: "exo-1", title: "Birth of Moses", reference: "Exodus 2:1-10", summary: "Moses is hidden in a basket, found by Pharaoh's daughter, and raised in the palace.", characters: ["Moses", "Jochebed", "Pharaoh's Daughter"], themes: ["Providence", "Deliverance", "Preservation"], lessonLearned: "God preserves His chosen instruments." },
      { id: "exo-2", title: "Burning Bush", reference: "Exodus 3-4", summary: "God appears to Moses in a burning bush, calling him to deliver Israel from Egypt.", characters: ["Moses", "God"], themes: ["Calling", "Holiness", "Mission"], lessonLearned: "God calls ordinary people for extraordinary purposes." },
      { id: "exo-3", title: "Ten Plagues", reference: "Exodus 7-12", summary: "God sends ten plagues on Egypt, demonstrating His power over Pharaoh and Egyptian gods.", characters: ["Moses", "Aaron", "Pharaoh"], themes: ["Judgment", "Power", "Deliverance"], lessonLearned: "God is sovereign over all powers." },
      { id: "exo-4", title: "Passover", reference: "Exodus 12", summary: "Israel applies lamb's blood to doorposts; the death angel passes over, and Israel is freed.", characters: ["Moses", "Israel", "Death Angel"], themes: ["Redemption", "Blood", "Salvation"], lessonLearned: "The blood of the lamb brings salvation." },
      { id: "exo-5", title: "Crossing the Red Sea", reference: "Exodus 14", summary: "God parts the Red Sea for Israel to escape; the Egyptian army drowns pursuing them.", characters: ["Moses", "Israel", "Pharaoh"], themes: ["Deliverance", "Faith", "Victory"], lessonLearned: "God makes a way where there is no way." },
      { id: "exo-6", title: "Manna and Quail", reference: "Exodus 16", summary: "God provides manna from heaven and quail to feed Israel in the wilderness.", characters: ["Moses", "Israel", "God"], themes: ["Provision", "Trust", "Daily Bread"], lessonLearned: "God provides daily bread for His people." },
      { id: "exo-7", title: "Water from the Rock", reference: "Exodus 17:1-7", summary: "Moses strikes a rock at Horeb and water flows out for the thirsty people.", characters: ["Moses", "Israel", "God"], themes: ["Provision", "Faith", "Grumbling"], lessonLearned: "God provides even when we complain." },
      { id: "exo-8", title: "Ten Commandments", reference: "Exodus 20", summary: "God gives Moses the Ten Commandments on Mount Sinai as the covenant law.", characters: ["Moses", "God", "Israel"], themes: ["Law", "Covenant", "Holiness"], lessonLearned: "God establishes His standard for righteousness." },
      { id: "exo-9", title: "Golden Calf", reference: "Exodus 32", summary: "Israel makes a golden idol while Moses is on the mountain; God's wrath is kindled.", characters: ["Moses", "Aaron", "Israel"], themes: ["Idolatry", "Impatience", "Judgment"], lessonLearned: "Impatience leads to idolatry." },
      { id: "exo-10", title: "Tabernacle Built", reference: "Exodus 35-40", summary: "Israel constructs the tabernacle according to God's design; His glory fills it.", characters: ["Moses", "Bezalel", "Israel"], themes: ["Worship", "Obedience", "Presence"], lessonLearned: "God dwells among those who worship Him rightly." },
      { id: "exo-11", title: "Moses' Face Shines", reference: "Exodus 34:29-35", summary: "After speaking with God, Moses' face shines so brightly he must wear a veil.", characters: ["Moses", "Israel"], themes: ["Glory", "Transformation", "Presence"], lessonLearned: "Time with God transforms our countenance." },
      { id: "exo-12", title: "Victory Over Amalek", reference: "Exodus 17:8-16", summary: "Israel fights Amalek; Moses' raised hands bring victory; Aaron and Hur support him.", characters: ["Moses", "Joshua", "Aaron", "Hur"], themes: ["Prayer", "Support", "Victory"], lessonLearned: "Spiritual victory requires intercession and teamwork." },
      { id: "exo-13", title: "Jethro's Wise Counsel", reference: "Exodus 18", summary: "Moses' father-in-law advises him to delegate judgment to capable leaders.", characters: ["Moses", "Jethro"], themes: ["Wisdom", "Delegation", "Leadership"], lessonLearned: "Wise leaders learn to delegate." }
    ]
  },

  // LEVITICUS
  {
    book: "Leviticus",
    testament: "old",
    stories: [
      { id: "lev-1", title: "Nadab and Abihu", reference: "Leviticus 10:1-7", summary: "Aaron's sons offer unauthorized fire before God and are consumed by divine fire.", characters: ["Nadab", "Abihu", "Aaron"], themes: ["Holiness", "Obedience", "Judgment"], lessonLearned: "God's holiness demands proper worship." },
      { id: "lev-1b", title: "The Five Offerings", reference: "Leviticus 1-7", summary: "God institutes five offerings: burnt, grain, peace, sin, and guilt—each pointing to Christ.", characters: ["Moses", "Priests", "Israel"], themes: ["Sacrifice", "Atonement", "Worship"], lessonLearned: "Every offering points to Christ's complete sacrifice." },
      { id: "lev-2", title: "Day of Atonement", reference: "Leviticus 16", summary: "Instructions for the annual day when the high priest makes atonement for Israel's sins.", characters: ["High Priest", "Scapegoat"], themes: ["Atonement", "Cleansing", "Sacrifice"], lessonLearned: "Sin requires blood atonement." },
      { id: "lev-2b", title: "The Feasts of the Lord", reference: "Leviticus 23", summary: "God establishes seven feasts: Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles.", characters: ["Moses", "Israel"], themes: ["Worship", "Prophecy", "Seasons"], lessonLearned: "God's feasts outline His redemptive plan." },
      { id: "lev-2c", title: "The Year of Jubilee", reference: "Leviticus 25", summary: "Every 50th year, debts are cancelled, slaves freed, and land returns to original owners.", characters: ["Moses", "Israel"], themes: ["Freedom", "Restoration", "Grace"], lessonLearned: "God builds liberation into His economic system." },
      { id: "lev-3", title: "The Blasphemer Stoned", reference: "Leviticus 24:10-23", summary: "A man blasphemes God's name and is stoned according to divine command.", characters: ["Blasphemer", "Moses"], themes: ["Holiness", "Blasphemy", "Justice"], lessonLearned: "God's name must be honored." }
    ]
  },

  // NUMBERS
  {
    book: "Numbers",
    testament: "old",
    stories: [
      { id: "num-0", title: "The Census and Order of March", reference: "Numbers 1-2", summary: "Israel is counted and organized around the tabernacle in precise formation.", characters: ["Moses", "Tribal Leaders"], themes: ["Order", "Organization", "Worship"], lessonLearned: "God brings order to His people." },
      { id: "num-0b", title: "The Nazirite Vow", reference: "Numbers 6", summary: "Special consecration vow with no wine, uncut hair, and no contact with dead.", characters: ["Moses", "Nazirites"], themes: ["Consecration", "Separation", "Devotion"], lessonLearned: "Some are called to special dedication." },
      { id: "num-0c", title: "The Aaronic Blessing", reference: "Numbers 6:22-27", summary: "God gives Aaron the words to bless Israel: 'The Lord bless you and keep you...'", characters: ["Moses", "Aaron"], themes: ["Blessing", "Protection", "Peace"], lessonLearned: "God desires to bless His people." },
      { id: "num-0d", title: "The Cloud and Fire", reference: "Numbers 9:15-23", summary: "God's cloud covers the tabernacle by day and fire by night, guiding Israel's movements.", characters: ["Israel", "God"], themes: ["Guidance", "Presence", "Obedience"], lessonLearned: "God guides His people step by step." },
      { id: "num-0e", title: "Miriam and Aaron Oppose Moses", reference: "Numbers 12", summary: "Miriam and Aaron criticize Moses' wife; Miriam becomes leprous but is healed after Moses prays.", characters: ["Moses", "Miriam", "Aaron"], themes: ["Jealousy", "Intercession", "Humility"], lessonLearned: "God defends His humble servants." },
      { id: "num-1", title: "Twelve Spies", reference: "Numbers 13-14", summary: "Twelve spies explore Canaan; ten bring a bad report, and Israel refuses to enter.", characters: ["Moses", "Joshua", "Caleb", "Spies"], themes: ["Faith", "Fear", "Unbelief"], lessonLearned: "Unbelief forfeits God's promises." },
      { id: "num-2", title: "Korah's Rebellion", reference: "Numbers 16", summary: "Korah leads a rebellion against Moses' leadership; the earth swallows the rebels.", characters: ["Korah", "Moses", "Aaron"], themes: ["Authority", "Rebellion", "Judgment"], lessonLearned: "Rebellion against God's appointed leaders brings judgment." },
      { id: "num-2b", title: "Aaron's Rod Buds", reference: "Numbers 17", summary: "Aaron's rod alone buds, blossoms, and produces almonds, confirming God's choice.", characters: ["Moses", "Aaron", "Tribal Leaders"], themes: ["Election", "Confirmation", "Authority"], lessonLearned: "God confirms His chosen servants." },
      { id: "num-2c", title: "The Red Heifer", reference: "Numbers 19", summary: "A red heifer's ashes mixed with water purify those defiled by death.", characters: ["Moses", "Eleazar"], themes: ["Purification", "Death", "Cleansing"], lessonLearned: "Christ cleanses us from death's defilement." },
      { id: "num-3", title: "Moses Strikes the Rock", reference: "Numbers 20:1-13", summary: "Moses angrily strikes the rock twice instead of speaking to it; he forfeits entering Canaan.", characters: ["Moses", "Israel", "God"], themes: ["Anger", "Disobedience", "Consequences"], lessonLearned: "Even great leaders face consequences for disobedience." },
      { id: "num-4", title: "Bronze Serpent", reference: "Numbers 21:4-9", summary: "God sends serpents among complaining Israel; a bronze serpent on a pole brings healing.", characters: ["Moses", "Israel"], themes: ["Judgment", "Healing", "Faith"], lessonLearned: "Looking to God's provision brings healing." },
      { id: "num-5", title: "Balaam's Donkey", reference: "Numbers 22-24", summary: "Balaam's donkey sees the angel blocking their path and speaks to the prophet.", characters: ["Balaam", "Donkey", "Angel"], themes: ["Greed", "Prophecy", "Blessing"], lessonLearned: "God can use anything to accomplish His will." },
      { id: "num-5b", title: "Phinehas's Zeal", reference: "Numbers 25", summary: "Phinehas stops a plague by executing an Israelite man and Midianite woman caught in sin.", characters: ["Phinehas", "Zimri", "Cozbi"], themes: ["Zeal", "Righteousness", "Covenant"], lessonLearned: "Holy zeal can turn away God's wrath." }
    ]
  },

  // DEUTERONOMY
  {
    book: "Deuteronomy",
    testament: "old",
    stories: [
      { id: "deu-1", title: "Moses' Final Addresses", reference: "Deuteronomy 1-4", summary: "Moses recounts Israel's journey and reminds them of God's faithfulness before entering Canaan.", characters: ["Moses", "Israel"], themes: ["Remembrance", "Faithfulness", "Warning"], lessonLearned: "Remember what God has done." },
      { id: "deu-1b", title: "Og's Iron Bed", reference: "Deuteronomy 3:11", summary: "King Og of Bashan, last of the Rephaim giants, had an iron bed 13 feet long—a trophy of God's victory over giants.", characters: ["Og", "Moses", "Israel"], themes: ["Giants", "Victory", "God's Power"], lessonLearned: "No enemy is too big for God to defeat." },
      { id: "deu-1c", title: "Cities of Refuge", reference: "Deuteronomy 19:1-13", summary: "God establishes six cities where those who accidentally kill someone can flee for protection from avengers.", characters: ["Moses", "Israel"], themes: ["Justice", "Mercy", "Refuge"], lessonLearned: "God provides refuge for the vulnerable." },
      { id: "deu-2", title: "Shema - The Greatest Command", reference: "Deuteronomy 6:4-9", summary: "Moses gives Israel the command to love God with all heart, soul, and strength.", characters: ["Moses", "Israel"], themes: ["Love", "Devotion", "Teaching"], lessonLearned: "Loving God is the greatest commandment." },
      { id: "deu-2b", title: "The Song of Moses", reference: "Deuteronomy 32", summary: "Moses composes a prophetic song about Israel's future apostasy and God's faithfulness as a witness.", characters: ["Moses", "Israel"], themes: ["Prophecy", "Warning", "Faithfulness"], lessonLearned: "God's word stands as a witness against unfaithfulness." },
      { id: "deu-3", title: "Death of Moses", reference: "Deuteronomy 34", summary: "Moses views the Promised Land from Mount Nebo, dies, and is buried by God.", characters: ["Moses", "God", "Joshua"], themes: ["Faithfulness", "Transition", "Legacy"], lessonLearned: "Faithful service honors God even without seeing fulfillment." }
    ]
  },

  // JOSHUA
  {
    book: "Joshua",
    testament: "old",
    stories: [
      { id: "jos-1", title: "Crossing the Jordan", reference: "Joshua 3-4", summary: "Israel crosses the Jordan River on dry ground as the priests carry the ark.", characters: ["Joshua", "Priests", "Israel"], themes: ["Faith", "Leadership", "Memorial"], lessonLearned: "God opens the way for those who step forward in faith." },
      { id: "jos-2", title: "Fall of Jericho", reference: "Joshua 6", summary: "Israel marches around Jericho seven days; the walls collapse at the trumpet blast.", characters: ["Joshua", "Israel", "Rahab"], themes: ["Obedience", "Faith", "Victory"], lessonLearned: "Unconventional obedience brings supernatural victory." },
      { id: "jos-3", title: "Achan's Sin", reference: "Joshua 7", summary: "Israel is defeated at Ai because Achan kept forbidden items from Jericho.", characters: ["Achan", "Joshua", "Israel"], themes: ["Sin", "Consequences", "Corporate Responsibility"], lessonLearned: "Hidden sin affects the whole community." },
      { id: "jos-4", title: "Rahab's Faith", reference: "Joshua 2, 6:22-25", summary: "Rahab the prostitute hides the spies and is saved when Jericho falls.", characters: ["Rahab", "Spies"], themes: ["Faith", "Redemption", "Unlikely Heroes"], lessonLearned: "God saves those who trust Him regardless of background." },
      { id: "jos-5", title: "Sun Stands Still", reference: "Joshua 10:1-15", summary: "Joshua asks God to make the sun stand still so Israel can complete their victory.", characters: ["Joshua", "Israel", "Amorites"], themes: ["Faith", "Prayer", "Miraculous Victory"], lessonLearned: "God fights for His people." },
      { id: "jos-6", title: "Gibeonite Deception", reference: "Joshua 9", summary: "The Gibeonites trick Israel into making a treaty by pretending to be from a distant land with moldy bread and worn clothes.", characters: ["Joshua", "Gibeonites", "Israel"], themes: ["Deception", "Oath", "Consequences"], lessonLearned: "Seek God's counsel before making major decisions." },
      { id: "jos-7", title: "Joshua's Farewell", reference: "Joshua 23-24", summary: "Elderly Joshua gathers Israel and challenges them to choose whom they will serve; 'As for me and my house, we will serve the Lord.'", characters: ["Joshua", "Israel"], themes: ["Choice", "Covenant", "Legacy"], lessonLearned: "Each generation must choose to follow God." },
      { id: "jos-8", title: "Division of the Land", reference: "Joshua 13-21", summary: "The Promised Land is divided among the twelve tribes by lot, with cities of refuge and Levitical cities established.", characters: ["Joshua", "Eleazar", "Tribes"], themes: ["Inheritance", "Fulfillment", "Promise"], lessonLearned: "God keeps His promises to the smallest detail." },
      { id: "jos-9", title: "Caleb Claims Hebron", reference: "Joshua 14:6-15", summary: "85-year-old Caleb, still strong, asks for the mountain where giants dwell, saying 'Give me this mountain!'", characters: ["Caleb", "Joshua"], themes: ["Faith", "Courage", "Perseverance"], lessonLearned: "Age is no barrier to claiming God's promises." }
    ]
  },

  // JUDGES
  {
    book: "Judges",
    testament: "old",
    stories: [
      { id: "jdg-0", title: "The Cycle of Judges", reference: "Judges 2:11-23", summary: "Israel repeatedly sins, is oppressed, cries out, and God raises a judge to deliver them.", characters: ["Israel", "Judges"], themes: ["Sin Cycle", "Deliverance", "Mercy"], lessonLearned: "Without God's law, everyone does what is right in their own eyes." },
      { id: "jdg-0b", title: "Othniel: First Judge", reference: "Judges 3:7-11", summary: "The Spirit of the Lord comes on Othniel and he delivers Israel from Mesopotamia.", characters: ["Othniel"], themes: ["Spirit", "Deliverance", "Rest"], lessonLearned: "God raises deliverers for His oppressed people." },
      { id: "jdg-0c", title: "Ehud's Bold Attack", reference: "Judges 3:12-30", summary: "Left-handed Ehud kills the obese King Eglon with a hidden sword and delivers Israel.", characters: ["Ehud", "Eglon"], themes: ["Courage", "Deliverance", "Unconventional Methods"], lessonLearned: "God uses unique people with unique methods." },
      { id: "jdg-0d", title: "Shamgar Defeats 600", reference: "Judges 3:31", summary: "Shamgar kills 600 Philistines with an ox goad and saves Israel.", characters: ["Shamgar"], themes: ["Unlikely Weapons", "Courage", "Deliverance"], lessonLearned: "God can use any tool in surrendered hands." },
      { id: "jdg-1", title: "Deborah and Barak", reference: "Judges 4-5", summary: "Prophetess Deborah leads Israel to victory over Sisera through Barak's army.", characters: ["Deborah", "Barak", "Jael", "Sisera"], themes: ["Leadership", "Courage", "Victory"], lessonLearned: "God uses unlikely leaders for His purposes." },
      { id: "jdg-1b", title: "Gideon's Call", reference: "Judges 6:11-40", summary: "The Angel of the Lord calls fearful Gideon; he asks for signs with a fleece.", characters: ["Gideon", "Angel of the Lord"], themes: ["Call", "Doubt", "Confirmation"], lessonLearned: "God patiently confirms His calling." },
      { id: "jdg-2", title: "Gideon's 300", reference: "Judges 7", summary: "God reduces Gideon's army to 300 men and defeats the Midianites with torches and trumpets.", characters: ["Gideon", "Midianites"], themes: ["Faith", "Weakness", "God's Power"], lessonLearned: "God's power is perfected in weakness." },
      { id: "jdg-2b", title: "Abimelech's Wickedness", reference: "Judges 9", summary: "Gideon's son Abimelech kills his 70 brothers and rules as a cruel king until he is killed.", characters: ["Abimelech", "Jotham"], themes: ["Ambition", "Violence", "Judgment"], lessonLearned: "Wicked ambition leads to destruction." },
      { id: "jdg-3", title: "Jephthah's Vow", reference: "Judges 11", summary: "Jephthah makes a rash vow and must sacrifice his daughter after victory.", characters: ["Jephthah", "Daughter"], themes: ["Rash Vows", "Tragedy", "Consequences"], lessonLearned: "Be careful what you vow to God." },
      { id: "jdg-3b", title: "Samson's Birth", reference: "Judges 13", summary: "An angel announces Samson's birth to barren parents; he will be a Nazirite.", characters: ["Manoah", "Manoah's Wife", "Angel"], themes: ["Prophecy", "Consecration", "Purpose"], lessonLearned: "God has purposes for us before birth." },
      { id: "jdg-3c", title: "Samson and the Lion", reference: "Judges 14", summary: "Samson kills a lion barehanded; later bees make honey in its carcass, inspiring a riddle.", characters: ["Samson", "Philistine Wife"], themes: ["Strength", "Riddles", "Revenge"], lessonLearned: "Great strength without wisdom brings trouble." },
      { id: "jdg-4", title: "Samson's Life", reference: "Judges 13-16", summary: "Samson is empowered by God's Spirit but falls through Delilah's deception.", characters: ["Samson", "Delilah", "Philistines"], themes: ["Strength", "Weakness", "Redemption"], lessonLearned: "Great gifts require great discipline." },
      { id: "jdg-5", title: "Micah's Idols", reference: "Judges 17-18", summary: "Micah sets up a private shrine with idols and a hired priest; Dan steals them.", characters: ["Micah", "Levite", "Danites"], themes: ["Idolatry", "Lawlessness", "Syncretism"], lessonLearned: "Personal religion without God's order leads astray." },
      { id: "jdg-6", title: "The Levite's Concubine", reference: "Judges 19-21", summary: "A horrific crime in Gibeah leads to civil war that nearly destroys the tribe of Benjamin.", characters: ["Levite", "Concubine", "Israel", "Benjamin"], themes: ["Depravity", "Civil War", "Moral Collapse"], lessonLearned: "Without God's law, society descends into chaos." }
    ]
  },

  // RUTH
  {
    book: "Ruth",
    testament: "old",
    stories: [
      { id: "rut-1", title: "Ruth's Loyalty", reference: "Ruth 1", summary: "Ruth chooses to stay with Naomi after their husbands die, leaving her homeland.", characters: ["Ruth", "Naomi", "Orpah"], themes: ["Loyalty", "Commitment", "Love"], lessonLearned: "True love commits regardless of circumstances." },
      { id: "rut-2", title: "Ruth Meets Boaz", reference: "Ruth 2", summary: "Ruth gleans in Boaz's field and receives his kindness and protection.", characters: ["Ruth", "Boaz"], themes: ["Providence", "Kindness", "Work"], lessonLearned: "God rewards faithfulness with provision." },
      { id: "rut-3", title: "Ruth and the Kinsman Redeemer", reference: "Ruth 3-4", summary: "Boaz redeems Ruth as kinsman-redeemer; they marry and become ancestors of David.", characters: ["Ruth", "Boaz", "Naomi"], themes: ["Redemption", "Marriage", "Lineage"], lessonLearned: "God redeems and restores the faithful." },
      { id: "rut-4", title: "Naomi's Emptiness Filled", reference: "Ruth 4:13-17", summary: "Ruth bears Obed; the women rejoice that Naomi's emptiness is filled; she nurses her grandson who becomes David's grandfather.", characters: ["Naomi", "Ruth", "Obed"], themes: ["Restoration", "Joy", "Providence"], lessonLearned: "God fills our emptiness beyond what we imagined." },
      { id: "rut-5", title: "The Sandal Exchange", reference: "Ruth 4:7-12", summary: "The nearer kinsman removes his sandal to transfer his redemption rights to Boaz, a legal custom witnessed by the elders.", characters: ["Boaz", "Nearer Kinsman", "Elders"], themes: ["Law", "Custom", "Covenant"], lessonLearned: "God works through legal and cultural structures." }
    ]
  },

  // 1 SAMUEL
  {
    book: "1 Samuel",
    testament: "old",
    stories: [
      { id: "1sa-1", title: "Hannah's Prayer", reference: "1 Samuel 1-2", summary: "Barren Hannah prays for a son and dedicates Samuel to God's service.", characters: ["Hannah", "Eli", "Samuel"], themes: ["Prayer", "Dedication", "Faithfulness"], lessonLearned: "God hears the prayers of the brokenhearted." },
      { id: "1sa-1b", title: "Ichabod - The Glory Departs", reference: "1 Samuel 4:19-22", summary: "When Eli's daughter-in-law hears the ark is captured and Eli is dead, she names her son Ichabod—'the glory has departed.'", characters: ["Phinehas' Wife", "Ichabod"], themes: ["Judgment", "Glory", "Loss"], lessonLearned: "Sin can cause God's presence to depart." },
      { id: "1sa-1c", title: "Dagon Falls Before the Ark", reference: "1 Samuel 5", summary: "The Philistines place the captured ark in Dagon's temple; the idol falls and breaks before it, and plagues strike.", characters: ["Dagon", "Philistines"], themes: ["God's Power", "Idolatry", "Judgment"], lessonLearned: "No idol can stand before the true God." },
      { id: "1sa-1d", title: "The Ark Returns on a Cart", reference: "1 Samuel 6", summary: "Philistines return the ark on a cart pulled by cows that miraculously go straight to Israel, proving God's hand.", characters: ["Philistines", "Beth-shemesh"], themes: ["Providence", "Holiness", "Testing"], lessonLearned: "Even unbelievers recognize God's power." },
      { id: "1sa-2", title: "Samuel's Call", reference: "1 Samuel 3", summary: "Young Samuel hears God's voice calling him in the night at the temple.", characters: ["Samuel", "Eli", "God"], themes: ["Calling", "Listening", "Prophecy"], lessonLearned: "God speaks to those who listen." },
      { id: "1sa-3", title: "Israel Demands a King", reference: "1 Samuel 8", summary: "Israel rejects God as king and demands a human king like other nations.", characters: ["Samuel", "Israel", "God"], themes: ["Rejection", "Worldliness", "Warning"], lessonLearned: "Rejecting God's rule brings consequences." },
      { id: "1sa-4", title: "Saul Anointed King", reference: "1 Samuel 9-10", summary: "Samuel anoints Saul, a tall Benjamite, as Israel's first king.", characters: ["Samuel", "Saul"], themes: ["Kingship", "Anointing", "Choice"], lessonLearned: "God gives people what they ask for." },
      { id: "1sa-5", title: "Saul's Disobedience", reference: "1 Samuel 15", summary: "Saul disobeys God by sparing Agag and the best livestock; his kingdom is rejected.", characters: ["Saul", "Samuel", "Agag"], themes: ["Obedience", "Rejection", "Consequences"], lessonLearned: "Obedience is better than sacrifice." },
      { id: "1sa-6", title: "David Anointed", reference: "1 Samuel 16", summary: "Samuel anoints young David as future king; God looks at the heart.", characters: ["Samuel", "David", "Jesse"], themes: ["Anointing", "Heart", "God's Choice"], lessonLearned: "God looks at the heart, not outward appearance." },
      { id: "1sa-7", title: "David and Goliath", reference: "1 Samuel 17", summary: "Young David defeats the giant Goliath with a sling and stone in God's name.", characters: ["David", "Goliath", "Saul"], themes: ["Faith", "Courage", "Victory"], lessonLearned: "The battle is the Lord's." },
      { id: "1sa-8", title: "David and Jonathan", reference: "1 Samuel 18-20", summary: "David and Jonathan form a covenant friendship despite Saul's jealousy.", characters: ["David", "Jonathan", "Saul"], themes: ["Friendship", "Loyalty", "Covenant"], lessonLearned: "True friendship transcends circumstances." },
      { id: "1sa-8b", title: "David Eats Holy Bread", reference: "1 Samuel 21:1-6", summary: "Fleeing Saul, David receives the consecrated showbread from the priest Ahimelech—a story Jesus later cited.", characters: ["David", "Ahimelech"], themes: ["Mercy", "Need", "Law"], lessonLearned: "Mercy triumphs over ritual law in genuine need." },
      { id: "1sa-8c", title: "David Pretends Madness", reference: "1 Samuel 21:10-15", summary: "To escape King Achish of Gath, David pretends to be insane, scratching doors and drooling.", characters: ["David", "Achish"], themes: ["Survival", "Wisdom", "Desperation"], lessonLearned: "Sometimes survival requires unconventional tactics." },
      { id: "1sa-8d", title: "Abigail's Wisdom", reference: "1 Samuel 25", summary: "Wise Abigail intervenes to stop David from killing her foolish husband Nabal; she later becomes David's wife.", characters: ["Abigail", "David", "Nabal"], themes: ["Wisdom", "Intervention", "Restraint"], lessonLearned: "A wise word can prevent disaster." },
      { id: "1sa-9", title: "David Spares Saul", reference: "1 Samuel 24, 26", summary: "David twice refuses to kill Saul when given the opportunity.", characters: ["David", "Saul"], themes: ["Mercy", "Respect", "Patience"], lessonLearned: "Trust God's timing rather than taking matters into your own hands." },
      { id: "1sa-9b", title: "Witch of Endor", reference: "1 Samuel 28", summary: "Desperate Saul consults a medium who summons Samuel's spirit, who prophesies Saul's death.", characters: ["Saul", "Medium", "Samuel's Spirit"], themes: ["Desperation", "Occult", "Judgment"], lessonLearned: "Turning to forbidden sources reveals a rejected heart." },
      { id: "1sa-10", title: "Samuel's Sons Rejected", reference: "1 Samuel 8:1-5", summary: "Samuel's sons take bribes and pervert justice, leading Israel to demand a king instead.", characters: ["Samuel", "Joel", "Abijah"], themes: ["Corruption", "Legacy", "Failure"], lessonLearned: "Godly parents don't guarantee godly children." },
      { id: "1sa-11", title: "Saul Hides Among Baggage", reference: "1 Samuel 10:20-24", summary: "When chosen as king by lot, Saul is found hiding among the baggage.", characters: ["Saul", "Samuel"], themes: ["Humility", "Reluctance", "Calling"], lessonLearned: "God sometimes chooses the hesitant." },
      { id: "1sa-12", title: "Jonathan's Honey", reference: "1 Samuel 14:24-46", summary: "Saul foolishly forbids eating during battle; Jonathan eats honey unknowingly; the army saves him from death.", characters: ["Saul", "Jonathan", "Army"], themes: ["Foolish Vows", "Wisdom", "Leadership"], lessonLearned: "Rash decisions put others at risk." },
      { id: "1sa-13", title: "David Plays for Saul", reference: "1 Samuel 16:14-23", summary: "An evil spirit torments Saul; David's harp playing soothes him.", characters: ["David", "Saul"], themes: ["Music", "Ministry", "Torment"], lessonLearned: "Music can minister to troubled souls." },
      { id: "1sa-14", title: "Saul's Death", reference: "1 Samuel 31", summary: "Wounded in battle, Saul falls on his own sword rather than be captured by Philistines.", characters: ["Saul", "Armor Bearer"], themes: ["Tragedy", "End", "Pride"], lessonLearned: "A life begun well can end in tragedy without obedience." }
    ]
  },

  // 2 SAMUEL
  {
    book: "2 Samuel",
    testament: "old",
    stories: [
      { id: "2sa-1", title: "David Becomes King", reference: "2 Samuel 2, 5", summary: "David is anointed king over Judah, then over all Israel, and conquers Jerusalem.", characters: ["David", "Israel"], themes: ["Kingship", "Patience", "Fulfillment"], lessonLearned: "God's promises are fulfilled in His timing." },
      { id: "2sa-1b", title: "Mephibosheth Restored", reference: "2 Samuel 9", summary: "David seeks out Jonathan's lame son Mephibosheth and restores his land, giving him a place at the king's table.", characters: ["David", "Mephibosheth", "Ziba"], themes: ["Kindness", "Covenant", "Grace"], lessonLearned: "God shows kindness to the undeserving for the sake of another." },
      { id: "2sa-2", title: "Ark Brought to Jerusalem", reference: "2 Samuel 6", summary: "David brings the ark to Jerusalem with celebration; Uzzah is struck dead for touching it.", characters: ["David", "Uzzah", "Michal"], themes: ["Worship", "Holiness", "Joy"], lessonLearned: "Approach God with reverence and joy." },
      { id: "2sa-3", title: "Davidic Covenant", reference: "2 Samuel 7", summary: "God promises David an eternal dynasty; his throne will be established forever.", characters: ["David", "Nathan", "God"], themes: ["Covenant", "Promise", "Messianic"], lessonLearned: "God establishes eternal covenants." },
      { id: "2sa-4", title: "David and Bathsheba", reference: "2 Samuel 11-12", summary: "David commits adultery with Bathsheba and arranges Uriah's death; Nathan confronts him.", characters: ["David", "Bathsheba", "Uriah", "Nathan"], themes: ["Sin", "Confrontation", "Repentance"], lessonLearned: "Sin has serious consequences even when forgiven." },
      { id: "2sa-4b", title: "Woman of Tekoa's Parable", reference: "2 Samuel 14:1-20", summary: "Joab sends a wise woman to tell David a parable that tricks him into allowing Absalom's return.", characters: ["Woman of Tekoa", "David", "Joab"], themes: ["Wisdom", "Parables", "Manipulation"], lessonLearned: "Stories can reveal truths we hide from ourselves." },
      { id: "2sa-5", title: "Absalom's Rebellion", reference: "2 Samuel 15-18", summary: "David's son Absalom rebels and is killed; David mourns deeply.", characters: ["David", "Absalom", "Joab"], themes: ["Rebellion", "Consequences", "Grief"], lessonLearned: "Family dysfunction has far-reaching effects." },
      { id: "2sa-5b", title: "Rizpah Guards Her Sons' Bodies", reference: "2 Samuel 21:10-14", summary: "For months, Rizpah protects the bodies of her executed sons from birds and beasts until David gives them proper burial.", characters: ["Rizpah", "David"], themes: ["Motherhood", "Persistence", "Honor"], lessonLearned: "Faithful devotion moves even kings to action." },
      { id: "2sa-5c", title: "Benaiah Kills a Lion in a Pit", reference: "2 Samuel 23:20-23", summary: "Benaiah, one of David's mighty men, chased a lion into a pit on a snowy day and killed it.", characters: ["Benaiah"], themes: ["Courage", "Valor", "Warriors"], lessonLearned: "Great courage pursues danger when duty calls." },
      { id: "2sa-5d", title: "Three Mighty Men Get Water", reference: "2 Samuel 23:13-17", summary: "Three warriors break through Philistine lines to get David water from Bethlehem's well; he pours it out as an offering.", characters: ["David", "Three Mighty Men"], themes: ["Devotion", "Sacrifice", "Honor"], lessonLearned: "Such devotion is too sacred to consume selfishly." },
      { id: "2sa-6", title: "David's Lament for Saul and Jonathan", reference: "2 Samuel 1:17-27", summary: "David composes a beautiful lament: 'How the mighty have fallen! Jonathan, you were very dear to me.'", characters: ["David", "Saul", "Jonathan"], themes: ["Grief", "Honor", "Friendship"], lessonLearned: "Grieving honors those we've lost." },
      { id: "2sa-7", title: "Amnon and Tamar", reference: "2 Samuel 13:1-22", summary: "David's son Amnon violates his half-sister Tamar; David is furious but doesn't act; Absalom plots revenge.", characters: ["Amnon", "Tamar", "Absalom", "David"], themes: ["Sin", "Injustice", "Family Dysfunction"], lessonLearned: "Unaddressed sin festers into greater tragedy." },
      { id: "2sa-8", title: "David Dances Before the Ark", reference: "2 Samuel 6:12-23", summary: "David dances before the Lord with all his might; Michal despises him and is left barren.", characters: ["David", "Michal"], themes: ["Worship", "Joy", "Scorn"], lessonLearned: "Uninhibited worship honors God regardless of others' opinions." },
      { id: "2sa-9", title: "Nathan's Parable", reference: "2 Samuel 12:1-14", summary: "Nathan tells David a parable about a rich man stealing a poor man's lamb; David condemns himself.", characters: ["Nathan", "David"], themes: ["Conviction", "Parable", "Confession"], lessonLearned: "God uses stories to pierce hardened hearts." }
    ]
  },

  // 1 KINGS
  {
    book: "1 Kings",
    testament: "old",
    stories: [
      { id: "1ki-1", title: "Solomon's Wisdom", reference: "1 Kings 3", summary: "Solomon asks God for wisdom instead of riches; God grants both.", characters: ["Solomon", "God"], themes: ["Wisdom", "Prayer", "Blessing"], lessonLearned: "Seeking wisdom pleases God." },
      { id: "1ki-1b", title: "Two Mothers and One Baby", reference: "1 Kings 3:16-28", summary: "Two prostitutes claim the same baby; Solomon's threat to divide the child reveals the true mother.", characters: ["Solomon", "Two Mothers"], themes: ["Wisdom", "Justice", "Motherhood"], lessonLearned: "True love would rather lose than see harm come." },
      { id: "1ki-2", title: "Solomon's Temple", reference: "1 Kings 6-8", summary: "Solomon builds and dedicates the temple; God's glory fills it.", characters: ["Solomon", "Israel", "God"], themes: ["Worship", "Glory", "Dedication"], lessonLearned: "God honors those who honor Him." },
      { id: "1ki-3", title: "Solomon's Wives", reference: "1 Kings 11:1-13", summary: "Solomon's foreign wives turn his heart to other gods.", characters: ["Solomon", "Wives"], themes: ["Compromise", "Idolatry", "Consequences"], lessonLearned: "Wrong relationships lead to spiritual compromise." },
      { id: "1ki-4", title: "Kingdom Divided", reference: "1 Kings 12", summary: "Rehoboam's harshness divides the kingdom; Jeroboam leads ten tribes.", characters: ["Rehoboam", "Jeroboam"], themes: ["Division", "Foolishness", "Judgment"], lessonLearned: "Poor leadership divides communities." },
      { id: "1ki-4b", title: "The Prophet and the Lion", reference: "1 Kings 13", summary: "A prophet disobeys God's command by eating with a deceiver; a lion kills him but doesn't eat him or harm his donkey.", characters: ["Man of God", "Old Prophet", "Lion"], themes: ["Obedience", "Deception", "Judgment"], lessonLearned: "Disobedience has consequences even when we're deceived." },
      { id: "1ki-5", title: "Elijah and the Drought", reference: "1 Kings 17", summary: "Elijah prophesies drought, is fed by ravens, and multiplies a widow's oil.", characters: ["Elijah", "Widow", "Ravens"], themes: ["Faith", "Provision", "Miracles"], lessonLearned: "God provides for those who trust Him." },
      { id: "1ki-5b", title: "Widow's Son Raised", reference: "1 Kings 17:17-24", summary: "The widow's son dies; Elijah stretches himself over the boy three times and God raises him.", characters: ["Elijah", "Widow", "Son"], themes: ["Resurrection", "Prayer", "Faith"], lessonLearned: "God has power over death." },
      { id: "1ki-6", title: "Elijah on Mount Carmel", reference: "1 Kings 18", summary: "Elijah challenges Baal's prophets; God sends fire from heaven.", characters: ["Elijah", "Ahab", "Baal Prophets"], themes: ["Faith", "Power", "Decision"], lessonLearned: "The Lord alone is God." },
      { id: "1ki-7", title: "Elijah at Horeb", reference: "1 Kings 19", summary: "Depressed Elijah flees; God speaks in a still small voice, not the earthquake or fire.", characters: ["Elijah", "God"], themes: ["Depression", "Encounter", "Commission"], lessonLearned: "God meets us in our weakness." },
      { id: "1ki-7b", title: "Naboth's Vineyard", reference: "1 Kings 21", summary: "Jezebel frames innocent Naboth to steal his vineyard for Ahab; Elijah pronounces doom on both.", characters: ["Ahab", "Jezebel", "Naboth", "Elijah"], themes: ["Injustice", "Murder", "Judgment"], lessonLearned: "God sees and avenges injustice against the innocent." },
      { id: "1ki-7c", title: "Micaiah's True Prophecy", reference: "1 Kings 22:1-28", summary: "400 prophets say 'Go to war,' but Micaiah alone tells the truth: Ahab will die.", characters: ["Micaiah", "Ahab", "Jehoshaphat"], themes: ["Truth", "False Prophets", "Courage"], lessonLearned: "One voice with God is a majority." }
    ]
  },

  // 2 KINGS
  {
    book: "2 Kings",
    testament: "old",
    stories: [
      { id: "2ki-1", title: "Elijah Taken to Heaven", reference: "2 Kings 2:1-14", summary: "Elijah ascends in a chariot of fire; Elisha receives his mantle.", characters: ["Elijah", "Elisha"], themes: ["Translation", "Succession", "Double Portion"], lessonLearned: "God raises up successors for His work." },
      { id: "2ki-1b", title: "Bears Maul the Mockers", reference: "2 Kings 2:23-25", summary: "Youths mock Elisha's baldness and curse God's prophet; two bears maul 42 of them.", characters: ["Elisha", "Mockers", "Bears"], themes: ["Respect", "Mockery", "Judgment"], lessonLearned: "Mocking God's messengers invites judgment." },
      { id: "2ki-1c", title: "Shunammite's Son Raised", reference: "2 Kings 4:8-37", summary: "A wealthy woman hosts Elisha; when her son dies, Elisha raises him from the dead.", characters: ["Elisha", "Shunammite Woman", "Son"], themes: ["Hospitality", "Faith", "Resurrection"], lessonLearned: "Generosity to God's servants is never forgotten." },
      { id: "2ki-1d", title: "Poison in the Pot", reference: "2 Kings 4:38-41", summary: "Wild gourds make stew deadly; Elisha adds flour and neutralizes the poison.", characters: ["Elisha", "Prophets"], themes: ["Provision", "Miracles", "Danger"], lessonLearned: "God can neutralize the poison in our lives." },
      { id: "2ki-1e", title: "Naaman's Little Maid", reference: "2 Kings 5:1-5", summary: "A captured Israelite servant girl tells her leprous master about the prophet who could heal him.", characters: ["Servant Girl", "Naaman", "Naaman's Wife"], themes: ["Witness", "Faith", "Unlikely Messengers"], lessonLearned: "Even a slave can change a general's destiny." },
      { id: "2ki-2", title: "Naaman Healed", reference: "2 Kings 5", summary: "Syrian commander Naaman is healed of leprosy by dipping in the Jordan.", characters: ["Naaman", "Elisha", "Servant Girl"], themes: ["Healing", "Humility", "Faith"], lessonLearned: "Humility precedes healing." },
      { id: "2ki-2b", title: "Gehazi's Greed", reference: "2 Kings 5:20-27", summary: "Elisha's servant Gehazi secretly takes gifts from Naaman and is struck with leprosy.", characters: ["Gehazi", "Elisha", "Naaman"], themes: ["Greed", "Deception", "Judgment"], lessonLearned: "Secret sin brings public consequences." },
      { id: "2ki-3", title: "Floating Axhead", reference: "2 Kings 6:1-7", summary: "Elisha makes a borrowed iron axhead float to recover it.", characters: ["Elisha", "Prophet's Son"], themes: ["Miracles", "Care", "Provision"], lessonLearned: "God cares about our daily concerns." },
      { id: "2ki-3b", title: "Invisible Army Revealed", reference: "2 Kings 6:8-23", summary: "Elisha's servant panics at the Syrian army until God opens his eyes to see fiery chariots protecting them.", characters: ["Elisha", "Servant", "Syrian Army"], themes: ["Protection", "Faith", "Invisible Realm"], lessonLearned: "Those with us are more than those against us." },
      { id: "2ki-3c", title: "Four Lepers Save a City", reference: "2 Kings 7", summary: "Four leprous outcasts discover the Syrian army has fled, leaving food—they bring news to starving Samaria.", characters: ["Four Lepers", "Samaria"], themes: ["Outcasts", "Providence", "Good News"], lessonLearned: "God uses the most unlikely people to bring salvation." },
      { id: "2ki-3d", title: "Dead Man Revived by Elisha's Bones", reference: "2 Kings 13:20-21", summary: "A corpse thrown into Elisha's tomb touches his bones and comes back to life.", characters: ["Dead Man", "Elisha's Bones"], themes: ["Power", "Legacy", "Resurrection"], lessonLearned: "God's power outlasts His prophets." },
      { id: "2ki-4", title: "Fall of Israel", reference: "2 Kings 17", summary: "Assyria conquers Israel due to persistent idolatry and covenant breaking.", characters: ["Israel", "Assyria"], themes: ["Judgment", "Exile", "Consequences"], lessonLearned: "Persistent sin leads to judgment." },
      { id: "2ki-5", title: "Hezekiah's Prayer", reference: "2 Kings 19-20", summary: "Hezekiah prays against Assyria; the angel kills 185,000 soldiers.", characters: ["Hezekiah", "Isaiah", "Sennacherib"], themes: ["Prayer", "Deliverance", "Faith"], lessonLearned: "God answers prayer against impossible odds." },
      { id: "2ki-5b", title: "Sundial Goes Backward", reference: "2 Kings 20:8-11", summary: "As a sign that Hezekiah will recover, God makes the shadow on the sundial go backward 10 degrees.", characters: ["Hezekiah", "Isaiah"], themes: ["Signs", "Healing", "God's Power"], lessonLearned: "God controls even time to confirm His word." },
      { id: "2ki-6", title: "Josiah's Reforms", reference: "2 Kings 22-23", summary: "Young Josiah finds the Law book and leads Judah in revival.", characters: ["Josiah", "Hilkiah", "Huldah"], themes: ["Reform", "Scripture", "Revival"], lessonLearned: "God's Word brings transformation." },
      { id: "2ki-6b", title: "Huldah the Prophetess", reference: "2 Kings 22:14-20", summary: "When the Law is found, King Josiah sends to Huldah—a female prophet—who confirms its authenticity and prophesies.", characters: ["Huldah", "Josiah", "Hilkiah"], themes: ["Women in Ministry", "Prophecy", "Validation"], lessonLearned: "God speaks through His servants regardless of gender." },
      { id: "2ki-7", title: "Fall of Jerusalem", reference: "2 Kings 25", summary: "Babylon destroys Jerusalem and the temple; Judah goes into exile.", characters: ["Nebuchadnezzar", "Zedekiah"], themes: ["Judgment", "Exile", "Destruction"], lessonLearned: "Sin's consequences eventually come due." },
      { id: "2ki-8", title: "Elisha's Double Portion", reference: "2 Kings 2:9-14", summary: "Elisha asks for a double portion of Elijah's spirit and parts the Jordan.", characters: ["Elisha", "Elijah"], themes: ["Succession", "Faith", "Power"], lessonLearned: "Ask boldly for spiritual power." },
      { id: "2ki-9", title: "Widow's Oil Multiplied", reference: "2 Kings 4:1-7", summary: "Elisha multiplies a widow's oil to fill many jars and pay her debts.", characters: ["Elisha", "Widow"], themes: ["Provision", "Faith", "Miracle"], lessonLearned: "God multiplies what we give Him." },
      { id: "2ki-10", title: "Shunammite's Son Raised", reference: "2 Kings 4:8-37", summary: "A wealthy woman hosts Elisha; her son dies but Elisha raises him from death.", characters: ["Elisha", "Shunammite Woman", "Son"], themes: ["Hospitality", "Faith", "Resurrection"], lessonLearned: "God rewards those who honor His servants." },
      { id: "2ki-11", title: "Poison in the Pot", reference: "2 Kings 4:38-41", summary: "Death is in the stew from wild gourds; Elisha purifies it with flour.", characters: ["Elisha", "Prophets"], themes: ["Danger", "Cleansing", "Provision"], lessonLearned: "God can neutralize deadly situations." },
      { id: "2ki-12", title: "The Leper General's Servant", reference: "2 Kings 5:20-27", summary: "Gehazi deceives Naaman for money; Naaman's leprosy transfers to him.", characters: ["Gehazi", "Naaman", "Elisha"], themes: ["Greed", "Deception", "Consequences"], lessonLearned: "Greed brings its own punishment." },
      { id: "2ki-13", title: "The Blinded Army", reference: "2 Kings 6:8-23", summary: "Elisha's servant sees angelic armies; Elisha blinds the Syrian army and leads them to Samaria.", characters: ["Elisha", "Servant", "Syrian Army"], themes: ["Protection", "Faith", "Vision"], lessonLearned: "Those with us are more than those against us." },
      { id: "2ki-14", title: "Famine and Siege Ended", reference: "2 Kings 6:24-7:20", summary: "During siege famine, Elisha prophesies abundance; four lepers discover the enemy fled.", characters: ["Elisha", "Four Lepers", "King"], themes: ["Faith", "Reversal", "Provision"], lessonLearned: "God can reverse impossible situations overnight." }
    ]
  },

  // 1 CHRONICLES
  {
    book: "1 Chronicles",
    testament: "old",
    stories: [
      { id: "1ch-1", title: "David's Mighty Men", reference: "1 Chronicles 11-12", summary: "David's warriors perform extraordinary feats of valor and loyalty.", characters: ["David", "Mighty Men"], themes: ["Courage", "Loyalty", "Warriors"], lessonLearned: "Faithful followers make great leaders." },
      { id: "1ch-2", title: "David's Census Sin", reference: "1 Chronicles 21", summary: "David's pride in numbering Israel brings plague; he buys the threshing floor for the temple site.", characters: ["David", "Gad", "Ornan"], themes: ["Pride", "Repentance", "Mercy"], lessonLearned: "Pride brings judgment; repentance brings mercy." },
      { id: "1ch-3", title: "David Prepares for Temple", reference: "1 Chronicles 28-29", summary: "David gathers materials and gives plans to Solomon for the temple.", characters: ["David", "Solomon"], themes: ["Preparation", "Generosity", "Legacy"], lessonLearned: "We prepare for what we cannot complete." }
    ]
  },

  // 2 CHRONICLES
  {
    book: "2 Chronicles",
    testament: "old",
    stories: [
      { id: "2ch-1", title: "Solomon's Glory", reference: "2 Chronicles 1-9", summary: "Solomon's reign reaches its height in wisdom, wealth, and the temple's glory.", characters: ["Solomon", "Queen of Sheba"], themes: ["Glory", "Wisdom", "Temple"], lessonLearned: "Blessing follows obedience." },
      { id: "2ch-2", title: "Asa's Faith and Failure", reference: "2 Chronicles 14-16", summary: "Asa trusts God for victory but later relies on Syria instead of God.", characters: ["Asa", "Hanani"], themes: ["Faith", "Decline", "Consequences"], lessonLearned: "Past faith doesn't guarantee future faithfulness." },
      { id: "2ch-3", title: "Jehoshaphat's Prayer", reference: "2 Chronicles 20", summary: "Jehoshaphat faces invasion, prays, and watches God defeat the enemies.", characters: ["Jehoshaphat", "Judah"], themes: ["Prayer", "Faith", "Victory"], lessonLearned: "The battle belongs to the Lord." },
      { id: "2ch-4", title: "Manasseh's Repentance", reference: "2 Chronicles 33", summary: "Wicked Manasseh is taken captive, repents, and is restored.", characters: ["Manasseh"], themes: ["Wickedness", "Repentance", "Restoration"], lessonLearned: "No one is beyond redemption." }
    ]
  },

  // EZRA
  {
    book: "Ezra",
    testament: "old",
    stories: [
      { id: "ezr-1", title: "Return from Exile", reference: "Ezra 1-2", summary: "Cyrus allows Jews to return to Jerusalem to rebuild the temple.", characters: ["Cyrus", "Zerubbabel", "Returnees"], themes: ["Restoration", "Providence", "Return"], lessonLearned: "God moves hearts to accomplish His purposes." },
      { id: "ezr-2", title: "Temple Rebuilt", reference: "Ezra 3-6", summary: "Despite opposition, the returning exiles rebuild and dedicate the temple.", characters: ["Zerubbabel", "Joshua", "Haggai"], themes: ["Perseverance", "Opposition", "Completion"], lessonLearned: "God's work continues despite opposition." },
      { id: "ezr-3", title: "Ezra's Mission", reference: "Ezra 7-10", summary: "Ezra leads another return and addresses the problem of intermarriage.", characters: ["Ezra", "Returnees"], themes: ["Scripture", "Reform", "Holiness"], lessonLearned: "God's Word must guide God's people." }
    ]
  },

  // NEHEMIAH
  {
    book: "Nehemiah",
    testament: "old",
    stories: [
      { id: "neh-1", title: "Nehemiah's Prayer", reference: "Nehemiah 1", summary: "Nehemiah weeps and prays when he hears Jerusalem's walls are broken down.", characters: ["Nehemiah"], themes: ["Prayer", "Burden", "Intercession"], lessonLearned: "Burden leads to prayer leads to action." },
      { id: "neh-1b", title: "Nehemiah Before the King", reference: "Nehemiah 2:1-8", summary: "Nehemiah asks the king for permission and resources to rebuild; the king grants it.", characters: ["Nehemiah", "Artaxerxes"], themes: ["Courage", "Prayer", "Favor"], lessonLearned: "Pray, then act with courage." },
      { id: "neh-2", title: "Wall Rebuilt", reference: "Nehemiah 2-6", summary: "Despite threats and ridicule, Nehemiah leads the people to rebuild the walls in 52 days.", characters: ["Nehemiah", "Sanballat", "Tobiah"], themes: ["Leadership", "Perseverance", "Unity"], lessonLearned: "United effort accomplishes great things." },
      { id: "neh-2b", title: "Building with Sword and Trowel", reference: "Nehemiah 4:16-23", summary: "Workers build with one hand and hold weapons with the other against enemies.", characters: ["Nehemiah", "Workers"], themes: ["Vigilance", "Work", "Defense"], lessonLearned: "Build and be ready to fight." },
      { id: "neh-3", title: "Reading of the Law", reference: "Nehemiah 8", summary: "Ezra reads the Law publicly; the people weep then celebrate.", characters: ["Ezra", "Nehemiah", "People"], themes: ["Scripture", "Revival", "Joy"], lessonLearned: "God's Word brings conviction and joy." },
      { id: "neh-4", title: "Nehemiah's Generosity", reference: "Nehemiah 5", summary: "Nehemiah rebukes nobles for charging interest to poor Jews and sets an example of generosity.", characters: ["Nehemiah", "Nobles"], themes: ["Justice", "Generosity", "Leadership"], lessonLearned: "True leaders sacrifice for their people." }
    ]
  },

  // ESTHER
  {
    book: "Esther",
    testament: "old",
    stories: [
      { id: "est-1", title: "Esther Becomes Queen", reference: "Esther 1-2", summary: "Jewish Esther becomes queen of Persia after Vashti is deposed.", characters: ["Esther", "Xerxes", "Mordecai"], themes: ["Providence", "Beauty", "Position"], lessonLearned: "God positions people for His purposes." },
      { id: "est-2", title: "Haman's Plot", reference: "Esther 3-4", summary: "Haman plots to destroy all Jews; Mordecai urges Esther to intervene.", characters: ["Haman", "Mordecai", "Esther"], themes: ["Evil", "Courage", "Purpose"], lessonLearned: "For such a time as this." },
      { id: "est-3", title: "Esther's Courage", reference: "Esther 5-7", summary: "Esther risks her life to expose Haman; he is hanged on his own gallows.", characters: ["Esther", "Xerxes", "Haman"], themes: ["Courage", "Reversal", "Justice"], lessonLearned: "Courage can reverse the plans of evil." },
      { id: "est-4", title: "Purim Established", reference: "Esther 9-10", summary: "Jews are saved and establish Purim to celebrate their deliverance.", characters: ["Jews", "Mordecai", "Esther"], themes: ["Deliverance", "Celebration", "Reversal"], lessonLearned: "God turns mourning into celebration." }
    ]
  },

  // JOB
  {
    book: "Job",
    testament: "old",
    stories: [
      { id: "job-1", title: "Job's Testing", reference: "Job 1-2", summary: "Satan tests Job by taking his wealth, children, and health; Job refuses to curse God.", characters: ["Job", "Satan", "God"], themes: ["Suffering", "Faith", "Testing"], lessonLearned: "Bless God in prosperity and adversity." },
      { id: "job-1b", title: "Job's Wife and Friends Arrive", reference: "Job 2:9-13", summary: "Job's wife urges him to curse God; his three friends sit in silence for seven days.", characters: ["Job", "Job's Wife", "Friends"], themes: ["Grief", "Silence", "Comfort"], lessonLearned: "Sometimes silent presence is the best comfort." },
      { id: "job-2", title: "Friends' Debate", reference: "Job 3-37", summary: "Job's friends argue that his suffering must be due to sin; Job maintains his innocence.", characters: ["Job", "Eliphaz", "Bildad", "Zophar", "Elihu"], themes: ["Suffering", "Theology", "Innocence"], lessonLearned: "Simple answers don't explain all suffering." },
      { id: "job-2b", title: "Job's Redeemer Lives", reference: "Job 19:23-27", summary: "Job declares that his Redeemer lives and he will see God in his flesh.", characters: ["Job"], themes: ["Hope", "Redemption", "Resurrection"], lessonLearned: "Even in despair, faith looks to the Redeemer." },
      { id: "job-3", title: "God Answers Job", reference: "Job 38-41", summary: "God speaks from the whirlwind, revealing His power and wisdom; Job is humbled.", characters: ["Job", "God"], themes: ["Sovereignty", "Humility", "Mystery"], lessonLearned: "God's ways are beyond our understanding." },
      { id: "job-3b", title: "Behemoth and Leviathan", reference: "Job 40-41", summary: "God describes Behemoth and Leviathan as examples of His creative power beyond human control.", characters: ["Job", "God"], themes: ["Power", "Creation", "Awe"], lessonLearned: "God's creation displays His incomprehensible power." },
      { id: "job-4", title: "Job Restored", reference: "Job 42", summary: "Job repents of questioning God; God restores double what he lost.", characters: ["Job", "God"], themes: ["Restoration", "Repentance", "Blessing"], lessonLearned: "God restores those who trust Him through suffering." }
    ]
  },

  // PSALMS
  {
    book: "Psalms",
    testament: "old",
    stories: [
      { id: "psa-1", title: "The Blessed Man", reference: "Psalm 1", summary: "Contrasts the righteous who meditate on God's law with the wicked who perish.", characters: ["Righteous", "Wicked"], themes: ["Blessing", "Meditation", "Two Ways"], lessonLearned: "Meditation on God's Word brings blessing." },
      { id: "psa-2", title: "The Shepherd Psalm", reference: "Psalm 23", summary: "David declares the Lord as shepherd who provides, guides, and protects.", characters: ["David", "Lord"], themes: ["Provision", "Guidance", "Protection"], lessonLearned: "The Lord is our shepherd; we lack nothing." },
      { id: "psa-3", title: "David's Repentance", reference: "Psalm 51", summary: "David's prayer of repentance after his sin with Bathsheba.", characters: ["David", "God"], themes: ["Repentance", "Forgiveness", "Cleansing"], lessonLearned: "God delights in a broken and contrite heart." },
      { id: "psa-4", title: "The Messianic Psalm", reference: "Psalm 22", summary: "Prophetically describes the Messiah's suffering and ultimate vindication.", characters: ["Messiah"], themes: ["Suffering", "Prophecy", "Victory"], lessonLearned: "Christ's suffering was foretold in detail." },
      { id: "psa-5", title: "The Praise Psalms", reference: "Psalm 145-150", summary: "The final psalms of praise calling all creation to worship the Lord.", characters: ["Creation", "Saints"], themes: ["Praise", "Worship", "Glory"], lessonLearned: "Let everything that has breath praise the Lord." },
      { id: "psa-6", title: "The Heavens Declare", reference: "Psalm 19", summary: "The heavens declare God's glory; His law is perfect, reviving the soul.", characters: ["Creation", "God"], themes: ["Creation", "Revelation", "Law"], lessonLearned: "God reveals Himself through nature and Scripture." },
      { id: "psa-7", title: "Out of the Depths", reference: "Psalm 130", summary: "From the depths I cry to You, Lord; with You there is forgiveness and plentiful redemption.", characters: ["Psalmist", "Lord"], themes: ["Despair", "Forgiveness", "Hope"], lessonLearned: "God hears our cries from the lowest places." },
      { id: "psa-8", title: "Unless the Lord Builds", reference: "Psalm 127", summary: "Unless the Lord builds the house, the builders labor in vain; children are a heritage from the Lord.", characters: ["Solomon"], themes: ["Dependence", "Family", "Work"], lessonLearned: "All human effort is futile without God's blessing." },
      { id: "psa-9", title: "By the Rivers of Babylon", reference: "Psalm 137", summary: "Exiles in Babylon weep, hang their harps on willows, and cannot sing the Lord's song in a foreign land.", characters: ["Exiles"], themes: ["Exile", "Grief", "Memory"], lessonLearned: "Grief for what was lost is part of faithful remembering." },
      { id: "psa-10", title: "Create in Me a Clean Heart", reference: "Psalm 51:10-12", summary: "David pleads for a clean heart, a renewed spirit, and the restoration of joy.", characters: ["David", "God"], themes: ["Cleansing", "Renewal", "Joy"], lessonLearned: "Only God can create a pure heart within us." },
      { id: "psa-11", title: "The Lord is My Light", reference: "Psalm 27", summary: "The Lord is my light and salvation—whom shall I fear? One thing I ask: to dwell in God's house.", characters: ["David", "Lord"], themes: ["Courage", "Seeking God", "Protection"], lessonLearned: "When God is our light, we need not fear." },
      { id: "psa-12", title: "O Taste and See", reference: "Psalm 34", summary: "David, when he pretended madness before Abimelech, praises God: 'O taste and see that the Lord is good!'", characters: ["David", "Lord"], themes: ["Deliverance", "Experience", "Fear of God"], lessonLearned: "God's goodness is meant to be tasted and experienced." },
      { id: "psa-13", title: "How Long, O Lord?", reference: "Psalm 13", summary: "David cries 'How long?' four times but ends with trust and singing to the Lord.", characters: ["David", "Lord"], themes: ["Lament", "Waiting", "Trust"], lessonLearned: "It's okay to ask 'how long?' if we end with trust." },
      { id: "psa-14", title: "The Lord Reigns", reference: "Psalm 93-99", summary: "A collection declaring God's kingship: The Lord reigns! Let the earth be glad.", characters: ["Lord", "Nations"], themes: ["Kingship", "Sovereignty", "Worship"], lessonLearned: "God is King over all the earth." }
    ]
  },

  // PROVERBS
  {
    book: "Proverbs",
    testament: "old",
    stories: [
      { id: "pro-1", title: "Wisdom's Call", reference: "Proverbs 1-9", summary: "Wisdom personified calls out, offering life and blessing to those who heed her.", characters: ["Wisdom", "Folly", "Young Man"], themes: ["Wisdom", "Choice", "Life"], lessonLearned: "The fear of the Lord is the beginning of wisdom." },
      { id: "pro-2", title: "The Virtuous Woman", reference: "Proverbs 31:10-31", summary: "Description of the excellent wife whose worth is far above rubies.", characters: ["Virtuous Woman", "Husband"], themes: ["Virtue", "Industry", "Character"], lessonLearned: "Character matters more than charm or beauty." },
      { id: "pro-3", title: "Trust in the Lord", reference: "Proverbs 3:5-6", summary: "Trust in the Lord with all your heart; lean not on your own understanding; in all your ways acknowledge Him and He will direct your paths.", characters: ["Solomon", "Reader"], themes: ["Trust", "Guidance", "Surrender"], lessonLearned: "Complete trust in God leads to divine guidance." },
      { id: "pro-4", title: "Lady Wisdom vs. Lady Folly", reference: "Proverbs 9", summary: "Both Wisdom and Folly call out to the simple; one offers life, the other leads to death.", characters: ["Lady Wisdom", "Lady Folly"], themes: ["Choice", "Consequences", "Invitation"], lessonLearned: "We must choose between wisdom's feast and folly's trap." },
      { id: "pro-5", title: "The Ant's Lesson", reference: "Proverbs 6:6-11", summary: "Go to the ant, you sluggard! Consider her ways and be wise—she stores provisions without a commander.", characters: ["Ant", "Sluggard"], themes: ["Industry", "Self-Motivation", "Nature Lessons"], lessonLearned: "Nature teaches us diligence without needing supervision." },
      { id: "pro-6", title: "The Seven Abominations", reference: "Proverbs 6:16-19", summary: "Seven things the Lord hates: proud looks, lying tongue, hands shedding innocent blood, wicked schemes, feet running to evil, false witness, sowing discord.", characters: ["God"], themes: ["Sin", "Hatred", "Character"], lessonLearned: "God has specific things He hates—we should hate them too." },
      { id: "pro-7", title: "Train Up a Child", reference: "Proverbs 22:6", summary: "Train up a child in the way he should go, and when he is old he will not depart from it.", characters: ["Parents", "Child"], themes: ["Parenting", "Training", "Future"], lessonLearned: "Early training shapes lifelong character." },
      { id: "pro-8", title: "A Soft Answer", reference: "Proverbs 15:1", summary: "A soft answer turns away wrath, but a harsh word stirs up anger.", characters: ["Speaker", "Listener"], themes: ["Speech", "Conflict", "Peace"], lessonLearned: "How we speak determines others' response." },
      { id: "pro-9", title: "Iron Sharpens Iron", reference: "Proverbs 27:17", summary: "As iron sharpens iron, so a man sharpens the countenance of his friend.", characters: ["Friends"], themes: ["Friendship", "Growth", "Challenge"], lessonLearned: "Good friendships sharpen our character." },
      { id: "pro-10", title: "Pride Goes Before Destruction", reference: "Proverbs 16:18", summary: "Pride goes before destruction, and a haughty spirit before a fall.", characters: ["Proud Person"], themes: ["Pride", "Fall", "Humility"], lessonLearned: "Pride always precedes a fall." }
    ]
  },

  // ECCLESIASTES
  {
    book: "Ecclesiastes",
    testament: "old",
    stories: [
      { id: "ecc-1", title: "Vanity of Life", reference: "Ecclesiastes 1-2", summary: "The Teacher explores pleasure, wisdom, and work, finding all is vanity without God.", characters: ["Teacher/Solomon"], themes: ["Vanity", "Meaning", "Search"], lessonLearned: "Life without God is meaningless." },
      { id: "ecc-2", title: "A Time for Everything", reference: "Ecclesiastes 3", summary: "There is a season for everything under heaven—birth, death, war, peace.", characters: ["Teacher"], themes: ["Seasons", "Time", "Providence"], lessonLearned: "God has appointed a time for everything." },
      { id: "ecc-3", title: "The Conclusion", reference: "Ecclesiastes 12", summary: "Remember your Creator; fear God and keep His commandments—this is man's all.", characters: ["Teacher"], themes: ["Conclusion", "Fear of God", "Purpose"], lessonLearned: "Fear God and keep His commandments." },
      { id: "ecc-4", title: "Two Are Better Than One", reference: "Ecclesiastes 4:9-12", summary: "Two are better than one; if one falls, the other can help. A cord of three strands is not quickly broken.", characters: ["Companions"], themes: ["Community", "Strength", "Unity"], lessonLearned: "Life is meant to be lived together." },
      { id: "ecc-5", title: "Cast Your Bread Upon Waters", reference: "Ecclesiastes 11:1-6", summary: "Cast your bread upon the waters and it will return after many days; sow in morning and evening—you don't know which will prosper.", characters: ["Teacher"], themes: ["Generosity", "Faith", "Action"], lessonLearned: "Give generously and work diligently without knowing outcomes." },
      { id: "ecc-6", title: "Remember Your Creator in Youth", reference: "Ecclesiastes 12:1-7", summary: "Remember your Creator in the days of your youth, before the difficult days come and the body grows old.", characters: ["Teacher", "Youth"], themes: ["Youth", "Aging", "Memory"], lessonLearned: "Serve God while you are young and strong." },
      { id: "ecc-7", title: "Chasing After Wind", reference: "Ecclesiastes 2:11-17", summary: "All achievements and pleasures are like chasing after the wind—they cannot satisfy the soul.", characters: ["Teacher"], themes: ["Futility", "Achievement", "Satisfaction"], lessonLearned: "No earthly pursuit can satisfy the God-shaped hole in our hearts." }
    ]
  },

  // SONG OF SOLOMON
  {
    book: "Song of Solomon",
    testament: "old",
    stories: [
      { id: "sos-1", title: "The Beloved's Beauty", reference: "Song of Solomon 1-4", summary: "The lover and beloved express their passionate love and admiration.", characters: ["Beloved", "Lover"], themes: ["Love", "Beauty", "Intimacy"], lessonLearned: "God created romantic love as beautiful." },
      { id: "sos-2", title: "Love's Strength", reference: "Song of Solomon 8:6-7", summary: "Love is as strong as death; many waters cannot quench it.", characters: ["Beloved", "Lover"], themes: ["Love", "Commitment", "Strength"], lessonLearned: "True love is unquenchable." },
      { id: "sos-3", title: "The Little Foxes", reference: "Song of Solomon 2:15", summary: "Catch the little foxes that spoil the vineyards, for our vineyards are in blossom.", characters: ["Beloved", "Lover"], themes: ["Protection", "Small Sins", "Relationship"], lessonLearned: "Small problems left unchecked destroy relationships." },
      { id: "sos-4", title: "The Search for the Beloved", reference: "Song of Solomon 3:1-5", summary: "The woman seeks her beloved by night through the city streets until she finds him.", characters: ["Shulamite Woman", "Watchmen"], themes: ["Longing", "Seeking", "Finding"], lessonLearned: "True love pursues even in difficulty." },
      { id: "sos-5", title: "My Beloved's Garden", reference: "Song of Solomon 4:12-5:1", summary: "The beloved is like a locked garden, a sealed spring—pure and treasured until the moment of union.", characters: ["Beloved", "Lover"], themes: ["Purity", "Waiting", "Intimacy"], lessonLearned: "Purity makes intimacy more precious." },
      { id: "sos-6", title: "I Am My Beloved's", reference: "Song of Solomon 6:3", summary: "I am my beloved's and my beloved is mine; he grazes among the lilies.", characters: ["Shulamite Woman", "Solomon"], themes: ["Belonging", "Mutual Love", "Devotion"], lessonLearned: "Love is about mutual belonging and devotion." }
    ]
  },

  // ISAIAH
  {
    book: "Isaiah",
    testament: "old",
    stories: [
      { id: "isa-1", title: "Isaiah's Vision", reference: "Isaiah 6", summary: "Isaiah sees the Lord high and lifted up; his lips are cleansed with a coal.", characters: ["Isaiah", "Seraphim", "God"], themes: ["Holiness", "Cleansing", "Calling"], lessonLearned: "Vision of God's holiness transforms us for service." },
      { id: "isa-2", title: "Immanuel Prophecy", reference: "Isaiah 7:14", summary: "Isaiah prophesies that a virgin will bear a son called Immanuel.", characters: ["Isaiah", "Ahaz"], themes: ["Prophecy", "Messiah", "Sign"], lessonLearned: "God gives signs of His coming salvation." },
      { id: "isa-3", title: "The Suffering Servant", reference: "Isaiah 52:13-53:12", summary: "Prophecy of the Servant who bears our sins and is crushed for our iniquities.", characters: ["Suffering Servant"], themes: ["Substitution", "Suffering", "Redemption"], lessonLearned: "By His wounds we are healed." },
      { id: "isa-4", title: "New Heavens and Earth", reference: "Isaiah 65:17-25", summary: "God promises to create new heavens and earth where peace reigns.", characters: ["God", "Redeemed"], themes: ["New Creation", "Peace", "Hope"], lessonLearned: "God will make all things new." },
      { id: "isa-5", title: "The Vineyard Song", reference: "Isaiah 5:1-7", summary: "God planted a vineyard expecting good grapes but got wild ones; the vineyard is Israel who produced injustice instead of justice.", characters: ["God", "Israel"], themes: ["Disappointment", "Judgment", "Expectation"], lessonLearned: "God expects His people to produce good fruit." },
      { id: "isa-6", title: "Hezekiah's Illness and Recovery", reference: "Isaiah 38", summary: "Hezekiah is told he will die; he prays weeping; God adds 15 years to his life.", characters: ["Hezekiah", "Isaiah", "God"], themes: ["Prayer", "Healing", "Gratitude"], lessonLearned: "God hears our desperate prayers." },
      { id: "isa-7", title: "The Branch of Jesse", reference: "Isaiah 11:1-10", summary: "A Branch from Jesse's stump will judge with righteousness; the wolf will lie with the lamb.", characters: ["Branch/Messiah"], themes: ["Messiah", "Peace", "Righteousness"], lessonLearned: "Christ brings perfect peace and justice." },
      { id: "isa-8", title: "Comfort My People", reference: "Isaiah 40:1-11", summary: "God tells prophets to comfort Jerusalem; every valley lifted, every mountain lowered; the Lord comes with power.", characters: ["God", "Isaiah"], themes: ["Comfort", "Preparation", "Coming"], lessonLearned: "God's comfort prepares the way for His coming." }
    ]
  },

  // JEREMIAH
  {
    book: "Jeremiah",
    testament: "old",
    stories: [
      { id: "jer-1", title: "Jeremiah's Call", reference: "Jeremiah 1", summary: "God calls Jeremiah as prophet before he was born; gives him words.", characters: ["Jeremiah", "God"], themes: ["Calling", "Youth", "Commissioning"], lessonLearned: "God prepares us before we are born." },
      { id: "jer-2", title: "The Potter's House", reference: "Jeremiah 18", summary: "Jeremiah watches a potter remake a marred vessel—illustrating God's sovereignty.", characters: ["Jeremiah", "Potter"], themes: ["Sovereignty", "Remaking", "Submission"], lessonLearned: "God reshapes those who yield to Him." },
      { id: "jer-3", title: "The New Covenant", reference: "Jeremiah 31:31-34", summary: "God promises a new covenant written on hearts, with sins remembered no more.", characters: ["God", "Israel"], themes: ["New Covenant", "Forgiveness", "Heart"], lessonLearned: "God will write His law on our hearts." },
      { id: "jer-4", title: "Jeremiah in the Cistern", reference: "Jeremiah 38", summary: "Jeremiah is thrown into a muddy cistern but rescued by Ebed-Melech.", characters: ["Jeremiah", "Ebed-Melech"], themes: ["Persecution", "Rescue", "Faithfulness"], lessonLearned: "Faithful prophets face persecution." },
      { id: "jer-5", title: "The Linen Belt", reference: "Jeremiah 13:1-11", summary: "God tells Jeremiah to buy a belt, wear it, then bury it by the Euphrates; it becomes ruined—so Israel became useless through pride.", characters: ["Jeremiah", "God"], themes: ["Object Lesson", "Pride", "Uselessness"], lessonLearned: "Pride ruins our usefulness to God." },
      { id: "jer-6", title: "Buying the Field at Anathoth", reference: "Jeremiah 32", summary: "While Jerusalem is under siege, God tells Jeremiah to buy his cousin's field as a sign that houses and fields will again be bought.", characters: ["Jeremiah", "Hanamel"], themes: ["Hope", "Faith", "Future"], lessonLearned: "Act in faith on God's future promises." },
      { id: "jer-7", title: "The Two Baskets of Figs", reference: "Jeremiah 24", summary: "God shows Jeremiah two baskets: good figs represent exiles He will restore; bad figs represent those who stayed and rebelled.", characters: ["Jeremiah", "God"], themes: ["Judgment", "Restoration", "Exile"], lessonLearned: "God distinguishes between those who submit and those who rebel." },
      { id: "jer-8", title: "Jeremiah's Lament", reference: "Jeremiah 20:7-18", summary: "Jeremiah pours out his anguish: God has deceived him, he's mocked daily, yet he cannot stop speaking God's word.", characters: ["Jeremiah", "God"], themes: ["Lament", "Compulsion", "Suffering"], lessonLearned: "Even prophets struggle, but God's word burns in them." },
      { id: "jer-9", title: "The Broken Jar", reference: "Jeremiah 19", summary: "Jeremiah breaks a clay jar at the Potsherd Gate, prophesying that Jerusalem will be broken beyond repair.", characters: ["Jeremiah", "Elders"], themes: ["Judgment", "Irreversibility", "Prophecy"], lessonLearned: "Some judgments cannot be reversed." }
    ]
  },

  // LAMENTATIONS
  {
    book: "Lamentations",
    testament: "old",
    stories: [
      { id: "lam-1", title: "Jerusalem's Desolation", reference: "Lamentations 1-2", summary: "Jeremiah mourns over Jerusalem's destruction and the people's suffering.", characters: ["Jeremiah", "Jerusalem"], themes: ["Grief", "Judgment", "Mourning"], lessonLearned: "Sin brings devastating consequences." },
      { id: "lam-2", title: "Hope in the Midst", reference: "Lamentations 3:22-26", summary: "Even in despair, Jeremiah declares God's mercies are new every morning.", characters: ["Jeremiah", "God"], themes: ["Hope", "Mercy", "Faithfulness"], lessonLearned: "God's mercies are new every morning." }
    ]
  },

  // EZEKIEL
  {
    book: "Ezekiel",
    testament: "old",
    stories: [
      { id: "eze-1", title: "Ezekiel's Vision", reference: "Ezekiel 1", summary: "Ezekiel sees visions of God's glory—living creatures, wheels, and throne.", characters: ["Ezekiel", "Living Creatures"], themes: ["Glory", "Vision", "Majesty"], lessonLearned: "God's glory transcends our imagination." },
      { id: "eze-1b", title: "Ezekiel Eats the Scroll", reference: "Ezekiel 2-3", summary: "Ezekiel eats a scroll that tastes like honey and is commissioned as watchman to Israel.", characters: ["Ezekiel", "God"], themes: ["Commission", "Watchman", "Word"], lessonLearned: "God's Word must be internalized before proclaimed." },
      { id: "eze-1c", title: "Siege of Jerusalem Enacted", reference: "Ezekiel 4-5", summary: "Ezekiel acts out the siege of Jerusalem with a model city, lying on his side, and cutting his hair.", characters: ["Ezekiel"], themes: ["Prophecy", "Judgment", "Object Lessons"], lessonLearned: "Sometimes prophets must dramatize God's message." },
      { id: "eze-1d", title: "Glory Departs the Temple", reference: "Ezekiel 10-11", summary: "Ezekiel watches as God's glory departs from the temple due to Israel's sin.", characters: ["Ezekiel", "Cherubim", "Glory"], themes: ["Departure", "Sin", "Ichabod"], lessonLearned: "Persistent sin drives God's presence away." },
      { id: "eze-1e", title: "The Shepherds of Israel", reference: "Ezekiel 34", summary: "God condemns Israel's false shepherds and promises to be their true Shepherd.", characters: ["God", "False Shepherds", "Israel"], themes: ["Leadership", "Shepherd", "Messiah"], lessonLearned: "God Himself will shepherd His scattered flock." },
      { id: "eze-2", title: "Valley of Dry Bones", reference: "Ezekiel 37:1-14", summary: "Ezekiel prophesies to dry bones; they come to life as God's breath enters them.", characters: ["Ezekiel", "Bones", "Spirit"], themes: ["Resurrection", "Revival", "Spirit"], lessonLearned: "God brings life from death." },
      { id: "eze-2b", title: "Two Sticks Become One", reference: "Ezekiel 37:15-28", summary: "Ezekiel joins two sticks symbolizing Judah and Israel's future reunification under one king.", characters: ["Ezekiel", "Judah", "Israel"], themes: ["Unity", "Restoration", "Messiah"], lessonLearned: "God will reunite His divided people." },
      { id: "eze-2c", title: "Gog and Magog", reference: "Ezekiel 38-39", summary: "God predicts and defeats a massive end-time invasion led by Gog from Magog.", characters: ["God", "Gog", "Magog"], themes: ["End Times", "Victory", "Protection"], lessonLearned: "God will defeat all final attacks on His people." },
      { id: "eze-3", title: "Temple Vision", reference: "Ezekiel 40-48", summary: "Ezekiel sees a vision of a restored temple with God's glory returning.", characters: ["Ezekiel", "Guide"], themes: ["Restoration", "Glory", "Worship"], lessonLearned: "God will restore His dwelling among His people." }
    ]
  },

  // DANIEL
  {
    book: "Daniel",
    testament: "old",
    stories: [
      { id: "dan-1", title: "Daniel's Resolve", reference: "Daniel 1", summary: "Daniel and friends refuse the king's food, choosing faithfulness to God.", characters: ["Daniel", "Shadrach", "Meshach", "Abednego"], themes: ["Faithfulness", "Resolve", "Blessing"], lessonLearned: "Faithfulness in small things leads to great honor." },
      { id: "dan-2", title: "Nebuchadnezzar's Dream", reference: "Daniel 2", summary: "Daniel interprets the king's dream of a statue representing successive kingdoms.", characters: ["Daniel", "Nebuchadnezzar"], themes: ["Prophecy", "Kingdoms", "God's Knowledge"], lessonLearned: "God reveals mysteries and controls history." },
      { id: "dan-3", title: "Fiery Furnace", reference: "Daniel 3", summary: "Shadrach, Meshach, and Abednego refuse to bow; God saves them from the fire.", characters: ["Shadrach", "Meshach", "Abednego", "Fourth Man"], themes: ["Faith", "Courage", "Deliverance"], lessonLearned: "God delivers those who stand firm." },
      { id: "dan-3b", title: "Nebuchadnezzar's Pride", reference: "Daniel 4", summary: "Nebuchadnezzar is warned in a dream, refuses to humble himself, and becomes like a beast for seven years.", characters: ["Daniel", "Nebuchadnezzar"], themes: ["Pride", "Humiliation", "Restoration"], lessonLearned: "God humbles those who walk in pride." },
      { id: "dan-4", title: "Writing on the Wall", reference: "Daniel 5", summary: "A hand writes on the wall; Daniel interprets doom for Belshazzar.", characters: ["Daniel", "Belshazzar"], themes: ["Judgment", "Pride", "Interpretation"], lessonLearned: "God judges prideful kingdoms." },
      { id: "dan-5", title: "Daniel in the Lions' Den", reference: "Daniel 6", summary: "Daniel continues praying despite the decree; God shuts the lions' mouths.", characters: ["Daniel", "Darius", "Lions"], themes: ["Faithfulness", "Prayer", "Deliverance"], lessonLearned: "God protects those who trust Him." },
      { id: "dan-6", title: "Vision of Four Beasts", reference: "Daniel 7", summary: "Daniel sees four beasts representing kingdoms, the Ancient of Days, and the Son of Man receiving dominion.", characters: ["Daniel", "Ancient of Days", "Son of Man"], themes: ["Prophecy", "Kingdoms", "Sovereignty"], lessonLearned: "God's kingdom will overcome all earthly powers." },
      { id: "dan-7", title: "Vision of Ram and Goat", reference: "Daniel 8", summary: "Daniel sees a ram (Medo-Persia) and a goat (Greece) with a little horn rising.", characters: ["Daniel", "Gabriel"], themes: ["Prophecy", "Empires", "Cleansing"], lessonLearned: "God reveals the rise and fall of empires." },
      { id: "dan-8", title: "Daniel's Prayer and 70 Weeks", reference: "Daniel 9", summary: "Daniel prays for Jerusalem's restoration; Gabriel reveals the 70 weeks prophecy pointing to Messiah.", characters: ["Daniel", "Gabriel"], themes: ["Prayer", "Messiah", "Prophecy"], lessonLearned: "God's prophetic timeline leads to Christ." },
      { id: "dan-9", title: "Vision of the Great Conflict", reference: "Daniel 10-12", summary: "Daniel receives a vision of spiritual warfare, kings of North and South, and the time of the end.", characters: ["Daniel", "Gabriel", "Michael"], themes: ["Spiritual Warfare", "End Times", "Resurrection"], lessonLearned: "Behind history is cosmic spiritual conflict." }
    ]
  },

  // HOSEA
  {
    book: "Hosea",
    testament: "old",
    stories: [
      { id: "hos-1", title: "Hosea Marries Gomer", reference: "Hosea 1-3", summary: "Hosea marries unfaithful Gomer to illustrate God's love for unfaithful Israel.", characters: ["Hosea", "Gomer", "Children"], themes: ["Unfaithfulness", "Redemption", "Love"], lessonLearned: "God's love pursues the unfaithful." },
      { id: "hos-2", title: "God's Faithful Love", reference: "Hosea 11", summary: "God recalls His love for Israel as a child and refuses to give them up.", characters: ["God", "Israel"], themes: ["Love", "Compassion", "Mercy"], lessonLearned: "God's love overcomes our unfaithfulness." }
    ]
  },

  // JOEL
  {
    book: "Joel",
    testament: "old",
    stories: [
      { id: "joe-1", title: "Locust Plague", reference: "Joel 1-2:11", summary: "A devastating locust plague pictures the coming Day of the Lord.", characters: ["Joel", "Judah"], themes: ["Judgment", "Repentance", "Warning"], lessonLearned: "Disaster calls for repentance." },
      { id: "joe-2", title: "Spirit Poured Out", reference: "Joel 2:28-32", summary: "God promises to pour out His Spirit on all flesh in the last days.", characters: ["God", "All Flesh"], themes: ["Spirit", "Prophecy", "Salvation"], lessonLearned: "God will pour out His Spirit on all people." }
    ]
  },

  // AMOS
  {
    book: "Amos",
    testament: "old",
    stories: [
      { id: "amo-1", title: "Amos the Shepherd", reference: "Amos 1-2", summary: "Shepherd Amos prophesies judgment against surrounding nations and Israel.", characters: ["Amos", "Nations"], themes: ["Justice", "Judgment", "Social Sin"], lessonLearned: "God judges all nations for injustice." },
      { id: "amo-2", title: "Let Justice Roll", reference: "Amos 5:21-24", summary: "God rejects Israel's religious rituals and demands justice and righteousness.", characters: ["God", "Israel"], themes: ["Justice", "True Worship", "Hypocrisy"], lessonLearned: "God desires justice, not empty religion." }
    ]
  },

  // OBADIAH
  {
    book: "Obadiah",
    testament: "old",
    stories: [
      { id: "oba-1", title: "Judgment on Edom", reference: "Obadiah 1", summary: "Obadiah pronounces doom on Edom for pride and mistreating Israel.", characters: ["Edom", "Israel"], themes: ["Pride", "Judgment", "Brotherhood"], lessonLearned: "Pride and cruelty bring judgment." }
    ]
  },

  // JONAH
  {
    book: "Jonah",
    testament: "old",
    stories: [
      { id: "jon-1", title: "Jonah Flees", reference: "Jonah 1", summary: "Jonah flees from God's call; a storm threatens the ship; he is thrown overboard.", characters: ["Jonah", "Sailors"], themes: ["Disobedience", "Consequences", "Providence"], lessonLearned: "We cannot run from God's call." },
      { id: "jon-2", title: "Jonah and the Fish", reference: "Jonah 2", summary: "A great fish swallows Jonah; he prays and is vomited onto land.", characters: ["Jonah", "Fish", "God"], themes: ["Rescue", "Prayer", "Second Chance"], lessonLearned: "God gives second chances." },
      { id: "jon-3", title: "Nineveh Repents", reference: "Jonah 3", summary: "Jonah preaches; Nineveh repents from king to commoner; God relents.", characters: ["Jonah", "Nineveh", "King"], themes: ["Repentance", "Mercy", "Revival"], lessonLearned: "God is merciful to those who repent." },
      { id: "jon-4", title: "Jonah's Anger", reference: "Jonah 4", summary: "Jonah is angry that God spared Nineveh; God teaches him about compassion.", characters: ["Jonah", "God"], themes: ["Anger", "Compassion", "Grace"], lessonLearned: "God's compassion extends to all people." },
      { id: "jon-4b", title: "The Gourd, the Worm, and the Wind", reference: "Jonah 4:5-11", summary: "God grows a plant to shade Jonah, then sends a worm to kill it, teaching Jonah he cares more about a plant than about 120,000 souls.", characters: ["Jonah", "God", "Plant", "Worm"], themes: ["Object Lessons", "Misplaced Values", "God's Heart"], lessonLearned: "Our priorities reveal our hearts; God cares for people above comfort." }
    ]
  },

  // MICAH
  {
    book: "Micah",
    testament: "old",
    stories: [
      { id: "mic-1", title: "What God Requires", reference: "Micah 6:6-8", summary: "God requires justice, mercy, and humble walk—not mere sacrifices.", characters: ["Micah", "Israel"], themes: ["Justice", "Mercy", "Humility"], lessonLearned: "Do justice, love mercy, walk humbly." },
      { id: "mic-2", title: "Bethlehem Prophecy", reference: "Micah 5:2", summary: "The ruler of Israel will come from Bethlehem, though it is small.", characters: ["Ruler/Messiah"], themes: ["Prophecy", "Messiah", "Humility"], lessonLearned: "God uses small places for great purposes." }
    ]
  },

  // NAHUM
  {
    book: "Nahum",
    testament: "old",
    stories: [
      { id: "nah-1", title: "Nineveh's Doom", reference: "Nahum 1-3", summary: "Nahum prophesies the destruction of Nineveh for its cruelty and evil.", characters: ["Nineveh", "Assyria"], themes: ["Judgment", "Vengeance", "Justice"], lessonLearned: "God eventually judges persistent wickedness." }
    ]
  },

  // HABAKKUK
  {
    book: "Habakkuk",
    testament: "old",
    stories: [
      { id: "hab-1", title: "Habakkuk's Questions", reference: "Habakkuk 1-2", summary: "Habakkuk questions God about evil; God reveals the just shall live by faith.", characters: ["Habakkuk", "God"], themes: ["Questions", "Faith", "Justice"], lessonLearned: "The righteous live by faith even in confusion." },
      { id: "hab-2", title: "Habakkuk's Prayer", reference: "Habakkuk 3", summary: "Habakkuk declares he will rejoice in God even if everything fails.", characters: ["Habakkuk"], themes: ["Faith", "Joy", "Trust"], lessonLearned: "Joy in God transcends circumstances." }
    ]
  },

  // ZEPHANIAH
  {
    book: "Zephaniah",
    testament: "old",
    stories: [
      { id: "zep-1", title: "Day of the Lord", reference: "Zephaniah 1", summary: "Zephaniah warns of coming judgment—the great Day of the Lord.", characters: ["Zephaniah", "Judah"], themes: ["Judgment", "Day of Lord", "Warning"], lessonLearned: "The Day of the Lord brings both judgment and hope." },
      { id: "zep-2", title: "God Rejoices", reference: "Zephaniah 3:17", summary: "The Lord rejoices over His people with singing and quiets them with love.", characters: ["God", "Remnant"], themes: ["Joy", "Love", "Singing"], lessonLearned: "God delights in His people with singing." }
    ]
  },

  // HAGGAI
  {
    book: "Haggai",
    testament: "old",
    stories: [
      { id: "hag-1", title: "Rebuild the Temple", reference: "Haggai 1-2", summary: "Haggai urges the returned exiles to stop building their houses and finish the temple.", characters: ["Haggai", "Zerubbabel", "Joshua"], themes: ["Priorities", "Obedience", "Glory"], lessonLearned: "Put God's house before your own." }
    ]
  },

  // ZECHARIAH
  {
    book: "Zechariah",
    testament: "old",
    stories: [
      { id: "zec-1", title: "Night Visions", reference: "Zechariah 1-6", summary: "Zechariah receives eight night visions about Israel's restoration and the Branch.", characters: ["Zechariah", "Angel", "Joshua"], themes: ["Vision", "Restoration", "Messiah"], lessonLearned: "God reveals His plans through visions." },
      { id: "zec-2", title: "The Pierced One", reference: "Zechariah 12:10", summary: "They will look on Him whom they pierced and mourn.", characters: ["The Pierced One", "Israel"], themes: ["Prophecy", "Messiah", "Mourning"], lessonLearned: "Israel will recognize their rejected Messiah." },
      { id: "zec-3", title: "King on a Donkey", reference: "Zechariah 9:9", summary: "The coming king will be humble, riding on a donkey.", characters: ["King/Messiah"], themes: ["Humility", "Kingship", "Peace"], lessonLearned: "The Messiah comes in humility." }
    ]
  },

  // MALACHI
  {
    book: "Malachi",
    testament: "old",
    stories: [
      { id: "mal-1", title: "Robbing God", reference: "Malachi 3:8-12", summary: "Israel robs God by withholding tithes; blessing promised for obedience.", characters: ["God", "Israel"], themes: ["Tithing", "Blessing", "Faithfulness"], lessonLearned: "Test God in giving and see His blessing." },
      { id: "mal-2", title: "Sun of Righteousness", reference: "Malachi 4", summary: "The Sun of Righteousness will rise with healing; Elijah will come first.", characters: ["Sun of Righteousness", "Elijah"], themes: ["Messiah", "Healing", "Preparation"], lessonLearned: "God will send a forerunner before the Messiah." }
    ]
  },

  // ============================================
  // NEW TESTAMENT
  // ============================================

  // MATTHEW
  {
    book: "Matthew",
    testament: "new",
    stories: [
      { id: "mat-1", title: "Birth of Jesus", reference: "Matthew 1-2", summary: "Jesus is born in Bethlehem; wise men visit; the family flees to Egypt.", characters: ["Jesus", "Mary", "Joseph", "Wise Men"], themes: ["Incarnation", "Prophecy Fulfilled", "Protection"], lessonLearned: "God became flesh to dwell among us." },
      { id: "mat-2", title: "Baptism of Jesus", reference: "Matthew 3:13-17", summary: "John baptizes Jesus; the Spirit descends like a dove; the Father speaks.", characters: ["Jesus", "John", "Holy Spirit"], themes: ["Baptism", "Trinity", "Approval"], lessonLearned: "Jesus identifies with sinners in baptism." },
      { id: "mat-3", title: "Temptation in Wilderness", reference: "Matthew 4:1-11", summary: "Satan tempts Jesus three times; Jesus responds with Scripture.", characters: ["Jesus", "Satan"], themes: ["Temptation", "Scripture", "Victory"], lessonLearned: "God's Word defeats temptation." },
      { id: "mat-4", title: "Sermon on the Mount", reference: "Matthew 5-7", summary: "Jesus teaches the Beatitudes, kingdom ethics, and the narrow way.", characters: ["Jesus", "Disciples", "Crowds"], themes: ["Kingdom", "Ethics", "Righteousness"], lessonLearned: "Kingdom living transforms from the heart." },
      { id: "mat-5", title: "Calming the Storm", reference: "Matthew 8:23-27", summary: "Jesus rebukes the wind and waves; the disciples marvel at His authority.", characters: ["Jesus", "Disciples"], themes: ["Faith", "Authority", "Peace"], lessonLearned: "Jesus has authority over nature." },
      { id: "mat-6", title: "Feeding the 5000", reference: "Matthew 14:13-21", summary: "Jesus multiplies five loaves and two fish to feed thousands.", characters: ["Jesus", "Disciples", "Crowds"], themes: ["Provision", "Compassion", "Multiplication"], lessonLearned: "Jesus provides abundantly from little." },
      { id: "mat-7", title: "Walking on Water", reference: "Matthew 14:22-33", summary: "Jesus walks on water; Peter walks but sinks when he fears.", characters: ["Jesus", "Peter", "Disciples"], themes: ["Faith", "Fear", "Rescue"], lessonLearned: "Keep your eyes on Jesus, not the waves." },
      { id: "mat-8", title: "Peter's Confession", reference: "Matthew 16:13-20", summary: "Peter declares Jesus is the Christ; Jesus promises to build His church.", characters: ["Jesus", "Peter"], themes: ["Identity", "Church", "Revelation"], lessonLearned: "Jesus is the Christ, the Son of the living God." },
      { id: "mat-9", title: "Transfiguration", reference: "Matthew 17:1-13", summary: "Jesus is transfigured on the mountain with Moses and Elijah.", characters: ["Jesus", "Peter", "James", "John", "Moses", "Elijah"], themes: ["Glory", "Identity", "Witness"], lessonLearned: "Jesus is the fulfillment of Law and Prophets." },
      { id: "mat-10", title: "Triumphal Entry", reference: "Matthew 21:1-11", summary: "Jesus enters Jerusalem on a donkey; crowds shout Hosanna.", characters: ["Jesus", "Crowds"], themes: ["Kingship", "Prophecy", "Humility"], lessonLearned: "The King comes humbly." },
      { id: "mat-11", title: "Cleansing the Temple", reference: "Matthew 21:12-17", summary: "Jesus drives out money changers, declaring the temple a house of prayer.", characters: ["Jesus", "Money Changers"], themes: ["Zeal", "Worship", "Purification"], lessonLearned: "God's house must be pure." },
      { id: "mat-12", title: "Last Supper", reference: "Matthew 26:17-30", summary: "Jesus institutes the Lord's Supper, sharing bread and wine.", characters: ["Jesus", "Disciples"], themes: ["Covenant", "Communion", "Remembrance"], lessonLearned: "Remember Christ's sacrifice." },
      { id: "mat-13", title: "Gethsemane", reference: "Matthew 26:36-46", summary: "Jesus prays in anguish; the disciples sleep; He submits to the Father.", characters: ["Jesus", "Peter", "James", "John"], themes: ["Prayer", "Submission", "Suffering"], lessonLearned: "Not my will but Yours be done." },
      { id: "mat-14", title: "Crucifixion", reference: "Matthew 27", summary: "Jesus is crucified between two thieves; darkness covers the land.", characters: ["Jesus", "Soldiers", "Thieves"], themes: ["Sacrifice", "Atonement", "Love"], lessonLearned: "Christ died for our sins." },
      { id: "mat-15", title: "Resurrection", reference: "Matthew 28:1-10", summary: "Jesus rises from the dead; women find the empty tomb; He appears.", characters: ["Jesus", "Women", "Angel"], themes: ["Resurrection", "Victory", "Hope"], lessonLearned: "He is risen!" },
      { id: "mat-16", title: "Great Commission", reference: "Matthew 28:18-20", summary: "Jesus commands disciples to make disciples of all nations.", characters: ["Jesus", "Disciples"], themes: ["Mission", "Authority", "Presence"], lessonLearned: "Go and make disciples of all nations." },
      { id: "mat-17", title: "Parable of the Sower", reference: "Matthew 13:1-23", summary: "Jesus explains four soils: wayside, rocky, thorny, and good ground.", characters: ["Jesus", "Crowds", "Disciples"], themes: ["Hearing", "Response", "Fruitfulness"], lessonLearned: "The condition of our hearts determines our fruitfulness." },
      { id: "mat-18", title: "Parable of Wheat and Tares", reference: "Matthew 13:24-30, 36-43", summary: "An enemy sows weeds among wheat; both grow until harvest judgment.", characters: ["Jesus", "Disciples"], themes: ["Good and Evil", "Patience", "Judgment"], lessonLearned: "God will separate the righteous from the wicked." },
      { id: "mat-19", title: "Parable of the Talents", reference: "Matthew 25:14-30", summary: "A master entrusts talents; faithful servants are rewarded, lazy servant is cast out.", characters: ["Master", "Servants"], themes: ["Stewardship", "Faithfulness", "Reward"], lessonLearned: "Use what God gives you or lose it." },
      { id: "mat-20", title: "The Ten Virgins", reference: "Matthew 25:1-13", summary: "Five wise and five foolish virgins await the bridegroom; only the prepared enter.", characters: ["Bridegroom", "Ten Virgins"], themes: ["Readiness", "Preparation", "Wisdom"], lessonLearned: "Be ready; you don't know when Christ will come." },
      { id: "mat-21", title: "The Unmerciful Servant", reference: "Matthew 18:21-35", summary: "A forgiven servant refuses to forgive his debtor; the master revokes his pardon.", characters: ["King", "Servants"], themes: ["Forgiveness", "Mercy", "Hypocrisy"], lessonLearned: "Forgive others as you have been forgiven." },
      { id: "mat-22", title: "Workers in the Vineyard", reference: "Matthew 20:1-16", summary: "All workers receive the same pay regardless of hours; the last are first.", characters: ["Landowner", "Workers"], themes: ["Grace", "Generosity", "Fairness"], lessonLearned: "God's grace isn't earned by our efforts." },
      { id: "mat-23", title: "Jesus Heals the Centurion's Servant", reference: "Matthew 8:5-13", summary: "A Roman centurion's faith amazes Jesus; his servant is healed from a distance.", characters: ["Jesus", "Centurion"], themes: ["Faith", "Authority", "Healing"], lessonLearned: "Great faith recognizes Christ's authority." },
      { id: "mat-24", title: "Parable of the Pearl", reference: "Matthew 13:45-46", summary: "The kingdom of heaven is like a merchant who finds a pearl of great price and sells everything to buy it.", characters: ["Jesus", "Merchant"], themes: ["Value", "Sacrifice", "Kingdom"], lessonLearned: "The kingdom is worth everything we have." },
      { id: "mat-25", title: "Parable of the Hidden Treasure", reference: "Matthew 13:44", summary: "A man finds treasure hidden in a field, sells all he has, and buys the field with joy.", characters: ["Jesus"], themes: ["Joy", "Sacrifice", "Discovery"], lessonLearned: "Finding the kingdom brings joy worth any sacrifice." },
      { id: "mat-26", title: "Wise Men Follow the Star", reference: "Matthew 2:1-12", summary: "Wise men from the East follow a star, bring gifts to Jesus, and are warned in a dream not to return to Herod.", characters: ["Wise Men", "Jesus", "Herod"], themes: ["Seeking", "Worship", "Warning"], lessonLearned: "Seekers who follow God's signs find Jesus." },
      { id: "mat-27", title: "Massacre of Innocents", reference: "Matthew 2:13-18", summary: "Herod kills all boys under two in Bethlehem; Joseph flees to Egypt with Mary and Jesus.", characters: ["Herod", "Joseph", "Mary", "Jesus"], themes: ["Evil", "Protection", "Prophecy"], lessonLearned: "God protects His purposes even through tragedy." },
      { id: "mat-28", title: "The Sheep and Goats", reference: "Matthew 25:31-46", summary: "The Son of Man separates sheep from goats based on how they treated 'the least of these.'", characters: ["Jesus", "Nations"], themes: ["Judgment", "Service", "Compassion"], lessonLearned: "How we treat others reveals our relationship with Christ." },
      { id: "mat-29", title: "Parable of the Net", reference: "Matthew 13:47-50", summary: "The kingdom is like a net catching all kinds of fish; angels will separate the wicked from the righteous.", characters: ["Jesus"], themes: ["Judgment", "Separation", "Kingdom"], lessonLearned: "God will sort out good and evil in the end." },
      { id: "mat-30", title: "Peter's Temple Tax Coin", reference: "Matthew 17:24-27", summary: "Jesus tells Peter to catch a fish; the first fish will have a coin in its mouth to pay the temple tax.", characters: ["Jesus", "Peter"], themes: ["Provision", "Miracle", "Wisdom"], lessonLearned: "God provides in unexpected ways." }
    ]
  },

  // MARK
  {
    book: "Mark",
    testament: "new",
    stories: [
      { id: "mrk-1", title: "Demon-Possessed Man", reference: "Mark 5:1-20", summary: "Jesus delivers a man from Legion; demons enter pigs that drown.", characters: ["Jesus", "Demoniac", "Legion"], themes: ["Deliverance", "Power", "Testimony"], lessonLearned: "Jesus has authority over demons." },
      { id: "mrk-2", title: "Jairus's Daughter", reference: "Mark 5:21-43", summary: "Jesus raises Jairus's dead daughter and heals the woman with bleeding.", characters: ["Jesus", "Jairus", "Woman"], themes: ["Faith", "Healing", "Resurrection"], lessonLearned: "Faith brings healing." },
      { id: "mrk-3", title: "Feeding the 4000", reference: "Mark 8:1-10", summary: "Jesus feeds 4000 with seven loaves in a Gentile region.", characters: ["Jesus", "Disciples", "Crowds"], themes: ["Provision", "Gentiles", "Compassion"], lessonLearned: "Jesus provides for all people." },
      { id: "mrk-4", title: "Blind Bartimaeus", reference: "Mark 10:46-52", summary: "Blind Bartimaeus cries out; Jesus heals him; he follows on the way.", characters: ["Jesus", "Bartimaeus"], themes: ["Faith", "Healing", "Discipleship"], lessonLearned: "Persistent faith receives healing." },
      { id: "mrk-5", title: "Widow's Offering", reference: "Mark 12:41-44", summary: "A poor widow gives two small coins—more than all the rich.", characters: ["Jesus", "Widow", "Rich"], themes: ["Giving", "Sacrifice", "Heart"], lessonLearned: "God values sacrificial giving." },
      { id: "mrk-6", title: "The Syrophoenician Woman", reference: "Mark 7:24-30", summary: "A Gentile woman's persistent faith wins healing for her daughter.", characters: ["Jesus", "Syrophoenician Woman"], themes: ["Faith", "Persistence", "Gentiles"], lessonLearned: "Persistent faith breaks through barriers." },
      { id: "mrk-7", title: "Deaf Man Healed", reference: "Mark 7:31-37", summary: "Jesus heals a deaf man, saying 'Ephphatha'—Be opened.", characters: ["Jesus", "Deaf Man"], themes: ["Healing", "Compassion", "Wholeness"], lessonLearned: "Jesus opens deaf ears to hear God's voice." },
      { id: "mrk-8", title: "Blind Man at Bethsaida", reference: "Mark 8:22-26", summary: "Jesus heals a blind man in stages—first blurry, then clear.", characters: ["Jesus", "Blind Man"], themes: ["Progressive Healing", "Faith", "Sight"], lessonLearned: "Sometimes healing is a process." },
      { id: "mrk-9", title: "The Boy with an Unclean Spirit", reference: "Mark 9:14-29", summary: "Disciples fail to cast out a demon; Jesus heals the boy and teaches about prayer and faith.", characters: ["Jesus", "Father", "Boy", "Disciples"], themes: ["Faith", "Prayer", "Deliverance"], lessonLearned: "Some battles require prayer and fasting." },
      { id: "mrk-10", title: "Jesus Blesses the Children", reference: "Mark 10:13-16", summary: "Disciples rebuke parents bringing children; Jesus rebukes the disciples and blesses the children, saying the kingdom belongs to such.", characters: ["Jesus", "Disciples", "Children"], themes: ["Kingdom", "Humility", "Welcome"], lessonLearned: "Come to Jesus with childlike faith." },
      { id: "mrk-11", title: "Rich Young Ruler", reference: "Mark 10:17-27", summary: "A rich young man asks how to inherit eternal life; Jesus tells him to sell all and follow; he leaves sad.", characters: ["Jesus", "Rich Young Man"], themes: ["Wealth", "Sacrifice", "Eternal Life"], lessonLearned: "Nothing should come before following Jesus." },
      { id: "mrk-12", title: "The Cursed Fig Tree", reference: "Mark 11:12-14, 20-25", summary: "Jesus curses a fig tree for having no fruit; it withers by the next day, teaching about faith and fruitlessness.", characters: ["Jesus", "Disciples"], themes: ["Fruitfulness", "Faith", "Judgment"], lessonLearned: "God expects spiritual fruit from His people." },
      { id: "mrk-13", title: "The Greatest Commandment", reference: "Mark 12:28-34", summary: "A scribe asks which commandment is greatest; Jesus answers: love God and love neighbor.", characters: ["Jesus", "Scribe"], themes: ["Love", "Law", "Priority"], lessonLearned: "All of God's law flows from love." },
      { id: "mrk-14", title: "Woman Anoints Jesus", reference: "Mark 14:3-9", summary: "A woman pours expensive perfume on Jesus; critics call it waste; Jesus says she prepared Him for burial and will be remembered.", characters: ["Jesus", "Woman", "Critics"], themes: ["Worship", "Sacrifice", "Memorial"], lessonLearned: "Extravagant worship is never wasted." },
      { id: "mrk-15", title: "Young Man Flees Naked", reference: "Mark 14:51-52", summary: "When Jesus is arrested, a young man following in only a linen garment flees naked when seized.", characters: ["Young Man", "Soldiers"], themes: ["Fear", "Abandonment", "Humanity"], lessonLearned: "Even the curious fled when danger came." }
    ]
  },

  // LUKE
  {
    book: "Luke",
    testament: "new",
    stories: [
      { id: "luk-1", title: "Annunciation", reference: "Luke 1:26-38", summary: "Gabriel announces to Mary she will bear the Son of God.", characters: ["Mary", "Gabriel"], themes: ["Incarnation", "Faith", "Favor"], lessonLearned: "Nothing is impossible with God." },
      { id: "luk-2", title: "Birth Narrative", reference: "Luke 2:1-20", summary: "Jesus is born in Bethlehem; angels announce to shepherds.", characters: ["Jesus", "Mary", "Joseph", "Shepherds"], themes: ["Humility", "Joy", "Glory"], lessonLearned: "God comes to the humble." },
      { id: "luk-3", title: "Boy Jesus in Temple", reference: "Luke 2:41-52", summary: "Twelve-year-old Jesus stays in the temple, amazing teachers.", characters: ["Jesus", "Mary", "Joseph", "Teachers"], themes: ["Wisdom", "Father's Business", "Growth"], lessonLearned: "Even young, Jesus knew His mission." },
      { id: "luk-4", title: "Good Samaritan", reference: "Luke 10:25-37", summary: "Jesus tells of a Samaritan who helps a beaten man ignored by religious leaders.", characters: ["Samaritan", "Injured Man", "Priest", "Levite"], themes: ["Mercy", "Neighbor", "Compassion"], lessonLearned: "Love your neighbor—whoever that may be." },
      { id: "luk-5", title: "Prodigal Son", reference: "Luke 15:11-32", summary: "A son squanders his inheritance but returns to a welcoming father.", characters: ["Father", "Prodigal Son", "Elder Son"], themes: ["Repentance", "Grace", "Reconciliation"], lessonLearned: "The Father welcomes repentant sinners." },
      { id: "luk-6", title: "Rich Man and Lazarus", reference: "Luke 16:19-31", summary: "A rich man dies and suffers while poor Lazarus is comforted.", characters: ["Rich Man", "Lazarus", "Abraham"], themes: ["Eternity", "Justice", "Reversal"], lessonLearned: "Earthly riches don't guarantee heavenly reward." },
      { id: "luk-7", title: "Ten Lepers", reference: "Luke 17:11-19", summary: "Jesus heals ten lepers; only one, a Samaritan, returns to thank Him.", characters: ["Jesus", "Ten Lepers", "Samaritan"], themes: ["Healing", "Gratitude", "Faith"], lessonLearned: "Give thanks for God's blessings." },
      { id: "luk-8", title: "Zacchaeus", reference: "Luke 19:1-10", summary: "Tax collector Zacchaeus climbs a tree to see Jesus and is transformed.", characters: ["Jesus", "Zacchaeus"], themes: ["Salvation", "Transformation", "Seeking"], lessonLearned: "Jesus seeks and saves the lost." },
      { id: "luk-9", title: "Road to Emmaus", reference: "Luke 24:13-35", summary: "Risen Jesus walks with two disciples, opens the Scriptures, then reveals Himself.", characters: ["Jesus", "Cleopas", "Disciple"], themes: ["Resurrection", "Scripture", "Recognition"], lessonLearned: "Christ is revealed in Scripture and fellowship." },
      { id: "luk-10", title: "Mary and Martha", reference: "Luke 10:38-42", summary: "Martha is distracted by preparations while Mary sits at Jesus' feet; Mary chose the better part.", characters: ["Jesus", "Mary", "Martha"], themes: ["Priorities", "Worship", "Service"], lessonLearned: "Sitting at Jesus' feet is the better choice." },
      { id: "luk-11", title: "The Persistent Friend", reference: "Luke 11:5-13", summary: "A man gets bread for his guest through persistence; how much more will God give the Spirit.", characters: ["Jesus", "Friend"], themes: ["Persistence", "Prayer", "Holy Spirit"], lessonLearned: "God rewards persistent prayer." },
      { id: "luk-12", title: "The Rich Fool", reference: "Luke 12:13-21", summary: "A rich man builds bigger barns but dies that night; he was not rich toward God.", characters: ["Jesus", "Rich Man"], themes: ["Greed", "Mortality", "True Riches"], lessonLearned: "Life doesn't consist in abundance of possessions." },
      { id: "luk-13", title: "The Lost Sheep and Lost Coin", reference: "Luke 15:1-10", summary: "A shepherd leaves 99 for 1 lost sheep; a woman sweeps for 1 lost coin; heaven rejoices.", characters: ["Jesus", "Shepherd", "Woman"], themes: ["Seeking", "Value", "Joy"], lessonLearned: "God seeks every lost soul." },
      { id: "luk-14", title: "The Pharisee and Tax Collector", reference: "Luke 18:9-14", summary: "The proud Pharisee is rejected; the humble tax collector is justified.", characters: ["Jesus", "Pharisee", "Tax Collector"], themes: ["Humility", "Pride", "Justification"], lessonLearned: "God exalts the humble and humbles the proud." },
      { id: "luk-15", title: "The Unjust Steward", reference: "Luke 16:1-13", summary: "A shrewd steward secures his future by forgiving debts; use worldly wealth wisely.", characters: ["Jesus", "Steward", "Master"], themes: ["Shrewdness", "Stewardship", "Faithfulness"], lessonLearned: "Use earthly resources for eternal purposes." },
      { id: "luk-16", title: "The Great Banquet", reference: "Luke 14:15-24", summary: "Invited guests make excuses; the poor, blind, and lame fill the banquet.", characters: ["Jesus", "Host", "Guests"], themes: ["Invitation", "Excuses", "Grace"], lessonLearned: "Don't make excuses when God invites you." },
      { id: "luk-17", title: "The Good Thief", reference: "Luke 23:39-43", summary: "One thief mocks Jesus; the other defends Him and asks to be remembered; Jesus promises him paradise that day.", characters: ["Jesus", "Good Thief", "Bad Thief"], themes: ["Salvation", "Last Chance", "Paradise"], lessonLearned: "It's never too late to turn to Jesus." },
      { id: "luk-18", title: "The Two Debtors", reference: "Luke 7:36-50", summary: "A sinful woman washes Jesus' feet with tears; Jesus tells a parable about two debtors forgiven—who loves more?", characters: ["Jesus", "Simon", "Sinful Woman"], themes: ["Forgiveness", "Love", "Gratitude"], lessonLearned: "Those forgiven much love much." },
      { id: "luk-19", title: "The Friend at Midnight", reference: "Luke 11:5-8", summary: "A man knocks at midnight for bread for a guest; his friend gives because of his boldness.", characters: ["Jesus", "Friend"], themes: ["Persistence", "Prayer", "Boldness"], lessonLearned: "Shameless persistence in prayer gets results." },
      { id: "luk-20", title: "The Tower Builder and King", reference: "Luke 14:25-33", summary: "Before building a tower, count the cost; before going to war, consider if you can win—so count the cost of discipleship.", characters: ["Jesus"], themes: ["Discipleship", "Cost", "Commitment"], lessonLearned: "Count the cost before following Jesus." },
      { id: "luk-21", title: "Simeon and Anna", reference: "Luke 2:25-38", summary: "Elderly Simeon and prophetess Anna recognize baby Jesus as the Messiah in the temple.", characters: ["Simeon", "Anna", "Jesus", "Mary", "Joseph"], themes: ["Recognition", "Prophecy", "Waiting"], lessonLearned: "Those who wait faithfully will see God's salvation." },
      { id: "luk-22", title: "Jesus Heals Ten Lepers", reference: "Luke 17:11-19", summary: "All ten lepers are healed but only one—a Samaritan—returns to give thanks.", characters: ["Jesus", "Ten Lepers"], themes: ["Gratitude", "Healing", "Faith"], lessonLearned: "Always return to give thanks." },
      { id: "luk-23", title: "The Widow's Persistence", reference: "Luke 18:1-8", summary: "A persistent widow keeps asking an unjust judge until he grants her justice; how much more will God answer.", characters: ["Jesus", "Widow", "Judge"], themes: ["Persistence", "Prayer", "Justice"], lessonLearned: "Never give up in prayer." }
    ]
  },

  // JOHN
  {
    book: "John",
    testament: "new",
    stories: [
      { id: "jhn-1", title: "Word Made Flesh", reference: "John 1:1-18", summary: "The eternal Word becomes flesh and dwells among us, full of grace and truth.", characters: ["Word/Jesus", "John the Baptist"], themes: ["Incarnation", "Deity", "Grace"], lessonLearned: "Jesus is God in human flesh." },
      { id: "jhn-2", title: "Water to Wine", reference: "John 2:1-11", summary: "Jesus performs His first sign, turning water into wine at a wedding.", characters: ["Jesus", "Mary", "Servants"], themes: ["Glory", "Abundance", "Signs"], lessonLearned: "Jesus transforms the ordinary into extraordinary." },
      { id: "jhn-3", title: "Nicodemus", reference: "John 3:1-21", summary: "Jesus tells Nicodemus he must be born again to see God's kingdom.", characters: ["Jesus", "Nicodemus"], themes: ["New Birth", "Salvation", "Belief"], lessonLearned: "You must be born again." },
      { id: "jhn-4", title: "Woman at the Well", reference: "John 4:1-42", summary: "Jesus offers living water to a Samaritan woman; she believes and testifies.", characters: ["Jesus", "Samaritan Woman"], themes: ["Living Water", "Worship", "Evangelism"], lessonLearned: "Jesus offers living water that satisfies forever." },
      { id: "jhn-5", title: "Healing at Bethesda", reference: "John 5:1-15", summary: "Jesus heals a man paralyzed for 38 years at the pool of Bethesda.", characters: ["Jesus", "Paralytic"], themes: ["Healing", "Authority", "Sabbath"], lessonLearned: "Jesus has authority to heal and forgive." },
      { id: "jhn-6", title: "Bread of Life", reference: "John 6:22-59", summary: "Jesus declares He is the Bread of Life; many disciples leave.", characters: ["Jesus", "Crowds", "Disciples"], themes: ["Sustenance", "Faith", "Offense"], lessonLearned: "Jesus alone satisfies spiritual hunger." },
      { id: "jhn-7", title: "Woman Caught in Adultery", reference: "John 8:1-11", summary: "Jesus challenges accusers to cast the first stone; they leave; He forgives.", characters: ["Jesus", "Woman", "Pharisees"], themes: ["Forgiveness", "Grace", "Hypocrisy"], lessonLearned: "Jesus forgives and calls to new life." },
      { id: "jhn-8", title: "Healing the Blind Man", reference: "John 9", summary: "Jesus heals a man born blind; Pharisees investigate and reject Jesus.", characters: ["Jesus", "Blind Man", "Pharisees"], themes: ["Light", "Spiritual Blindness", "Testimony"], lessonLearned: "Jesus opens blind eyes—physical and spiritual." },
      { id: "jhn-9", title: "Raising of Lazarus", reference: "John 11:1-44", summary: "Jesus raises His friend Lazarus from the dead after four days.", characters: ["Jesus", "Lazarus", "Mary", "Martha"], themes: ["Resurrection", "Life", "Glory"], lessonLearned: "Jesus is the resurrection and the life." },
      { id: "jhn-10", title: "Washing Disciples' Feet", reference: "John 13:1-17", summary: "Jesus washes His disciples' feet, teaching servant leadership.", characters: ["Jesus", "Peter", "Disciples"], themes: ["Service", "Humility", "Example"], lessonLearned: "Lead by serving others." },
      { id: "jhn-11", title: "Upper Room Discourse", reference: "John 14-16", summary: "Jesus teaches about the Spirit, abiding in Him, and the world's hatred.", characters: ["Jesus", "Disciples"], themes: ["Spirit", "Abiding", "Peace"], lessonLearned: "Abide in Christ; the Spirit will come." },
      { id: "jhn-12", title: "High Priestly Prayer", reference: "John 17", summary: "Jesus prays for Himself, His disciples, and all future believers.", characters: ["Jesus", "Father"], themes: ["Unity", "Glory", "Protection"], lessonLearned: "Jesus prays for our unity and protection." },
      { id: "jhn-13", title: "Doubting Thomas", reference: "John 20:24-29", summary: "Thomas doubts until he sees Jesus' wounds; blessed are those who believe.", characters: ["Jesus", "Thomas"], themes: ["Doubt", "Faith", "Evidence"], lessonLearned: "Blessed are those who believe without seeing." },
      { id: "jhn-14", title: "Restoration of Peter", reference: "John 21:15-19", summary: "Jesus asks Peter three times if he loves Him; commissions him to feed sheep.", characters: ["Jesus", "Peter"], themes: ["Restoration", "Love", "Commission"], lessonLearned: "Jesus restores the fallen and recommissions them." },
      { id: "jhn-15", title: "The Miraculous Catch of Fish", reference: "John 21:1-14", summary: "Disciples fish all night catching nothing; Jesus tells them to cast on the right side; they catch 153 large fish.", characters: ["Jesus", "Peter", "Disciples"], themes: ["Provision", "Obedience", "Resurrection"], lessonLearned: "Obedience to Jesus brings abundant results." },
      { id: "jhn-16", title: "Jesus and the Official's Son", reference: "John 4:46-54", summary: "A royal official begs Jesus to heal his dying son; Jesus says 'Go, your son will live' and the boy is healed from a distance.", characters: ["Jesus", "Royal Official", "Son"], themes: ["Faith", "Distance Healing", "Authority"], lessonLearned: "Jesus' word has power even from afar." },
      { id: "jhn-17", title: "I Am the Good Shepherd", reference: "John 10:1-18", summary: "Jesus declares He is the Good Shepherd who lays down His life for the sheep; He knows His own and they know Him.", characters: ["Jesus"], themes: ["Shepherd", "Sacrifice", "Security"], lessonLearned: "Jesus knows us personally and protects us completely." },
      { id: "jhn-18", title: "I Am the Vine", reference: "John 15:1-17", summary: "Jesus teaches that He is the vine and we are branches; apart from Him we can do nothing; abiding produces fruit.", characters: ["Jesus", "Disciples"], themes: ["Abiding", "Fruitfulness", "Dependence"], lessonLearned: "Fruitfulness comes only from abiding in Christ." },
      { id: "jhn-19", title: "The Pool of Siloam", reference: "John 9:1-12", summary: "Jesus makes mud with His saliva, puts it on a blind man's eyes, and tells him to wash in the Pool of Siloam; he comes back seeing.", characters: ["Jesus", "Blind Man"], themes: ["Obedience", "Healing", "Testimony"], lessonLearned: "Sometimes healing requires obedient action." },
      { id: "jhn-20", title: "Jesus Weeps", reference: "John 11:32-37", summary: "At Lazarus's tomb, Jesus weeps; the shortest verse in the Bible shows His humanity and compassion.", characters: ["Jesus", "Mary", "Martha"], themes: ["Compassion", "Grief", "Humanity"], lessonLearned: "Jesus enters into our grief with us." }
    ]
  },

  // ACTS
  {
    book: "Acts",
    testament: "new",
    stories: [
      { id: "act-1", title: "Ascension", reference: "Acts 1:1-11", summary: "Jesus ascends to heaven; angels promise He will return the same way.", characters: ["Jesus", "Disciples", "Angels"], themes: ["Ascension", "Promise", "Mission"], lessonLearned: "Jesus will return as He left." },
      { id: "act-2", title: "Pentecost", reference: "Acts 2", summary: "The Spirit comes with wind and fire; 3000 are saved at Peter's sermon.", characters: ["Peter", "Disciples", "Crowds"], themes: ["Spirit", "Power", "Witness"], lessonLearned: "The Spirit empowers the church's mission." },
      { id: "act-3", title: "Lame Man Healed", reference: "Acts 3", summary: "Peter heals a lame beggar at the temple gate in Jesus' name.", characters: ["Peter", "John", "Lame Man"], themes: ["Healing", "Name of Jesus", "Boldness"], lessonLearned: "In Jesus' name there is power." },
      { id: "act-4", title: "Ananias and Sapphira", reference: "Acts 5:1-11", summary: "Couple lies about their offering; both fall dead.", characters: ["Ananias", "Sapphira", "Peter"], themes: ["Holiness", "Deception", "Fear"], lessonLearned: "God takes holiness seriously." },
      { id: "act-4b", title: "Gamaliel's Wise Counsel", reference: "Acts 5:33-40", summary: "Pharisee Gamaliel advises the council: if this movement is from God, you cannot stop it; if not, it will fail.", characters: ["Gamaliel", "Sanhedrin"], themes: ["Wisdom", "Patience", "Sovereignty"], lessonLearned: "God's work cannot be stopped by human opposition." },
      { id: "act-5", title: "Stephen's Martyrdom", reference: "Acts 6-7", summary: "Stephen preaches, sees Jesus standing, and is stoned as the first martyr.", characters: ["Stephen", "Saul"], themes: ["Martyrdom", "Courage", "Vision"], lessonLearned: "Faithful witness may cost everything." },
      { id: "act-5b", title: "Simon the Sorcerer", reference: "Acts 8:9-24", summary: "Simon the magician believes and is baptized, but tries to buy the power to give the Holy Spirit.", characters: ["Simon", "Peter", "Philip"], themes: ["Simony", "Heart Motives", "Rebuke"], lessonLearned: "God's gifts cannot be purchased." },
      { id: "act-6", title: "Philip and Ethiopian", reference: "Acts 8:26-40", summary: "Philip explains Isaiah to an Ethiopian official who is baptized.", characters: ["Philip", "Ethiopian"], themes: ["Evangelism", "Scripture", "Baptism"], lessonLearned: "Be ready to explain the gospel." },
      { id: "act-7", title: "Saul's Conversion", reference: "Acts 9:1-19", summary: "Saul meets Jesus on Damascus road; is blinded, then healed and baptized.", characters: ["Saul/Paul", "Jesus", "Ananias"], themes: ["Conversion", "Grace", "Calling"], lessonLearned: "No one is beyond God's transforming grace." },
      { id: "act-7b", title: "Dorcas Raised from the Dead", reference: "Acts 9:36-42", summary: "Beloved seamstress Dorcas dies; widows weep showing her garments; Peter raises her to life.", characters: ["Dorcas/Tabitha", "Peter", "Widows"], themes: ["Resurrection", "Service", "Compassion"], lessonLearned: "A life of service leaves a powerful legacy." },
      { id: "act-8", title: "Peter's Vision", reference: "Acts 10", summary: "Peter sees a vision of unclean animals; Cornelius's household receives the Spirit.", characters: ["Peter", "Cornelius"], themes: ["Gentiles", "Inclusion", "Spirit"], lessonLearned: "The gospel is for all people." },
      { id: "act-8b", title: "Rhoda Forgets to Open the Door", reference: "Acts 12:12-16", summary: "When Peter escapes prison and knocks, servant girl Rhoda is so overjoyed she forgets to let him in.", characters: ["Rhoda", "Peter", "Believers"], themes: ["Joy", "Prayer", "Humor"], lessonLearned: "Answered prayer can overwhelm us." },
      { id: "act-9", title: "Peter's Prison Escape", reference: "Acts 12:1-19", summary: "An angel frees Peter from prison; the church prays; Herod dies.", characters: ["Peter", "Angel", "Church"], themes: ["Prayer", "Deliverance", "Judgment"], lessonLearned: "Prayer releases God's power." },
      { id: "act-9b", title: "Herod Eaten by Worms", reference: "Acts 12:20-23", summary: "King Herod accepts worship as a god; an angel strikes him and he is eaten by worms.", characters: ["Herod Agrippa", "Angel"], themes: ["Pride", "Judgment", "Blasphemy"], lessonLearned: "God will not share His glory." },
      { id: "act-10", title: "First Missionary Journey", reference: "Acts 13-14", summary: "Paul and Barnabas travel to Cyprus and Asia Minor, planting churches.", characters: ["Paul", "Barnabas"], themes: ["Mission", "Church Planting", "Opposition"], lessonLearned: "Take the gospel to the unreached." },
      { id: "act-11", title: "Jerusalem Council", reference: "Acts 15", summary: "Church leaders decide Gentiles need not be circumcised to be saved.", characters: ["Paul", "Peter", "James"], themes: ["Grace", "Unity", "Decision"], lessonLearned: "Salvation is by grace alone." },
      { id: "act-12", title: "Philippian Jailer", reference: "Acts 16:16-34", summary: "Paul and Silas sing in prison; earthquake frees them; jailer is saved.", characters: ["Paul", "Silas", "Jailer"], themes: ["Joy", "Salvation", "Household Faith"], lessonLearned: "Believe in Jesus and be saved." },
      { id: "act-13", title: "Paul in Athens", reference: "Acts 17:16-34", summary: "Paul preaches at the Areopagus about the unknown God.", characters: ["Paul", "Athenians"], themes: ["Apologetics", "Resurrection", "Culture"], lessonLearned: "Contextualize the gospel without compromising it." },
      { id: "act-13b", title: "Eutychus Falls from the Window", reference: "Acts 20:7-12", summary: "Young Eutychus falls asleep during Paul's long sermon, falls three stories, and dies—but Paul raises him.", characters: ["Eutychus", "Paul"], themes: ["Resurrection", "Long Sermons", "Restoration"], lessonLearned: "Even fatal mistakes can be redeemed." },
      { id: "act-13c", title: "Paul's Farewell to Ephesian Elders", reference: "Acts 20:17-38", summary: "Paul warns the elders of coming wolves, reminds them he worked with his hands, and they weep as he departs.", characters: ["Paul", "Ephesian Elders"], themes: ["Leadership", "Warning", "Sacrifice"], lessonLearned: "Guard the flock against false teachers." },
      { id: "act-14", title: "Paul's Shipwreck", reference: "Acts 27", summary: "Paul's ship wrecks on Malta; all 276 people survive as God promised.", characters: ["Paul", "Centurion", "Sailors"], themes: ["Faith", "Providence", "Witness"], lessonLearned: "God keeps His promises even in storms." },
      { id: "act-14b", title: "Paul Bitten by a Viper", reference: "Acts 28:1-6", summary: "A viper bites Paul on Malta; the natives expect him to swell and die, but he shakes it off unharmed.", characters: ["Paul", "Maltese"], themes: ["Protection", "Signs", "Witness"], lessonLearned: "God protects His servants to fulfill their mission." }
    ]
  },

  // ROMANS
  {
    book: "Romans",
    testament: "new",
    stories: [
      { id: "rom-1", title: "All Have Sinned", reference: "Romans 3:23", summary: "Paul declares that all have sinned and fall short of God's glory.", characters: ["Paul"], themes: ["Sin", "Universal Need", "Glory"], lessonLearned: "All people need salvation." },
      { id: "rom-2", title: "Justified by Faith", reference: "Romans 5:1-11", summary: "Being justified by faith, we have peace with God through Christ.", characters: ["Paul"], themes: ["Justification", "Peace", "Grace"], lessonLearned: "Faith brings peace with God." },
      { id: "rom-3", title: "Nothing Separates Us", reference: "Romans 8:31-39", summary: "Nothing can separate us from the love of God in Christ Jesus.", characters: ["Paul"], themes: ["Security", "Love", "Victory"], lessonLearned: "God's love is unbreakable." },
      { id: "rom-4", title: "Living Sacrifice", reference: "Romans 12:1-2", summary: "Offer yourselves as living sacrifices; be transformed by renewed minds.", characters: ["Paul"], themes: ["Worship", "Transformation", "Surrender"], lessonLearned: "True worship is total surrender." }
    ]
  },

  // 1 CORINTHIANS
  {
    book: "1 Corinthians",
    testament: "new",
    stories: [
      { id: "1co-1", title: "Church Divisions", reference: "1 Corinthians 1-3", summary: "Paul addresses divisions as the church follows different leaders.", characters: ["Paul", "Corinthians"], themes: ["Unity", "Wisdom", "Foundation"], lessonLearned: "Christ alone is the foundation." },
      { id: "1co-2", title: "Body of Christ", reference: "1 Corinthians 12", summary: "The church is one body with many members, each essential.", characters: ["Paul"], themes: ["Unity", "Gifts", "Interdependence"], lessonLearned: "Every member matters in the body." },
      { id: "1co-3", title: "Love Chapter", reference: "1 Corinthians 13", summary: "Love is the greatest virtue—patient, kind, never failing.", characters: ["Paul"], themes: ["Love", "Priority", "Eternity"], lessonLearned: "Love is the greatest gift." },
      { id: "1co-4", title: "Resurrection Hope", reference: "1 Corinthians 15", summary: "Christ rose; we will rise; death is swallowed in victory.", characters: ["Paul"], themes: ["Resurrection", "Hope", "Victory"], lessonLearned: "Because He lives, we too will live." }
    ]
  },

  // 2 CORINTHIANS
  {
    book: "2 Corinthians",
    testament: "new",
    stories: [
      { id: "2co-1", title: "Comfort in Affliction", reference: "2 Corinthians 1:3-7", summary: "God comforts us so we can comfort others in their troubles.", characters: ["Paul"], themes: ["Comfort", "Suffering", "Ministry"], lessonLearned: "Our comfort equips us to comfort others." },
      { id: "2co-2", title: "Treasure in Jars", reference: "2 Corinthians 4:7-18", summary: "We have treasure in clay jars; outwardly wasting but inwardly renewed.", characters: ["Paul"], themes: ["Weakness", "Power", "Perseverance"], lessonLearned: "God's power shines through our weakness." },
      { id: "2co-3", title: "Sufficient Grace", reference: "2 Corinthians 12:7-10", summary: "Paul's thorn remains; Christ's grace is sufficient; power in weakness.", characters: ["Paul"], themes: ["Grace", "Weakness", "Sufficiency"], lessonLearned: "God's grace is sufficient for every trial." }
    ]
  },

  // GALATIANS
  {
    book: "Galatians",
    testament: "new",
    stories: [
      { id: "gal-1", title: "No Other Gospel", reference: "Galatians 1:6-9", summary: "Paul warns against any gospel different from what was preached.", characters: ["Paul"], themes: ["Gospel", "Truth", "Warning"], lessonLearned: "Guard the purity of the gospel." },
      { id: "gal-2", title: "Justified by Faith", reference: "Galatians 2:15-21", summary: "We are justified by faith in Christ, not by works of the law.", characters: ["Paul"], themes: ["Justification", "Faith", "Freedom"], lessonLearned: "Faith, not works, justifies us." },
      { id: "gal-3", title: "Fruit of the Spirit", reference: "Galatians 5:22-26", summary: "The Spirit produces love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.", characters: ["Paul"], themes: ["Spirit", "Character", "Fruit"], lessonLearned: "The Spirit transforms our character." }
    ]
  },

  // EPHESIANS
  {
    book: "Ephesians",
    testament: "new",
    stories: [
      { id: "eph-1", title: "Spiritual Blessings", reference: "Ephesians 1:3-14", summary: "God has blessed us with every spiritual blessing in Christ.", characters: ["Paul"], themes: ["Blessing", "Election", "Inheritance"], lessonLearned: "In Christ we have every spiritual blessing." },
      { id: "eph-2", title: "Saved by Grace", reference: "Ephesians 2:1-10", summary: "By grace we are saved through faith; it is God's gift, not works.", characters: ["Paul"], themes: ["Grace", "Faith", "Salvation"], lessonLearned: "Salvation is a gift, not earned." },
      { id: "eph-3", title: "Armor of God", reference: "Ephesians 6:10-20", summary: "Put on full armor to stand against the devil's schemes.", characters: ["Paul"], themes: ["Warfare", "Protection", "Prayer"], lessonLearned: "Spiritual battles require spiritual armor." }
    ]
  },

  // PHILIPPIANS
  {
    book: "Philippians",
    testament: "new",
    stories: [
      { id: "php-1", title: "Christ's Humility", reference: "Philippians 2:5-11", summary: "Christ emptied Himself, became a servant, and was exalted.", characters: ["Christ"], themes: ["Humility", "Incarnation", "Exaltation"], lessonLearned: "Humility precedes exaltation." },
      { id: "php-2", title: "Pressing On", reference: "Philippians 3:12-14", summary: "Paul presses on toward the goal for the prize of God's calling.", characters: ["Paul"], themes: ["Perseverance", "Goal", "Calling"], lessonLearned: "Keep pressing toward the goal." },
      { id: "php-3", title: "Rejoice Always", reference: "Philippians 4:4-7", summary: "Rejoice always; let requests be known; peace will guard hearts.", characters: ["Paul"], themes: ["Joy", "Prayer", "Peace"], lessonLearned: "Joy and peace come through prayer." }
    ]
  },

  // COLOSSIANS
  {
    book: "Colossians",
    testament: "new",
    stories: [
      { id: "col-1", title: "Supremacy of Christ", reference: "Colossians 1:15-20", summary: "Christ is the image of God, firstborn over creation, head of the church.", characters: ["Christ"], themes: ["Supremacy", "Creation", "Reconciliation"], lessonLearned: "Christ is supreme over all." },
      { id: "col-2", title: "Set Your Mind Above", reference: "Colossians 3:1-4", summary: "Set your minds on things above where Christ is seated.", characters: ["Paul"], themes: ["Focus", "Heaven", "Christ"], lessonLearned: "Focus on heavenly realities." }
    ]
  },

  // 1 THESSALONIANS
  {
    book: "1 Thessalonians",
    testament: "new",
    stories: [
      { id: "1th-1", title: "Model Church", reference: "1 Thessalonians 1", summary: "The Thessalonians became a model of faith to all believers.", characters: ["Paul", "Thessalonians"], themes: ["Faith", "Example", "Gospel"], lessonLearned: "Let your faith be an example to others." },
      { id: "1th-2", title: "The Lord's Return", reference: "1 Thessalonians 4:13-18", summary: "The Lord will descend; dead in Christ rise first; we meet Him in air.", characters: ["Lord", "Believers"], themes: ["Return", "Resurrection", "Hope"], lessonLearned: "Encourage one another with Christ's return." }
    ]
  },

  // 2 THESSALONIANS
  {
    book: "2 Thessalonians",
    testament: "new",
    stories: [
      { id: "2th-1", title: "Man of Lawlessness", reference: "2 Thessalonians 2:1-12", summary: "The man of lawlessness will be revealed before the Day of the Lord.", characters: ["Man of Lawlessness", "Lord"], themes: ["End Times", "Deception", "Judgment"], lessonLearned: "Stand firm; the Lord will triumph." },
      { id: "2th-2", title: "Work and Eat", reference: "2 Thessalonians 3:6-12", summary: "Those unwilling to work should not eat; don't be idle.", characters: ["Paul"], themes: ["Work", "Responsibility", "Order"], lessonLearned: "Faithful work honors God." }
    ]
  },

  // 1 TIMOTHY
  {
    book: "1 Timothy",
    testament: "new",
    stories: [
      { id: "1ti-1", title: "Faithful Saying", reference: "1 Timothy 1:15", summary: "Christ Jesus came to save sinners—of whom Paul is the worst.", characters: ["Paul"], themes: ["Grace", "Salvation", "Humility"], lessonLearned: "Jesus saves the worst sinners." },
      { id: "1ti-2", title: "Fight the Good Fight", reference: "1 Timothy 6:11-16", summary: "Fight the good fight of faith; take hold of eternal life.", characters: ["Timothy"], themes: ["Perseverance", "Faith", "Calling"], lessonLearned: "Fight the good fight of faith." }
    ]
  },

  // 2 TIMOTHY
  {
    book: "2 Timothy",
    testament: "new",
    stories: [
      { id: "2ti-1", title: "Inspired Scripture", reference: "2 Timothy 3:16-17", summary: "All Scripture is God-breathed and useful for teaching and training.", characters: ["Paul"], themes: ["Scripture", "Inspiration", "Equipping"], lessonLearned: "Scripture equips us for every good work." },
      { id: "2ti-2", title: "Paul's Final Words", reference: "2 Timothy 4:6-8", summary: "Paul has fought the fight, finished the race, and awaits his crown.", characters: ["Paul"], themes: ["Faithfulness", "Reward", "Legacy"], lessonLearned: "Finish well." }
    ]
  },

  // TITUS
  {
    book: "Titus",
    testament: "new",
    stories: [
      { id: "tit-1", title: "Grace Teaches Us", reference: "Titus 2:11-14", summary: "Grace teaches us to say no to ungodliness and live uprightly.", characters: ["Paul"], themes: ["Grace", "Godliness", "Hope"], lessonLearned: "Grace transforms how we live." }
    ]
  },

  // PHILEMON
  {
    book: "Philemon",
    testament: "new",
    stories: [
      { id: "phm-1", title: "Onesimus Returns", reference: "Philemon 1", summary: "Paul appeals for runaway slave Onesimus to be received as a brother.", characters: ["Paul", "Philemon", "Onesimus"], themes: ["Reconciliation", "Brotherhood", "Forgiveness"], lessonLearned: "In Christ, relationships are transformed." }
    ]
  },

  // HEBREWS
  {
    book: "Hebrews",
    testament: "new",
    stories: [
      { id: "heb-1", title: "Superior to Angels", reference: "Hebrews 1-2", summary: "Christ is superior to angels, the exact representation of God.", characters: ["Christ", "Angels"], themes: ["Supremacy", "Incarnation", "Salvation"], lessonLearned: "Jesus is greater than all." },
      { id: "heb-2", title: "Enter His Rest", reference: "Hebrews 4:1-11", summary: "A Sabbath rest remains for God's people; strive to enter it.", characters: ["Author", "Readers"], themes: ["Rest", "Faith", "Perseverance"], lessonLearned: "Faith enters God's rest." },
      { id: "heb-3", title: "Great High Priest", reference: "Hebrews 4:14-16", summary: "Our high priest sympathizes with our weaknesses; approach boldly.", characters: ["Christ"], themes: ["Priesthood", "Access", "Grace"], lessonLearned: "We can approach God's throne boldly." },
      { id: "heb-4", title: "Hall of Faith", reference: "Hebrews 11", summary: "By faith the ancients did great things; a cloud of witnesses surrounds us.", characters: ["Abel", "Enoch", "Noah", "Abraham", "Moses", "Others"], themes: ["Faith", "Perseverance", "Example"], lessonLearned: "Faith enabled the heroes of old." },
      { id: "heb-5", title: "Run the Race", reference: "Hebrews 12:1-3", summary: "Lay aside every weight; run with endurance; fix eyes on Jesus.", characters: ["Jesus", "Believers"], themes: ["Perseverance", "Focus", "Endurance"], lessonLearned: "Fix your eyes on Jesus and run." }
    ]
  },

  // JAMES
  {
    book: "James",
    testament: "new",
    stories: [
      { id: "jas-1", title: "Trials Produce", reference: "James 1:2-4", summary: "Count trials as joy; testing produces perseverance leading to maturity.", characters: ["James"], themes: ["Trials", "Joy", "Maturity"], lessonLearned: "Trials develop our character." },
      { id: "jas-2", title: "Faith and Works", reference: "James 2:14-26", summary: "Faith without works is dead; show faith by what you do.", characters: ["James"], themes: ["Faith", "Works", "Evidence"], lessonLearned: "True faith produces action." },
      { id: "jas-3", title: "Taming the Tongue", reference: "James 3:1-12", summary: "The tongue is a fire; no one can tame it; it blesses and curses.", characters: ["James"], themes: ["Speech", "Control", "Integrity"], lessonLearned: "Guard your words carefully." }
    ]
  },

  // 1 PETER
  {
    book: "1 Peter",
    testament: "new",
    stories: [
      { id: "1pe-1", title: "Living Hope", reference: "1 Peter 1:3-9", summary: "We have a living hope through Christ's resurrection.", characters: ["Peter"], themes: ["Hope", "Inheritance", "Joy"], lessonLearned: "Our hope is living and secure." },
      { id: "1pe-2", title: "Living Stones", reference: "1 Peter 2:4-10", summary: "We are living stones being built into a spiritual house.", characters: ["Peter"], themes: ["Church", "Priesthood", "Identity"], lessonLearned: "We are God's chosen people." },
      { id: "1pe-3", title: "Suffering for Good", reference: "1 Peter 3:13-17", summary: "If you suffer for doing good, you are blessed; be ready to give an answer.", characters: ["Peter"], themes: ["Suffering", "Witness", "Defense"], lessonLearned: "Be ready to explain your hope." }
    ]
  },

  // 2 PETER
  {
    book: "2 Peter",
    testament: "new",
    stories: [
      { id: "2pe-1", title: "Add to Faith", reference: "2 Peter 1:5-11", summary: "Add to faith virtue, knowledge, self-control, perseverance, godliness, love.", characters: ["Peter"], themes: ["Growth", "Character", "Diligence"], lessonLearned: "Grow in faith and character." },
      { id: "2pe-2", title: "Day of the Lord", reference: "2 Peter 3:8-13", summary: "The Lord is not slow; the day will come as a thief; new heavens await.", characters: ["Peter"], themes: ["Return", "Patience", "New Creation"], lessonLearned: "Live holy lives as you wait." }
    ]
  },

  // 1 JOHN
  {
    book: "1 John",
    testament: "new",
    stories: [
      { id: "1jn-1", title: "God Is Light", reference: "1 John 1:5-10", summary: "God is light; if we walk in light, we have fellowship; blood cleanses.", characters: ["John"], themes: ["Light", "Fellowship", "Confession"], lessonLearned: "Walk in the light and confess sin." },
      { id: "1jn-2", title: "God Is Love", reference: "1 John 4:7-21", summary: "God is love; He loved us first; we love because He first loved us.", characters: ["John"], themes: ["Love", "Origin", "Response"], lessonLearned: "Love one another as God loved us." },
      { id: "1jn-3", title: "Assurance of Salvation", reference: "1 John 5:11-13", summary: "God has given eternal life in His Son; you may know you have life.", characters: ["John"], themes: ["Assurance", "Eternal Life", "Testimony"], lessonLearned: "You can know you have eternal life." }
    ]
  },

  // 2 JOHN
  {
    book: "2 John",
    testament: "new",
    stories: [
      { id: "2jn-1", title: "Walking in Truth", reference: "2 John 1", summary: "John rejoices that some walk in truth; warns against deceivers.", characters: ["John", "Elect Lady"], themes: ["Truth", "Love", "Discernment"], lessonLearned: "Walk in truth and guard against deception." }
    ]
  },

  // 3 JOHN
  {
    book: "3 John",
    testament: "new",
    stories: [
      { id: "3jn-1", title: "Gaius and Diotrephes", reference: "3 John 1", summary: "Gaius is commended for hospitality; Diotrephes condemned for pride.", characters: ["John", "Gaius", "Diotrephes"], themes: ["Hospitality", "Pride", "Service"], lessonLearned: "Imitate good, not evil." }
    ]
  },

  // JUDE
  {
    book: "Jude",
    testament: "new",
    stories: [
      { id: "jud-1", title: "Contend for Faith", reference: "Jude 1:3-4", summary: "Contend for the faith once delivered; certain men have crept in.", characters: ["Jude"], themes: ["Contending", "Faith", "Warning"], lessonLearned: "Defend the faith against false teaching." },
      { id: "jud-2", title: "Doxology", reference: "Jude 1:24-25", summary: "To Him who is able to keep you from stumbling and present you faultless.", characters: ["Jude"], themes: ["Preservation", "Glory", "Praise"], lessonLearned: "God keeps us and presents us faultless." }
    ]
  },

  // REVELATION
  {
    book: "Revelation",
    testament: "new",
    stories: [
      { id: "rev-1", title: "Vision of Christ", reference: "Revelation 1", summary: "John sees the glorified Christ among seven lampstands with seven stars.", characters: ["John", "Christ"], themes: ["Glory", "Revelation", "Majesty"], lessonLearned: "Christ is glorified and present with His churches." },
      { id: "rev-2", title: "Letters to Churches", reference: "Revelation 2-3", summary: "Christ addresses seven churches with commendation, correction, and promise.", characters: ["Christ", "Seven Churches"], themes: ["Warning", "Promise", "Overcoming"], lessonLearned: "He who has ears, let him hear." },
      { id: "rev-2b", title: "Ephesus: Lost First Love", reference: "Revelation 2:1-7", summary: "Ephesus is praised for labor but rebuked for losing first love; repent or lose your lampstand.", characters: ["Christ", "Ephesus"], themes: ["First Love", "Repentance", "Tree of Life"], lessonLearned: "Never lose your first love for Christ." },
      { id: "rev-2c", title: "Smyrna: Faithful unto Death", reference: "Revelation 2:8-11", summary: "Smyrna faces persecution; be faithful unto death and receive the crown of life.", characters: ["Christ", "Smyrna"], themes: ["Suffering", "Faithfulness", "Crown"], lessonLearned: "Faithfulness through suffering earns the crown of life." },
      { id: "rev-2d", title: "Pergamos: Where Satan Dwells", reference: "Revelation 2:12-17", summary: "Pergamos holds fast Christ's name but tolerates false teaching; repent and receive hidden manna.", characters: ["Christ", "Pergamos"], themes: ["Compromise", "Truth", "Hidden Manna"], lessonLearned: "Don't tolerate false teaching." },
      { id: "rev-2e", title: "Thyatira: Jezebel Tolerated", reference: "Revelation 2:18-29", summary: "Thyatira's works are praised but Jezebel's immorality tolerated; overcomers rule nations.", characters: ["Christ", "Thyatira", "Jezebel"], themes: ["Tolerance", "Immorality", "Authority"], lessonLearned: "Don't tolerate immorality in the church." },
      { id: "rev-2f", title: "Sardis: Spiritually Dead", reference: "Revelation 3:1-6", summary: "Sardis has a reputation for life but is dead; wake up and strengthen what remains.", characters: ["Christ", "Sardis"], themes: ["Death", "Wake Up", "White Garments"], lessonLearned: "Reputation means nothing if spiritually dead." },
      { id: "rev-2g", title: "Philadelphia: Open Door", reference: "Revelation 3:7-13", summary: "Philadelphia has little strength but kept Christ's word; an open door none can shut.", characters: ["Christ", "Philadelphia"], themes: ["Faithfulness", "Open Door", "Pillar"], lessonLearned: "God opens doors for the faithful." },
      { id: "rev-2h", title: "Laodicea: Lukewarm", reference: "Revelation 3:14-22", summary: "Laodicea is neither hot nor cold; Christ stands at the door and knocks.", characters: ["Christ", "Laodicea"], themes: ["Lukewarmness", "Self-Deception", "Fellowship"], lessonLearned: "Be zealous and repent of lukewarmness." },
      { id: "rev-3", title: "Throne Room", reference: "Revelation 4-5", summary: "John sees heaven's throne, worship, and the Lamb worthy to open the scroll.", characters: ["God", "Lamb", "Living Creatures", "Elders"], themes: ["Worship", "Sovereignty", "Redemption"], lessonLearned: "The Lamb alone is worthy." },
      { id: "rev-4", title: "Seven Seals", reference: "Revelation 6-7", summary: "The Lamb opens seals; judgments come; 144,000 are sealed.", characters: ["Lamb", "Four Horsemen", "144,000"], themes: ["Judgment", "Sealing", "Martyrs"], lessonLearned: "God's judgments are just." },
      { id: "rev-4b", title: "The Four Horsemen", reference: "Revelation 6:1-8", summary: "Four horsemen ride: conquest (white), war (red), famine (black), death (pale).", characters: ["Four Horsemen", "Lamb"], themes: ["Conquest", "War", "Famine", "Death"], lessonLearned: "History's judgments follow a divine pattern." },
      { id: "rev-4c", title: "The 144,000 Sealed", reference: "Revelation 7:1-8", summary: "Before the winds blow, 144,000 from all tribes of Israel are sealed on their foreheads.", characters: ["Angels", "144,000"], themes: ["Sealing", "Protection", "Remnant"], lessonLearned: "God marks His own for protection." },
      { id: "rev-4d", title: "Great Multitude", reference: "Revelation 7:9-17", summary: "A great multitude from every nation stands before the throne in white robes.", characters: ["Great Multitude", "Elders", "Lamb"], themes: ["Salvation", "Worship", "No More Tears"], lessonLearned: "Salvation comes from all nations." },
      { id: "rev-5", title: "Seven Trumpets", reference: "Revelation 8-11", summary: "Angels sound trumpets bringing escalating judgments; two witnesses prophesy.", characters: ["Angels", "Two Witnesses"], themes: ["Judgment", "Warning", "Witness"], lessonLearned: "God warns before final judgment." },
      { id: "rev-5b", title: "The Two Witnesses", reference: "Revelation 11:1-14", summary: "Two witnesses prophesy 1,260 days, are killed, and rise after three and a half days.", characters: ["Two Witnesses", "Beast"], themes: ["Testimony", "Martyrdom", "Resurrection"], lessonLearned: "God's witnesses cannot be silenced permanently." },
      { id: "rev-6", title: "Woman and Dragon", reference: "Revelation 12", summary: "A woman gives birth; the dragon pursues her; war erupts in heaven.", characters: ["Woman", "Dragon", "Michael", "Child"], themes: ["Conflict", "Protection", "Victory"], lessonLearned: "Satan is defeated; God protects His own." },
      { id: "rev-7", title: "Beast and False Prophet", reference: "Revelation 13", summary: "A beast rises from the sea; a false prophet makes the world worship it.", characters: ["Beast", "False Prophet"], themes: ["Deception", "Persecution", "Mark"], lessonLearned: "Endure; don't take the mark." },
      { id: "rev-7b", title: "Three Angels' Messages", reference: "Revelation 14:6-12", summary: "Three angels proclaim: fear God, Babylon is fallen, don't take the mark.", characters: ["Three Angels"], themes: ["Gospel", "Judgment", "Warning"], lessonLearned: "God's final message calls for decision." },
      { id: "rev-8", title: "Seven Bowls", reference: "Revelation 15-16", summary: "Seven angels pour out bowls of God's wrath on the earth.", characters: ["Angels"], themes: ["Wrath", "Judgment", "Justice"], lessonLearned: "God's final judgments complete His wrath." },
      { id: "rev-8b", title: "Armageddon", reference: "Revelation 16:12-16", summary: "Demonic spirits gather kings to Armageddon for the great day of God Almighty.", characters: ["Dragon", "Beast", "False Prophet", "Kings"], themes: ["Deception", "Battle", "Final Conflict"], lessonLearned: "The final battle belongs to God." },
      { id: "rev-9", title: "Fall of Babylon", reference: "Revelation 17-18", summary: "The great harlot Babylon falls in one hour; merchants mourn.", characters: ["Babylon", "Kings", "Merchants"], themes: ["Judgment", "Worldliness", "Mourning"], lessonLearned: "The world system will be judged." },
      { id: "rev-10", title: "Christ's Return", reference: "Revelation 19", summary: "Heaven opens; Christ returns on a white horse; the beast is defeated.", characters: ["Christ", "Armies", "Beast"], themes: ["Victory", "Return", "Judgment"], lessonLearned: "Christ returns victorious." },
      { id: "rev-10b", title: "Marriage Supper of the Lamb", reference: "Revelation 19:6-9", summary: "The marriage of the Lamb has come; His bride has made herself ready.", characters: ["Lamb", "Bride"], themes: ["Marriage", "Joy", "Readiness"], lessonLearned: "The church is prepared as Christ's bride." },
      { id: "rev-11", title: "Millennium and Judgment", reference: "Revelation 20", summary: "Satan bound 1000 years; final rebellion; Great White Throne judgment.", characters: ["Satan", "Christ", "Dead"], themes: ["Reign", "Judgment", "Lake of Fire"], lessonLearned: "Every person will face judgment." },
      { id: "rev-12", title: "New Heaven and Earth", reference: "Revelation 21-22", summary: "New heaven, new earth, New Jerusalem; no tears, death, or pain; come Lord Jesus.", characters: ["God", "Lamb", "Bride"], themes: ["New Creation", "Restoration", "Eternity"], lessonLearned: "God makes all things new. Come, Lord Jesus!" },
      { id: "rev-12b", title: "The River of Life", reference: "Revelation 22:1-5", summary: "A river of life flows from the throne; the tree of life yields twelve fruits; God's face is seen.", characters: ["God", "Lamb", "Saints"], themes: ["Life", "Healing", "Presence"], lessonLearned: "Eternal life means seeing God face to face." },
      { id: "rev-12c", title: "Come, Lord Jesus", reference: "Revelation 22:12-21", summary: "Jesus promises to come quickly; the Spirit and Bride say Come; invitation to all who thirst.", characters: ["Jesus", "Spirit", "Bride"], themes: ["Soon Return", "Invitation", "Blessing"], lessonLearned: "The Bible ends with an invitation and a promise." }
    ]
  }
];

// Helper function to get stories by book
export const getStoriesByBook = (bookName: string): BibleStory[] => {
  const book = bibleStoryLibrary.find(b => b.book.toLowerCase() === bookName.toLowerCase());
  return book?.stories || [];
};

// Helper function to get all books
export const getAllBooks = (): string[] => {
  return bibleStoryLibrary.map(b => b.book);
};

// Helper function to search stories
export const searchStories = (query: string): BibleStory[] => {
  const lowerQuery = query.toLowerCase();
  const results: BibleStory[] = [];

  bibleStoryLibrary.forEach(book => {
    book.stories.forEach(story => {
      if (
        story.title.toLowerCase().includes(lowerQuery) ||
        story.summary.toLowerCase().includes(lowerQuery) ||
        story.characters.some(c => c.toLowerCase().includes(lowerQuery)) ||
        story.themes.some(t => t.toLowerCase().includes(lowerQuery))
      ) {
        results.push(story);
      }
    });
  });

  return results;
};

// Get total story count
export const getTotalStoryCount = (): number => {
  return bibleStoryLibrary.reduce((total, book) => total + book.stories.length, 0);
};
