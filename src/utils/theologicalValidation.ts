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
          'The little horn of Daniel 8 represents papal Rome, not Antiochus. ' +
          'While Antiochus may be a type, he does NOT fulfill the Daniel 8 prophecy. ' +
          'The 2,300 days point to 1844 and the judgment hour, not the Maccabean period.'
        );
        break;
      }
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
          'Titus was merely the human instrument. Satan is the "prince of this world" (John 14:30) who continues as the cosmic adversary into the end time (Daniel 11:40).'
        );
        break;
      }
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
        'The little horn of Daniel 8 represents Papal Rome, fulfilling prophecy through the 2,300-day/year timeline ' +
        'pointing to 1844. While Antiochus Epiphanes may be a type of the desolating power, he does NOT fulfill ' +
        'the specific details of Daniel 8. This distinction is fundamental to Adventist prophetic interpretation.',
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
        'Titus was merely the human instrument. Satan is the "prince of this world" (John 14:30) who led Rome\'s destruction ' +
        'and continues as the cosmic adversary into the end time (Daniel 11:40).',
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
  ];
}
