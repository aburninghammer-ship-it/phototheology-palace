## Heaven's Diary VR Enhancement Plan

### 1. Richer Visual Environments
Generate 6 cosmic-style backdrop images (one per stage) matching the established aesthetic:
- **Creation**: Swirling nebula with cosmic matter forming, deep blues and golds
- **Garden**: Lush ethereal garden with glowing trees, rivers of light
- **Cross**: Dark dramatic sky with a radiant cross breaking through darkness
- **Resurrection**: Explosive golden light burst, empty tomb with dawn breaking
- **Throne Room**: Majestic golden architecture, rainbow aurora, sea of glass
- **New Jerusalem**: Descending city of light, pearl gates, crystal river

These will be rendered as large billboard planes behind each scene for depth and atmosphere.

### 2. Scripture Integration
Add a rotating scripture display to each stage showing 3-4 key verses that cycle during the scene:
- Creation: Gen 1:1, Gen 1:3, Ps 33:6, John 1:1
- Garden: Gen 2:8-9, Gen 2:10, Rev 22:2
- Cross: John 19:30, Isa 53:5, Rom 5:8, 1 Pet 2:24
- Resurrection: Matt 28:6, Rom 6:9, 1 Cor 15:55
- Throne: Rev 4:2-3, Rev 4:8, Dan 7:9-10
- New Jerusalem: Rev 21:2-4, Rev 22:1-2, Rev 21:23

Verses will gently fade in/out as floating text panels within the 3D scene.

### 3. Ambient Soundscapes (Layered)
Add subtle ambient audio layers per scene using the Web Audio API:
- Creation: Deep cosmic rumble, ethereal tones
- Garden: Gentle water flowing, birds, rustling leaves
- Cross: Thunder, wind, solemn tone
- Resurrection: Rising orchestral swell, triumphant horns
- Throne: Angelic choir hum, reverberant chimes
- New Jerusalem: Crystal bells, flowing water, peaceful chimes

We'll generate these via the ElevenLabs SFX API and cache them in storage.

### Implementation Order
1. Generate backdrop images (6 images)
2. Add scripture cycling system
3. Wire up ambient soundscapes
