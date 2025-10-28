# Brainscape 24FPS Image Integration Guide

## Current Status

Your project already has Genesis 24fps images located in:
- `src/assets/24fps/genesis/genesis-01.jpg` through `genesis-24.jpg`

## About Brainscape Images

The Brainscape flashcard deck at https://www.brainscape.com/p/32E0K-LH-92GCE contains:

### Available Decks (8 total, 318 flashcards):
1. **Set 1: Genesis 1-24 (Division)** - 24 cards
2. **Set 2: Genesis 25-50 (Multiplication)** - 26 cards  
3. **Set 3: Exodus 1-24 (Deliverance)** - 24 cards
4. **Set 4: Exodus 25-Leviticus 8 (Sanctuary)** - 24 cards
5. **Leviticus 9-Numbers 5 (Laws)** - 24 cards
6. **Numbers 6-29** - 24 cards
7. **The PhotoTheology Bible** - 122 cards
8. **The Bible Rendered Revised** - 50 cards

## Image Access Limitation

The Brainscape images are hosted on AWS S3 but require authentication:
- Images are at URLs like: `https://s3.amazonaws.com/brainscape-prod/...`
- They're protected behind Brainscape's paywall
- Cannot be directly scraped without login credentials

## How to Manually Add Images

If you have access to the Brainscape deck:

1. Log in to Brainscape
2. Navigate to each flashcard
3. Right-click and save each image
4. Place them in the appropriate folders:

```
src/assets/24fps/
├── genesis/
│   ├── genesis-01.jpg (already exists)
│   ├── genesis-02.jpg (already exists)
│   └── ... (already exists through 24)
├── exodus/
│   ├── exodus-01.jpg
│   ├── exodus-02.jpg
│   └── ...
├── leviticus/
│   └── ...
└── numbers/
    └── ...
```

## Using Existing Genesis Images

The Genesis images are already indexed in `src/assets/24fps/genesis/index.ts`:

```typescript
import genesis01 from './genesis-01.jpg';
import genesis02 from './genesis-02.jpg';
// ... etc

export const genesisImages = {
  1: genesis01,
  2: genesis02,
  // ... etc
};
```

## Implementation Recommendation

Since the images require manual download from Brainscape (if you have access), the best approach is:

1. **For Genesis**: Use the existing images already in the project ✅
2. **For other books**: Either:
   - Manually download from Brainscape if you have access
   - Use AI image generation (already implemented in Bible Rendered Room)
   - Contact Ivor Myers for permission to use the images

## Alternative: AI Image Generation

The Bible Rendered Room already has AI image generation capability:
- Navigate to `/bible-rendered-room`
- Click "Generate Image" for each set
- Uses Lovable AI to create custom symbolic images

This provides an immediate solution without needing Brainscape access.
