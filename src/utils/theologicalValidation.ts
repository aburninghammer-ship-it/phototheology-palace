/**
 * CRITICAL: Theological Validation Rules
 * 
 * This file enforces hard theological rules that must never be violated
 * anywhere in the application - including Jeeves responses, challenges,
 * games, courses, and any user-generated content.
 * 
 * PHOTOTHEOLOGY DOCTRINAL SPINE — Daniel & Revelation Commentary
 * These are non-negotiables for audio commentary and all teaching content.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates content against hard theological rules
 */
export function validateTheologicalContent(content: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Convert to lowercase for case-insensitive checking
  const lowerContent = content.toLowerCase();

  // Rule 1: Scapegoat must NEVER be identified as Jesus/Christ
  if (lowerContent.includes('scapegoat')) {
    const scapegoatPatterns = [
      /scapegoat.*jesus/i,
      /scapegoat.*christ/i,
      /jesus.*scapegoat/i,
      /christ.*scapegoat/i,
      /scapegoat.*represents.*jesus/i,
      /scapegoat.*represents.*christ/i,
      /scapegoat.*is.*jesus/i,
      /scapegoat.*is.*christ/i,
      /scapegoat.*symbolizes.*jesus/i,
      /scapegoat.*symbolizes.*christ/i,
      /jesus.*is.*scapegoat/i,
      /christ.*is.*scapegoat/i,
    ];

    for (const pattern of scapegoatPatterns) {
      if (pattern.test(content)) {
        errors.push(
          'CRITICAL VIOLATION: The scapegoat must NEVER be identified as Jesus or Christ. ' +
          'The scapegoat (Leviticus 16:8-10, 20-22) represents Azazel/Satan bearing sin AFTER atonement is complete. ' +
          'Christ is the LORD\'s goat (the one slain), NOT the scapegoat (sent away).'
        );
        break;
      }
    }
  }

  // Rule 2: Little horn of Daniel 8 must NEVER be identified as Antiochus
  if (lowerContent.includes('antiochus') && lowerContent.includes('daniel')) {
    const antiochusPatterns = [
      /antiochus.*daniel\s*8/i,
      /daniel\s*8.*antiochus/i,
      /little\s+horn.*antiochus/i,
      /antiochus.*little\s+horn/i,
      /daniel\s*8.*168\s*bc/i,
      /168\s*bc.*daniel\s*8/i,
    ];

    for (const pattern of antiochusPatterns) {
      if (pattern.test(content)) {
        errors.push(
          'CRITICAL VIOLATION: The little horn of Daniel 8 must NEVER be identified as Antiochus Epiphanes. ' +
          'The prophetic pattern shows escalation: Babylon (great) → Medo-Persia (greater) → Greece (very great) → Next power (exceeding great). ' +
          'Antiochus was a minor Seleucid king who paid tribute to Rome and died in obscurity. He never "waxed exceeding great." ' +
          'The little horn is Rome (Pagan → Papal), which crucified Christ, replaced His priesthood, attacked the sanctuary, and extends to the time of the end. ' +
          'Jesus placed Daniel\'s abomination AFTER AD 70, not in 165 BC (Matt 24:15). The 2,300 days point to 1844, not the Maccabean period.'
        );
        break;
      }
    }
  }

  // Rule 2b: "Out of one of them" must be properly explained as the Greco-Roman world
  if (lowerContent.includes('daniel 8') && 
      (lowerContent.includes('out of one') || lowerContent.includes('little horn'))) {
    const hasWindsExplanation = lowerContent.includes('four winds') || 
                                 lowerContent.includes('compass') ||
                                 lowerContent.includes('western wind');
    const hasGrecoRoman = lowerContent.includes('greco-roman') || 
                         lowerContent.includes('greco roman');
    
    if (!hasWindsExplanation && !hasGrecoRoman && content.length > 200) {
      warnings.push(
        'WARNING: When discussing "out of one of them" in Daniel 8:9, clarify that the Hebrew grammar refers to the four WINDS, not the four horns. ' +
        'The little horn arises from the western wind—the Greco-Roman world—where Greek culture merged with rising Roman power. ' +
        'This grammatically and historically defeats the Antiochus interpretation.'
      );
    }
  }

  // Rule 3: Prince in Daniel 9:26 must be Satan, not Titus
  if (lowerContent.includes('daniel') && lowerContent.includes('prince')) {
    const titusPatterns = [
      /prince.*titus/i,
      /titus.*prince/i,
      /daniel\s*9.*titus/i,
      /titus.*daniel\s*9/i,
    ];

    for (const pattern of titusPatterns) {
      if (pattern.test(content)) {
        errors.push(
          'CRITICAL VIOLATION: The "prince that shall come" (Daniel 9:26) is Satan, not Titus. ' +
          'Daniel 9 reveals TWO princes: (1) Messiah the Prince (v.25)—pure, divine, cut off for sins not His own; ' +
          '(2) The prince that shall come (v.26)—destroys Jerusalem, opposes the covenant, continues to the end. ' +
          'Titus was merely the human instrument. Satan is the "prince of this world" (John 14:30), the cosmic adversary who: ' +
          'led Rome\'s destruction, continues into the end time (Daniel 11:40), and is the miracle-worker of Revelation 16:13-14. ' +
          'This prince is the counterfeit Christ, the demonic ruler behind Rome, not a Roman general.'
        );
        break;
      }
    }
  }

  // Rule 3b: Ensure Daniel 8-9-11 integration is maintained
  if ((lowerContent.includes('daniel 8') || lowerContent.includes('daniel 9') || lowerContent.includes('daniel 11')) &&
      (lowerContent.includes('little horn') || lowerContent.includes('prince') || lowerContent.includes('king of the north'))) {
    const hasIntegration = (lowerContent.includes('rome') || lowerContent.includes('papal')) &&
                          (lowerContent.includes('pagan') || lowerContent.includes('papacy'));
    
    if (!hasIntegration && content.length > 250) {
      warnings.push(
        'WARNING: Daniel 8, 9, and 11 present a unified prophetic system: ' +
        'Daniel 8 little horn = Rome (Pagan → Papal); Daniel 9:26-27 = Satan as prince behind Rome; ' +
        'Daniel 11:40 = Satan impersonating Christ. All point to the same power rising from the Greco-Roman world: ' +
        'Pagan Rome (crucified Christ) → Papal Rome (replaced priesthood, attacked sanctuary, changed law) → ' +
        'leads to the final deception (Dan 11:40, Rev 13, Rev 16:13-14).'
      );
    }
  }

  // Rule 4: Mark of the Beast must be specifically named as Sunday enforcement
  if (lowerContent.includes('mark') && lowerContent.includes('beast')) {
    const vaguenessCheck = !lowerContent.includes('sunday') && 
                           !lowerContent.includes('sabbath') && 
                           !lowerContent.includes('worship');
    
    if (vaguenessCheck && content.length > 200) {
      warnings.push(
        'WARNING: When discussing the mark of the beast, be specific: the mark = enforced Sunday worship backed by civil penalty. ' +
        'The image to the beast = Protestant America enforcing Papal theology via state power. ' +
        'The seal of God = Sabbath. The crisis centers on worship authority.'
      );
    }
  }

  // Rule 5: Three frogs are NOT plagues - common misconception
  if ((lowerContent.includes('frog') || lowerContent.includes('unclean spirit')) && 
      lowerContent.includes('plague')) {
    const frogsAsPlagues = /frogs?.*(?:are|is).*plague/i.test(content) ||
                          /unclean.*spirit.*plague/i.test(content);
    
    if (frogsAsPlagues) {
      errors.push(
        'CRITICAL VIOLATION: The three unclean spirits like frogs (Rev 16:13-14) are NOT part of the seven plagues. ' +
        'The plagues are God\'s judgments. The frogs represent Satan\'s miracle-working campaign to gather the world BEFORE the seventh plague. ' +
        'Frogs reference Egypt\'s last successful counterfeit—Satan\'s final imitation before he is unmasked.'
      );
    }
  }

  // Rule 6: Revelation 13:11 must specifically name America
  if ((lowerContent.includes('revelation 13') || lowerContent.includes('lamb') || 
       lowerContent.includes('two horn')) && 
      (lowerContent.includes('beast') || lowerContent.includes('earth'))) {
    const vagueBeastReference = !lowerContent.includes('america') &&
                                !lowerContent.includes('united states') &&
                                !lowerContent.includes('usa') &&
                                content.length > 150;
    
    if (vagueBeastReference) {
      warnings.push(
        'WARNING: When discussing the lamb-like beast (Rev 13:11), NAME THE POWER: this represents the United States of America. ' +
        'Do not speak in vague terms. America was born with lamb-like principles (liberty, Protestantism) but speaks like a dragon (slavery, persecution, future Sunday laws).'
      );
    }
  }

  // Rule 7: Daniel 11:40 must identify Satan appearing as Christ
  if (lowerContent.includes('daniel 11') && lowerContent.includes('40')) {
    const kingSouthNorthMention = lowerContent.includes('king') && 
                                  (lowerContent.includes('north') || lowerContent.includes('south'));
    const satanMention = lowerContent.includes('satan') || 
                        lowerContent.includes('impersonat') ||
                        lowerContent.includes('counterfeit');
    
    if (kingSouthNorthMention && !satanMention && content.length > 200) {
      warnings.push(
        'WARNING: At Daniel 11:40, the King of the North = Satan impersonating Christ. ' +
        'Ships = counterfeit resurrected saints. Chariots = fallen angels. Horsemen = supernatural military imagery. ' +
        'This is the healing of the deadly wound and the counterfeit second coming.'
      );
    }
  }

  // Rule 8: Little horn = Papal Rome (must be specific, not vague)
  if ((lowerContent.includes('little horn') || lowerContent.includes('small horn')) &&
      (lowerContent.includes('daniel 7') || lowerContent.includes('daniel 8'))) {
    const papalMention = lowerContent.includes('papal') || 
                        lowerContent.includes('papacy') ||
                        lowerContent.includes('rome');
    
    if (!papalMention && content.length > 150) {
      warnings.push(
        'WARNING: When discussing the little horn, NAME THE POWER: the little horn = Papal Rome. ' +
        'Do not speak in vague terms. Papal Rome ruled 1260 years (AD 538-1798), received a deadly wound, and will be healed in the final crisis.'
      );
    }
  }

  // Rule 9: Ensure proper scapegoat teaching when mentioned
  if (lowerContent.includes('scapegoat') && errors.length === 0) {
    const hasCorrectTeaching = 
      lowerContent.includes('azazel') || 
      lowerContent.includes('satan') ||
      (lowerContent.includes('lord') && lowerContent.includes('goat'));

    if (!hasCorrectTeaching) {
      warnings.push(
        'WARNING: When mentioning the scapegoat, clarify that it represents Azazel/Satan, ' +
        'and that Christ is the LORD\'S goat (slain), not the scapegoat (sent away).'
      );
    }
  }

  // Rule 10: Daniel 2 must extend forward, not be static history
  if (lowerContent.includes('daniel 2') && 
      (lowerContent.includes('statue') || lowerContent.includes('image') || lowerContent.includes('stone'))) {
    const staticLanguage = /daniel\s*2.*(?:ends|ended|finished|complete)/i.test(content);
    const forwardLanguage = lowerContent.includes('trajectory') ||
                           lowerContent.includes('continue') ||
                           lowerContent.includes('modern') ||
                           lowerContent.includes('america');
    
    if (staticLanguage && !forwardLanguage) {
      warnings.push(
        'WARNING: Daniel 2 is not only history—it is trajectory. The prophecy does not end with divided Rome. ' +
        'It stretches forward through the horns of Daniel 7 into the modern nations that appear in Revelation.'
      );
    }
  }

  // Rule 11: Ten horns must be identified correctly and shown as continuing forward
  if ((lowerContent.includes('ten horns') || lowerContent.includes('10 horns')) &&
      (lowerContent.includes('daniel 7') || lowerContent.includes('revelation'))) {
    const hasHornNames = lowerContent.includes('franks') || 
                        lowerContent.includes('anglo') ||
                        lowerContent.includes('alemanni') ||
                        lowerContent.includes('visigoth') ||
                        lowerContent.includes('lombard') ||
                        lowerContent.includes('burgund') ||
                        lowerContent.includes('heruli') ||
                        lowerContent.includes('vandal') ||
                        lowerContent.includes('ostrogoth');
    
    const hasModernConnection = lowerContent.includes('modern') ||
                                lowerContent.includes('continue') ||
                                lowerContent.includes('evolve') ||
                                lowerContent.includes('america') ||
                                lowerContent.includes('europe');
    
    if (!hasHornNames && content.length > 200) {
      warnings.push(
        'WARNING: When discussing the ten horns, name the specific tribes: Heruli, Vandals, Ostrogoths (uprooted), ' +
        'Franks, Anglo-Saxons, Alemanni, Visigoths, Suevi, Lombards, Burgundians (surviving). ' +
        'Each produced a unique distortion of Christianity leading to the final crisis.'
      );
    }
    
    if (!hasModernConnection && content.length > 200) {
      warnings.push(
        'WARNING: The ten horns are not frozen in the 5th century. They grow forward into modern nations. ' +
        'The Anglo-Saxon line produces England and America. The Alemanni become Germany (rationalism). ' +
        'All surviving horns contribute to the end-time image of the beast.'
      );
    }
  }

  // Rule 12: Daniel 11:23 must identify the Papacy's entrance
  if (lowerContent.includes('daniel 11') && lowerContent.includes('23')) {
    const hasLeagueExplanation = lowerContent.includes('league') || lowerContent.includes('covenant');
    const hasPapalIdentification = lowerContent.includes('papal') || lowerContent.includes('papacy');
    const hasSmallPeopleExplanation = lowerContent.includes('small people') || lowerContent.includes('diplomacy');
    
    if (hasLeagueExplanation && !hasPapalIdentification && content.length > 150) {
      warnings.push(
        'WARNING: Daniel 11:23 "after the league made with him" is the Papacy\'s entrance into the chapter. ' +
        'The league = formal alliance between the Papacy and civil powers (Clovis & the Franks AD 496-508, Justinian\'s decree AD 533). ' +
        'This is the same moment that uproots three horns, begins the Papal phase of the little horn, and launches the 1260 years. ' +
        'Daniel 11:23 parallels Daniel 7 little horn, Daniel 8 little horn, and Revelation 13 beast from the sea.'
      );
    }
    
    if (hasSmallPeopleExplanation && !hasPapalIdentification && content.length > 150) {
      warnings.push(
        'WARNING: "Shall become strong with a small people" (Dan 11:23) describes how Papal Rome rose—not by military conquest or large armies, ' +
        'but through diplomacy, alliances, religious influence, political manipulation, and support of a small but powerful minority. ' +
        'This is uniquely Papal—not Islam, Greece, or any other power. The Papacy came to power through others, not through itself.'
      );
    }
  }

  // Rule 13: Daniel 11:23-30 = Papal military phase; 11:31-39 = Papal spiritual phase
  if (lowerContent.includes('daniel 11') && 
      (lowerContent.includes('daily') || lowerContent.includes('abomination') || lowerContent.includes('sanctuary'))) {
    const hasTwoPhaseExplanation = (lowerContent.includes('military') || lowerContent.includes('iron')) &&
                                   (lowerContent.includes('spiritual') || lowerContent.includes('clay'));
    
    if (!hasTwoPhaseExplanation && content.length > 200) {
      warnings.push(
        'WARNING: Daniel 11 divides the Papal period into two phases: ' +
        'Verses 23-30 = military/political conquests (iron phase): wars, crusades, territorial manipulation, crowns placed by Papacy. ' +
        'Verses 31-39 = spiritual conquests (clay phase): pollute sanctuary, take away daily, place abomination, corrupt with flatteries, ' +
        'exalt above every god, replace Christ\'s ministry. Military dominance + spiritual dominance = complete Papal supremacy 1260 years.'
      );
    }
  }

  // Rule 14: Shushan in Daniel 8 must be connected to Esther's judgment typology
  if ((lowerContent.includes('daniel 8') && lowerContent.includes('shushan')) ||
      (lowerContent.includes('palace') && lowerContent.includes('daniel 8'))) {
    const hasEstherConnection = lowerContent.includes('esther') || lowerContent.includes('judgment');
    
    if (!hasEstherConnection && content.length > 150) {
      warnings.push(
        'WARNING: Daniel 8:2 places Daniel "at Shushan in the palace" for a reason. Shushan is the location of Esther\'s book, ' +
        'which is a courtroom/judgment narrative: decree of death, accusations, records searched, king reviewing evidence, Mordecai vindicated, ' +
        'Haman condemned, deliverance granted. This mirrors Daniel 7\'s heavenly courtroom, Daniel 8\'s sanctuary cleansing (v.14), ' +
        'and the Investigative Judgment. Esther foreshadows the judgment scene that Daniel 8:14 describes. Shushan anchors prophecy in judgment typology.'
      );
    }
  }

  // Rule 15: 2300 days must be interpreted as symbolic years
  if (lowerContent.includes('2300') && lowerContent.includes('daniel')) {
    const hasLiteralDaysError = /2300.*literal.*days/i.test(content) || 
                                /literal.*2300.*days/i.test(content);
    const hasSymbolicExplanation = lowerContent.includes('symbolic') || 
                                   lowerContent.includes('year') ||
                                   lowerContent.includes('1844');
    
    if (hasLiteralDaysError) {
      errors.push(
        'CRITICAL VIOLATION: The 2300 days CANNOT be literal days. 2300 literal days = 6.3 years, but the prophecy spans: ' +
        'Medo-Persia (ram), Greece (goat), Greco-Roman transition, Pagan Rome, Papal Rome, and the time of the end. ' +
        'Six years cannot cover 600+ years of Medo-Persia/Greece, much less Papal Rome\'s 1260-year phase. ' +
        'Daniel 7 & 9 establish day-year principle (70 weeks = 490 years; time/times/half = 1260 years). ' +
        'Gabriel links 2300 to 490 years in Daniel 9. Jesus places fulfillment in Christian era (Matt 24:15), not 165 BC Antiochus. ' +
        'Daniel 8 explicitly reaches "time of the end" (v.17,19). Only symbolic year-day interpretation fits: 457 BC to AD 1844.'
      );
    } else if (!hasSymbolicExplanation && content.length > 200) {
      warnings.push(
        'WARNING: When discussing the 2300 days (Daniel 8:14), clarify they are symbolic years using the day-year principle. ' +
        'The prophecy covers Medo-Persia, Greece, Pagan Rome, Papal Rome (1260 years), reaching to "the time of the end" (v.17,19). ' +
        'Literal days cannot span this timeline. The 2300 years = 457 BC (Artaxerxes\' decree) to AD 1844 (Investigative Judgment begins).'
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates and sanitizes content, throwing an error if validation fails
 */
export function validateOrThrow(content: string, context: string = 'Content'): void {
  const result = validateTheologicalContent(content);
  
  if (!result.valid) {
    throw new Error(
      `Theological validation failed for ${context}:\n` +
      result.errors.join('\n')
    );
  }
}

/**
 * Gets a list of all theological rules for display
 */
export function getTheologicalRules(): Array<{ id: string; rule: string; rationale: string }> {
  return [
    {
      id: 'ten-horns-continue-forward',
      rule: 'The ten horns of Daniel 7 are not frozen in the 5th century—they continue into the last days',
      rationale:
        'The ten horns = post-Roman nations (Heruli, Vandals, Ostrogoths, Franks, Anglo-Saxons, Alemanni, Visigoths, Suevi, Lombards, Burgundians). ' +
        'Three were uprooted (Heruli, Vandals, Ostrogoths) to make way for Papal Rome. ' +
        'The remaining seven evolved into modern Western powers and each produced a unique distortion of Christianity: ' +
        'Franks → Church Supremacy; Anglo-Saxons → Persecuting Protestantism & America; Alemanni → Atheistic Rationalism; ' +
        'Visigoths → The Inquisition; Suevi → Global Slavery; Lombards → Papal Territorial Power; Burgundians → Doctrinal Fragmentation.',
    },
    {
      id: 'daniel-11-23-papacy-entrance',
      rule: 'Daniel 11:23 marks the Papacy\'s entrance through "the league" with civil powers',
      rationale:
        '"After the league made with him he shall work deceitfully: for he shall come up, and shall become strong with a small people" (Dan 11:23). ' +
        'The league = formal alliance between the Papacy and civil powers (Clovis & Franks AD 496-508; Justinian\'s decree AD 533 recognizing Papacy as head over all churches). ' +
        'This is the exact moment that: uproots three horns (Heruli, Vandals, Ostrogoths), begins the Papal phase of the little horn, launches 1260 years of supremacy. ' +
        'Daniel 11:23 parallels Daniel 7 little horn, Daniel 8 little horn, Revelation 13 beast. "Small people" = Papacy rose not by military conquest but through diplomacy, ' +
        'alliances, religious influence, political manipulation—uniquely Papal. The Papacy came to power through others, not through itself.',
    },
    {
      id: 'daniel-11-two-phase-papal-dominion',
      rule: 'Daniel 11:23-30 = Papal military phase (iron); Daniel 11:31-39 = Papal spiritual phase (clay)',
      rationale:
        'Daniel 11 divides Papal Rome into two phases matching Daniel 2 iron/clay feet. ' +
        'Verses 23-30 (military/iron): "stir up power," wars, crusades, political alliances, territorial manipulation, armies controlled by Papacy, crowns placed/removed by Papacy. ' +
        'Verses 31-39 (spiritual/clay): "pollute sanctuary," "take away the daily," "place abomination of desolation," "corrupt with flatteries," "exalt above every god"—' +
        'changing times/laws (Dan 7:25), replacing Christ\'s heavenly ministry, introducing priesthoods/confessions/masses, counterfeit sanctuary system, ' +
        'elevating human authority above Scripture, universal church-state religious empire. Military dominance + spiritual dominance = complete Papal supremacy AD 538-1798.',
    },
    {
      id: 'shushan-esther-judgment-typology',
      rule: 'Palace of Shushan in Daniel 8 connects to Esther\'s judgment typology and Investigative Judgment',
      rationale:
        'Daniel 8:2: "I saw in a vision... I was at Shushan in the palace." Shushan is the location of Esther\'s book, which is a courtroom/judgment narrative: ' +
        'decree of death, accusations, records searched, king reviewing evidence, Mordecai vindicated, Haman condemned, deliverance granted, sentence executed. ' +
        'This mirrors: Daniel 7 heavenly courtroom, Daniel 8:14 sanctuary cleansing, Daniel 9 Messiah cut off, Daniel 11 end-time persecution, Revelation 14 judgment hour. ' +
        'Esther is sanctuary-coded judgment story. The Persian king judging = type of heavenly judgment, God reviewing record books, deliverance of God\'s people, ' +
        'destruction of accusers. Daniel 8:14 cleansing parallels: reversal of Haman\'s decree, vindication of saints, exposure of enemy, deliverance, new kingdom decree. ' +
        'Shushan anchors the prophecy in judgment typology, foreshadowing the Investigative Judgment that Daniel 8:14 describes.',
    },
    {
      id: '2300-days-symbolic-years',
      rule: 'The 2300 days of Daniel 8:14 MUST be interpreted as symbolic years (day-year principle), not literal days',
      rationale:
        '2300 literal days = 6.3 years, but prophecy spans: Medo-Persia (ram), Greece (goat), Greco-Roman transition, Pagan Rome, Papal Rome, time of the end. ' +
        'Six years cannot cover 600+ years of Medo-Persia/Greece, much less Papal Rome\'s 1260-year phase. ' +
        'Daniel 7 & 9 establish day-year principle: 70 weeks = 490 years (Dan 9:24-27); time/times/half = 1260 years (Dan 7:25). ' +
        'Gabriel links 2300 to 490 in Daniel 9 (70 weeks "cut off"/chathak from longer period). Both use symbolic time, both reach Messiah and judgment. ' +
        'Jesus places fulfillment in Christian era (Matt 24:15), not 165 BC Antiochus. Daniel 8 explicitly reaches "time of the end" (v.17,19). ' +
        'Literal days cannot reach: fall of Pagan Rome, rise of Papal Rome, Middle Ages, Reformation, end-time judgment, appearing of Satan (Dan 11:40). ' +
        'Only symbolic interpretation fits: 2300 years = 457 BC (Artaxerxes\' decree to restore Jerusalem) to AD 1844 (Investigative Judgment begins in heavenly sanctuary).',
    },
    {
      id: 'scapegoat-never-christ',
      rule: 'The scapegoat is NEVER Jesus Christ',
      rationale:
        'Leviticus 16 describes two goats: the LORD\'s goat (slain, representing Christ\'s sacrifice) ' +
        'and the scapegoat (Azazel, sent away, representing Satan bearing final guilt after atonement is complete). ' +
        'Confusing these destroys the sanctuary message of complete atonement and final judgment.',
    },
    {
      id: 'little-horn-never-antiochus',
      rule: 'The little horn of Daniel 8 is NEVER Antiochus Epiphanes',
      rationale:
        'The prophetic pattern demands escalation: Babylon (great) → Medo-Persia (greater) → Greece (very great) → Next power (exceeding great). ' +
        'Antiochus Epiphanes was a minor Seleucid king who paid tribute to Rome, lost most campaigns, and died in obscurity—he never "waxed exceeding great." ' +
        'The little horn represents Rome (Pagan → Papal): crucified Christ, replaced His priesthood, attacked the sanctuary ministry, cast truth to the ground, ' +
        'and extends to "the time of the end" (Dan 8:17,19). Jesus placed Daniel\'s abomination AFTER AD 70 (Matt 24:15), not 165 BC. ' +
        'The 2,300 days point to 1844 and the judgment hour. Grammar also defeats Antiochus: "out of one of them" refers to the four WINDS (Greco-Roman world), not the four horns.',
    },
    {
      id: 'out-of-one-of-them-winds',
      rule: '"Out of one of them" in Daniel 8:9 refers to the four winds (Greco-Roman world), not the four Greek horns',
      rationale:
        'Daniel 8:8 describes two divisions: four notable horns AND those horns extending toward the four winds of heaven. ' +
        'When verse 9 says "out of one of them," the nearest grammatical antecedent is the four WINDS, not the four horns. ' +
        'This means the little horn arises from one of the compass directions (the west)—the Greco-Roman world where Greek culture merged with rising Roman Republic. ' +
        'Rome is literally "Greco-Roman": Greek language widely spoken, Greek philosophy adopted, Hellenized architecture/education/law. ' +
        'The little horn rises from the western wind (Greco-Roman zone), not from within a Greek dynasty. This grammatically defeats the Antiochus interpretation.',
    },
    {
      id: 'daniel-2-extends-forward',
      rule: 'Daniel 2 extends into the last days - not static history',
      rationale:
        'Daniel 2 is trajectory, not just history. The feet of iron + clay = church-state amalgamation. ' +
        'The ten toes parallel the ten horns of Daniel 7, evolving into modern European/Western powers including the United States.',
    },
    {
      id: 'america-lamb-like-beast',
      rule: 'Revelation 13:11 identifies the United States as the lamb-like beast',
      rationale:
        'The two-horned beast rising from the earth represents the United States - born with lamb-like principles but speaking like a dragon from the start (slavery). ' +
        'Its final fulfillment includes Sunday legislation, persecution, and worldwide influence through miracles.',
    },
    {
      id: 'mark-of-beast-sunday',
      rule: 'The mark of the beast is enforced Sunday worship',
      rationale:
        'The mark = enforced Sunday sacredness backed by civil penalty. The image = Protestant America enforcing Papal theology via state power. ' +
        'The seal of God = Sabbath. The crisis centers on authority and worship.',
    },
    {
      id: 'prince-that-shall-come-satan',
      rule: 'The "prince that shall come" in Daniel 9:26 is Satan, not Titus',
      rationale:
        'Daniel 9 reveals TWO princes: (1) Messiah the Prince (v.25)—pure, divine, anointed, cut off for sins not His own, confirms the covenant; ' +
        '(2) The prince that shall come (v.26)—destroys Jerusalem, opposes the covenant, makes desolation, continues through history, appears eschatologically. ' +
        'Titus did NOT continue into the end time, did NOT appear after Messiah\'s ministry as a supernatural ruler, is NOT the enemy of Christ in Daniel. ' +
        'Jesus identified the real prince: "The prince of this world cometh" (John 14:30). Paul confirmed: "the god of this world" (2 Cor 4:4). ' +
        'This prince opposes Messiah, leads destruction, brings desolation, is behind earthly armies, is the final adversary in Daniel 11:40, ' +
        'is the miracle-worker of Revelation 16:13-14—Satan himself impersonating Christ. Titus was merely the human instrument; Satan was the prince behind Rome.',
    },
    {
      id: 'daniel-8-9-11-integration',
      rule: 'Daniel 8, 9, and 11 form a unified prophetic system pointing to Rome (Pagan → Papal) led by Satan',
      rationale:
        'All three chapters converge on the same power: Daniel 7 little horn = Papal Rome; Daniel 8 little horn = Rome (attacks sanctuary, extends to end time); ' +
        'Daniel 9:26-27 = Satan as prince behind Rome; Daniel 11:40 = Satan impersonating Christ. ' +
        'The sequence is consistent: Pagan Rome (crucified Christ, destroyed Jerusalem) → Papal Rome (replaced priesthood, attacked sanctuary ministry, changed times and law, ' +
        'persecuted saints 1260 years) → Miracle-working deception (Rev 13, Rev 16:13-14 frogs, Dan 11:40 counterfeit second coming). ' +
        'All arise from the Greco-Roman world (western wind of divided Greece). This unified interpretation connects the little horn, the prince, and the king of the north ' +
        'into one coherent prophetic narrative leading to the final crisis.',
    },
    {
      id: 'three-frogs-not-plagues',
      rule: 'The three unclean spirits (frogs) are NOT part of the seven plagues',
      rationale:
        'The frogs (Rev 16:13-14) represent Satan\'s miracle-working campaign to gather the world BEFORE the seventh plague. ' +
        'Frogs reference Egypt\'s last successful counterfeit - Satan\'s final imitation before being unmasked.',
    },
    {
      id: 'daniel-11-40-satan-appearing',
      rule: 'Daniel 11:40 - King of the North is Satan impersonating Christ',
      rationale:
        'At verse 40, the king of the north = Satan appearing as Christ. Ships = counterfeit resurrected saints. ' +
        'Chariots = fallen angels. This is the healing of the deadly wound and the counterfeit second coming.',
    },
    {
      id: 'seven-churches-start-pentecost',
      rule: 'Seven Churches, Seven Seals, Seven Trumpets all start at Pentecost',
      rationale:
        'Ephesus = Peter preaching at Pentecost (3,000 baptized). 1st seal white horse = Word going forth. ' +
        'Trumpets begin at altar of incense with prayers from the early church. This tri-parallel structure unifies Revelation.',
    },
    {
      id: 'little-horn-papal-rome',
      rule: 'The little horn = Papal Rome (name the power, not vague terms)',
      rationale:
        'The little horn in Daniel 7 and 8 represents Papal Rome specifically. Ruled 1260 years (AD 538-1798). ' +
        'Received deadly wound in 1798. Will be healed in final crisis. Name the power - do not speak in vague terms.',
    },
    {
      id: 'ten-horns-continue-forward',
      rule: 'The ten horns are not frozen in the 5th century—they grow forward',
      rationale:
        'The ten horns of Daniel 7 = post-Roman nations that continue into modern times. Three were uprooted (Heruli, Vandals, Ostrogoths). ' +
        'The remaining seven (Franks, Anglo-Saxons, Alemanni, Visigoths, Suevi, Lombards, Burgundians) evolved into modern Western powers.',
    },
    {
      id: 'matthew-24-primary-ad-70',
      rule: 'Matthew 24\'s primary fulfillment is AD 70, not the end of the world',
      rationale:
        'Matthew 24 is a dual prophecy: PRIMARY fulfillment in the Roman destruction of Jerusalem (AD 70), SECONDARY typological foreshadowing of the final end. ' +
        'Jesus anchors it immediately: "There shall not be left here one stone upon another" (Matt 24:2). ' +
        'Signs given - fleeing to mountains, armies surrounding Jerusalem, abomination (Roman standards), tribulation for Judea, false messiahs during Jewish revolt - ' +
        'apply to the Roman siege, NOT primarily to end-time persecution. ' +
        'Hebrews 8:13 warned "the first covenant is ready to vanish away" - written shortly before AD 70. ' +
        'Hebrews 12:26-27 warned of "shaking" - the destruction of Jerusalem and the sanctuary system. ' +
        'This is Second Heaven/Second Day of the Lord. The final fulfillment belongs to Daniel & Revelation (Third Heaven/Third Day).',
    },
    {
      id: 'seven-trumpets-church-protection',
      rule: 'The Seven Trumpets show God defending His church through history by judging her persecutors',
      rationale:
        'Each trumpet strikes an enemy of God\'s people, restrains a persecuting power, and buys time for the gospel to advance. ' +
        'This is a historical chain of defensive judgments, not a single end-time event. ' +
        'Trumpet 1 = Fall of Jerusalem AD 70 (cursed fig tree withered, Matt 24 primary fulfillment). ' +
        'Trumpet 2 = Fall of Pagan Rome (the mountain cast into sea, Matt 21:21 - Rome that crucified Christ). ' +
        'Trumpet 3 = Wormwood star (false doctrine of Papal Rome, Dan 8:12 truth cast down). ' +
        'Trumpet 4 = Darkening of lights (spiritual darkness, hiding Scripture under Papacy). ' +
        'Trumpet 5 = First Woe (Islamic Saracens restrain Papal expansion). ' +
        'Trumpet 6 = Second Woe (Ottoman Empire keeps Papacy in check, giving Reformation time). ' +
        'Trumpet 7 = Judgment on the whole world (Third Heaven/Third Day - fall of modern Babylon, Rev 11:15-19). ' +
        'Master summary: "The trumpets show God repeatedly turning the swords of persecuting empires against themselves, protecting His remnant through the ages."',
    },
    {
      id: 'sanctuary-pattern-new-testament',
      rule: 'The New Testament follows the Sanctuary pattern: Gospels (Altar), Acts/Epistles (Laver), Revelation 1-11 (Holy Place), Revelation 12-14 (Most Holy Place), Revelation 15-19 (Plagues/Second Coming), Revelation 20 (Outside Camp), Revelation 21-22 (Eternal Most Holy Place)',
      rationale:
        'The Gospels are the Altar of Sacrifice where the Lamb is slain, blood shed, and salvation secured (John 1:29, John 19:30, Matt 27:51 veil torn). ' +
        'Acts & Epistles are the Laver where the Church is washed, consecrated, and formed into a priesthood (Acts 2 baptism, Titus 3:5, 1 Pet 2:9, Rom 6). ' +
        'Revelation 1-11 is the Holy Place following furniture in exact order: Rev 1-3 = Lampstand (seven churches = seven lamps, Christ walking among them); ' +
        'Rev 4-6 = Table of Shewbread (sealed book opened, Word broken open through seals); Rev 8-11 = Altar of Incense (prayers ascend, trumpets sound as God answers). ' +
        'Revelation 11:19-14 is the Most Holy Place (temple opens, Ark appears, Investigative Judgment begins, final war, remnant sealed, three angels\' messages). ' +
        'Revelation 15-19 follows Day of Atonement pattern (temple filled with smoke, close of probation, plagues fall, Christ emerges as King). ' +
        'Revelation 20 is Outside the Camp (judgment of wicked, Satan bound, millennium, scapegoat removed). ' +
        'Revelation 21-22 is the Eternal Most Holy Place City (New Jerusalem as perfect cube, God dwelling with His people forever). ' +
        'Master summary: "The Gospels are the Altar; Acts/Epistles are the Laver; Revelation 1-11 is the Holy Place; Revelation 12-14 is the Most Holy Place; ' +
        'Plagues/Second Coming are the High Priest exiting; Millennium is outside the camp; New Jerusalem is the eternal Most Holy Place."',
    },
    {
      id: 'pentecost-sanctuary-hinge',
      rule: 'Pentecost is the hinge between the Laver and the Holy Place - it washes, consecrates, lights the lamps, breaks open the Bread, and empowers intercession',
      rationale:
        'Pentecost is not simply an event in Acts - it is the architectural transition from Courtyard (Gospels/Altar) to Holy Place (Lampstand, Bread, Incense). ' +
        'As the Laver (Acts 2): baptism of water/Spirit, washing of regeneration, consecration of priesthood, birth of New Testament priesthood (Rev 1:6 kings and priests). ' +
        'Pentecost gives birth to Seven Churches (Rev 1-3): Spirit-filled community, lampstand age, Light to Gentiles, entire church age - Christ walks among lamps AFTER Pentecost. ' +
        'Pentecost opens the Seven Seals (Rev 4-6): Seals cannot open until Lamb dies (Gospels/Altar), Lamb rises (Firstfruits), Spirit descends (Pentecost). ' +
        'Pentecost is when Lamb is enthroned (Acts 2:33) - the exact moment He is worthy to open the Book (Rev 5:7). ' +
        'Chain: Pentecost → Enthronement → Scroll given → Seals opened. Seal 1 (White Horse) = Pentecost Explosion (pure gospel, Spirit-filled conquest). ' +
        'Pentecost links everything: 1. Gospels = Altar (Christ offered); 2. Pentecost = Laver (Church washed/consecrated); 3. Seven Churches = Lampstand (Light ignited); ' +
        '4. Seven Seals = Shewbread (Word broken open); 5. Seven Trumpets = Incense (Prayers answered); 6. Rev 11:19 = Veil opens (Ark revealed); ' +
        '7. Rev 12-14 = Most Holy Place (Judgment Hour). Without Pentecost, lampstand never lights, bread never breaks, seals never open. ' +
        'Master line: "Pentecost is the hinge that turns the Gospels\' altar into Revelation\'s sanctuary."',
    },
    {
      id: 'feast-pattern-new-testament',
      rule: 'The Feasts overlay the Sanctuary pattern: Passover (Gospels/Cross), Unleavened Bread (Tomb), Firstfruits (Resurrection), Pentecost (Acts/Churches/Seals), Trumpets (Warnings), Day of Atonement (Judgment), Tabernacles (Eternal Home)',
      rationale:
        'PASSOVER (Gospels/Altar): Christ is the Passover Lamb (1 Cor 5:7), Gospels fulfill Passover. ' +
        'UNLEAVENED BREAD (Gospels/Resurrection): Christ in tomb - pure, unleavened, without corruption. ' +
        'FIRSTFRUITS (Resurrection): Christ rises as "Firstfruits of them that slept" (1 Cor 15:20). ' +
        'PENTECOST (Acts/Seven Churches/Seven Seals/Laver→Lampstand): Feast of Weeks symbolizes first fruits of gospel harvest, birth of church, ' +
        'offering of two leavened loaves (Jew + Gentile), globalizing of mission, empowerment for Holy Place ministry - launches entire Revelation 1-11 era. ' +
        'TRUMPETS (Seven Trumpets/Rev 8-11): Warnings before Day of Atonement - Fall of Jerusalem, Fall of Rome, Judgment on Papal teachings, Islam judging Papacy, Final judgment. ' +
        'DAY OF ATONEMENT (Rev 11:19-14): Investigative Judgment - Ark seen, Commandments highlighted, Remnant sealed, Three angels proclaimed, Little horn judged, Satan exposed. ' +
        'FEAST OF TABERNACLES (Rev 19-22): Second Coming, Marriage Supper, God tabernacling with humanity, New Jerusalem, Eternity with God - final celebration, God with us forever. ' +
        'The Feasts follow the Sanctuary pattern perfectly: Passover (Cross) → Unleavened Bread (Tomb) → Firstfruits (Resurrection) → Pentecost (Acts) → ' +
        'Trumpets (Warnings) → Day of Atonement (Judgment) → Tabernacles (Eternal Home).',
    },
  ];
}
