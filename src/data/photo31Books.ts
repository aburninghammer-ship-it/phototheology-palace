// All 66 books of the Bible for Photo31 picture-based study
// Each book has thematic "pictures" — big-picture theological scenes, not verse-by-verse passages
// Pictures are ordered by theological weight, not necessarily chapter sequence

export interface Photo31Book {
  key: string;
  name: string;
  testament: "OT" | "NT";
  chapters: number;
  summary: string; // One-line theological synopsis
}

export const BIBLE_BOOKS: Photo31Book[] = [
  // OLD TESTAMENT
  { key: "genesis", name: "Genesis", testament: "OT", chapters: 50, summary: "The origin of everything — creation, fall, promise, and the birth of covenant." },
  { key: "exodus", name: "Exodus", testament: "OT", chapters: 40, summary: "Deliverance, law, and sanctuary — the blueprint of salvation displayed." },
  { key: "leviticus", name: "Leviticus", testament: "OT", chapters: 27, summary: "The holiness code — every sacrifice, feast, and law pointing to Christ's ministry." },
  { key: "numbers", name: "Numbers", testament: "OT", chapters: 36, summary: "Wilderness wandering — faith tested, rebellion judged, and God's faithfulness sustained." },
  { key: "deuteronomy", name: "Deuteronomy", testament: "OT", chapters: 34, summary: "Moses' farewell — covenant renewal on the threshold of promise." },
  { key: "joshua", name: "Joshua", testament: "OT", chapters: 24, summary: "Conquest and inheritance — entering the rest God promised." },
  { key: "judges", name: "Judges", testament: "OT", chapters: 21, summary: "The cycle of apostasy — when everyone does what is right in their own eyes." },
  { key: "ruth", name: "Ruth", testament: "OT", chapters: 4, summary: "The kinsman-redeemer — loyalty, redemption, and the lineage of Christ." },
  { key: "1samuel", name: "1 Samuel", testament: "OT", chapters: 31, summary: "From judges to kings — the rise and fall of Saul, the anointing of David." },
  { key: "2samuel", name: "2 Samuel", testament: "OT", chapters: 24, summary: "David's reign — glory, sin, consequences, and the everlasting covenant." },
  { key: "1kings", name: "1 Kings", testament: "OT", chapters: 22, summary: "Solomon's temple and the divided kingdom — wisdom lost and idolatry enthroned." },
  { key: "2kings", name: "2 Kings", testament: "OT", chapters: 25, summary: "The march toward exile — prophets cry, kings fail, and judgment falls." },
  { key: "1chronicles", name: "1 Chronicles", testament: "OT", chapters: 29, summary: "Israel's sacred genealogy and David's preparation for the temple." },
  { key: "2chronicles", name: "2 Chronicles", testament: "OT", chapters: 36, summary: "Temple, revival, and ruin — the spiritual heartbeat of Judah's kings." },
  { key: "ezra", name: "Ezra", testament: "OT", chapters: 10, summary: "Return and rebuild — Cyrus's decree and the restoration of worship." },
  { key: "nehemiah", name: "Nehemiah", testament: "OT", chapters: 13, summary: "Walls rebuilt, covenant renewed — leadership under opposition." },
  { key: "esther", name: "Esther", testament: "OT", chapters: 10, summary: "Providence in the shadows — God's unseen hand preserving His people." },
  { key: "job", name: "Job", testament: "OT", chapters: 42, summary: "The courtroom of heaven — suffering, sovereignty, and the controversy revealed." },
  { key: "psalms", name: "Psalms", testament: "OT", chapters: 150, summary: "The hymnal of the sanctuary — every human emotion mapped to God's character." },
  { key: "proverbs", name: "Proverbs", testament: "OT", chapters: 31, summary: "Wisdom personified — the art of living in covenant alignment." },
  { key: "ecclesiastes", name: "Ecclesiastes", testament: "OT", chapters: 12, summary: "Vanity of vanity — the search for meaning that only God can satisfy." },
  { key: "songofsolomon", name: "Song of Solomon", testament: "OT", chapters: 8, summary: "The love poem of covenant — Christ and His bride in intimate union." },
  { key: "isaiah", name: "Isaiah", testament: "OT", chapters: 66, summary: "The gospel prophet — judgment, Messiah, suffering servant, and new creation." },
  { key: "jeremiah", name: "Jeremiah", testament: "OT", chapters: 52, summary: "The weeping prophet — covenant broken, judgment pronounced, new covenant promised." },
  { key: "lamentations", name: "Lamentations", testament: "OT", chapters: 5, summary: "The funeral of Jerusalem — grief structured as worship." },
  { key: "ezekiel", name: "Ezekiel", testament: "OT", chapters: 48, summary: "Visions of glory departing and returning — the sanctuary in exile." },
  { key: "daniel", name: "Daniel", testament: "OT", chapters: 12, summary: "Prophecy's master key — empires, judgment, and the Son of Man enthroned." },
  { key: "hosea", name: "Hosea", testament: "OT", chapters: 14, summary: "God's unfaithful bride — judgment tempered by relentless love." },
  { key: "joel", name: "Joel", testament: "OT", chapters: 3, summary: "The Day of the Lord — locusts, repentance, and the outpouring of the Spirit." },
  { key: "amos", name: "Amos", testament: "OT", chapters: 9, summary: "Justice roars — the shepherd prophet confronts Israel's corruption." },
  { key: "obadiah", name: "Obadiah", testament: "OT", chapters: 1, summary: "Edom's doom — pride judged, Zion vindicated." },
  { key: "jonah", name: "Jonah", testament: "OT", chapters: 4, summary: "The reluctant prophet — death, resurrection typology, and God's mercy to enemies." },
  { key: "micah", name: "Micah", testament: "OT", chapters: 7, summary: "Bethlehem's ruler — justice, mercy, and the remnant's hope." },
  { key: "nahum", name: "Nahum", testament: "OT", chapters: 3, summary: "Nineveh falls — God's patience has limits; His justice is certain." },
  { key: "habakkuk", name: "Habakkuk", testament: "OT", chapters: 3, summary: "The prophet's complaint — the just shall live by faith." },
  { key: "zephaniah", name: "Zephaniah", testament: "OT", chapters: 3, summary: "The great Day of the Lord — universal judgment and a purified remnant." },
  { key: "haggai", name: "Haggai", testament: "OT", chapters: 2, summary: "Build the house — priorities, presence, and the glory to come." },
  { key: "zechariah", name: "Zechariah", testament: "OT", chapters: 14, summary: "Apocalyptic visions — the Branch, the pierced One, and final triumph." },
  { key: "malachi", name: "Malachi", testament: "OT", chapters: 4, summary: "God's last Old Testament word — covenant unfaithfulness and the coming Messenger." },
  // NEW TESTAMENT
  { key: "matthew", name: "Matthew", testament: "NT", chapters: 28, summary: "The King has come — Christ fulfills every prophecy, law, and type." },
  { key: "mark", name: "Mark", testament: "NT", chapters: 16, summary: "The Servant-Savior in action — urgency, authority, and the cross." },
  { key: "luke", name: "Luke", testament: "NT", chapters: 24, summary: "The Son of Man — Christ's humanity, compassion, and universal mission." },
  { key: "john", name: "John", testament: "NT", chapters: 21, summary: "The Word made flesh — seven signs, seven I-AMs, and believing unto life." },
  { key: "acts", name: "Acts", testament: "NT", chapters: 28, summary: "The Spirit unleashed — the church born, scattered, and unstoppable." },
  { key: "romans", name: "Romans", testament: "NT", chapters: 16, summary: "The gospel unpacked — justification, sanctification, and glorification mapped." },
  { key: "1corinthians", name: "1 Corinthians", testament: "NT", chapters: 16, summary: "The cross applied — wisdom, unity, gifts, love, and resurrection." },
  { key: "2corinthians", name: "2 Corinthians", testament: "NT", chapters: 13, summary: "Strength in weakness — Paul's defense and the ministry of reconciliation." },
  { key: "galatians", name: "Galatians", testament: "NT", chapters: 6, summary: "Freedom in Christ — law and grace rightly divided." },
  { key: "ephesians", name: "Ephesians", testament: "NT", chapters: 6, summary: "The body of Christ — predestined, unified, armored for warfare." },
  { key: "philippians", name: "Philippians", testament: "NT", chapters: 4, summary: "Joy in chains — the mind of Christ and the prize of the high calling." },
  { key: "colossians", name: "Colossians", testament: "NT", chapters: 4, summary: "Christ supreme — the fullness of the Godhead, the sufficiency of the cross." },
  { key: "1thessalonians", name: "1 Thessalonians", testament: "NT", chapters: 5, summary: "Living in the light of the Second Coming — faith, love, and hope." },
  { key: "2thessalonians", name: "2 Thessalonians", testament: "NT", chapters: 3, summary: "The Man of Sin — apostasy exposed, the Lord's return vindicated." },
  { key: "1timothy", name: "1 Timothy", testament: "NT", chapters: 6, summary: "Order in God's house — leadership, doctrine, and the good fight." },
  { key: "2timothy", name: "2 Timothy", testament: "NT", chapters: 4, summary: "Paul's last charge — endure, preach, finish the course." },
  { key: "titus", name: "Titus", testament: "NT", chapters: 3, summary: "Sound doctrine lived out — grace that teaches godliness." },
  { key: "philemon", name: "Philemon", testament: "NT", chapters: 1, summary: "The gospel in one letter — forgiveness, reconciliation, and new identity." },
  { key: "hebrews", name: "Hebrews", testament: "NT", chapters: 13, summary: "The better covenant — Christ's sanctuary ministry surpasses all shadows." },
  { key: "james", name: "James", testament: "NT", chapters: 5, summary: "Faith that works — the royal law applied to daily life." },
  { key: "1peter", name: "1 Peter", testament: "NT", chapters: 5, summary: "Suffering with hope — the pilgrim's identity and the fiery trial." },
  { key: "2peter", name: "2 Peter", testament: "NT", chapters: 3, summary: "True knowledge vs. false teachers — the Day of the Lord approaches." },
  { key: "1john", name: "1 John", testament: "NT", chapters: 5, summary: "Light, love, and life — the tests of genuine fellowship with God." },
  { key: "2john", name: "2 John", testament: "NT", chapters: 1, summary: "Walk in truth — guard against deception in love." },
  { key: "3john", name: "3 John", testament: "NT", chapters: 1, summary: "Hospitality and truth — supporting those who walk faithfully." },
  { key: "jude", name: "Jude", testament: "NT", chapters: 1, summary: "Contend for the faith — apostasy's pattern and God's keeping power." },
  { key: "revelation", name: "Revelation", testament: "NT", chapters: 22, summary: "The unveiling — Christ victorious over every beast, throne, and grave." },
];

export function getBookByKey(key: string): Photo31Book | undefined {
  return BIBLE_BOOKS.find(b => b.key === key);
}
