// Bible Freestyle Library - Verse Genetics Examples
// Shows how any two verses in Scripture are connected—they're all family

export type RelationshipType = 'siblings' | 'cousins' | 'distant';

export interface VerseGenetic {
  id: string;
  verseA: {
    reference: string;
    text: string;
  };
  verseB: {
    reference: string;
    text: string;
  };
  relationship: RelationshipType;
  connectionType: string;
  sharedDNA: string;
  christBridge: string;
  explanation: string;
}

export const bibleFreestyleLibrary: VerseGenetic[] = [
  // SIBLING CONNECTIONS (Nearly identical concepts, direct parallels)
  {
    id: 'passover-crucifixion',
    verseA: {
      reference: 'Exodus 12:6',
      text: 'Keep it until the fourteenth day of this month, when the whole assembly of the congregation of Israel shall kill their lambs at twilight.'
    },
    verseB: {
      reference: '1 Corinthians 5:7',
      text: 'For Christ, our Passover lamb, has been sacrificed.'
    },
    relationship: 'siblings',
    connectionType: 'Direct Type-Fulfillment',
    sharedDNA: 'Both speak of a lamb slain at a specific time to save God\'s people from judgment.',
    christBridge: 'Jesus was crucified on Passover, at the exact hour when Passover lambs were being slain in the temple.',
    explanation: 'These are siblings—Paul explicitly identifies Christ as THE Passover lamb. The timing, the blood, the deliverance—all match perfectly.'
  },
  {
    id: 'seed-promise',
    verseA: {
      reference: 'Genesis 3:15',
      text: 'I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel.'
    },
    verseB: {
      reference: 'Galatians 4:4',
      text: 'But when the fullness of time had come, God sent forth his Son, born of woman.'
    },
    relationship: 'siblings',
    connectionType: 'Promise-Fulfillment',
    sharedDNA: 'Both identify the Redeemer as coming from the woman—the "seed of woman" promise.',
    christBridge: 'Jesus is THE seed of the woman—born of Mary, crushing Satan\'s head at Calvary.',
    explanation: 'The proto-gospel of Genesis 3:15 finds its direct answer in Galatians 4:4. Both emphasize "of woman"—the seed promise fulfilled.'
  },
  {
    id: 'rock-water',
    verseA: {
      reference: 'Exodus 17:6',
      text: 'Behold, I will stand before you there on the rock at Horeb, and you shall strike the rock, and water shall come out of it.'
    },
    verseB: {
      reference: '1 Corinthians 10:4',
      text: 'For they drank from the spiritual Rock that followed them, and the Rock was Christ.'
    },
    relationship: 'siblings',
    connectionType: 'Direct Type Identification',
    sharedDNA: 'Both speak of a rock that provides life-giving water for God\'s thirsty people.',
    christBridge: 'Paul explicitly says "the Rock was Christ"—the OT rock typified Christ struck for us.',
    explanation: 'Paul doesn\'t allegorize—he reveals. The rock Moses struck WAS Christ in typological form.'
  },

  // COUSIN CONNECTIONS (Shared theme from different angles)
  {
    id: 'shepherd-theme',
    verseA: {
      reference: 'Psalm 23:1',
      text: 'The LORD is my shepherd; I shall not want.'
    },
    verseB: {
      reference: 'John 10:11',
      text: 'I am the good shepherd. The good shepherd lays down his life for the sheep.'
    },
    relationship: 'cousins',
    connectionType: 'Theme Expansion',
    sharedDNA: 'Both present God/Christ as Shepherd who provides for and protects His flock.',
    christBridge: 'The LORD who is David\'s shepherd is the same Person who says "I AM the good shepherd."',
    explanation: 'David celebrates Yahweh as shepherd; Jesus claims the title personally. Same role, now embodied in the incarnate Son.'
  },
  {
    id: 'suffering-servant',
    verseA: {
      reference: 'Isaiah 53:7',
      text: 'He was oppressed, and he was afflicted, yet he opened not his mouth; like a lamb that is led to the slaughter.'
    },
    verseB: {
      reference: 'Acts 8:32-35',
      text: 'The place of the Scripture which he read was this... Philip opened his mouth, and beginning with this Scripture he told him the good news about Jesus.'
    },
    relationship: 'cousins',
    connectionType: 'Prophetic Identification',
    sharedDNA: 'Both describe the silent, suffering Lamb—Isaiah prophetically, Acts historically.',
    christBridge: 'Philip shows the Ethiopian that Isaiah\'s suffering servant IS Jesus—prophecy meets history.',
    explanation: 'Isaiah\'s prophecy and Philip\'s explanation are cousins—same truth from different angles: prophetic vision and apostolic interpretation.'
  },
  {
    id: 'light-world',
    verseA: {
      reference: 'Genesis 1:3',
      text: 'And God said, "Let there be light," and there was light.'
    },
    verseB: {
      reference: 'John 8:12',
      text: 'I am the light of the world. Whoever follows me will not walk in darkness.'
    },
    relationship: 'cousins',
    connectionType: 'Creation-New Creation',
    sharedDNA: 'Both present light as God\'s answer to darkness—physical creation and spiritual redemption.',
    christBridge: 'The Word who created physical light IS the Light of the world bringing spiritual illumination.',
    explanation: 'Genesis shows God creating light; John shows the Light incarnate. Same divine action: dispelling darkness through the Word.'
  },
  {
    id: 'living-water',
    verseA: {
      reference: 'Jeremiah 2:13',
      text: 'My people have committed two evils: they have forsaken me, the fountain of living waters.'
    },
    verseB: {
      reference: 'John 7:37-38',
      text: 'If anyone thirsts, let him come to me and drink... Out of his heart will flow rivers of living water.'
    },
    relationship: 'cousins',
    connectionType: 'Theme Fulfillment',
    sharedDNA: 'Both identify the source of living water—God in Jeremiah, Jesus in John.',
    christBridge: 'Israel forsook Yahweh, the living water; Jesus offers Himself as that same living water.',
    explanation: 'Jeremiah laments Israel\'s rejection; Jesus offers what they rejected. The fountain forsaken becomes the fountain offered.'
  },

  // DISTANT RELATIVES (Connected through patterns, typology, or Christ-centered threads)
  {
    id: 'leper-isaiah',
    verseA: {
      reference: 'Leviticus 13:45',
      text: 'The leprous person who has the disease shall wear torn clothes... and shall cry out, "Unclean, unclean."'
    },
    verseB: {
      reference: 'Isaiah 6:5',
      text: 'Woe is me! For I am lost; for I am a man of unclean lips, and I dwell in the midst of a people of unclean lips.'
    },
    relationship: 'distant',
    connectionType: 'Confession Pattern',
    sharedDNA: 'Both involve confession of uncleanness before holy presence—physical and spiritual.',
    christBridge: 'Christ touches both lepers and prophets to cleanse them—coal for Isaiah\'s lips, word for lepers\' flesh.',
    explanation: 'The leper\'s required confession echoes Isaiah\'s spontaneous confession. Both reveal: approaching the Holy requires acknowledging corruption.'
  },
  {
    id: 'jacob-ladder-temple',
    verseA: {
      reference: 'Genesis 28:12',
      text: 'He dreamed, and behold, there was a ladder set up on the earth, and the top of it reached to heaven. And behold, the angels of God were ascending and descending on it.'
    },
    verseB: {
      reference: 'John 2:19',
      text: 'Jesus answered them, "Destroy this temple, and in three days I will raise it up."'
    },
    relationship: 'distant',
    connectionType: 'Meeting Place Pattern',
    sharedDNA: 'Both are about the connection point between heaven and earth.',
    christBridge: 'John 1:51 bridges them—Jesus IS the ladder/stairway AND the temple. He is heaven-earth meeting place.',
    explanation: 'Seemingly unrelated until John 1:51 connects them. Both are access points to God—Jacob\'s ladder and the temple body of Christ.'
  },
  {
    id: 'serpent-curse',
    verseA: {
      reference: 'Numbers 21:8-9',
      text: 'Make a fiery serpent and set it on a pole, and everyone who is bitten, when he sees it, shall live.'
    },
    verseB: {
      reference: 'Galatians 3:13',
      text: 'Christ redeemed us from the curse of the law by becoming a curse for us.'
    },
    relationship: 'distant',
    connectionType: 'Curse-Bearer Pattern',
    sharedDNA: 'Both involve looking at the curse/curse-bearer lifted up for salvation.',
    christBridge: 'John 3:14 explicitly connects them: "As Moses lifted up the serpent... so must the Son of Man be lifted up."',
    explanation: 'The serpent (symbol of curse) lifted up for salvation seems opposite to Christ—until you realize Jesus BECAME the curse.'
  },
  {
    id: 'sandal-redemption',
    verseA: {
      reference: 'Ruth 4:7',
      text: 'Now this was the custom in former times in Israel concerning redeeming and exchanging: to confirm a transaction, the one drew off his sandal and gave it to the other.'
    },
    verseB: {
      reference: 'John 1:27',
      text: 'He who comes after me, the strap of whose sandal I am not worthy to untie.'
    },
    relationship: 'distant',
    connectionType: 'Redemption Rights Symbol',
    sharedDNA: 'Sandal represents authority to redeem in both—transferred in Ruth, claimed by Christ.',
    christBridge: 'John declares unworthiness to even touch Christ\'s sandal because JESUS holds all redemption rights.',
    explanation: 'The sandal in Ruth transfers redemption rights. John\'s statement declares Christ holds those rights absolutely.'
  },
  {
    id: 'two-sticks-cross',
    verseA: {
      reference: '1 Kings 17:12',
      text: 'She said, "As the LORD your God lives, I have nothing... only a handful of flour... and behold, I am gathering a couple of sticks."'
    },
    verseB: {
      reference: 'Deuteronomy 21:23',
      text: 'Cursed is everyone who is hanged on a tree.'
    },
    relationship: 'distant',
    connectionType: 'Cross Symbol',
    sharedDNA: 'Two sticks/tree—place of death that becomes place of life.',
    christBridge: 'The widow\'s two sticks form a cross shape; she prepares for death but Elijah brings resurrection. The curse-tree becomes life-tree.',
    explanation: 'Subtle typology: two sticks (cross shape) + preparation for death + resurrection life from the prophet. Hidden cross preview.'
  },
  {
    id: 'abraham-moriah-david-threshing',
    verseA: {
      reference: 'Genesis 22:2',
      text: 'Take your son, your only son Isaac, whom you love, and go to the land of Moriah, and offer him there.'
    },
    verseB: {
      reference: '2 Chronicles 3:1',
      text: 'Then Solomon began to build the house of the LORD in Jerusalem on Mount Moriah, where the LORD had appeared to David.'
    },
    relationship: 'distant',
    connectionType: 'Location Significance',
    sharedDNA: 'Moriah—where substitute was provided and where sacrifice continues.',
    christBridge: 'Abraham offered Isaac on Moriah; the temple (sacrifice system) was built on Moriah; Jesus was crucified on Moriah (Golgotha).',
    explanation: 'The mountain of substitute sacrifice becomes the temple mount—same place, same purpose, pointing to ultimate sacrifice.'
  },
  {
    id: 'firstborn-redemption',
    verseA: {
      reference: 'Exodus 13:13',
      text: 'Every firstborn of a donkey you shall redeem with a lamb, or if you will not redeem it you shall break its neck.'
    },
    verseB: {
      reference: 'Romans 8:29',
      text: 'For those whom he foreknew he also predestined to be conformed to the image of his Son, in order that he might be the firstborn among many brothers.'
    },
    relationship: 'distant',
    connectionType: 'Firstborn Pattern',
    sharedDNA: 'Firstborn must be redeemed—by lamb or by Christ.',
    christBridge: 'Christ is THE firstborn who was NOT redeemed—He IS the Redeemer. Through Him, we become "many brothers."',
    explanation: 'Every firstborn needed redemption; Jesus IS the redeeming Lamb. We\'re adopted into His firstborn status.'
  },
  {
    id: 'dry-bones-resurrection',
    verseA: {
      reference: 'Ezekiel 37:3',
      text: 'Son of man, can these bones live?'
    },
    verseB: {
      reference: 'John 11:43-44',
      text: 'Lazarus, come out. The man who had died came out, his hands and feet bound.'
    },
    relationship: 'distant',
    connectionType: 'Resurrection Power',
    sharedDNA: 'Both ask/answer the question: Can the dead live? Both show God\'s power over death.',
    christBridge: 'Ezekiel sees vision of resurrection; Jesus PERFORMS resurrection. He doesn\'t just prophesy life—He IS the Resurrection.',
    explanation: 'Ezekiel\'s vision of resurrection power finds demonstration in Jesus raising Lazarus. Same power, now incarnate.'
  },
  {
    id: 'creation-new-creation',
    verseA: {
      reference: 'Genesis 1:2',
      text: 'The Spirit of God was hovering over the face of the waters.'
    },
    verseB: {
      reference: '2 Corinthians 5:17',
      text: 'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.'
    },
    relationship: 'distant',
    connectionType: 'Creation Pattern',
    sharedDNA: 'Both involve the Spirit creating something new from chaos/void.',
    christBridge: 'The Spirit who hovered over creation hovers over believers, making them new creations IN Christ.',
    explanation: 'Genesis 1 creation and 2 Corinthians 5 new creation—same Spirit, same creative power, now applied to hearts.'
  },
  {
    id: 'scarlet-thread',
    verseA: {
      reference: 'Joshua 2:18',
      text: 'When we come into the land, you shall tie this scarlet cord in the window.'
    },
    verseB: {
      reference: 'Hebrews 9:22',
      text: 'Without the shedding of blood there is no forgiveness of sins.'
    },
    relationship: 'distant',
    connectionType: 'Blood/Salvation Symbol',
    sharedDNA: 'Both connect scarlet/blood with salvation—Rahab\'s cord and redemption theology.',
    christBridge: 'Rahab\'s scarlet cord (recalling Passover blood) saved her household; Christ\'s blood saves all who trust.',
    explanation: 'The scarlet cord echoes Passover blood on doorposts. Distant in text but close in meaning—blood-marked salvation.'
  }
];

// Verse pairs for practice (without solutions - for training)
export const practiceVersePairs = [
  { verseA: 'Genesis 1:1', verseB: 'John 1:1', hint: 'Beginning, Word, Creation' },
  { verseA: 'Psalm 22:1', verseB: 'Matthew 27:46', hint: 'Cry of abandonment' },
  { verseA: 'Micah 5:2', verseB: 'Matthew 2:6', hint: 'Bethlehem birthplace' },
  { verseA: 'Isaiah 7:14', verseB: 'Matthew 1:23', hint: 'Virgin birth' },
  { verseA: 'Zechariah 9:9', verseB: 'Matthew 21:5', hint: 'King on donkey' },
  { verseA: 'Psalm 118:22', verseB: '1 Peter 2:7', hint: 'Rejected stone' },
  { verseA: 'Hosea 11:1', verseB: 'Matthew 2:15', hint: 'Out of Egypt' },
  { verseA: 'Malachi 3:1', verseB: 'Mark 1:2', hint: 'Messenger prepares' },
  { verseA: 'Proverbs 3:5-6', verseB: 'Philippians 4:6-7', hint: 'Trust/peace' },
  { verseA: 'Deuteronomy 6:4', verseB: 'Mark 12:29', hint: 'Shema' },
  { verseA: 'Leviticus 17:11', verseB: 'Romans 3:25', hint: 'Blood atonement' },
  { verseA: 'Isaiah 40:3', verseB: 'Luke 3:4', hint: 'Voice in wilderness' }
];

// Helper functions
export const getByRelationship = (relationship: RelationshipType) => {
  return bibleFreestyleLibrary.filter(v => v.relationship === relationship);
};

export const searchConnections = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return bibleFreestyleLibrary.filter(v =>
    v.verseA.reference.toLowerCase().includes(lowerQuery) ||
    v.verseB.reference.toLowerCase().includes(lowerQuery) ||
    v.verseA.text.toLowerCase().includes(lowerQuery) ||
    v.verseB.text.toLowerCase().includes(lowerQuery) ||
    v.sharedDNA.toLowerCase().includes(lowerQuery)
  );
};

export const getRandomConnection = () => {
  return bibleFreestyleLibrary[Math.floor(Math.random() * bibleFreestyleLibrary.length)];
};

export const getRandomPracticePair = () => {
  return practiceVersePairs[Math.floor(Math.random() * practiceVersePairs.length)];
};

// Relationship type descriptions
export const relationshipDescriptions: Record<RelationshipType, { name: string; description: string }> = {
  siblings: {
    name: 'Siblings',
    description: 'Nearly identical concept, direct parallels, one quoting or fulfilling the other'
  },
  cousins: {
    name: 'Cousins',
    description: 'Shared theme from different angles, complementary truths'
  },
  distant: {
    name: 'Distant Relatives',
    description: 'Connected through patterns, typology, or Christ-centered threads'
  }
};
