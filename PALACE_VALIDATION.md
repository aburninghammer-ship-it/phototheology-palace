# Palace Content Validation System

## ⚠️ CRITICAL: Preventing AI Hallucinations

This document explains the multi-layer validation system that prevents Jeeves from hallucinating Palace content.

## The Problem

AI assistants can "hallucinate" - generating plausible-sounding content that doesn't match reality. In Phototheology, this is particularly dangerous because:

1. **Room Confusion**: Using "Connect-6" to discuss the 6 themes (Life of Christ Wall, Sanctuary Wall, etc.) when those actually belong to "Theme Room"
2. **Method Fabrication**: Making up methodologies instead of using the exact methods defined in palaceData.ts
3. **Room Invention**: Creating rooms that don't exist in the Palace structure
4. **Purpose Mixing**: Confusing room purposes (e.g., using Bible Freestyle for philosophical analysis instead of verse linking)

## Example of Hallucination

**WRONG** (Hallucinated Content):
```
**Bible Freestyle (BF):** Approaching this verse with a "Bible Freestyle" lens 
allows us to appreciate its immediate impact. Jesus isn't offering a nuanced 
theological treatise here; he's laying down a foundational truth...
[continues with philosophical analysis]

**Connect-6 (C6):** Applying "Connect-6" helps us trace the interconnectedness:
1. Creation/Fall
2. Old Covenant/New Covenant
3. Adam/Christ
[continues with 6 themes that don't match C6's actual purpose]
```

**CORRECT** (Valid Usage):
```
**Bible Freestyle (BF):** John 3:6 relatives:
- Romans 8:5-8 (flesh vs. Spirit)
- Galatians 5:16-17 (walking by Spirit not flesh)
- 1 Corinthians 2:14 (natural man vs. spiritual)

**Connect-6 (C6):** John 3:6 uses EPISTLE genre - instructional dialogue.
Reading by genre rules: This is didactic teaching, not narrative or poetry.
Look for propositional truth statements and logical structure.
```

## Validation Layers

### Layer 1: Source of Truth (`src/data/palaceData.ts`)

All Palace rooms, their purposes, and methodologies are defined in `palaceData.ts`. This is the single source of truth.

```typescript
{
  id: "bf",
  name: "Bible Freestyle",
  tag: "BF",
  purpose: "Train spontaneous cross-linking (Verse Genetics).",
  coreQuestion: "What verses are this verse's 'relatives'?",
  method: "Pick a verse; name 3–5 'relatives' (brothers/cousins).",
  examples: ["John 3:16 → Rom 5:8, 1 John 4:9-10, Eph 2:4-5"],
  // ...
}
```

### Layer 2: Validation Utilities (`src/utils/palaceValidation.ts`)

Provides functions to:
- Extract valid rooms from palaceData.ts
- Validate that responses only use real rooms
- Check for common hallucination patterns
- Get exact methodologies for rooms

```typescript
import { validateJeevesResponse, getValidatedRoom } from "@/utils/palaceValidation";

// Validate a response
const validation = validateJeevesResponse(response);
if (!validation.valid) {
  console.error("Errors:", validation.errors);
}

// Get room details
const room = getValidatedRoom("BF");
console.log(room.method); // Exact method from palaceData.ts
```

### Layer 3: Edge Function Schema (`supabase/functions/jeeves/palace-schema.ts`)

A complete Palace reference schema injected into Jeeves' system prompt:

```typescript
export const PALACE_SCHEMA = `
# PHOTOTHEOLOGY PALACE - AUTHORITATIVE REFERENCE

## ⚠️ CRITICAL RULES FOR JEEVES ⚠️

1. **NEVER MAKE UP ROOMS** - Only use rooms listed in this schema
2. **NEVER MODIFY METHODOLOGIES** - Use the exact method stated
3. **NEVER CONFUSE ROOMS** - Each room has specific purpose
4. **VALIDATE BEFORE RESPONDING** - Check schema before generating

### BF - Bible Freestyle (Verse Genetics)
**METHOD:** Pick a verse; name 3–5 'relatives' (brothers/cousins).
**Example:** John 3:16 → Rom 5:8, 1 John 4:9-10, Eph 2:4-5
⚠️ CRITICAL: This room is about LISTING RELATED VERSES, not analysis!

### C6 - Connect-6
**METHOD:** Label: Prophecy/Parable/Epistle/History/Gospel/Poetry; apply genre rules.
⚠️ CRITICAL: This room is about GENRE, not the 6 themes! (those are Theme Room)
// ...
`;
```

### Layer 4: Client-Side Validation (`src/components/bible/JeevesResponseValidator.tsx`)

React component that validates responses before displaying them:

```tsx
<JeevesResponseValidator 
  response={response}
  onValidated={(isValid) => {
    if (!isValid) {
      // Alert user to hallucination
      console.warn("Hallucination detected");
    }
  }}
/>
```

## Common Hallucination Patterns Detected

### 1. Wrong Room for Task
```typescript
// Detects BF being used for analysis instead of verse listing
if (bfSection.length > 300 && !bfSection.match(/→.*?→/)) {
  errors.push("BF must list verse relatives, not analyze");
}
```

### 2. Theme Room Content in Connect-6
```typescript
const c6Section = response.match(/Connect-6.*?(?=\*\*|$)/s)?.[0];
if (c6Section.includes("Life of Christ Wall")) {
  errors.push("These themes belong to Theme Room, NOT Connect-6");
}
```

### 3. Invalid Room Tags
```typescript
const roomTagPattern = /\*\*([A-Z]{1,4})\s*[-:]/g;
while ((match = roomTagPattern.exec(response)) !== null) {
  if (!ROOM_BY_TAG.has(match[1])) {
    errors.push(`Room tag "${match[1]}" doesn't exist`);
  }
}
```

## How to Add New Rooms

1. **Add to `palaceData.ts` FIRST**
   ```typescript
   {
     id: "newroom",
     name: "New Room",
     tag: "NR",
     purpose: "Clear purpose statement",
     coreQuestion: "What question does this room answer?",
     method: "Exact step-by-step method",
     examples: ["Concrete examples"],
     pitfalls: ["Common mistakes to avoid"],
     deliverable: "What user should produce"
   }
   ```

2. **Update `palace-schema.ts` in Edge Function**
   - Schema is generated from palaceData, but verify it's included
   - Add any special validation rules if needed

3. **Test Validation**
   ```typescript
   const room = getValidatedRoom("NR");
   expect(room).toBeDefined();
   expect(room.method).toBe("Exact step-by-step method");
   ```

## For Developers

### When Adding Features

1. Always reference `palaceData.ts` as source of truth
2. Use `getValidatedRoom()` to get room details
3. Never hardcode room methodologies
4. Include `JeevesResponseValidator` in UI components

### When Debugging Hallucinations

1. Check console for validation errors
2. Verify edge function has latest PALACE_SCHEMA
3. Look for pattern: is it confusing rooms? making up methods?
4. Add new detection rule if pattern not caught

### Testing

```typescript
import { validateJeevesResponse } from "@/utils/palaceValidation";

test("detects BF hallucination", () => {
  const badResponse = `**Bible Freestyle (BF):** This verse shows us the profound truth...`;
  const result = validateJeevesResponse(badResponse);
  expect(result.valid).toBe(false);
  expect(result.errors[0]).toContain("Verse Genetics");
});

test("allows valid BF usage", () => {
  const goodResponse = `**Bible Freestyle (BF):** John 3:16 → Rom 5:8, 1 John 4:9-10`;
  const result = validateJeevesResponse(goodResponse);
  expect(result.valid).toBe(true);
});
```

## Key Principles

1. **Single Source of Truth**: palaceData.ts defines everything
2. **Strict Validation**: Multiple layers catch different error types
3. **Clear Error Messages**: Users understand what went wrong
4. **Fail Safe**: When in doubt, show error rather than bad content
5. **Continuous Improvement**: Add new detection rules as patterns emerge

## When Validation Fails

If validation detects hallucination:

1. **Alert User**: Show clear error message explaining the issue
2. **Log Details**: Console log for debugging (don't send to analytics)
3. **Don't Display**: Don't show hallucinated content to user
4. **Allow Retry**: Give user option to regenerate response

## Maintenance

This system requires:

- Keep `palaceData.ts` as authoritative source
- Sync `palace-schema.ts` with any palaceData changes
- Update validation rules when new patterns emerge
- Test edge cases with new room additions

## Resources

- **Palace Data**: `src/data/palaceData.ts`
- **Validation Utils**: `src/utils/palaceValidation.ts`
- **Edge Function Schema**: `supabase/functions/jeeves/palace-schema.ts`
- **Validator Component**: `src/components/bible/JeevesResponseValidator.tsx`
- **Example Usage**: `src/components/bible/JeevesVerseAssistant.tsx`
