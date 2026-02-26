// ─── AATS Training Data: New Age ──────────────────────────────────────────────
// Apologetics Avatar Training System — The New Ager avatar
// SDA counter-apologetics curriculum for engaging New Age spirituality

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ──────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "all-paths-lead-to-god",
    title: "All Paths Lead to God",
    description:
      "Every religion is a different route up the same mountain; no single faith can claim exclusive truth because the divine is too vast to be contained in one tradition.",
  },
  {
    id: "consciousness-evolution",
    title: "Consciousness / Spiritual Evolution",
    description:
      "Humanity is undergoing a collective awakening to higher consciousness; the goal of existence is to evolve spiritually beyond the ego and realize our inherent divinity.",
  },
  {
    id: "nde-afterlife",
    title: "NDE / Afterlife Experiences",
    description:
      "Near-death experiences prove that the soul survives bodily death, that heaven is universally welcoming, and that there is no judgment — only unconditional love and light.",
  },
  {
    id: "reincarnation",
    title: "Reincarnation",
    description:
      "The soul cycles through many lifetimes to learn lessons and accumulate karma; physical death is merely a doorway to the next incarnation on the journey toward enlightenment.",
  },
  {
    id: "crystal-energy-healing",
    title: "Crystal / Energy Healing",
    description:
      "Crystals, chakras, and energy fields channel universal life force that can heal physical and spiritual ailments; tapping into these vibrations aligns a person with the divine frequency.",
  },
];

// ── Steelman Arguments ────────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "newage-steel-1",
    title: "All Religions Point to the Same God",
    argument:
      "Every major religion describes encounters with a transcendent reality — the Tao, Brahman, Allah, Yahweh, the Great Spirit. These are simply different cultural lenses on the same infinite divine source. It would be arrogant for any single tradition to claim exclusive access to ultimate truth when the divine is, by definition, beyond the capacity of any finite human system to fully comprehend. The mystics of every religion — Sufi, Kabbalist, Christian contemplative, Hindu sage — report strikingly similar experiences of union with the divine, suggesting a common source behind all paths.",
    hiddenAssumptions: [
      "Surface similarities between religions prove they share the same underlying reality, while ignoring fundamental contradictions in their core truth claims.",
      "All religious experiences are equally valid revelations of truth — subjective experience is elevated above objective doctrine.",
      "Exclusivity is inherently arrogant rather than a logical necessity when competing truth claims contradict one another.",
      "God has not clearly revealed Himself in any particular way, so all attempts to know Him are equally approximate.",
    ],
    sdaResponse:
      "The claim that all paths lead to God sounds humble, but it actually overrides every religion's own self-understanding. Jesus did not say, 'I am one of many equally valid paths.' He said, 'I am the way, the truth, and the life. No one comes to the Father except through Me' (John 14:6). Islam, Buddhism, Christianity, and Hinduism make mutually exclusive claims about God's nature, humanity's problem, and the path to salvation. They cannot all be true simultaneously — that would violate the law of non-contradiction. The mystic experience argument confuses subjective phenomenology with objective reality; similar feelings do not prove identical sources. SDAs affirm that God has clearly revealed Himself in Scripture and supremely in Christ (Hebrews 1:1-2), and that the test for truth is 'to the law and to the testimony' (Isaiah 8:20), not the breadth of human religious experience.",
  },
  {
    id: "newage-steel-2",
    title: "Humanity Is Evolving Toward Higher Consciousness",
    argument:
      "Just as biological evolution moved life from simple organisms to complex beings, spiritual evolution is moving humanity from ego-based consciousness to a higher, unified awareness. The great spiritual teachers — Jesus, Buddha, Krishna, Lao Tzu — were forerunners who achieved Christ-consciousness or enlightenment, showing what all humans can attain. The current era represents a quantum leap in collective consciousness; more people are awakening to their true divine nature, and this shift will usher in a new age of peace, unity, and spiritual harmony on Earth.",
    hiddenAssumptions: [
      "Spiritual evolution is an upward trajectory — humanity is getting better, not worse — which contradicts the biblical teaching of increasing wickedness before Christ's return.",
      "Jesus was merely an enlightened human teacher, not the unique incarnation of the eternal God.",
      "Divinity is inherent in all humans, waiting to be awakened, rather than a quality belonging exclusively to God.",
      "Human effort and awareness, rather than divine intervention, will bring about a golden age on Earth.",
    ],
    sdaResponse:
      "The Bible presents a starkly different trajectory for humanity. Rather than evolving upward into collective enlightenment, Scripture warns that 'in the last days perilous times will come' and people will be 'lovers of self... having a form of godliness but denying its power' (2 Timothy 3:1-5). The promise of achieving divinity through human effort is the oldest lie in Scripture — 'you will be like God' (Genesis 3:5). Jesus is not one enlightened teacher among many; He is 'the image of the invisible God, the firstborn over all creation,' through whom 'all things were created' (Colossians 1:15-16). The SDA understanding is that genuine transformation comes not from self-actualization but from the indwelling of the Holy Spirit through surrender to Christ (Galatians 2:20). Peace on Earth will come not through a shift in human consciousness but through the literal second coming of Jesus Christ (Revelation 21:1-5).",
  },
  {
    id: "newage-steel-3",
    title: "Near-Death Experiences Prove the Soul Survives Death",
    argument:
      "Thousands of documented NDEs from people of all cultures and religions share common features: leaving the body, traveling through a tunnel, encountering a being of light, experiencing unconditional love, and receiving a life review — but never judgment or condemnation. Blind people have reported accurate visual observations during NDEs. Children too young to have cultural conditioning report the same elements. Neuroscience cannot fully explain these experiences as mere brain chemistry. NDEs demonstrate that consciousness survives bodily death and that the afterlife is a realm of love, not of punishment — proving that traditional doctrines of hell and judgment are fear-based distortions.",
    hiddenAssumptions: [
      "Subjective near-death experiences are reliable windows into objective afterlife reality, rather than neurological phenomena or spiritual deceptions.",
      "The consistency of NDE reports across cultures proves a universal afterlife reality rather than reflecting shared neurobiological processes or demonic deception.",
      "The absence of judgment in most NDE reports means there truly is no divine judgment — the experiences of dying (but not dead) people are taken as the final word on what happens after permanent death.",
      "The 'being of light' encountered in NDEs is God or a benevolent spiritual entity rather than a potential deceptive spirit.",
    ],
    sdaResponse:
      "The Bible is clear: 'The dead know nothing' (Ecclesiastes 9:5). Death is a sleep, not a gateway to continued consciousness (John 11:11-14; Psalm 115:17; Psalm 146:4). NDEs occur in people who are near death, not actually dead — their brains are still functioning, even if minimally. The SDA understanding of the state of the dead explains that humans do not possess an inherently immortal soul that departs at death; rather, 'the dust returns to the ground it came from, and the spirit [breath] returns to God who gave it' (Ecclesiastes 12:7). The 'being of light' experienced in NDEs aligns with Paul's warning that 'Satan himself masquerades as an angel of light' (2 Corinthians 11:14). Furthermore, Deuteronomy 18:10-12 condemns any attempt to communicate with the dead as an abomination. The comforting feelings in NDEs do not validate their theological content — Satan's most effective deceptions are the ones that feel the most loving. Scripture, not experience, is the standard of truth (Isaiah 8:20).",
  },
  {
    id: "newage-steel-4",
    title: "Reincarnation Explains Suffering and Spiritual Growth",
    argument:
      "Reincarnation provides the most satisfying answer to the problem of suffering: the inequalities of this life — why some are born into poverty and others into wealth, why some suffer terribly while others thrive — are the result of karma accumulated in past lives. Each lifetime is a classroom where the soul learns lessons it needs for its spiritual evolution. Death is not final; it is a transition to the next lesson. This framework removes the cruelty of a God who would condemn people to eternal punishment for one short lifetime and replaces it with a compassionate system of gradual growth across many incarnations.",
    hiddenAssumptions: [
      "The soul is inherently immortal and pre-exists the body — it has always existed and will always exist through endless cycles.",
      "Justice operates through an impersonal karmic mechanism rather than through a personal, righteous God.",
      "One lifetime is not sufficient for God to accomplish His purposes in a human being.",
      "Suffering is always deserved — a consequence of past-life actions — which effectively blames victims for their own misfortune.",
    ],
    sdaResponse:
      "The Bible explicitly contradicts reincarnation: 'It is appointed for man to die once, and after that comes judgment' (Hebrews 9:27). There is no cycle of rebirth — there is one life, one death, and one judgment. The SDA understanding of the state of the dead is that the dead 'sleep' unconsciously in the grave until the resurrection (1 Thessalonians 4:13-17; Daniel 12:2). There is no conscious soul migrating between bodies. Furthermore, the karmic framework is deeply cruel despite its gentle appearance: it implies that a child born with a disability or into extreme poverty deserves their suffering because of sins in a past life they cannot remember. The biblical answer to suffering is not karma but the great controversy — a cosmic conflict between Christ and Satan in which God permits suffering temporarily while working all things for the good of those who love Him (Romans 8:28). Salvation is not earned across multiple lifetimes through self-effort; it is a free gift received by faith in one lifetime (Ephesians 2:8-9). The doctrine of reincarnation also opens the door to spiritualism, which God explicitly condemns (Deuteronomy 18:10-12), by promoting the idea that the dead are conscious and communicative.",
  },
  {
    id: "newage-steel-5",
    title: "Crystal and Energy Healing Tap Into Divine Frequencies",
    argument:
      "Everything in the universe vibrates at a specific frequency — this is confirmed by quantum physics. Crystals have highly ordered molecular structures that emit stable energy frequencies. By placing crystals on or near the body, or by channeling universal life force energy (chi, prana, reiki), practitioners can realign the body's energy centers (chakras) and restore physical, emotional, and spiritual health. Ancient civilizations — Egyptians, Mayans, Chinese — all recognized these energy systems. Modern science is only beginning to catch up with what mystics have known for millennia: that consciousness and energy are the fundamental fabric of reality, and healing occurs when we harmonize our personal vibration with the universal frequency.",
    hiddenAssumptions: [
      "Quantum physics validates metaphysical energy claims — a misapplication of quantum mechanics to spiritual practices with no scientific support.",
      "Ancient use of crystals and energy practices validates their spiritual efficacy, rather than reflecting pre-scientific or occult traditions.",
      "A universal 'life force energy' exists that can be channeled by human intention, which is an unfalsifiable spiritual claim dressed in scientific language.",
      "Physical healing through crystals and energy manipulation is a neutral spiritual practice rather than a form of occultism or sorcery.",
    ],
    sdaResponse:
      "Crystal healing, chakra work, reiki, and similar energy practices are rooted not in science but in Eastern mysticism and occultism. Quantum physics does not validate the existence of 'healing vibrations' in crystals — this is a fundamental misrepresentation of physics (quantum effects operate at subatomic scales and do not translate to macroscopic crystal-body interactions). The Bible explicitly condemns sorcery and occult practices: 'Let no one be found among you who... practices divination or sorcery, interprets omens, engages in witchcraft, or casts spells' (Deuteronomy 18:10-12). These practices invite spiritual forces that are not from God. Ellen White warned that Satan would use health reform and healing as avenues for introducing spiritualism into the church. The SDA health message is grounded in the natural laws God built into the body — nutrition, exercise, water, rest, sunlight, temperance, fresh air, and trust in God — not in manipulating invisible energy fields. True healing comes from the God who made the body (Exodus 15:26; James 5:14-15), not from crystals or channeled energy. The end-time deception includes 'spirits of demons, performing signs' (Revelation 16:13-14), and energy healing is a gateway to precisely this kind of spiritualistic deception.",
  },
];

// ── Mind Games ────────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "newage-mg-1",
    name: "Spiritual Elitism",
    description:
      "Framing the SDA as spiritually immature or stuck in a lower vibration for holding to biblical absolutes. The New Ager positions themselves as having transcended the 'narrow' thinking of organized religion, implying that adherence to Scripture is a sign of spiritual infancy rather than faithful conviction.",
    example:
      "\"You're still caught in the old paradigm of fear-based religion. When you evolve spiritually, you'll see that God is beyond your little book. I used to think like you before my awakening.\" This positions the New Ager as having graduated beyond the Bible, making the SDA feel backward for still relying on Scripture.",
    detectionTip:
      "When someone frames your biblical convictions as 'lower consciousness' or 'unevolved,' recognize this as a form of spiritual pride disguised as humility. The Bible warns against those who are 'always learning and never able to arrive at a knowledge of the truth' (2 Timothy 3:7). Ask: 'By what standard do you measure spiritual maturity? If it's subjective experience, how do you distinguish genuine growth from self-deception?' True spiritual maturity is measured by conformity to Christ's character, not by transcending Scripture.",
  },
  {
    id: "newage-mg-2",
    name: "Love-Bombing and Toxic Positivity",
    description:
      "Using excessive language of love, light, and positivity to shut down any critique of New Age beliefs. Any challenge to their position is reframed as 'negative energy,' 'judgment,' or 'fear-based thinking,' making it socially impossible to disagree without appearing unloving.",
    example:
      "\"I just feel so much love and light when I meditate with my crystals. Why would you want to bring negativity into this beautiful space? Your God seems so angry and judgmental. My spirituality is about love, not fear.\" This weaponizes the concept of love to make biblical truth claims seem inherently hostile.",
    detectionTip:
      "When 'love' is used to silence all critical evaluation, it has become a manipulation tool rather than a virtue. Biblical love 'rejoices with the truth' (1 Corinthians 13:6), not apart from it. Gently point out: 'I also believe God is love (1 John 4:8), but genuine love tells the truth even when it's uncomfortable. A doctor who loves you will give you a difficult diagnosis, not just tell you everything is fine.' Love without truth is not love — it is sentimentality.",
  },
  {
    id: "newage-mg-3",
    name: "Quantum Mysticism Jargon",
    description:
      "Using scientific-sounding terminology (vibrations, frequencies, quantum fields, energy) to give New Age beliefs a veneer of scientific credibility. This intimidates the SDA who may not have a physics background into thinking these spiritual claims are scientifically validated.",
    example:
      "\"Quantum physics has proven that consciousness creates reality. Your thoughts literally shape the universe at the quantum level. Everything is energy, and when you raise your vibration through meditation and crystals, you align with the source frequency.\" This chains together real physics terms with completely unfounded metaphysical claims.",
    detectionTip:
      "When someone uses scientific language to support spiritual claims, ask for the specific peer-reviewed study that supports their claim. In almost every case, quantum mechanics is being misrepresented. The observer effect in quantum physics refers to measurement instruments affecting subatomic particles, not to human consciousness creating reality. Respond: 'Can you cite the specific physics paper that demonstrates crystals heal through quantum effects? There is a difference between quantum mechanics and quantum mysticism.' Do not be intimidated by jargon you do not understand — the burden of proof is on the one making the scientific claim.",
  },
  {
    id: "newage-mg-4",
    name: "Experiential Trumping",
    description:
      "Elevating personal spiritual experience above any scriptural or logical argument. No matter what evidence or Bible verse you present, the New Ager responds with a personal experience that they treat as irrefutable proof — 'I felt it, so it must be real.'",
    example:
      "\"I appreciate your Bible verses, but I've had a direct experience of the divine. I've left my body during astral projection and communed with beings of pure light. You can quote your book all day, but I've actually experienced what you only read about.\" This places subjective experience above objective revelation.",
    detectionTip:
      "Acknowledge the reality of their experience without validating its interpretation. Say: 'I don't doubt that you experienced something powerful. The question is not whether the experience was real, but what was its source.' The Bible warns that 'Satan himself masquerades as an angel of light' (2 Corinthians 11:14) and that 'the heart is deceitful above all things' (Jeremiah 17:9). Experiences must be tested by Scripture, not the other way around. Even Paul tested his revelatory experiences against the gospel (Galatians 1:8).",
  },
];

// ── Fallacies ─────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "newage-fal-1",
    name: "False Equivalence",
    definition:
      "Treating all religions as essentially identical by cherry-picking superficial similarities while ignoring fundamental and irreconcilable doctrinal differences.",
    example:
      "\"Christianity, Islam, Hinduism, and Buddhism all teach love and compassion — they're basically the same thing expressed in different cultural wrappers.\" This ignores that Christianity teaches salvation by grace through faith in a personal God, Hinduism teaches liberation through self-realization of impersonal Brahman, Buddhism denies the existence of a creator God entirely, and Islam denies the deity of Christ and the Trinity.",
    counterMove:
      "Expose the differences that matter. Ask: 'Is God personal or impersonal? Is Jesus God incarnate, a prophet, or just a teacher? Is salvation a free gift or something earned through karma and reincarnation? Is there one life or many?' These are not minor cultural variations — they are mutually exclusive truth claims. Two contradictory statements cannot both be true (the law of non-contradiction). As Jesus declared, 'I am the way, the truth, and the life. No one comes to the Father except through Me' (John 14:6). Genuine respect for other religions means taking their actual claims seriously, not flattening them into a single homogeneous spirituality.",
  },
  {
    id: "newage-fal-2",
    name: "Appeal to Antiquity",
    definition:
      "Arguing that New Age practices (crystals, energy healing, astrology, chakras) are valid because ancient civilizations used them. Age of a practice does not establish its truth or spiritual legitimacy.",
    example:
      "\"Crystal healing has been practiced by the Egyptians, Mayans, and Native Americans for thousands of years. This ancient wisdom predates your Bible — it can't all be wrong.\" This confuses longevity with validity and ignores that ancient civilizations also practiced human sacrifice, child sacrifice, and divination.",
    counterMove:
      "Point out that antiquity does not equal truth. Human sacrifice, idol worship, and temple prostitution are also ancient practices — their age does not validate them. The Bible itself is ancient and explicitly condemns the occult practices that New Age spirituality recycles (Deuteronomy 18:10-12). Furthermore, many New Age practices are not genuinely ancient — modern crystal healing, chakra systems, and reiki were largely systematized or invented in the 19th and 20th centuries, drawing eclectically from various traditions. Ask: 'If age validates a practice, then the biblical prohibition of sorcery (also thousands of years old) should carry equal or greater weight, since the Bible predates most of the traditions you cite.'",
  },
  {
    id: "newage-fal-3",
    name: "Equivocation on 'Energy'",
    definition:
      "Using the word 'energy' to conflate a measurable physical quantity (as in physics) with an unmeasurable spiritual concept (as in chi, prana, or reiki), thereby smuggling metaphysical claims in under the authority of science.",
    example:
      "\"Everything is energy — Einstein proved that with E=mc². So when I talk about healing energy flowing through crystals and chakras, I'm talking about the same thing physics describes. It's all one unified field of energy.\" This equivocates between 'energy' as a precise scientific term and 'energy' as a vague spiritual metaphor.",
    counterMove:
      "Distinguish the two meanings sharply. In physics, energy is a precisely defined, measurable quantity (kinetic, potential, thermal, electromagnetic, etc.). E=mc² describes the equivalence of mass and energy in nuclear reactions — it says nothing about crystals emitting healing vibrations or chakras channeling life force. No scientific instrument has ever detected 'chi,' 'prana,' or 'reiki energy.' Ask: 'If this energy is real, what units is it measured in? What instrument detects it? Can it be falsified?' The Bible does not need to borrow credibility from physics; it stands on the authority of God Himself (2 Timothy 3:16).",
  },
  {
    id: "newage-fal-4",
    name: "Unfalsifiable Experience Claims",
    definition:
      "Presenting personal spiritual experiences (NDEs, astral projection, channeling, past-life memories) as evidence for New Age beliefs while making them immune to any form of testing or critique.",
    example:
      "\"I've communicated with my spirit guide during deep meditation, and he told me that all souls are on a journey of reincarnation. You can't disprove my experience — I was there and you weren't.\" This makes the claim unfalsifiable: if you challenge it, you're told you lack the spiritual sensitivity to understand; if you accept it, it's treated as proven.",
    counterMove:
      "Acknowledge the sincerity of the experience while insisting on an external standard of evaluation. Say: 'I don't doubt you experienced something. But how do you distinguish a genuine divine encounter from a demonic deception or a neurological event? You need a standard outside yourself.' The Bible provides that standard: 'Test the spirits to see whether they are from God' (1 John 4:1). Any spirit that contradicts Scripture — denying Christ's unique deity, promoting reincarnation, or teaching that all paths lead to God — is not from God, regardless of how the experience felt. Ecclesiastes 9:5 is clear: 'The dead know nothing.' Any supposed communication with the dead is by definition not with the actual dead person (Deuteronomy 18:10-12).",
  },
];

// ── Counter Strategies ────────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "all-paths-lead-to-god",
    title: "The Exclusivity of Christ Against Spiritual Pluralism",
    sdaPosition:
      "SDAs affirm that Jesus Christ is the only way to the Father (John 14:6; Acts 4:12). This is not arrogance but faithfulness to Christ's own words. The claim that all religions lead to the same God fails logically because the world's religions make mutually exclusive truth claims about God's nature, humanity's problem, and the path to salvation. Christianity teaches that God is a personal Trinity who saves by grace; Hinduism teaches that ultimate reality is impersonal Brahman from which the individual soul must be liberated; Buddhism denies a creator God entirely; Islam denies the deity of Christ. These cannot all be simultaneously true. The SDA message is rooted in the three angels' messages of Revelation 14:6-12, which call every nation, tribe, tongue, and people to worship the Creator and reject false systems of worship.",
    keyScriptures: [
      "John 14:6 -- 'I am the way, the truth, and the life. No one comes to the Father except through Me.' Christ's own claim to exclusivity.",
      "Acts 4:12 -- 'There is no other name under heaven given among men by which we must be saved.' Salvation is in Christ alone.",
      "Isaiah 8:20 -- 'To the law and to the testimony! If they do not speak according to this word, it is because there is no light in them.' The biblical test for all spiritual truth claims.",
      "Revelation 14:6-7 -- 'Fear God and give glory to Him, for the hour of His judgment has come; and worship Him who made heaven and earth.' The first angel's message calls all people to worship the Creator, not a generic divine force.",
    ],
    counterArguments: [
      "The 'all paths lead to God' claim is logically self-defeating: it asserts that the exclusive truth claims of Christianity, Islam, Hinduism, and Buddhism are all true — but these claims contradict each other. If Jesus is God (Christianity) and Jesus is not God (Islam, Judaism), both cannot be true. Religious pluralism fails the law of non-contradiction.",
      "The mystical experience argument cherry-picks similarities while ignoring radical differences. Christian mystics experienced union with a personal, triune God; Hindu mystics experienced dissolution into impersonal Brahman; Buddhist meditators experienced the emptiness of self. These are not the same experience described differently — they are fundamentally different experiences of what the practitioners themselves describe as fundamentally different realities.",
      "Jesus was not one enlightened teacher among many — He claimed to be God incarnate (John 8:58; 10:30), accepted worship (Matthew 14:33; John 20:28), and proved His claims by rising from the dead. No other religious founder made these claims and substantiated them with resurrection. C.S. Lewis's trilemma applies: Jesus was either Lord, liar, or lunatic — but He cannot be reduced to merely a 'great spiritual teacher.'",
      "The SDA three angels' messages (Revelation 14:6-12) are a direct counter to spiritual pluralism: they call the whole world to worship the specific Creator God of the Bible, to come out of Babylon (false religious systems), and to keep the commandments of God and the faith of Jesus. This is a call to specificity, not vagueness.",
    ],
    closingStatement:
      "Spiritual pluralism sounds tolerant, but it is intellectually incoherent and ultimately disrespectful to every religion it claims to honor — because it tells each tradition that its distinctive truth claims do not actually matter. Jesus did not say, 'I am one of many paths.' He said, 'I am the way.' The SDA message is not narrow-minded exclusivism; it is faithful proclamation of the gospel to every nation, tongue, and people, inviting all to worship the Creator who loved the world enough to die for it.",
  },
  {
    subjectId: "consciousness-evolution",
    title: "Biblical Anthropology Against the Divinity of Self",
    sdaPosition:
      "SDAs teach that human beings are created in the image of God (Genesis 1:27) but are not themselves divine. The distinction between Creator and creature is fundamental to all biblical theology. The claim that humans can 'awaken' to their inherent divinity recycles the original Edenic temptation: 'You will be like God' (Genesis 3:5). Rather than evolving upward, humanity is in a state of fallen sinfulness that can only be remedied by divine grace through faith in Christ (Romans 3:23; 6:23; Ephesians 2:8-9). The 'Christ consciousness' teaching strips Jesus of His unique deity and reduces Him to a spiritual exemplar — a move the Bible categorically rejects.",
    keyScriptures: [
      "Genesis 3:5 -- 'You will be like God, knowing good and evil.' Satan's original temptation is the foundation of New Age self-deification.",
      "Isaiah 14:13-14 -- 'I will make myself like the Most High.' Lucifer's aspiration to divine status is the archetype of spiritual pride.",
      "Romans 3:23 -- 'For all have sinned and fall short of the glory of God.' Humanity's condition requires a Savior, not self-awakening.",
      "Colossians 1:15-17 -- Christ is 'the image of the invisible God, the firstborn over all creation... by Him all things were created.' Jesus alone is divine by nature.",
    ],
    counterArguments: [
      "The 'Christ consciousness' concept is a deceptive redefinition. The Bible does not teach that 'the Christ' is a universal spiritual principle accessible to all. Christ (Christos, 'anointed one') is a title for the specific historical person Jesus of Nazareth, the eternal Son of God incarnate. There is one Christ, not a 'Christ consciousness' achievable by every human (1 Timothy 2:5).",
      "The trajectory of biblical history is not upward evolution but downward degeneration that only Christ can reverse. From Eden's fall (Genesis 3) to the increasing wickedness before the Flood (Genesis 6:5), from Israel's repeated apostasy to Paul's warning of end-time 'lovers of self' (2 Timothy 3:1-5), Scripture portrays humanity as spiraling away from God, not evolving toward Him.",
      "If humans are inherently divine, then sin is an illusion and salvation is unnecessary. But the cross of Christ testifies that sin is devastatingly real and that humanity needed a divine rescue so radical that it cost God His own Son's life (Romans 5:8). A God who dies on a cross to save you is not the same as a universe that merely needs you to 'wake up.'",
      "The SDA understanding of sanctification acknowledges genuine spiritual growth — but this growth is the fruit of the Holy Spirit's work in a surrendered life (Galatians 5:22-23), not the self-powered expansion of inherent human divinity. The difference is between receiving a gift and claiming a birthright.",
    ],
    closingStatement:
      "The promise 'you will be like God' was the first lie ever told on this planet, and it remains the most seductive. New Age consciousness evolution is a sophisticated repackaging of Eden's original temptation. SDAs affirm that humans bear the image of God but are not God. Our hope is not in awakening our inner divinity but in surrendering to the One who is truly divine — Jesus Christ, who became human so that fallen humans could be restored to the image of their Creator.",
  },
  {
    subjectId: "nde-afterlife",
    title: "The State of the Dead Against NDE Theology",
    sdaPosition:
      "SDAs hold the distinctive biblical teaching that death is an unconscious sleep, not a gateway to another realm. The dead 'know nothing' (Ecclesiastes 9:5), their thoughts 'perish' (Psalm 146:4), and they await the resurrection at Christ's return (1 Thessalonians 4:13-17). NDEs, whatever their neurological explanation, cannot be used to construct a theology of the afterlife because the individuals were not actually dead — they were near death. The SDA understanding provides the most effective defense against spiritualism, which the Bible identifies as a satanic deception (Revelation 16:13-14) and explicitly condemns (Deuteronomy 18:10-12).",
    keyScriptures: [
      "Ecclesiastes 9:5 -- 'For the living know that they will die, but the dead know nothing.' The dead are unconscious.",
      "Psalm 146:4 -- 'When their breath departs, they return to the earth; on that very day their plans perish.' Consciousness ceases at death.",
      "1 Thessalonians 4:13-17 -- 'The dead in Christ will rise first.' Resurrection, not disembodied consciousness, is the Christian hope.",
      "2 Corinthians 11:14 -- 'Satan himself masquerades as an angel of light.' Beings of light encountered in NDEs may not be what they appear.",
    ],
    counterArguments: [
      "NDEs occur in people whose brains are still functioning, even if minimally. By definition, a 'near-death' experience is not a 'death' experience. The person was not dead — they were dying. Drawing conclusions about the afterlife from the experiences of still-living brains is a fundamental methodological error.",
      "The Bible describes death as 'sleep' over fifty times (Daniel 12:2; John 11:11-14; Acts 7:60; 1 Corinthians 15:51). Jesus Himself used this metaphor when He said of Lazarus, 'Our friend Lazarus has fallen asleep; but I am going there to wake him up' (John 11:11). If the dead were conscious, this language would be deceptive.",
      "The 'being of light' encountered in NDEs never identifies itself as Jesus Christ specifically, never points people to Scripture, and consistently delivers a message of universal acceptance with no judgment — a message that directly contradicts biblical teaching (Hebrews 9:27; Revelation 20:12-15). This profile perfectly matches Satan disguised as an angel of light (2 Corinthians 11:14).",
      "Revelation 16:13-14 warns of end-time 'spirits of demons performing signs.' The SDA prophetic understanding identifies spiritualism — communication with alleged spirits of the dead — as one of Satan's primary end-time deceptions. NDEs that promote the idea that the dead are conscious and welcoming serve this deceptive agenda perfectly.",
    ],
    closingStatement:
      "NDEs are real experiences, but they are not reliable theology. The Bible — not the subjective experiences of dying brains — is the standard for understanding what happens after death. SDAs have been given a message perfectly suited for this moment in history: the dead sleep in unconscious rest until the resurrection. This truth is the antidote to every form of spiritualism, from Victorian seances to modern NDE theology. 'To the law and to the testimony! If they do not speak according to this word, it is because there is no light in them' (Isaiah 8:20).",
  },
  {
    subjectId: "reincarnation",
    title: "One Life, One Death, One Judgment Against Reincarnation",
    sdaPosition:
      "SDAs affirm the biblical teaching that each person lives once, dies once, and then faces judgment (Hebrews 9:27). There is no cycle of rebirth. The dead sleep unconsciously until the resurrection (Daniel 12:2; 1 Thessalonians 4:16-17). Reincarnation denies the finality of death, the reality of the resurrection, the sufficiency of Christ's atonement, and the justice of God's judgment. It replaces the personal God of Scripture with an impersonal karmic mechanism and transforms salvation from a gift of grace into an achievement of self-effort across countless lifetimes.",
    keyScriptures: [
      "Hebrews 9:27 -- 'It is appointed for man to die once, and after that comes judgment.' One life, one death — no reincarnation.",
      "Ecclesiastes 9:5-6 -- 'The dead know nothing... their love, their hatred, and their envy have already perished.' No conscious soul survives to reincarnate.",
      "Daniel 12:2 -- 'Many of those who sleep in the dust of the earth shall awake, some to everlasting life, and some to shame and everlasting contempt.' Resurrection, not reincarnation.",
      "Deuteronomy 18:10-12 -- 'Let no one be found among you who... consults the dead.' Communication with supposed past-life entities is forbidden.",
    ],
    counterArguments: [
      "Hebrews 9:27 is a direct, unambiguous refutation of reincarnation. The Bible allows no room for multiple deaths and rebirths — it teaches one life, followed by one death, followed by judgment. Any theology that requires reincarnation must contradict this verse.",
      "The karmic framework is morally problematic despite its surface appeal. If suffering is always the result of past-life karma, then every victim deserves their suffering, every child born into poverty chose it before birth, and compassionate intervention actually interferes with karmic justice. This is not a more compassionate theology — it is a theology that blames victims and removes the urgency of justice.",
      "Reincarnation makes Christ's atonement unnecessary. If the soul can purify itself across many lifetimes through accumulated good karma, then the cross was pointless. But the Bible teaches that 'the wages of sin is death' (Romans 6:23) and that only the blood of Christ can atone for sin (Hebrews 9:22). Salvation is 'not by works, so that no one can boast' (Ephesians 2:9).",
      "The doctrine of reincarnation serves as a gateway to spiritualism by teaching that the dead are conscious, that communication with 'past-life' entities is possible, and that spirit guides can be consulted. The Bible condemns all of this as abomination (Deuteronomy 18:10-12). The SDA state-of-the-dead doctrine is the strongest firewall against this deception.",
    ],
    closingStatement:
      "Reincarnation offers the illusion of endless second chances, but it removes the urgency of the gospel and the sufficiency of the cross. The Bible teaches that this one life matters infinitely — it is the arena in which we respond to God's grace and accept or reject the salvation freely offered in Christ. There are no do-overs, no karmic recycling, and no gradual self-improvement across lifetimes. There is one Savior, one sacrifice, one offer of grace — and the time to respond is now. 'Today, if you hear His voice, do not harden your hearts' (Hebrews 3:15).",
  },
  {
    subjectId: "crystal-energy-healing",
    title: "God as Healer Against Occult Energy Practices",
    sdaPosition:
      "SDAs believe in divine healing through prayer and through obedience to the health laws God has built into the natural world. The SDA health message — based on nutrition, exercise, water, sunlight, temperance, fresh air, rest, and trust in God (the 'NEW START' principles) — is grounded in the Creator's design for the human body, not in manipulating invisible energy fields. Crystal healing, reiki, chakra balancing, and similar energy practices are rooted in occultism and Eastern mysticism, not in science or Scripture. God explicitly condemns sorcery and enchantment (Deuteronomy 18:10-12; Revelation 21:8), and these practices, regardless of their intentions, open doors to demonic influence.",
    keyScriptures: [
      "Deuteronomy 18:10-12 -- 'Let no one be found among you who practices divination or sorcery, interprets omens, engages in witchcraft, or casts spells... anyone who does these things is detestable to the LORD.'",
      "Exodus 15:26 -- 'I am the LORD who heals you.' God Himself is the source of genuine healing.",
      "James 5:14-15 -- 'Is anyone among you sick? Let them call the elders of the church to pray over them and anoint them with oil in the name of the Lord.' Biblical healing is through prayer and faith, not energy manipulation.",
      "Revelation 16:13-14 -- 'Spirits of demons, performing signs.' End-time deceptions will include counterfeit healing and miraculous signs.",
    ],
    counterArguments: [
      "No peer-reviewed scientific study has demonstrated that crystals emit healing energy, that chakras are real anatomical or energetic structures, or that reiki produces effects beyond placebo. Systematic reviews and meta-analyses consistently find no evidence for energy healing beyond placebo response and the relaxation effect. The scientific language used to promote these practices (vibrations, frequencies, quantum fields) is pseudoscience — a misapplication of physics terminology.",
      "The historical roots of crystal healing, reiki, and chakra work are in paganism, Hinduism, and occultism — not in neutral 'wellness' culture. Reiki was developed by Mikao Usui as a spiritual practice involving attunement to spirit entities. Chakra theory comes from Hindu and Tantric traditions deeply embedded in a non-biblical worldview. Christians who adopt these practices are importing an occult framework, regardless of whether they rebrand it in Christian language.",
      "The SDA health message provides a robust, evidence-based, God-honoring alternative to New Age healing. Adventist health principles have been validated by extensive epidemiological research (the Adventist Health Studies at Loma Linda University), showing that SDA lifestyle practices lead to measurably longer and healthier lives. This is healing grounded in the Creator's design, not in occult energy manipulation.",
      "Revelation 16:13-14 warns that end-time deceptions will include demonic spirits performing signs. The explosion of interest in energy healing, crystal therapy, and alternative spiritual practices fits precisely the prophetic warning of spiritualism's infiltration in the last days. Ellen White warned that Satan would use the health reform platform to introduce spiritualism; energy healing practices are a primary vector for this deception today.",
    ],
    closingStatement:
      "True healing comes from the God who designed the human body and sustains it by His power. The SDA health message — grounded in natural law, validated by science, and rooted in trust in the Creator — offers everything the New Age promises and more, without opening the door to occult influence. Crystals are beautiful minerals created by God, but they do not heal. Energy fields are real in physics, but 'chi' and 'prana' have no scientific basis. When we are sick, we pray to the God who heals (Exodus 15:26), we call for the elders of the church (James 5:14), and we follow the natural health laws our Creator built into us. We do not channel spirits or manipulate invisible forces — we trust in the visible, tangible, proven principles of God's design.",
  },
];

// ── Modules ───────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  // ────── Module 1: All Paths Lead to God ──────
  {
    id: "newage-mod-1",
    subjectId: "all-paths-lead-to-god",
    title: "All Paths Lead to God: Confronting Spiritual Pluralism",
    doctrineBrief:
      "New Age spirituality teaches that every religion is a different expression of the same underlying divine reality. God (or the Universe, Source, Higher Power) is too vast to be captured by any single tradition, so all traditions capture a partial truth. The metaphor of 'many paths up the same mountain' is central to this worldview. Exclusivist claims — such as Jesus saying 'no one comes to the Father except through Me' (John 14:6) — are reinterpreted as metaphorical or dismissed as later church additions that Jesus never actually said.\n\nThis teaching draws heavily from perennial philosophy (Aldous Huxley), theosophy (Helena Blavatsky), and Hindu Vedanta, which teaches that Brahman manifests through all religions. It appeals to the modern sensibility of tolerance and inclusivity, making any exclusive truth claim seem arrogant and divisive.\n\nFor SDAs, this challenge strikes at the heart of the three angels' messages. Revelation 14:6-7 calls every nation, tribe, tongue, and people to 'worship Him who made heaven and earth' — a specific call to worship the Creator God of the Bible, not a generic spiritual force. The Sabbath commandment, rooted in creation (Exodus 20:8-11), is the ultimate expression of specificity: God asks for a particular day, in a particular way, commemorating a particular act. Spiritual pluralism dissolves all such specificity into a fog of generic spirituality — which is precisely the 'Babylon' of Revelation 14:8.",
    steelmanArguments: [steelmanArguments[0]],
    hiddenAssumptions: [
      "All religions are fundamentally the same at their core, differing only in cultural expression — while in reality they make mutually exclusive claims about God's nature, humanity's problem, and the path to salvation.",
      "Exclusivist truth claims are inherently arrogant rather than logically necessary when competing claims contradict each other.",
      "Mystical experiences of 'unity' in different religions prove a common divine source rather than reflecting shared neurological processes or demonic deception.",
      "God has not definitively revealed Himself in any particular tradition, so all traditions are equally approximate.",
    ],
    mindGames: [mindGames[0], mindGames[1]],
    fallacies: [fallacies[0], fallacies[3]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "new-age",
    debriefPrompt:
      "Reflect on your engagement with spiritual pluralism. Were you able to show that 'all paths lead to God' is logically self-defeating because it denies the exclusive claims every religion makes about itself? Did you present Jesus' exclusive claims with grace and clarity? Could you articulate why the three angels' messages are a direct response to spiritual pluralism? How did you handle the charge of arrogance or narrow-mindedness? What would you strengthen for next time?",
  },
  // ────── Module 2: Consciousness / Spiritual Evolution ──────
  {
    id: "newage-mod-2",
    subjectId: "consciousness-evolution",
    title: "Consciousness Evolution: Confronting the Divinity of Self",
    doctrineBrief:
      "New Age teaching holds that humanity is undergoing a great spiritual awakening — a shift from ego-based, fear-driven consciousness to a higher, love-based, unified awareness. This 'consciousness evolution' is presented as the next stage in human development, following biological evolution. Influential teachers like Eckhart Tolle, Deepak Chopra, and Oprah Winfrey promote the idea that each person carries a 'divine spark' that can be awakened through meditation, mindfulness, and spiritual practice.\n\nA central concept is 'Christ consciousness' — the idea that Jesus achieved a state of awareness available to all humans. On this view, Jesus was not uniquely God incarnate but an enlightened human who realized his divine nature, just as Buddha, Krishna, and other masters did. The goal of the spiritual journey is for each person to awaken to their own Christ consciousness and realize that they are, in essence, God.\n\nThis directly confronts the SDA understanding of the Creator-creature distinction, the reality of sin, the necessity of the cross, and the unique deity of Christ. If humans are inherently divine, then the fall is an illusion, sin is a mistake of perception, and the cross was an unnecessary tragedy rather than the climax of God's redemptive plan. The SDA message insists that humanity's fundamental problem is not ignorance of its own divinity but rebellion against its Creator — and the solution is not self-realization but surrender to Christ.",
    steelmanArguments: [steelmanArguments[1]],
    hiddenAssumptions: [
      "Humanity is on an upward spiritual trajectory rather than in a fallen state requiring divine rescue.",
      "Jesus was an enlightened human who achieved 'Christ consciousness,' not the unique, eternal Son of God.",
      "Divinity is inherent in all humans, waiting to be discovered through spiritual practice.",
      "Human consciousness, rather than divine intervention, will bring about a new age of peace on Earth.",
    ],
    mindGames: [mindGames[0], mindGames[3]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "new-age",
    debriefPrompt:
      "Evaluate your response to consciousness evolution teaching. Were you able to trace the 'you are divine' claim back to the serpent's lie in Genesis 3:5? Did you clearly distinguish between biblical sanctification (being transformed by the Holy Spirit) and New Age self-deification? Could you show that the 'Christ consciousness' concept strips Jesus of His unique deity? How did you balance firmness on doctrine with compassion toward the person? What areas need further study?",
  },
  // ────── Module 3: NDE / Afterlife Experiences ──────
  {
    id: "newage-mod-3",
    subjectId: "nde-afterlife",
    title: "NDEs and Afterlife Experiences: Confronting False Comfort",
    doctrineBrief:
      "Near-death experiences (NDEs) have become a cornerstone of New Age afterlife theology. Bestselling books like 'Proof of Heaven' by Eben Alexander and 'Heaven is for Real' by Todd Burpo have mainstreamed the idea that NDEs provide empirical evidence of life after death. Common NDE elements include out-of-body experiences, traveling through a tunnel, encountering a brilliant light, feeling overwhelming love, meeting deceased relatives, and receiving a 'life review' — but conspicuously absent from most accounts are judgment, accountability, or any specific reference to Jesus Christ as Savior.\n\nFor the New Age movement, NDEs confirm the belief that death is not an ending but a transition, that the soul is inherently immortal, that the afterlife is universally welcoming regardless of one's beliefs or behavior, and that traditional doctrines of judgment and hell are fear-based distortions. Many NDE experiencers report being told by 'beings of light' that all religions are equal and that love is all that matters.\n\nThe SDA position on the state of the dead provides the most powerful biblical response to NDE theology. Because the dead 'know nothing' (Ecclesiastes 9:5), any experience that appears to involve the conscious dead is by definition not what it claims to be. The SDA understanding that death is an unconscious sleep until the resurrection is the ultimate firewall against spiritualism — and NDEs are one of Satan's most effective modern tools for undermining this truth.",
    steelmanArguments: [steelmanArguments[2]],
    hiddenAssumptions: [
      "People who are near death gain reliable insight into what happens after permanent, irreversible death.",
      "The consistency of NDE reports across cultures proves a universal afterlife reality rather than shared neurological processes.",
      "The 'beings of light' encountered in NDEs are benevolent divine entities, not potential agents of deception.",
      "The absence of judgment in NDEs means there truly is no divine judgment — contradicting Hebrews 9:27 and Revelation 20:12.",
    ],
    mindGames: [mindGames[1], mindGames[3]],
    fallacies: [fallacies[3], fallacies[0]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "new-age",
    debriefPrompt:
      "Review your defense of the state of the dead against NDE claims. Were you able to clearly explain that NDEs happen to people who are near death, not actually dead? Could you present Ecclesiastes 9:5 and Psalm 146:4 as definitive statements on the unconscious state of the dead? Did you address the 'being of light' phenomenon with 2 Corinthians 11:14? How did you handle the emotional weight of someone sharing their own NDE or that of a loved one? Were you able to connect NDE theology to the end-time spiritualism warned about in Revelation 16:13-14?",
  },
  // ────── Module 4: Reincarnation ──────
  {
    id: "newage-mod-4",
    subjectId: "reincarnation",
    title: "Reincarnation: Confronting the Cycle of Rebirth",
    doctrineBrief:
      "Reincarnation — the belief that the soul is reborn into successive bodies over many lifetimes — is one of the most widely held New Age beliefs, adopted from Hinduism and Buddhism and blended with Western spirituality. According to this framework, each person has lived many previous lives and will live many more. The circumstances of each life are determined by karma — the moral balance sheet of actions from all previous lives. Suffering in this life is the result of negative karma from past lives; privilege is the reward for past virtue.\n\nReincarnation is appealing because it seems to solve the problem of suffering (inequalities are explained by karma), offers unlimited second chances (no eternal punishment after just one life), and promises eventual spiritual perfection through cumulative growth. It is also closely linked to past-life regression therapy, spirit guides, and channeling — all of which involve communication with entities that claim to have knowledge of past and future incarnations.\n\nFor SDAs, reincarnation contradicts virtually every fundamental biblical doctrine: the state of the dead (the dead are unconscious, not reincarnating), the resurrection (the biblical hope is bodily resurrection, not soul migration), the atonement (if karma saves, the cross is unnecessary), the judgment (Hebrews 9:27 says we die once and then face judgment), and the prohibition of spiritualism (consulting entities about 'past lives' is a form of necromancy condemned in Deuteronomy 18:10-12).",
    steelmanArguments: [steelmanArguments[3]],
    hiddenAssumptions: [
      "The soul is inherently immortal and pre-exists the body — a Platonic assumption, not a biblical one.",
      "Justice operates through impersonal karmic mechanisms rather than through a personal, righteous God.",
      "One lifetime is insufficient for God to accomplish His purposes — implying God needs multiple attempts.",
      "Suffering is always deserved karmic payback, which effectively blames victims for their own misfortune.",
    ],
    mindGames: [mindGames[0], mindGames[3]],
    fallacies: [fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "new-age",
    debriefPrompt:
      "Assess your response to reincarnation. Were you able to present Hebrews 9:27 as a decisive refutation? Did you expose the moral problems with karma (victim-blaming, removing urgency of justice)? Could you show how reincarnation makes the cross unnecessary and therefore contradicts the entire gospel? Did you connect the practice of past-life regression to the biblical prohibition of consulting the dead? How did you handle the emotional appeal of 'unlimited second chances'? What would you sharpen for future encounters?",
  },
  // ────── Module 5: Crystal / Energy Healing ──────
  {
    id: "newage-mod-5",
    subjectId: "crystal-energy-healing",
    title: "Crystal and Energy Healing: Confronting Occult Wellness",
    doctrineBrief:
      "Crystal healing, reiki, chakra balancing, and other forms of 'energy healing' have become mainstream wellness practices, available in spas, yoga studios, hospitals, and even some churches. The core premise is that the human body contains or is surrounded by an energy field (variously called chi, prana, life force, or biofield) that can become blocked or imbalanced, leading to physical, emotional, and spiritual illness. By placing crystals on the body, channeling 'universal life force energy' through the hands (reiki), or manipulating chakra points, practitioners claim to restore energetic balance and promote healing.\n\nThis is typically presented as a neutral, scientific, or at least harmless wellness practice. Quantum physics is frequently invoked to lend credibility. However, the historical roots of these practices are firmly in Hinduism (chakras, prana), Chinese folk religion (chi, meridians), and Japanese spiritualism (reiki). Mikao Usui, the founder of reiki, developed the practice through extended fasting and meditation on a mountain, claiming to receive spiritual 'attunement' — a process that involves opening oneself to spiritual entities.\n\nFor SDAs, this topic is especially significant because of the denomination's strong emphasis on health ministry. The SDA health message — rooted in natural law and the Creator's design — is the God-given alternative to occult healing practices. The enemy's strategy is to counterfeit genuine health principles with spiritualistic alternatives that look similar on the surface but are fundamentally different in their source and spiritual implications. Deuteronomy 18:10-12 condemns sorcery and enchantment in the strongest terms, and Revelation 16:13-14 warns that end-time deceptions will include demonic signs and wonders — a category that includes counterfeit healing.",
    steelmanArguments: [steelmanArguments[4]],
    hiddenAssumptions: [
      "Quantum physics validates the existence of spiritual energy that can be channeled for healing — a fundamental misrepresentation of quantum mechanics.",
      "Ancient use of crystals and energy practices proves their efficacy rather than reflecting pre-scientific or occult worldviews.",
      "A universal 'life force energy' exists and can be manipulated by human intention — an unfalsifiable spiritual claim dressed in scientific language.",
      "These practices are spiritually neutral wellness tools rather than gateways to occult influence.",
    ],
    mindGames: [mindGames[2], mindGames[1]],
    fallacies: [fallacies[1], fallacies[2]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "new-age",
    debriefPrompt:
      "Evaluate your engagement with crystal and energy healing claims. Were you able to distinguish between real physics and quantum mysticism pseudoscience? Did you trace the historical roots of reiki, chakra work, and crystal healing to their occult and Eastern mystical origins? Could you present the SDA health message (NEW START) as a biblically grounded, scientifically validated alternative? Did you apply Deuteronomy 18:10-12 and Revelation 16:13-14 to show that these practices fall under biblical condemnation of sorcery? How did you handle the objection that energy healing is 'just wellness, not religion'? What would you study further?",
  },
];

// ── Export ─────────────────────────────────────────────────────────────────────

export const newAgeTraining: AATSAvatarTraining = {
  avatarId: "new-age",
  avatarName: "The New Ager",
  emoji: "\u{1F52E}", // 🔮
  color: "border-fuchsia-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
