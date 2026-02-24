
-- Expand all 28 Fundamental Belief lessons with 12-25 verses each and Palace principle mappings

-- 1. The Holy Scriptures
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"2 Timothy 3:16-17","why":"All Scripture is God-breathed — the divine origin and authority of the Word"},
  {"reference":"2 Peter 1:20-21","why":"Prophecy came by the Holy Spirit moving men — not private interpretation"},
  {"reference":"Psalm 119:105","why":"The Word as a lamp and light — guidance for every step"},
  {"reference":"Isaiah 40:8","why":"The grass withers, but God''s Word stands forever — permanence of Scripture"},
  {"reference":"John 17:17","why":"Sanctify them through thy truth — the Word is truth itself"},
  {"reference":"Hebrews 4:12","why":"The Word is alive and active, sharper than a two-edged sword — penetrating power"},
  {"reference":"Psalm 12:6-7","why":"The words of the LORD are pure — sevenfold purification, divine preservation"},
  {"reference":"Matthew 4:4","why":"Man shall not live by bread alone — Scripture is spiritual sustenance"},
  {"reference":"Joshua 1:8","why":"Meditate day and night — the method of absorbing the Word"},
  {"reference":"Romans 15:4","why":"Written for our learning — patience, comfort, and hope through Scripture"},
  {"reference":"John 5:39","why":"Search the scriptures; they testify of Christ — the Concentration Room principle"},
  {"reference":"Luke 24:27","why":"Beginning at Moses, Christ expounded Himself in all the Scriptures"},
  {"reference":"Psalm 119:11","why":"Thy word have I hid in mine heart — the Story Room memory principle"},
  {"reference":"Revelation 1:3","why":"Blessed is he that readeth — the promise attached to engaging prophecy"},
  {"reference":"Acts 17:11","why":"The Bereans searched daily — the Investigation Floor model of study"}
]',
pt_map = '{"palace_path":[{"floor":"1st Floor - Furnishing","rooms":["Story Room","Bible Rendered Room","Translation Room"],"principle":"Scripture is the raw material that fills every room in the Palace. Without it, the Palace is empty."},{"floor":"2nd Floor - Investigation","rooms":["Observation Room","Def-Com Room"],"principle":"The Bible must be investigated with detective precision — every word matters."},{"floor":"4th Floor - Next Level","rooms":["Concentration Room"],"principle":"Every text must reveal Christ — John 5:39 is the Concentration Room''s founding verse."}],"cycle":"@Ad","heaven":"All three heavens — Scripture spans from creation to new creation","feast":"Pentecost — the Spirit who inspired the Word also illuminates it"}'
WHERE fundamental_number = 1;

-- 2. The Trinity
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Deuteronomy 6:4","why":"Hear O Israel, the LORD our God is one LORD — divine unity"},
  {"reference":"Matthew 28:19","why":"Baptizing in the name of Father, Son, and Holy Ghost — Trinitarian formula"},
  {"reference":"2 Corinthians 13:14","why":"Grace, love, and communion — the three Persons in benediction"},
  {"reference":"Genesis 1:26","why":"Let US make man — plural language in creation"},
  {"reference":"Isaiah 48:16","why":"The Lord GOD and his Spirit hath sent me — three Persons active"},
  {"reference":"John 14:16-17","why":"The Father sends another Comforter — distinct Persons, unified purpose"},
  {"reference":"John 1:1-3","why":"The Word was with God and was God — the Son''s eternal deity"},
  {"reference":"Acts 5:3-4","why":"Lying to the Holy Ghost is lying to God — the Spirit''s deity"},
  {"reference":"Matthew 3:16-17","why":"Christ baptized, Spirit descending, Father speaking — all three present"},
  {"reference":"John 10:30","why":"I and my Father are one — unity of essence"},
  {"reference":"Romans 8:9-11","why":"Spirit of God, Spirit of Christ, Christ in you — Trinitarian indwelling"},
  {"reference":"1 Peter 1:2","why":"Foreknowledge of Father, sanctification of Spirit, sprinkling of Son"},
  {"reference":"Ephesians 4:4-6","why":"One Spirit, one Lord, one God and Father — unity in diversity"},
  {"reference":"John 15:26","why":"The Spirit proceeds from the Father and testifies of Christ"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Dimensions Room","Concentration Room"],"principle":"The Trinity reveals five dimensions: literal unity, Christ the Son, the Spirit in me, the Church as body, Heaven as eternal fellowship."},{"floor":"6th Floor - Three Heavens","rooms":["Three Heavens Framework"],"principle":"Father plans (1H), Son executes (2H), Spirit applies (3H) — the Trinity maps to the cosmic stages."}],"cycle":"@Ad","heaven":"All three — the Trinity operates across every dispensation","feast":"All feasts — each feast reveals a different Person''s work"}'
WHERE fundamental_number = 2;

-- 3. The Father
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Genesis 1:1","why":"In the beginning God created — the Father as originator of all things"},
  {"reference":"Psalm 139:13-16","why":"Thou hast covered me in my mother''s womb — the Father''s intimate creation"},
  {"reference":"Isaiah 40:28-31","why":"The everlasting God fainteth not — the Father''s inexhaustible power"},
  {"reference":"Revelation 4:11","why":"Thou art worthy, O Lord — the Father on the throne, worthy of worship"},
  {"reference":"Malachi 3:6","why":"I am the LORD, I change not — the Father''s immutability"},
  {"reference":"Psalm 103:13","why":"Like as a father pitieth his children — the Father''s compassion"},
  {"reference":"James 1:17","why":"Every good gift comes from the Father of lights — the source of all blessing"},
  {"reference":"1 John 3:1","why":"Behold what manner of love the Father hath bestowed — adoption into His family"},
  {"reference":"John 3:16","why":"God so loved the world that He gave — the Father''s sacrificial love"},
  {"reference":"Matthew 6:9","why":"Our Father which art in heaven — Jesus teaches us to approach God as Father"},
  {"reference":"Jeremiah 31:3","why":"I have loved thee with an everlasting love — the Father''s eternal commitment"},
  {"reference":"Isaiah 64:8","why":"Thou art our Father; we are the clay — the Father as Potter and Creator"},
  {"reference":"Deuteronomy 32:6","why":"Is not he thy father that hath bought thee? — the Father as Redeemer"},
  {"reference":"Psalm 68:5","why":"A father of the fatherless — the Father''s care for the vulnerable"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Concentration Room","Fruit Room"],"principle":"Every revelation of the Father points to Christ — ''He that hath seen me hath seen the Father'' (John 14:9)."},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Father sits on the throne above the Ark — the Sanctuary reveals His governance."}],"cycle":"@Ad","heaven":"1H — the Father revealed through creation and covenant","feast":"Day of Atonement — the Father presides over final judgment"}'
WHERE fundamental_number = 3;

-- 4. The Son
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"John 1:1-3","why":"In the beginning was the Word — the Son''s eternal pre-existence"},
  {"reference":"John 1:14","why":"The Word was made flesh — the incarnation, God becoming man"},
  {"reference":"Colossians 1:15-17","why":"The image of the invisible God, firstborn of every creature — Christ''s supremacy"},
  {"reference":"Hebrews 1:1-3","why":"The brightness of His glory — the Son is the exact representation of the Father"},
  {"reference":"Philippians 2:5-8","why":"Made himself of no reputation, took the form of a servant — the kenosis"},
  {"reference":"Isaiah 53:3-5","why":"A man of sorrows — the suffering Servant prophecy fulfilled in Christ"},
  {"reference":"John 14:6","why":"I am the way, the truth, and the life — Christ as the only path to the Father"},
  {"reference":"Micah 5:2","why":"His goings forth have been from of old, from everlasting — eternal origin"},
  {"reference":"Matthew 1:23","why":"Emmanuel, God with us — the incarnation''s meaning"},
  {"reference":"Revelation 1:8","why":"I am Alpha and Omega — Christ encompasses all of history"},
  {"reference":"John 8:58","why":"Before Abraham was, I am — Christ claims the divine name"},
  {"reference":"Hebrews 2:14-17","why":"He took part of flesh and blood — why the incarnation was necessary"},
  {"reference":"1 Timothy 2:5","why":"One mediator between God and men — Christ''s unique role"},
  {"reference":"Acts 4:12","why":"Neither is there salvation in any other — exclusivity of Christ''s saving work"},
  {"reference":"Revelation 5:5-6","why":"The Lion and the Lamb — Christ''s dual nature as King and Sacrifice"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Concentration Room","Patterns Room","Parallels Room"],"principle":"Every room leads to Christ. He is the Pattern that repeats through every cycle."},{"floor":"5th Floor - Vision","rooms":["Blue Room","Prophecy Room"],"principle":"Christ fulfills every sanctuary station — altar (cross), laver (cleansing), lampstand (light), bread (sustenance), incense (intercession), ark (law-keeper)."},{"floor":"6th Floor","rooms":["Cyrus-Christ Cycle"],"principle":"@CyC — Christ is the greater Cyrus, the true Deliverer."}],"cycle":"@CyC","heaven":"2H — Christ inaugurates the heavenly sanctuary order","feast":"Passover — Christ is our Passover Lamb (1 Cor 5:7)"}'
WHERE fundamental_number = 4;

-- 5. The Holy Spirit
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"John 14:16-17","why":"Another Comforter who will abide forever — the Spirit as Christ''s replacement on earth"},
  {"reference":"John 16:13","why":"The Spirit of truth will guide you into all truth — the Spirit''s teaching role"},
  {"reference":"Acts 2:1-4","why":"Tongues of fire at Pentecost — the Spirit''s dramatic arrival"},
  {"reference":"Romans 8:14","why":"As many as are led by the Spirit are the sons of God — the Spirit''s guidance"},
  {"reference":"Romans 8:26","why":"The Spirit maketh intercession for us — the Spirit''s prayer ministry"},
  {"reference":"1 Corinthians 12:4-11","why":"Diversities of gifts, same Spirit — the Spirit distributes gifts"},
  {"reference":"Galatians 5:22-23","why":"The fruit of the Spirit — the character transformation the Spirit produces"},
  {"reference":"John 3:5-8","why":"Born of water and of the Spirit — the Spirit''s role in new birth"},
  {"reference":"Ezekiel 37:1-14","why":"The breath of God revives dry bones — the Spirit as life-giver"},
  {"reference":"Joel 2:28-29","why":"I will pour out my spirit upon all flesh — the promise of the latter rain"},
  {"reference":"Acts 1:8","why":"Ye shall receive power — the Spirit empowers for witness"},
  {"reference":"Ephesians 4:30","why":"Grieve not the Holy Spirit — the Spirit is a Person who can be grieved"},
  {"reference":"2 Corinthians 3:17-18","why":"Where the Spirit of the Lord is, there is liberty — transformation into Christ''s image"},
  {"reference":"Genesis 1:2","why":"The Spirit moved upon the face of the waters — active from creation"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Spirit is the Lampstand''s oil — the seven lamps burn by the Spirit''s fuel (Zechariah 4:6)."},{"floor":"6th Floor","rooms":["Spirit Cycle"],"principle":"@Sp — the Spirit Cycle begins at Pentecost and extends through the church age."},{"floor":"7th Floor","rooms":["Fire Room"],"principle":"The Fire Room is where the Spirit burns truth into the heart — conviction, not just information."}],"cycle":"@Sp","heaven":"2H — the Spirit inaugurates the church age after Christ ascends","feast":"Pentecost — the feast literally fulfilled by the Spirit''s outpouring"}'
WHERE fundamental_number = 5;

-- 6. Creation
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Genesis 1:1","why":"In the beginning God created — the foundational declaration"},
  {"reference":"Genesis 1:31","why":"God saw everything He had made, and it was very good — creation''s original perfection"},
  {"reference":"Exodus 20:11","why":"In six days the LORD made heaven and earth — creation linked to the Sabbath command"},
  {"reference":"Psalm 33:6-9","why":"By the word of the LORD were the heavens made — creation by divine speech"},
  {"reference":"Hebrews 11:3","why":"Through faith we understand worlds were framed by God''s word — faith and creation"},
  {"reference":"John 1:1-3","why":"All things were made by Him — Christ as active agent of creation"},
  {"reference":"Colossians 1:16-17","why":"By Him were all things created — Christ sustains what He created"},
  {"reference":"Isaiah 45:12","why":"I have made the earth and created man upon it — God claims personal authorship"},
  {"reference":"Psalm 19:1-4","why":"The heavens declare the glory of God — creation as revelation"},
  {"reference":"Romans 1:20","why":"His invisible things are clearly seen by the things that are made — nature witnesses"},
  {"reference":"Nehemiah 9:6","why":"Thou hast made heaven, the heaven of heavens — the scope of creation"},
  {"reference":"Revelation 4:11","why":"Thou hast created all things, and for thy pleasure they are — creation''s purpose"},
  {"reference":"Genesis 2:7","why":"God formed man of the dust — the intimate, hands-on creation of humanity"},
  {"reference":"Psalm 104:24-30","why":"O LORD, how manifold are thy works — the diversity and wisdom of creation"},
  {"reference":"Isaiah 40:26","why":"Lift up your eyes on high — the stars witness the Creator''s power"}
]',
pt_map = '{"palace_path":[{"floor":"1st Floor - Furnishing","rooms":["Story Room","Imagination Room"],"principle":"Creation is the opening scene of the Bible''s story — the first frame in the 24FPS reel."},{"floor":"3rd Floor - Freestyle","rooms":["Nature Freestyle Room"],"principle":"Every element of nature becomes a sermon — creation is God''s second book (Romans 1:20)."},{"floor":"6th Floor","rooms":["Adamic Cycle"],"principle":"@Ad — Creation opens the Adamic cycle: paradise, fall, promise, exile."}],"cycle":"@Ad","heaven":"1H — the original creation, to be renewed in 3H (new heavens and earth)","feast":"Sabbath — the memorial of creation, the seventh day blessed and sanctified"}'
WHERE fundamental_number = 6;

-- 7. The Nature of Humanity
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Genesis 1:27","why":"God created man in his own image — the imago Dei, humanity''s dignity"},
  {"reference":"Genesis 2:7","why":"The LORD formed man of the dust — body + breath = living soul (holistic nature)"},
  {"reference":"Psalm 8:3-6","why":"What is man that thou art mindful of him? — humanity''s paradox of smallness and glory"},
  {"reference":"Ecclesiastes 12:7","why":"The dust returns to the earth, the spirit to God — the reversal of creation at death"},
  {"reference":"Genesis 3:19","why":"Dust thou art, and unto dust shalt thou return — mortality after the fall"},
  {"reference":"Romans 3:23","why":"All have sinned — universal human fallenness"},
  {"reference":"Romans 5:12","why":"By one man sin entered — Adam''s fall affected all humanity"},
  {"reference":"Jeremiah 17:9","why":"The heart is deceitful above all things — the depth of human corruption"},
  {"reference":"Psalm 51:5","why":"In sin did my mother conceive me — sinful nature from birth"},
  {"reference":"1 Thessalonians 5:23","why":"Spirit, soul, and body — the whole person preserved"},
  {"reference":"1 Corinthians 6:19-20","why":"Your body is the temple of the Holy Ghost — sacredness of the body"},
  {"reference":"Ezekiel 18:4","why":"The soul that sinneth, it shall die — mortality of the soul"},
  {"reference":"Genesis 2:17","why":"In the day thou eatest thereof thou shalt surely die — death as consequence"},
  {"reference":"2 Corinthians 5:17","why":"If any man be in Christ, he is a new creature — restoration of the image"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Dimensions Room","Theme Room"],"principle":"The Great Controversy Wall — humanity''s nature is the battleground where God and Satan contend."},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Laver represents cleansing of human nature — what is fallen must be washed."},{"floor":"6th Floor","rooms":["Adamic Cycle"],"principle":"@Ad — humanity''s fall opens the need for every subsequent cycle of redemption."}],"cycle":"@Ad","heaven":"1H — the fall in Eden is the crisis of the first heaven","feast":"Day of Atonement — the ultimate cleansing of sin''s effects on human nature"}'
WHERE fundamental_number = 7;

-- 8. The Great Controversy
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Revelation 12:7-9","why":"War in heaven — the cosmic origin of the great controversy"},
  {"reference":"Isaiah 14:12-14","why":"How art thou fallen, O Lucifer — Satan''s original rebellion and ambition"},
  {"reference":"Ezekiel 28:12-17","why":"Thou wast perfect till iniquity was found in thee — the mystery of sin''s origin"},
  {"reference":"Genesis 3:1-6","why":"The serpent deceived Eve — the controversy comes to earth"},
  {"reference":"Genesis 3:15","why":"The Seed promise — God''s first declaration of war against evil"},
  {"reference":"Job 1:6-12","why":"Satan challenges God before the heavenly council — the controversy exposed"},
  {"reference":"Zechariah 3:1-5","why":"Satan accusing Joshua the high priest — the controversy over God''s people"},
  {"reference":"Matthew 4:1-11","why":"Christ tempted in the wilderness — the controversy''s decisive battle"},
  {"reference":"John 12:31","why":"Now shall the prince of this world be cast out — the cross as turning point"},
  {"reference":"Ephesians 6:12","why":"We wrestle not against flesh and blood — the spiritual dimension of the war"},
  {"reference":"1 Peter 5:8","why":"Your adversary the devil walketh about — Satan''s ongoing activity"},
  {"reference":"Revelation 12:17","why":"The dragon was wroth with the woman — the final phase of the controversy"},
  {"reference":"Revelation 20:10","why":"The devil was cast into the lake of fire — the controversy''s resolution"},
  {"reference":"Romans 8:37-39","why":"More than conquerors through Him — victory assured in Christ"},
  {"reference":"Nahum 1:9","why":"Affliction shall not rise up the second time — sin will never return"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Theme Room","Patterns Room","Concentration Room"],"principle":"The Great Controversy Wall is the master narrative — every text can be placed on this wall."},{"floor":"5th Floor - Vision","rooms":["Prophecy Room","Three Angels Room"],"principle":"Daniel and Revelation map the controversy across centuries — beasts, kingdoms, and the remnant."},{"floor":"6th Floor","rooms":["All Eight Cycles"],"principle":"Every cycle repeats the controversy pattern: Fall → Covenant → Sanctuary → Enemy → Restoration."}],"cycle":"All cycles","heaven":"Spans all three heavens — from the fall in 1H through 2H''s church struggle to 3H''s final resolution","feast":"Day of Atonement — the final judgment that resolves the controversy"}'
WHERE fundamental_number = 8;

-- 9. Life, Death, and Resurrection of Christ
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"John 1:14","why":"The Word was made flesh — the incarnation as the central event of history"},
  {"reference":"Luke 2:10-11","why":"Unto you is born a Saviour — the announcement of Christ''s birth"},
  {"reference":"Luke 4:18-19","why":"The Spirit of the Lord is upon me — Christ''s ministry mandate"},
  {"reference":"John 3:16","why":"God so loved the world — the gospel in a single verse"},
  {"reference":"Isaiah 53:4-6","why":"He was wounded for our transgressions — the suffering Servant fulfilled"},
  {"reference":"Romans 5:8","why":"While we were yet sinners, Christ died for us — love demonstrated"},
  {"reference":"1 Corinthians 15:3-4","why":"Christ died, was buried, and rose again — the gospel core"},
  {"reference":"Matthew 28:5-6","why":"He is not here: for he is risen — the resurrection declaration"},
  {"reference":"Romans 6:3-4","why":"Buried with him by baptism, raised to walk in newness — participation in His death and life"},
  {"reference":"1 Peter 2:24","why":"Who his own self bare our sins in his own body on the tree — substitutionary atonement"},
  {"reference":"Hebrews 9:22","why":"Without shedding of blood is no remission — the necessity of the cross"},
  {"reference":"John 10:17-18","why":"I lay down my life that I might take it again — Christ''s voluntary sacrifice"},
  {"reference":"Philippians 2:8-11","why":"He humbled himself unto death — the exaltation that follows humiliation"},
  {"reference":"1 Corinthians 15:20-22","why":"Now is Christ risen, the firstfruits — His resurrection guarantees ours"},
  {"reference":"Revelation 1:18","why":"I am he that liveth, and was dead; and, behold, I am alive for evermore — the living Christ"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Concentration Room","Parallels Room"],"principle":"This is the Concentration Room''s ultimate subject — every room leads here."},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Altar of Burnt Offering = the cross. The entire sanctuary points to Christ''s sacrifice and ministry."},{"floor":"7th Floor","rooms":["Fire Room","Meditation Room"],"principle":"Gethsemane and Calvary are the Fire Room''s deepest exercises — truth that must be felt, not just known."}],"cycle":"@CyC","heaven":"2H — Christ''s death, resurrection, and ascension inaugurate the second Day of the Lord","feast":"Passover + Unleavened Bread + Firstfruits — Christ dies at Passover, rests on Sabbath, rises as Firstfruits"}'
WHERE fundamental_number = 9;

-- 10. The Experience of Salvation
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Ephesians 2:8-9","why":"By grace are ye saved through faith — salvation is a gift, not earned"},
  {"reference":"Romans 3:24-26","why":"Justified freely by his grace — justification explained"},
  {"reference":"John 3:3-5","why":"Ye must be born again — the necessity of spiritual rebirth"},
  {"reference":"Romans 5:1","why":"Being justified by faith, we have peace with God — the result of justification"},
  {"reference":"Titus 3:5","why":"Not by works of righteousness but by his mercy he saved us — mercy over merit"},
  {"reference":"2 Corinthians 5:17","why":"If any man be in Christ, he is a new creature — transformation evidence"},
  {"reference":"Romans 8:1","why":"No condemnation for those in Christ Jesus — freedom from guilt"},
  {"reference":"1 John 1:9","why":"If we confess our sins, he is faithful to forgive — the confession-forgiveness cycle"},
  {"reference":"Acts 2:38","why":"Repent and be baptized — the call to response"},
  {"reference":"Romans 6:23","why":"The gift of God is eternal life — salvation as gift"},
  {"reference":"John 6:37","why":"Him that cometh to me I will in no wise cast out — Christ''s open invitation"},
  {"reference":"Philippians 1:6","why":"He which hath begun a good work will perform it — God completes what He starts"},
  {"reference":"Romans 12:1-2","why":"Present your bodies a living sacrifice — sanctification as ongoing response"},
  {"reference":"Hebrews 12:1-2","why":"Looking unto Jesus, the author and finisher of our faith — Christ as both beginning and end of salvation"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Dimensions Room","Fruit Room"],"principle":"Salvation has five dimensions: literal forgiveness, Christ as Savior, personal transformation, church community, eternal hope."},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The entire sanctuary walk IS the experience of salvation: altar (justification), laver (sanctification), holy place (daily walk), most holy (glorification)."}],"cycle":"@CyC","heaven":"2H — the New Covenant order makes salvation accessible through Christ''s heavenly ministry","feast":"Passover — salvation begins with the blood of the Lamb applied by faith"}'
WHERE fundamental_number = 10;

-- 11. Growing in Christ
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"2 Peter 3:18","why":"Grow in grace and in the knowledge of our Lord — the command to grow"},
  {"reference":"Colossians 2:6-7","why":"As ye have received Christ, walk in Him, rooted and built up — walking in faith"},
  {"reference":"Galatians 2:20","why":"I am crucified with Christ — the death of self that enables growth"},
  {"reference":"Ephesians 6:10-18","why":"Put on the whole armour of God — spiritual warfare equipment for growth"},
  {"reference":"Romans 8:37","why":"More than conquerors through Him that loved us — victory in the Christian walk"},
  {"reference":"Philippians 4:13","why":"I can do all things through Christ — strength for every challenge"},
  {"reference":"1 John 5:4","why":"This is the victory that overcometh the world, even our faith — faith as weapon"},
  {"reference":"Psalm 119:9-11","why":"Wherewithal shall a young man cleanse his way? By taking heed to thy word — the Word as growth tool"},
  {"reference":"James 1:2-4","why":"Count it all joy when ye fall into temptations — trials produce maturity"},
  {"reference":"Hebrews 5:12-14","why":"Strong meat belongeth to them that are of full age — growing from milk to meat"},
  {"reference":"Romans 12:1-2","why":"Be ye transformed by the renewing of your mind — transformation process"},
  {"reference":"John 15:4-5","why":"Abide in me — the secret of fruitful growth"},
  {"reference":"1 Thessalonians 5:17","why":"Pray without ceasing — prayer as growth discipline"}
]',
pt_map = '{"palace_path":[{"floor":"3rd Floor - Freestyle","rooms":["Personal Freestyle Room","Nature Freestyle Room"],"principle":"Growth happens when you practice Scripture all day — freestyle connects the Word to every moment."},{"floor":"7th Floor","rooms":["Meditation Room","Fire Room"],"principle":"Growth requires both slow marination (Meditation) and burning conviction (Fire)."},{"floor":"8th Floor","rooms":["Reflexive Mastery"],"principle":"The goal: Christlike character becomes reflexive, not forced."}],"cycle":"@Sp","heaven":"2H — the Spirit cycle powers growth through the church age","feast":"Feast of Weeks (Pentecost) — the Spirit empowers growth"}'
WHERE fundamental_number = 11;

-- 12. The Church
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Matthew 16:18","why":"Upon this rock I will build my church — Christ as founder and builder"},
  {"reference":"Ephesians 1:22-23","why":"The church is his body, the fulness of him — the church as Christ''s body"},
  {"reference":"1 Corinthians 12:12-14","why":"By one Spirit are we all baptized into one body — unity in diversity"},
  {"reference":"Ephesians 2:19-22","why":"Built upon the foundation of the apostles and prophets — the church''s foundation"},
  {"reference":"Acts 2:42-47","why":"They continued in the apostles'' doctrine — the early church model"},
  {"reference":"1 Peter 2:9","why":"A chosen generation, a royal priesthood — the church''s identity and mission"},
  {"reference":"Hebrews 10:25","why":"Not forsaking the assembling of ourselves together — the importance of gathering"},
  {"reference":"Matthew 18:20","why":"Where two or three are gathered in my name — Christ''s presence with the church"},
  {"reference":"Ephesians 4:11-13","why":"He gave some apostles, some prophets — gifts for building up the church"},
  {"reference":"Colossians 1:18","why":"He is the head of the body, the church — Christ''s authority over the church"},
  {"reference":"Revelation 1:20","why":"The seven candlesticks are the seven churches — the church as light-bearer"},
  {"reference":"Acts 20:28","why":"Feed the church of God, purchased with his own blood — the church bought by Christ"},
  {"reference":"Ephesians 5:25-27","why":"Christ loved the church and gave himself for it — the church as bride"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Dimensions Room","Theme Room"],"principle":"The Church dimension — every text has implications for the body of believers."},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The church is the living sanctuary — each member a stone, Christ the cornerstone."}],"cycle":"@Sp","heaven":"2H — the church is the new covenant community","feast":"Pentecost — the church was born at the feast of Pentecost"}'
WHERE fundamental_number = 12;

-- 13. The Remnant and Its Mission
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Revelation 12:17","why":"The remnant which keep the commandments of God and have the testimony of Jesus — the remnant defined"},
  {"reference":"Revelation 14:6-12","why":"The three angels'' messages — the remnant''s specific mission"},
  {"reference":"Revelation 19:10","why":"The testimony of Jesus is the spirit of prophecy — the prophetic gift in the remnant"},
  {"reference":"Isaiah 1:9","why":"Except the LORD had left a very small remnant — God always preserves a faithful few"},
  {"reference":"Romans 9:27","why":"Though the number of Israel be as the sand, a remnant shall be saved — the remnant principle"},
  {"reference":"Revelation 10:11","why":"Thou must prophesy again — the remnant rises after disappointment"},
  {"reference":"Amos 3:7","why":"The Lord GOD will do nothing but he revealeth his secret — prophetic guidance for the remnant"},
  {"reference":"Matthew 24:14","why":"This gospel shall be preached in all the world — the remnant''s global mission"},
  {"reference":"Revelation 14:12","why":"Here is the patience of the saints — endurance marks the remnant"},
  {"reference":"Daniel 12:1-3","why":"At that time thy people shall be delivered — the remnant''s deliverance"},
  {"reference":"Malachi 3:16-18","why":"They that feared the LORD spake often one to another — the remnant''s fellowship"},
  {"reference":"2 Timothy 4:7-8","why":"I have fought a good fight — the remnant''s perseverance"},
  {"reference":"Joel 2:32","why":"Whosoever shall call on the name of the LORD shall be delivered — the remnant''s hope"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Three Angels Room","Prophecy Room"],"principle":"The Three Angels'' Room is the capstone — the remnant''s message converges all doctrine into a final gospel appeal."},{"floor":"6th Floor","rooms":["Remnant Cycle"],"principle":"@Re — the eighth and final cycle: apostasy, beast, remnant fidelity, second coming."}],"cycle":"@Re","heaven":"3H — the remnant bridges 2H (church age) into 3H (new creation)","feast":"Day of Atonement — the remnant lives in the antitypical Day of Atonement"}'
WHERE fundamental_number = 13;

-- 14. Unity in the Body of Christ
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"John 17:20-23","why":"That they all may be one — Christ''s high-priestly prayer for unity"},
  {"reference":"Ephesians 4:1-6","why":"One Lord, one faith, one baptism — the sevenfold unity of the church"},
  {"reference":"1 Corinthians 12:12-27","why":"The body is one and hath many members — unity in diversity explained"},
  {"reference":"Galatians 3:28","why":"Neither Jew nor Greek, bond nor free — equality in Christ"},
  {"reference":"Philippians 2:1-4","why":"Be likeminded, having the same love — the attitude that produces unity"},
  {"reference":"Colossians 3:14","why":"Above all put on charity, which is the bond of perfectness — love as unity''s glue"},
  {"reference":"Psalm 133:1","why":"How good and pleasant for brethren to dwell together in unity — the beauty of harmony"},
  {"reference":"Romans 12:4-5","why":"We being many are one body in Christ — mutual belonging"},
  {"reference":"Acts 4:32","why":"The multitude of believers were of one heart and one soul — early church unity modeled"},
  {"reference":"Ephesians 2:14-16","why":"He is our peace, who hath made both one — Christ breaks down walls"},
  {"reference":"1 Corinthians 1:10","why":"That ye all speak the same thing — Paul''s appeal for unity"},
  {"reference":"Romans 15:5-7","why":"Receive ye one another as Christ received you — practical unity"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Fruit Room","Dimensions Room"],"principle":"Unity is the fruit test — if a teaching produces division instead of love, it fails the Fruit Room."},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Table of Showbread — twelve loaves, one table. Diversity of tribes, unity of bread."}],"cycle":"@Sp","heaven":"2H — the church age challenges unity across cultures and centuries","feast":"Feast of Tabernacles — all Israel gathered together in booths, picture of final unity"}'
WHERE fundamental_number = 14;

-- 15. Baptism
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Matthew 28:19-20","why":"Go ye therefore, and baptize — the Great Commission includes baptism"},
  {"reference":"Acts 2:38","why":"Repent, and be baptized every one of you — baptism follows repentance"},
  {"reference":"Romans 6:3-4","why":"Buried with him by baptism into death — baptism symbolizes death and resurrection"},
  {"reference":"Mark 16:16","why":"He that believeth and is baptized shall be saved — faith + baptism"},
  {"reference":"Acts 8:36-38","why":"Philip and the Ethiopian — baptism by immersion demonstrated"},
  {"reference":"Colossians 2:12","why":"Buried with him in baptism, risen with him through faith — the buried/risen symbolism"},
  {"reference":"Galatians 3:27","why":"As many as have been baptized into Christ have put on Christ — identity change"},
  {"reference":"1 Peter 3:21","why":"Baptism doth also now save us — the answer of a good conscience toward God"},
  {"reference":"John 3:5","why":"Except a man be born of water and of the Spirit — baptism and the new birth"},
  {"reference":"Matthew 3:13-17","why":"Jesus baptized by John — Christ''s example of baptism by immersion"},
  {"reference":"Acts 22:16","why":"Arise, and be baptized, and wash away thy sins — baptism and cleansing"},
  {"reference":"1 Corinthians 10:1-2","why":"All baptized unto Moses in the cloud and in the sea — Old Testament type of baptism"},
  {"reference":"Ephesians 4:5","why":"One Lord, one faith, one baptism — one true mode"},
  {"reference":"Acts 16:33","why":"The Philippian jailer baptized the same hour of the night — urgency of baptism"},
  {"reference":"Titus 3:5","why":"The washing of regeneration — baptism as renewal"}
]',
pt_map = '{"palace_path":[{"floor":"2nd Floor - Investigation","rooms":["Symbols/Types Room"],"principle":"Baptism is a TYPE: Noah''s flood (1 Pet 3:20-21), Red Sea crossing (1 Cor 10:1-2), and the laver — all point to Christ."},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Laver (Bronze Basin) in the sanctuary courtyard = baptism. Priests washed before entering the holy place."},{"floor":"6th Floor","rooms":["Parallels Room"],"principle":"Babel (languages divided) parallels Pentecost (languages united) — baptism marks entry into the Spirit-filled community."}],"cycle":"@CyC","heaven":"2H — baptism marks entrance into the New Covenant community","feast":"Pentecost — 3,000 baptized at Pentecost (Acts 2:41)"}'
WHERE fundamental_number = 15;

-- 16. The Lord's Supper
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"1 Corinthians 11:23-26","why":"This do in remembrance of me — the institution of the Lord''s Supper"},
  {"reference":"Matthew 26:26-28","why":"This is my body, this is my blood — the symbols explained by Christ"},
  {"reference":"John 13:1-17","why":"Jesus washed the disciples'' feet — the ordinance of humility"},
  {"reference":"1 Corinthians 10:16-17","why":"The cup of blessing, the bread which we break — communion and participation"},
  {"reference":"John 6:53-56","why":"Except ye eat the flesh of the Son of man — spiritual nourishment in Christ"},
  {"reference":"Exodus 12:14","why":"This day shall be unto you for a memorial — Passover as the Lord''s Supper''s foundation"},
  {"reference":"Luke 22:19-20","why":"This cup is the new testament in my blood — the new covenant sealed"},
  {"reference":"1 Corinthians 11:27-29","why":"Let a man examine himself — self-examination before communion"},
  {"reference":"Acts 2:42","why":"They continued in breaking of bread — early church practice"},
  {"reference":"Matthew 26:29","why":"I will not drink henceforth until I drink it new with you — the eschatological hope"},
  {"reference":"John 13:34-35","why":"A new commandment I give unto you — love displayed through foot washing"},
  {"reference":"Revelation 19:9","why":"Blessed are they called unto the marriage supper of the Lamb — the final communion"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Table of Showbread — twelve loaves representing God''s provision and communion. The Lord''s Supper is the New Covenant Showbread."},{"floor":"7th Floor","rooms":["Fire Room","Meditation Room"],"principle":"The Lord''s Supper demands the Fire Room — feeling the weight of Christ''s sacrifice — and the Meditation Room — slow, reverent reflection."}],"cycle":"@CyC","heaven":"2H — the Lord''s Supper sustains the church until Christ returns","feast":"Passover — the Lord''s Supper replaces the Passover meal in the New Covenant"}'
WHERE fundamental_number = 16;

-- 17. Spiritual Gifts and Ministries
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"1 Corinthians 12:4-11","why":"Diversities of gifts, but the same Spirit — the Spirit distributes gifts"},
  {"reference":"Ephesians 4:11-13","why":"Apostles, prophets, evangelists, pastors, teachers — ministry gifts for the church"},
  {"reference":"Romans 12:6-8","why":"Having then gifts differing according to the grace — the variety of gifts"},
  {"reference":"1 Peter 4:10-11","why":"As every man hath received the gift, minister the same — stewardship of gifts"},
  {"reference":"1 Corinthians 12:27-31","why":"Ye are the body of Christ, and members in particular — each member has a function"},
  {"reference":"1 Corinthians 14:1","why":"Follow after charity, and desire spiritual gifts — pursue gifts with love"},
  {"reference":"Acts 6:1-7","why":"Full of the Holy Ghost and wisdom — deacons chosen by their Spirit-filled character"},
  {"reference":"Matthew 25:14-30","why":"The parable of the talents — gifts must be used or lost"},
  {"reference":"1 Timothy 4:14","why":"Neglect not the gift that is in thee — Paul''s charge to Timothy"},
  {"reference":"Joel 2:28-29","why":"I will pour out my spirit — gifts poured upon all, not just leaders"},
  {"reference":"1 Corinthians 13:1-3","why":"Though I speak with tongues of men and of angels, and have not charity — love above gifts"},
  {"reference":"Acts 2:17-18","why":"Your sons and daughters shall prophesy — gifts given without gender restriction"},
  {"reference":"2 Timothy 1:6","why":"Stir up the gift of God which is in thee — gifts require cultivation"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Connect 6 Room","Fruit Room"],"principle":"Gifts must be tested by the Fruit Room — do they produce love, joy, peace? Gifts without fruit are dangerous."},{"floor":"6th Floor","rooms":["Spirit Cycle"],"principle":"@Sp — the Spirit distributes gifts throughout the church age, each generation receiving what it needs."}],"cycle":"@Sp","heaven":"2H — spiritual gifts sustain the church during the heavenly sanctuary age","feast":"Pentecost — the Spirit''s gift-giving launched at Pentecost"}'
WHERE fundamental_number = 17;

-- 18. The Gift of Prophecy
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Revelation 12:17","why":"The testimony of Jesus Christ — the prophetic gift marks the remnant"},
  {"reference":"Revelation 19:10","why":"The testimony of Jesus is the spirit of prophecy — prophecy defined"},
  {"reference":"Amos 3:7","why":"The Lord will do nothing but he revealeth his secret unto his servants the prophets — God''s method"},
  {"reference":"2 Peter 1:19-21","why":"Prophecy came not by the will of man but holy men spake as moved by the Holy Ghost — divine origin"},
  {"reference":"1 Corinthians 14:3","why":"He that prophesieth speaketh unto men to edification, exhortation, comfort — prophecy''s purpose"},
  {"reference":"Joel 2:28-29","why":"Your old men shall dream dreams, your young men shall see visions — the latter day promise"},
  {"reference":"1 Thessalonians 5:20-21","why":"Despise not prophesyings. Prove all things — test, don''t reject"},
  {"reference":"Deuteronomy 18:21-22","why":"If the thing follow not, the prophet hath spoken presumptuously — the truthfulness test"},
  {"reference":"Isaiah 8:20","why":"To the law and to the testimony — the Scripture test for prophets"},
  {"reference":"Matthew 7:15-20","why":"By their fruits ye shall know them — the fruit test for prophets"},
  {"reference":"Numbers 12:6","why":"If there be a prophet among you, I the LORD will make myself known — God communicates through prophets"},
  {"reference":"Ephesians 4:11-14","why":"He gave some prophets — prophecy as Christ''s gift to His church"},
  {"reference":"1 John 4:1","why":"Try the spirits whether they are of God — discernment is essential"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Prophecy Room","Three Angels Room"],"principle":"The Prophecy Room IS this doctrine — prophecy maps the stars of Daniel and Revelation into constellations."},{"floor":"2nd Floor - Investigation","rooms":["Questions Room"],"principle":"The Questions Room tests prophets with intratextual, intertextual, and Phototheological interrogation."}],"cycle":"@Re","heaven":"2H extending to 3H — the prophetic gift guides the church through the end times","feast":"Day of Atonement — prophetic guidance is critical during the antitypical judgment"}'
WHERE fundamental_number = 18;

-- 19. The Law of God
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Exodus 20:1-17","why":"The Ten Commandments — God''s moral law spoken and written by His own finger"},
  {"reference":"Psalm 19:7-11","why":"The law of the LORD is perfect, converting the soul — the law''s beauty and power"},
  {"reference":"Matthew 5:17-18","why":"I am not come to destroy the law but to fulfil — Christ upholds the law"},
  {"reference":"Romans 3:31","why":"Do we then make void the law through faith? God forbid — faith establishes the law"},
  {"reference":"James 2:10-12","why":"Whosoever shall keep the whole law and yet offend in one point is guilty of all — the law''s unity"},
  {"reference":"Romans 7:7","why":"I had not known sin but by the law — the law as mirror revealing sin"},
  {"reference":"1 John 3:4","why":"Sin is the transgression of the law — sin defined by the law"},
  {"reference":"Psalm 40:8","why":"I delight to do thy will; thy law is within my heart — the law internalized"},
  {"reference":"Deuteronomy 6:4-9","why":"These words shall be in thine heart — the law as life guide"},
  {"reference":"Romans 13:8-10","why":"Love is the fulfilling of the law — love and law are not opposites"},
  {"reference":"John 14:15","why":"If ye love me, keep my commandments — obedience as love''s expression"},
  {"reference":"Jeremiah 31:33","why":"I will put my law in their inward parts and write it in their hearts — the new covenant promise"},
  {"reference":"Revelation 14:12","why":"Here are they that keep the commandments of God — the remnant identified by law-keeping"},
  {"reference":"James 1:25","why":"The perfect law of liberty — the law liberates, not enslaves"},
  {"reference":"Ecclesiastes 12:13","why":"Fear God and keep his commandments: for this is the whole duty of man — the law''s comprehensive scope"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Ark of the Covenant contained the Ten Commandments — the law is at the heart of the sanctuary, inside the Most Holy Place."},{"floor":"4th Floor - Next Level","rooms":["Theme Room","Concentration Room"],"principle":"The law reveals Christ''s character — every commandment is a window into who He is."},{"floor":"5th Floor - Vision","rooms":["Three Angels Room"],"principle":"Revelation 14:12 unites the law and faith — the remnant keeps commandments AND has the faith of Jesus."}],"cycle":"@Mo","heaven":"All three — the law is eternal, transcending every dispensation","feast":"Pentecost — the law given at Sinai and the Spirit given at Pentecost connect (same feast day)"}'
WHERE fundamental_number = 19;

-- 20. The Sabbath
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Genesis 2:1-3","why":"God blessed the seventh day and sanctified it — the Sabbath established at creation"},
  {"reference":"Exodus 20:8-11","why":"Remember the sabbath day to keep it holy — the fourth commandment"},
  {"reference":"Mark 2:27-28","why":"The sabbath was made for man — Jesus affirms the Sabbath''s purpose"},
  {"reference":"Isaiah 58:13-14","why":"Call the sabbath a delight — how to experience the Sabbath''s blessing"},
  {"reference":"Luke 4:16","why":"As his custom was, he went into the synagogue on the sabbath day — Jesus kept the Sabbath"},
  {"reference":"Ezekiel 20:12","why":"I gave them my sabbaths to be a sign between me and them — the Sabbath as covenant sign"},
  {"reference":"Hebrews 4:9-10","why":"There remaineth therefore a rest for the people of God — the Sabbath rest continues"},
  {"reference":"Matthew 24:20","why":"Pray that your flight be not on the sabbath — Jesus expected Sabbath observance after His death"},
  {"reference":"Revelation 1:10","why":"I was in the Spirit on the Lord''s day — John worships on the day Christ claimed as Lord"},
  {"reference":"Isaiah 66:22-23","why":"From one sabbath to another shall all flesh come to worship — the Sabbath in the new earth"},
  {"reference":"Acts 13:42-44","why":"The next sabbath day came almost the whole city together — apostolic Sabbath worship"},
  {"reference":"Acts 16:13","why":"On the sabbath we went to the riverside where prayer was wont to be made — Paul keeps the Sabbath"},
  {"reference":"Luke 23:56","why":"They rested the sabbath day according to the commandment — the disciples kept the Sabbath after the cross"},
  {"reference":"Nehemiah 13:15-22","why":"Nehemiah reforms Sabbath keeping — protecting the Sabbath from commercialism"},
  {"reference":"Exodus 31:13-17","why":"It is a sign between me and the children of Israel for ever — the eternal covenant sign"}
]',
pt_map = '{"palace_path":[{"floor":"1st Floor - Furnishing","rooms":["Story Room"],"principle":"The Sabbath story begins in Genesis 2 — the first complete story frame in the Bible after creation."},{"floor":"5th Floor - Vision","rooms":["Blue Room","Three Angels Room"],"principle":"The Sabbath connects to the Altar of Incense (worship) and to the First Angel''s Message: Worship Him that made heaven and earth (Rev 14:7 echoes Exodus 20:11)."},{"floor":"6th Floor","rooms":["All Cycles"],"principle":"The Sabbath persists through every cycle — from @Ad (creation) through @Re (new earth). It is the only institution that spans all eight cycles."}],"cycle":"All cycles","heaven":"All three — the Sabbath existed before sin and will exist after sin is eliminated","feast":"The Sabbath IS the foundational feast — the weekly feast upon which all annual feasts build"}'
WHERE fundamental_number = 20;

-- 21. Stewardship
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Psalm 24:1","why":"The earth is the LORD''s and the fulness thereof — God owns everything"},
  {"reference":"Malachi 3:8-10","why":"Will a man rob God? Bring ye all the tithes — the tithe command and promise"},
  {"reference":"2 Corinthians 9:6-7","why":"God loveth a cheerful giver — the spirit of giving"},
  {"reference":"Matthew 25:14-30","why":"The parable of the talents — stewardship of gifts and resources"},
  {"reference":"Luke 12:48","why":"Unto whomsoever much is given, of him shall much be required — responsibility proportional to blessing"},
  {"reference":"1 Corinthians 6:19-20","why":"Ye are bought with a price — stewardship of the body"},
  {"reference":"Genesis 1:28","why":"Have dominion — stewardship of the earth"},
  {"reference":"Proverbs 3:9-10","why":"Honour the LORD with thy substance — firstfruits giving"},
  {"reference":"Haggai 2:8","why":"The silver is mine, and the gold is mine — God''s ownership of wealth"},
  {"reference":"Luke 16:10-12","why":"He that is faithful in that which is least — faithfulness in small things"},
  {"reference":"Acts 4:32-35","why":"Neither said any that ought of the things which he possessed was his own — radical early church generosity"},
  {"reference":"Deuteronomy 8:18","why":"It is God that giveth thee power to get wealth — all earning ability comes from God"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Fruit Room","Dimensions Room"],"principle":"Stewardship is the Fruit Room test for materialism — does your use of money produce love, generosity, faith?"},{"floor":"5th Floor - Vision","rooms":["Blue Room"],"principle":"The Table of Showbread — God provides bread; we return the tithe. The altar requires sacrifice."}],"cycle":"@Mo","heaven":"2H — stewardship sustains the church''s earthly mission during the heavenly sanctuary age","feast":"Firstfruits — giving the first and best back to God"}'
WHERE fundamental_number = 21;

-- 22. Christian Behavior
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Romans 12:1-2","why":"Present your bodies a living sacrifice — the foundation of Christian behavior"},
  {"reference":"1 Peter 1:15-16","why":"Be ye holy, for I am holy — the standard of conduct"},
  {"reference":"1 Corinthians 10:31","why":"Whether ye eat or drink, do all to the glory of God — behavior encompasses everything"},
  {"reference":"Philippians 4:8","why":"Whatsoever things are true, honest, just, pure — the thought-life filter"},
  {"reference":"1 John 2:15-17","why":"Love not the world — the call to counter-cultural living"},
  {"reference":"Titus 2:11-12","why":"The grace of God teaches us to deny ungodliness — grace produces holiness"},
  {"reference":"Galatians 5:22-25","why":"The fruit of the Spirit — the character marks of Spirit-led living"},
  {"reference":"Matthew 5:13-16","why":"Ye are the salt of the earth, the light of the world — influence through behavior"},
  {"reference":"Colossians 3:1-4","why":"Set your affection on things above — priority reorientation"},
  {"reference":"James 1:27","why":"Pure religion is to visit the fatherless and widows — faith in action"},
  {"reference":"1 Corinthians 6:19-20","why":"Your body is the temple — health as worship"},
  {"reference":"Ephesians 5:1-2","why":"Be ye followers of God as dear children — imitating the Father"},
  {"reference":"2 Corinthians 6:14-18","why":"Come out from among them and be separate — distinctive living"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Fruit Room"],"principle":"Christian behavior IS the Fruit Room — the ultimate test of genuine study. Does it produce Christlike character?"},{"floor":"7th Floor","rooms":["Fire Room","Speed Room"],"principle":"Behavior is forged in the Fire Room (conviction) and tested in the Speed Room (reflexive responses under pressure)."},{"floor":"8th Floor","rooms":["Reflexive Mastery"],"principle":"The 8th Floor goal — Christlike behavior becomes instinctive, not calculated."}],"cycle":"@Sp","heaven":"2H — Christian behavior witnesses to the world during the church age","feast":"Feast of Unleavened Bread — putting away the leaven of sin from daily life"}'
WHERE fundamental_number = 22;

-- 23. Marriage and the Family
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Genesis 2:18-24","why":"It is not good for man to be alone — God institutes marriage at creation"},
  {"reference":"Matthew 19:4-6","why":"What God hath joined together, let not man put asunder — Christ upholds marriage"},
  {"reference":"Ephesians 5:22-33","why":"Husbands love your wives as Christ loved the church — marriage as gospel illustration"},
  {"reference":"Proverbs 31:10-31","why":"Who can find a virtuous woman? — the godly wife described"},
  {"reference":"Malachi 2:14-16","why":"The LORD hateth putting away — God''s view of divorce"},
  {"reference":"Deuteronomy 6:6-7","why":"Teach them diligently unto thy children — parental responsibility"},
  {"reference":"Psalm 127:3-5","why":"Children are an heritage of the LORD — the blessing of family"},
  {"reference":"Ephesians 6:1-4","why":"Children, obey your parents. Fathers, provoke not to wrath — family order"},
  {"reference":"Proverbs 22:6","why":"Train up a child in the way he should go — the promise of faithful parenting"},
  {"reference":"1 Peter 3:1-7","why":"Husbands and wives — mutual respect and spiritual partnership"},
  {"reference":"Colossians 3:18-21","why":"Wives submit, husbands love, children obey — family roles in brief"},
  {"reference":"Hebrews 13:4","why":"Marriage is honourable in all — the dignity of the marriage covenant"},
  {"reference":"Genesis 1:27-28","why":"Male and female created He them — gender and family rooted in creation"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Parallels Room","Patterns Room"],"principle":"Marriage parallels Christ and the church (Eph 5). The family is a micro-sanctuary."},{"floor":"6th Floor","rooms":["Adamic Cycle"],"principle":"@Ad — marriage was established in the first cycle and will be restored in the last."}],"cycle":"@Ad","heaven":"1H — marriage established at creation; 3H — the marriage supper of the Lamb","feast":"Feast of Tabernacles — families gathering together, dwelling with God"}'
WHERE fundamental_number = 23;

-- 24. Christ's Ministry in the Heavenly Sanctuary
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Hebrews 8:1-2","why":"We have such an high priest who is set on the right hand of the throne — Christ''s heavenly ministry"},
  {"reference":"Hebrews 9:11-12","why":"By his own blood he entered in once — Christ''s blood in the heavenly sanctuary"},
  {"reference":"Daniel 8:14","why":"Unto two thousand and three hundred days; then shall the sanctuary be cleansed — the 2300-day prophecy"},
  {"reference":"Hebrews 4:14-16","why":"We have a great high priest — boldness to approach the throne"},
  {"reference":"Revelation 11:19","why":"The temple of God was opened in heaven and there was seen the ark — the heavenly sanctuary revealed"},
  {"reference":"Exodus 25:8-9","why":"Let them make me a sanctuary that I may dwell among them — the earthly pattern of the heavenly"},
  {"reference":"Hebrews 9:23-24","why":"The heavenly things themselves with better sacrifices — the heavenly reality"},
  {"reference":"Leviticus 16:1-34","why":"The Day of Atonement — the type of Christ''s final ministry"},
  {"reference":"Hebrews 7:25","why":"He ever liveth to make intercession — Christ''s ongoing priestly work"},
  {"reference":"1 John 2:1","why":"We have an advocate with the Father — Christ as our defense attorney"},
  {"reference":"Hebrews 10:19-22","why":"Having boldness to enter into the holiest by the blood of Jesus — access granted"},
  {"reference":"Revelation 8:3-4","why":"The angel offered incense with the prayers of the saints — intercession in the heavenly temple"},
  {"reference":"Daniel 7:9-10","why":"The Ancient of days did sit, the judgment was set — the pre-advent judgment"},
  {"reference":"Hebrews 6:19-20","why":"An anchor of the soul, sure and stedfast — Christ within the veil"},
  {"reference":"Zechariah 6:13","why":"He shall be a priest upon his throne — Christ combines kingship and priesthood"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Blue Room","Prophecy Room"],"principle":"The Blue Room IS this doctrine — the sanctuary is the master blueprint of salvation. Every piece of furniture maps to Christ''s work."},{"floor":"6th Floor","rooms":["Three Heavens Framework"],"principle":"The sanctuary spans all three heavens: 1H (earthly tabernacle/temple), 2H (Christ''s heavenly ministry), 3H (God dwelling with man, no temple needed — Rev 21:22)."}],"cycle":"@CyC extending to @Re","heaven":"2H — the heavenly sanctuary IS the second heaven in the PT framework","feast":"Day of Atonement — the antitypical Day of Atonement began in 1844 (Dan 8:14)"}'
WHERE fundamental_number = 24;

-- 25. The Second Coming of Christ
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"John 14:1-3","why":"I will come again and receive you unto myself — Christ''s personal promise"},
  {"reference":"Acts 1:9-11","why":"This same Jesus shall so come in like manner — visible, bodily, literal return"},
  {"reference":"Matthew 24:30-31","why":"They shall see the Son of man coming in the clouds — every eye shall see"},
  {"reference":"Revelation 1:7","why":"Behold he cometh with clouds; and every eye shall see him — the public, visible return"},
  {"reference":"1 Thessalonians 4:16-17","why":"The Lord himself shall descend with a shout — the resurrection of the dead"},
  {"reference":"Matthew 24:36","why":"Of that day and hour knoweth no man — the unknown timing"},
  {"reference":"Matthew 24:42-44","why":"Watch therefore, for ye know not what hour — the call to readiness"},
  {"reference":"Titus 2:13","why":"Looking for that blessed hope — the second coming as the believer''s great hope"},
  {"reference":"2 Peter 3:9-10","why":"The Lord is not slack concerning his promise — why the delay and the coming certainty"},
  {"reference":"James 5:7-8","why":"Be patient unto the coming of the Lord — endurance while waiting"},
  {"reference":"Revelation 22:12","why":"Behold, I come quickly; and my reward is with me — reward at the return"},
  {"reference":"Daniel 2:44","why":"In the days of these kings shall the God of heaven set up a kingdom — the stone kingdom"},
  {"reference":"Matthew 25:31-34","why":"When the Son of man shall come in his glory — separation of sheep and goats"},
  {"reference":"1 Corinthians 15:51-54","why":"We shall all be changed in a moment — the transformation at His coming"},
  {"reference":"Revelation 19:11-16","why":"King of Kings and Lord of Lords — the glorious warrior return"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Prophecy Room","Three Angels Room"],"principle":"The Second Coming is the climax of the Prophecy Room''s telescope — Daniel 2, 7, 8, Revelation 14 all point here."},{"floor":"6th Floor","rooms":["Remnant Cycle","Three Heavens"],"principle":"@Re cycle culmination — the Second Coming transitions from 2H to 3H, from church age to eternal kingdom."},{"floor":"7th Floor","rooms":["Fire Room"],"principle":"The Fire Room should burn with the urgency and hope of Christ''s return."}],"cycle":"@Re","heaven":"3H — the Second Coming is the Day of the Lord that ushers in the literal new heavens and earth","feast":"Feast of Trumpets — the trumpets herald the King''s arrival"}'
WHERE fundamental_number = 25;

-- 26. Death and Resurrection
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Ecclesiastes 9:5-6","why":"The dead know not any thing — the state of the dead"},
  {"reference":"Psalm 146:4","why":"His breath goeth forth, he returneth to his earth; in that very day his thoughts perish — death is unconsciousness"},
  {"reference":"John 11:11-14","why":"Our friend Lazarus sleepeth — Jesus calls death a sleep"},
  {"reference":"1 Thessalonians 4:13-18","why":"Them which sleep in Jesus will God bring with him — the resurrection hope"},
  {"reference":"Job 14:10-12","why":"Man lieth down and riseth not till the heavens be no more — the dead wait for resurrection"},
  {"reference":"Genesis 2:7","why":"God formed man of dust + breath = living soul — the soul is not independently immortal"},
  {"reference":"Ezekiel 18:4","why":"The soul that sinneth, it shall die — the soul is mortal"},
  {"reference":"1 Timothy 6:15-16","why":"Who only hath immortality — God alone is inherently immortal"},
  {"reference":"1 Corinthians 15:51-55","why":"This mortal must put on immortality — immortality is GIVEN at the resurrection, not possessed now"},
  {"reference":"John 5:28-29","why":"All that are in the graves shall hear his voice and come forth — universal resurrection"},
  {"reference":"Revelation 20:6","why":"Blessed is he that hath part in the first resurrection — two resurrections"},
  {"reference":"Daniel 12:2","why":"Many that sleep in the dust shall awake — the Old Testament resurrection promise"},
  {"reference":"John 6:39-40","why":"I will raise him up at the last day — Christ''s personal commitment"},
  {"reference":"Psalm 115:17","why":"The dead praise not the LORD — the dead are inactive"}
]',
pt_map = '{"palace_path":[{"floor":"2nd Floor - Investigation","rooms":["Def-Com Room","Questions Room"],"principle":"Death requires precise definitions — ''soul'' (nephesh), ''spirit'' (ruach) — the Def-Com Room prevents confusion."},{"floor":"4th Floor - Next Level","rooms":["Theme Room"],"principle":"The Great Controversy Wall — Satan''s first lie was ''ye shall not surely die'' (Gen 3:4). The state of the dead is ground zero of the controversy."}],"cycle":"@Ad","heaven":"1H — death entered in the Adamic cycle; 3H — death destroyed in the new creation (Rev 21:4)","feast":"Day of Atonement — the final judgment determines who participates in the resurrection of life"}'
WHERE fundamental_number = 26;

-- 27. The Millennium and the End of Sin
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Revelation 20:1-6","why":"Satan bound for a thousand years — the millennium described"},
  {"reference":"Revelation 20:7-10","why":"Satan loosed, then destroyed — the end of the millennium"},
  {"reference":"Revelation 20:11-15","why":"The great white throne judgment — final judgment of the wicked"},
  {"reference":"John 5:28-29","why":"Two resurrections — the resurrection of life and the resurrection of damnation"},
  {"reference":"1 Thessalonians 4:16-17","why":"The dead in Christ rise first — the first resurrection at the Second Coming"},
  {"reference":"Revelation 21:1-4","why":"A new heaven and a new earth — what follows the millennium"},
  {"reference":"2 Peter 3:10-13","why":"The elements shall melt with fervent heat — the earth cleansed by fire"},
  {"reference":"Nahum 1:9","why":"Affliction shall not rise up the second time — sin''s permanent end"},
  {"reference":"Malachi 4:1-3","why":"The day cometh that shall burn as an oven — the wicked consumed"},
  {"reference":"Isaiah 34:8-10","why":"The Lord hath a day of vengeance — justice executed"},
  {"reference":"Jeremiah 4:23-26","why":"I beheld the earth, and lo, it was without form and void — the desolate earth during the millennium"},
  {"reference":"1 Corinthians 6:2-3","why":"The saints shall judge the world and angels — the saints'' role during the millennium"},
  {"reference":"Revelation 22:3","why":"There shall be no more curse — the curse fully reversed"}
]',
pt_map = '{"palace_path":[{"floor":"5th Floor - Vision","rooms":["Prophecy Room"],"principle":"The millennium is the climactic scene of the Prophecy Room — where all timelines converge and resolve."},{"floor":"6th Floor","rooms":["Remnant Cycle","Three Heavens"],"principle":"@Re culmination → 3H (DoL³/NE³) — the millennium IS the transition between the final Day of the Lord and the New Earth."}],"cycle":"@Re","heaven":"3H — the millennium is part of the transition to the literal new heavens and earth","feast":"Day of Atonement completion — the scapegoat (Azazel) sent into the wilderness, Satan bound"}'
WHERE fundamental_number = 27;

-- 28. The New Earth
UPDATE baptism_lessons SET scripture_pack = '[
  {"reference":"Revelation 21:1-5","why":"I saw a new heaven and a new earth — the climactic vision of Scripture"},
  {"reference":"Revelation 21:3-4","why":"God shall wipe away all tears — the end of suffering, death, and sorrow"},
  {"reference":"Revelation 22:1-5","why":"The tree of life, the river of life — Eden restored and glorified"},
  {"reference":"Isaiah 65:17-25","why":"I create new heavens and a new earth — the Old Testament vision of restoration"},
  {"reference":"2 Peter 3:13","why":"We look for new heavens and a new earth, wherein dwelleth righteousness — the promise we await"},
  {"reference":"Isaiah 11:6-9","why":"The wolf shall dwell with the lamb — the peace of the new creation"},
  {"reference":"1 Corinthians 2:9","why":"Eye hath not seen, nor ear heard — the new earth exceeds imagination"},
  {"reference":"Isaiah 66:22-23","why":"From one sabbath to another shall all flesh come to worship — Sabbath in eternity"},
  {"reference":"Revelation 21:22-27","why":"I saw no temple therein — God''s presence IS the temple; no mediator needed"},
  {"reference":"Revelation 22:3-5","why":"His servants shall serve him, they shall see his face — face-to-face communion"},
  {"reference":"John 14:2-3","why":"In my Father''s house are many mansions — Christ prepares our home"},
  {"reference":"Isaiah 35:1-10","why":"The desert shall rejoice and blossom as the rose — the earth renewed"},
  {"reference":"Revelation 7:16-17","why":"They shall hunger no more — every need met eternally"},
  {"reference":"Romans 8:18-23","why":"The whole creation groaneth and travaileth — creation awaits its liberation"},
  {"reference":"Habakkuk 2:14","why":"The earth shall be filled with the knowledge of the glory of the LORD — the ultimate fulfillment"}
]',
pt_map = '{"palace_path":[{"floor":"4th Floor - Next Level","rooms":["Dimensions Room"],"principle":"The Heaven Dimension — the fifth lens of the Dimensions Room. Every text ultimately points to this eternal reality."},{"floor":"6th Floor","rooms":["Three Heavens"],"principle":"3H (NE³) — the literal New Heavens and New Earth. This is the final destination of the entire Three Heavens framework."},{"floor":"8th Floor","rooms":["Reflexive Mastery"],"principle":"The 8th Floor realized — the palace disappears because you are HOME. No more rooms, no more method — just dwelling with God."}],"cycle":"@Re completed","heaven":"3H (NE³) — the final, literal, eternal new creation","feast":"Feast of Tabernacles completed — God tabernacles with man forever (Rev 21:3)"}'
WHERE fundamental_number = 28;
