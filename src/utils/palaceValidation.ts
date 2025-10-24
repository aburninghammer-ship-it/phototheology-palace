import { palaceFloors, type Room, type Floor } from "@/data/palaceData";

/**
 * CRITICAL: This file ensures Jeeves NEVER hallucinates Palace content.
 * All room references must match exactly what exists in palaceData.ts
 */

export interface ValidatedRoom {
  id: string;
  name: string;
  tag: string;
  floor: number;
  floorName: string;
  purpose: string;
  coreQuestion: string;
  method: string;
  examples: string[];
  pitfalls: string[];
}

// Build validated room registry from source of truth
export const VALID_ROOMS: Map<string, ValidatedRoom> = new Map();
export const ROOM_BY_TAG: Map<string, ValidatedRoom> = new Map();
export const ROOM_BY_NAME: Map<string, ValidatedRoom> = new Map();

// Initialize registry
palaceFloors.forEach(floor => {
  floor.rooms.forEach(room => {
    const validated: ValidatedRoom = {
      id: room.id,
      name: room.name,
      tag: room.tag,
      floor: floor.number,
      floorName: floor.name,
      purpose: room.purpose,
      coreQuestion: room.coreQuestion,
      method: room.method,
      examples: room.examples,
      pitfalls: room.pitfalls,
    };
    
    VALID_ROOMS.set(room.id, validated);
    ROOM_BY_TAG.set(room.tag.toUpperCase(), validated);
    ROOM_BY_NAME.set(room.name.toLowerCase(), validated);
  });
});

/**
 * Get the EXACT methodology for a room - NO HALLUCINATIONS ALLOWED
 */
export function getRoomMethod(roomIdOrTag: string): string | null {
  const upper = roomIdOrTag.toUpperCase();
  const room = VALID_ROOMS.get(roomIdOrTag) || ROOM_BY_TAG.get(upper);
  return room?.method || null;
}

/**
 * Get complete room details - MUST use this for any Palace references
 */
export function getValidatedRoom(roomIdOrTag: string): ValidatedRoom | null {
  const upper = roomIdOrTag.toUpperCase();
  return VALID_ROOMS.get(roomIdOrTag) || ROOM_BY_TAG.get(upper) || null;
}

/**
 * Generate the strict schema Jeeves MUST follow
 */
export function generatePalaceSchema(): string {
  let schema = "# PHOTOTHEOLOGY PALACE - COMPLETE ROOM REGISTRY\n\n";
  schema += "## CRITICAL: You may ONLY reference rooms that exist in this registry.\n";
  schema += "## NEVER make up methodologies. ALWAYS use the exact method listed below.\n\n";
  
  palaceFloors.forEach(floor => {
    schema += `\n### FLOOR ${floor.number}: ${floor.name.toUpperCase()}\n`;
    schema += `Subtitle: ${floor.subtitle}\n`;
    schema += `Description: ${floor.description}\n\n`;
    
    floor.rooms.forEach(room => {
      schema += `#### ${room.tag} - ${room.name}\n`;
      schema += `**Purpose:** ${room.purpose}\n\n`;
      schema += `**Core Question:** ${room.coreQuestion}\n\n`;
      schema += `**METHOD (USE EXACTLY AS WRITTEN):** ${room.method}\n\n`;
      schema += `**Examples:**\n`;
      room.examples.forEach(ex => schema += `- ${ex}\n`);
      schema += `\n**Pitfalls to Avoid:**\n`;
      room.pitfalls.forEach(pit => schema += `- ${pit}\n`);
      schema += `\n---\n\n`;
    });
  });
  
  return schema;
}

/**
 * Validate that a response only uses real rooms
 */
export function validateJeevesResponse(response: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for common hallucination patterns
  const roomTagPattern = /\*\*([A-Z]{1,4})\s*[-:]/g;
  let match;
  
  while ((match = roomTagPattern.exec(response)) !== null) {
    const tag = match[1];
    if (!ROOM_BY_TAG.has(tag)) {
      errors.push(`Invalid room tag "${tag}" - this room does not exist in the Palace`);
    }
  }
  
  // Check for Theme Room themes being used in Connect-6
  if (response.includes("Connect-6") || response.includes("C6")) {
    const themeRoomThemes = [
      "Life of Christ Wall",
      "Sanctuary Wall", 
      "Time Prophecy Wall",
      "Time-Prophecy Wall",
      "Great Controversy Wall",
      "Heaven Ceiling",
      "Gospel Floor"
    ];
    
    const c6Section = response.match(/Connect-6.*?(?=\*\*|$)/s)?.[0] || "";
    
    themeRoomThemes.forEach(theme => {
      if (c6Section.includes(theme)) {
        errors.push(
          `ERROR: "${theme}" found in Connect-6 section. These themes belong to Theme Room (TRm), NOT Connect-6. ` +
          `Connect-6 is about GENRE rules: Prophecy/Parable/Epistle/History/Gospel/Poetry.`
        );
      }
    });
  }
  
  // Check Bible Freestyle isn't doing philosophy
  if (response.includes("Bible Freestyle") || response.includes("BF")) {
    const bfSection = response.match(/Bible Freestyle.*?(?=\*\*|$)/s)?.[0] || "";
    if (bfSection.length > 300 && !bfSection.match(/→.*?→/)) {
      errors.push(
        `ERROR: Bible Freestyle appears to be doing theological analysis instead of Verse Genetics. ` +
        `BF method is: "Pick a verse; name 3–5 'relatives' (brothers/cousins)." Example: "John 3:16 → Rom 5:8, 1 John 4:9-10, Eph 2:4-5"`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get list of all valid room tags for quick reference
 */
export function getAllRoomTags(): string[] {
  return Array.from(ROOM_BY_TAG.keys());
}

/**
 * Get rooms for a specific floor
 */
export function getRoomsByFloor(floorNumber: number): ValidatedRoom[] {
  return Array.from(VALID_ROOMS.values()).filter(r => r.floor === floorNumber);
}
