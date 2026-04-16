-- Seed 50 Sermon Topics for the Sermon Forge
-- Run this in Supabase SQL Editor after creating the tables

INSERT INTO sermon_topics (slug, title, summary, tags, anchor_scriptures, category, is_featured) VALUES

-- THEMES (15 topics)
('encouragement', 'Encouragement', 'When life weighs heavy and hope feels distant, Scripture offers a wellspring of encouragement. This topic explores how God strengthens His people through trials and points them toward eternal hope.',
 ARRAY['Hope', 'Comfort', 'Strength', 'Trials'],
 ARRAY['2 Corinthians 1:3-7', 'Psalm 23', 'Isaiah 41:10', 'Hebrews 4:14-16'],
 'Theme', true),

('faith', 'Faith', 'Faith is the substance of things hoped for, the evidence of things not seen. Explore what it means to trust God completely and how faith transforms our daily walk.',
 ARRAY['Trust', 'Belief', 'Abraham', 'Hebrews 11'],
 ARRAY['Hebrews 11:1-6', 'Romans 10:17', 'James 2:14-26', 'Mark 11:22-24'],
 'Theme', true),

('forgiveness', 'Forgiveness', 'The cross stands as the ultimate demonstration of forgiveness. This topic examines both receiving God''s forgiveness and extending it to others.',
 ARRAY['Grace', 'Mercy', 'Reconciliation', 'Cross'],
 ARRAY['Matthew 6:14-15', 'Ephesians 4:32', 'Colossians 3:13', 'Psalm 103:12'],
 'Theme', true),

('hope', 'Hope', 'Christian hope is not wishful thinking but confident expectation anchored in God''s promises. Discover how hope sustains believers through every circumstance.',
 ARRAY['Future', 'Promise', 'Anchor', 'Second Coming'],
 ARRAY['Romans 8:24-25', 'Hebrews 6:19', '1 Peter 1:3', 'Titus 2:13'],
 'Theme', true),

('love', 'Love', 'God is love, and His love is the foundation of all Christian ethics. Explore the depths of divine love and its transforming power in human relationships.',
 ARRAY['Agape', 'Relationships', 'God''s Character', '1 John'],
 ARRAY['1 Corinthians 13', '1 John 4:7-21', 'John 3:16', 'Romans 5:8'],
 'Theme', true),

('peace', 'Peace', 'In a world of anxiety and turmoil, Christ offers a peace that surpasses understanding. Learn how to access and maintain divine peace.',
 ARRAY['Rest', 'Anxiety', 'Trust', 'Shalom'],
 ARRAY['Philippians 4:6-7', 'John 14:27', 'Isaiah 26:3', 'Colossians 3:15'],
 'Theme', false),

('joy', 'Joy', 'Joy is not dependent on circumstances but rooted in relationship with God. Discover the difference between happiness and deep, abiding joy.',
 ARRAY['Happiness', 'Fruit of Spirit', 'Rejoice', 'Contentment'],
 ARRAY['Nehemiah 8:10', 'Philippians 4:4', 'Psalm 16:11', 'John 15:11'],
 'Theme', false),

('suffering', 'Suffering', 'Why do the righteous suffer? This profound topic explores theodicy, redemptive suffering, and finding meaning in pain.',
 ARRAY['Trials', 'Job', 'Persecution', 'Growth'],
 ARRAY['Romans 8:18', 'James 1:2-4', '2 Corinthians 4:17', '1 Peter 4:12-19'],
 'Theme', false),

('prayer', 'Prayer', 'Prayer is the breath of the soul, the channel of communication with heaven. Explore the principles, power, and practice of effective prayer.',
 ARRAY['Communication', 'Intercession', 'ACTS', 'Lord''s Prayer'],
 ARRAY['Matthew 6:5-15', 'James 5:16', '1 Thessalonians 5:17', 'Philippians 4:6'],
 'Theme', false),

('obedience', 'Obedience', 'Obedience flows from love, not legalism. Understand the proper relationship between grace, faith, and keeping God''s commandments.',
 ARRAY['Commandments', 'Law', 'Love', 'Discipleship'],
 ARRAY['John 14:15', '1 John 5:3', 'Deuteronomy 6:5-6', 'James 1:22'],
 'Theme', false),

('humility', 'Humility', 'Christ humbled Himself to the cross. Explore how humility opens doors to God''s grace and transforms relationships.',
 ARRAY['Pride', 'Servanthood', 'Philippians 2', 'Meekness'],
 ARRAY['Philippians 2:3-11', 'James 4:6', '1 Peter 5:5-6', 'Micah 6:8'],
 'Theme', false),

('grace', 'Grace', 'Amazing grace—unmerited favor that saves, sustains, and transforms. Explore the depths of God''s grace in salvation and daily living.',
 ARRAY['Salvation', 'Mercy', 'Unmerited', 'Ephesians'],
 ARRAY['Ephesians 2:8-9', 'Romans 5:20-21', '2 Corinthians 12:9', 'Titus 2:11-12'],
 'Theme', false),

('identity-in-christ', 'Identity in Christ', 'Who we are in Christ defines everything. Discover your true identity as a child of God and its implications for daily life.',
 ARRAY['New Creation', 'Adoption', 'Worth', 'Belonging'],
 ARRAY['2 Corinthians 5:17', 'Galatians 2:20', 'Ephesians 1:3-14', '1 Peter 2:9'],
 'Theme', false),

('spiritual-warfare', 'Spiritual Warfare', 'We wrestle not against flesh and blood. Understand the reality of spiritual conflict and how to stand victorious in Christ.',
 ARRAY['Armor of God', 'Satan', 'Victory', 'Ephesians 6'],
 ARRAY['Ephesians 6:10-18', '2 Corinthians 10:3-5', '1 Peter 5:8-9', 'James 4:7'],
 'Theme', false),

('stewardship', 'Stewardship', 'Everything belongs to God; we are managers. Explore faithful stewardship of time, talent, treasure, and the earth.',
 ARRAY['Money', 'Time', 'Talents', 'Tithe'],
 ARRAY['Matthew 25:14-30', '1 Corinthians 4:2', 'Malachi 3:10', 'Luke 16:10-12'],
 'Theme', false),

-- DOCTRINE (10 topics)
('sabbath', 'The Sabbath', 'God''s memorial of creation and sign of sanctification. Explore the meaning, blessing, and end-time significance of the seventh-day Sabbath.',
 ARRAY['Rest', 'Creation', 'Fourth Commandment', 'Mark of God'],
 ARRAY['Genesis 2:1-3', 'Exodus 20:8-11', 'Isaiah 58:13-14', 'Hebrews 4:9-11'],
 'Doctrine', true),

('sanctuary', 'The Sanctuary', 'God''s object lesson of salvation. Trace Christ''s ministry through the heavenly sanctuary and understand the plan of redemption.',
 ARRAY['Tabernacle', 'Christ''s Ministry', 'Atonement', 'Hebrews'],
 ARRAY['Hebrews 8:1-5', 'Hebrews 9:1-28', 'Exodus 25:8-9', 'Daniel 8:14'],
 'Doctrine', true),

('state-of-dead', 'State of the Dead', 'What happens when we die? Examine the biblical teaching on death, the resurrection hope, and common misconceptions.',
 ARRAY['Death', 'Resurrection', 'Soul Sleep', 'Immortality'],
 ARRAY['Ecclesiastes 9:5-6', 'John 11:11-14', '1 Thessalonians 4:13-18', '1 Corinthians 15:51-55'],
 'Doctrine', false),

('health-message', 'Health Message', 'Our bodies are temples of the Holy Spirit. Explore biblical principles of health and their spiritual significance.',
 ARRAY['Temple', 'Diet', 'Lifestyle', 'Holiness'],
 ARRAY['1 Corinthians 6:19-20', '1 Corinthians 10:31', 'Daniel 1:8', '3 John 1:2'],
 'Doctrine', false),

('spirit-of-prophecy', 'Spirit of Prophecy', 'The testimony of Jesus is the spirit of prophecy. Understand the prophetic gift and its role in the remnant church.',
 ARRAY['Ellen White', 'Prophetic Gift', 'Remnant', 'Revelation 12:17'],
 ARRAY['Revelation 12:17', 'Revelation 19:10', '1 Corinthians 12:28', 'Amos 3:7'],
 'Doctrine', false),

('baptism', 'Baptism', 'Buried with Christ and raised to new life. Explore the meaning, mode, and importance of biblical baptism.',
 ARRAY['Immersion', 'New Life', 'Public Confession', 'Romans 6'],
 ARRAY['Romans 6:3-6', 'Matthew 28:19', 'Acts 2:38', 'Colossians 2:12'],
 'Doctrine', false),

('second-coming', 'Second Coming', 'The blessed hope of all believers. Examine the manner, signs, and purpose of Christ''s return.',
 ARRAY['Advent', 'Signs', 'Hope', 'Matthew 24'],
 ARRAY['John 14:1-3', 'Acts 1:11', 'Matthew 24:30-31', '1 Thessalonians 4:16-17'],
 'Doctrine', true),

('judgment', 'The Judgment', 'The hour of His judgment has come. Understand the pre-advent judgment, its purpose, and assurance for believers.',
 ARRAY['Investigative Judgment', '1844', 'Daniel 7', 'Accountability'],
 ARRAY['Daniel 7:9-10', 'Revelation 14:7', 'Ecclesiastes 12:14', '2 Corinthians 5:10'],
 'Doctrine', false),

('great-controversy', 'Great Controversy', 'The cosmic conflict between Christ and Satan. Trace the origin, progress, and ultimate resolution of the war in heaven.',
 ARRAY['Satan', 'Lucifer', 'Cosmic Conflict', 'Isaiah 14'],
 ARRAY['Revelation 12:7-12', 'Isaiah 14:12-15', 'Ezekiel 28:12-19', 'Job 1:6-12'],
 'Doctrine', false),

('remnant-church', 'The Remnant', 'God has always preserved a faithful remnant. Explore the characteristics and mission of God''s end-time people.',
 ARRAY['144000', 'Commandments', 'Testimony of Jesus', 'Revelation 12'],
 ARRAY['Revelation 12:17', 'Revelation 14:12', 'Isaiah 1:9', 'Romans 11:5'],
 'Doctrine', false),

-- PROPHECY (10 topics)
('three-angels-messages', 'Three Angels'' Messages', 'God''s final warning to the world. Unpack the everlasting gospel, Babylon''s fall, and the mark of the beast warning.',
 ARRAY['Revelation 14', 'Everlasting Gospel', 'Babylon', 'Mark of Beast'],
 ARRAY['Revelation 14:6-12', 'Revelation 18:1-4'],
 'Prophecy', true),

('daniel-2', 'Daniel 2: Image of Kingdoms', 'From Babylon to God''s eternal kingdom. Trace the prophetic outline of world history and its culmination.',
 ARRAY['Nebuchadnezzar', 'Statue', 'Kingdoms', 'Stone'],
 ARRAY['Daniel 2:31-45'],
 'Prophecy', false),

('daniel-7', 'Daniel 7: Four Beasts', 'The vision of beasts and the judgment scene. Understand the parallel to Daniel 2 with added detail.',
 ARRAY['Beasts', 'Little Horn', 'Ancient of Days', 'Son of Man'],
 ARRAY['Daniel 7:1-28'],
 'Prophecy', false),

('daniel-8-9', 'Daniel 8-9: 2300 Days', 'The cleansing of the sanctuary and the 70 weeks. Unpack this crucial time prophecy pointing to 1844 and the Messiah.',
 ARRAY['2300 Days', '70 Weeks', 'Sanctuary', '1844'],
 ARRAY['Daniel 8:14', 'Daniel 9:24-27'],
 'Prophecy', false),

('revelation-13', 'Revelation 13: Two Beasts', 'The sea beast and earth beast. Identify these powers and understand the end-time crisis they precipitate.',
 ARRAY['Sea Beast', 'Earth Beast', 'Mark', 'Image'],
 ARRAY['Revelation 13:1-18'],
 'Prophecy', false),

('seals-trumpets', 'Seals and Trumpets', 'The seven seals and seven trumpets of Revelation. Trace church history and God''s judgments through these prophetic sequences.',
 ARRAY['Seven Seals', 'Seven Trumpets', 'Church History', 'Judgments'],
 ARRAY['Revelation 6-9', 'Revelation 8:1-13'],
 'Prophecy', false),

('millennium', 'The Millennium', 'A thousand years with Christ. Understand the pre-millennial return, the millennium in heaven, and final events.',
 ARRAY['1000 Years', 'First Resurrection', 'Second Resurrection', 'New Earth'],
 ARRAY['Revelation 20:1-15', '1 Thessalonians 4:16-17'],
 'Prophecy', false),

('mark-of-beast', 'Mark of the Beast', 'The ultimate test of loyalty. Understand what the mark is, when it comes, and how to be sealed instead.',
 ARRAY['Sunday Law', 'Seal of God', 'Worship', 'Revelation 13'],
 ARRAY['Revelation 13:16-18', 'Revelation 14:9-11', 'Revelation 7:1-4'],
 'Prophecy', false),

('time-of-trouble', 'Time of Trouble', 'Such as never was. Prepare for the final crisis and understand God''s protection of His people.',
 ARRAY['Jacob''s Trouble', 'Seven Last Plagues', 'Deliverance', 'Michael'],
 ARRAY['Daniel 12:1', 'Revelation 16', 'Psalm 91'],
 'Prophecy', false),

('new-earth', 'New Earth', 'The ultimate home of the redeemed. Explore the glorious future God has prepared for those who love Him.',
 ARRAY['Heaven', 'Restoration', 'Eternity', 'No More Death'],
 ARRAY['Revelation 21:1-7', 'Isaiah 65:17-25', '2 Peter 3:13', 'Revelation 22:1-5'],
 'Prophecy', false),

-- OCCASIONS (8 topics)
('new-year', 'New Year', 'A time for reflection and rededication. Explore biblical principles for new beginnings and fresh starts with God.',
 ARRAY['New Beginnings', 'Goals', 'Consecration', 'Time'],
 ARRAY['Lamentations 3:22-23', 'Isaiah 43:18-19', 'Philippians 3:13-14', '2 Corinthians 5:17'],
 'Occasion', false),

('easter-resurrection', 'Resurrection Sunday', 'He is risen! Celebrate the cornerstone of Christian faith—Christ''s victory over death.',
 ARRAY['Resurrection', 'Empty Tomb', 'Victory', 'Hope'],
 ARRAY['1 Corinthians 15:1-20', 'Matthew 28:1-10', 'Romans 6:9', 'John 11:25-26'],
 'Occasion', false),

('mothers-day', 'Mother''s Day', 'Honoring mothers and exploring biblical motherhood. From Eve to Mary, see God''s design for motherhood.',
 ARRAY['Mothers', 'Family', 'Proverbs 31', 'Honor'],
 ARRAY['Proverbs 31:10-31', 'Exodus 20:12', '2 Timothy 1:5', 'Proverbs 22:6'],
 'Occasion', false),

('fathers-day', 'Father''s Day', 'Honoring fathers and understanding God as Father. Explore biblical fatherhood and the Father heart of God.',
 ARRAY['Fathers', 'Family', 'God as Father', 'Leadership'],
 ARRAY['Ephesians 6:4', 'Proverbs 3:11-12', 'Psalm 103:13', 'Malachi 4:6'],
 'Occasion', false),

('thanksgiving', 'Thanksgiving', 'Gratitude as a lifestyle. Discover the transforming power of thankfulness in every circumstance.',
 ARRAY['Gratitude', 'Praise', 'Contentment', 'Blessing'],
 ARRAY['1 Thessalonians 5:18', 'Psalm 100', 'Colossians 3:15-17', 'Philippians 4:6'],
 'Occasion', false),

('christmas-incarnation', 'The Incarnation', 'God became flesh. Marvel at the mystery and meaning of Christ''s birth and what it reveals about God''s character.',
 ARRAY['Birth of Christ', 'Emmanuel', 'Humility', 'Salvation'],
 ARRAY['John 1:14', 'Philippians 2:5-11', 'Luke 2:1-20', 'Isaiah 9:6'],
 'Occasion', false),

('graduation', 'Graduation', 'Transitioning to new chapters. Biblical wisdom for graduates facing life''s next steps.',
 ARRAY['Wisdom', 'Future', 'Purpose', 'Young Adults'],
 ARRAY['Jeremiah 29:11', 'Proverbs 3:5-6', 'Ecclesiastes 12:1', 'Joshua 1:9'],
 'Occasion', false),

('baptism-service', 'Baptism Service', 'Welcoming new believers into the family. A celebration of death to self and resurrection in Christ.',
 ARRAY['New Members', 'Celebration', 'Commitment', 'Family'],
 ARRAY['Romans 6:3-4', 'Galatians 3:27', 'Acts 2:41', 'Matthew 28:19'],
 'Occasion', false),

-- CHRISTIAN LIVING (7 topics)
('marriage', 'Marriage', 'God''s first institution. Explore the biblical foundation for marriage and how it reflects Christ and the church.',
 ARRAY['Family', 'Covenant', 'Ephesians 5', 'Love'],
 ARRAY['Ephesians 5:22-33', 'Genesis 2:24', 'Mark 10:6-9', 'Hebrews 13:4'],
 'Christian Living', false),

('parenting', 'Parenting', 'Training up children in the way they should go. Biblical principles for raising godly children in an ungodly world.',
 ARRAY['Children', 'Discipline', 'Training', 'Deuteronomy 6'],
 ARRAY['Proverbs 22:6', 'Deuteronomy 6:6-9', 'Ephesians 6:4', 'Psalm 127:3'],
 'Christian Living', false),

('work-vocation', 'Work and Vocation', 'Working as unto the Lord. Discover meaning and ministry in your daily work.',
 ARRAY['Career', 'Purpose', 'Excellence', 'Witness'],
 ARRAY['Colossians 3:23-24', 'Ecclesiastes 9:10', '1 Corinthians 10:31', 'Proverbs 12:11'],
 'Christian Living', false),

('evangelism', 'Evangelism', 'Go and make disciples. Explore personal and church evangelism methods rooted in love.',
 ARRAY['Witnessing', 'Great Commission', 'Soul Winning', 'Mission'],
 ARRAY['Matthew 28:18-20', 'Acts 1:8', '1 Peter 3:15', 'Mark 16:15'],
 'Christian Living', false),

('discipleship', 'Discipleship', 'Following Jesus and making followers. The cost and reward of true discipleship.',
 ARRAY['Following Jesus', 'Growth', 'Mentoring', 'Cross'],
 ARRAY['Luke 9:23', 'Matthew 4:19', 'John 8:31-32', '2 Timothy 2:2'],
 'Christian Living', false),

('temptation', 'Overcoming Temptation', 'No temptation has overtaken you except what is common to man. Learn Christ''s method for victory over temptation.',
 ARRAY['Sin', 'Victory', 'Jesus in Wilderness', 'Word of God'],
 ARRAY['1 Corinthians 10:13', 'James 1:12-15', 'Matthew 4:1-11', 'Hebrews 4:15-16'],
 'Christian Living', false),

('anxiety-worry', 'Anxiety and Worry', 'Be anxious for nothing. Biblical strategies for overcoming anxiety and finding peace in Christ.',
 ARRAY['Peace', 'Trust', 'Mental Health', 'Cast Your Cares'],
 ARRAY['Philippians 4:6-7', 'Matthew 6:25-34', '1 Peter 5:7', 'Isaiah 41:10'],
 'Christian Living', true);

-- Verify insertion
SELECT COUNT(*) as total_topics FROM sermon_topics;
