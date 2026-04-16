// Floor 1: Furnishing - Memory & Visualization

export * from './StoryRoomGraphics';
export * from './ImaginationRoomGraphics';
export * from './TwentyFourFPSGraphics';
export * from './BibleRenderedGraphics';
export * from './TranslationRoomGraphics';
export * from './GemsRoomGraphics';

// Room graphics mapping for Floor 1
export const FLOOR_1_GRAPHICS = {
  sr: {
    flowchart: 'StoryRoomFlowchart',
    concept: 'StoryRoomConcept',
    example: 'StoryRoomExample'
  },
  ir: {
    flowchart: 'ImaginationRoomFlowchart',
    concept: 'ImaginationRoomConcept',
    example: 'ImaginationRoomExample'
  },
  '24fps': {
    flowchart: 'TwentyFourFPSFlowchart',
    concept: 'TwentyFourFPSConcept',
    example: 'TwentyFourFPSExample'
  },
  br: {
    flowchart: 'BibleRenderedFlowchart',
    concept: 'BibleRenderedConcept',
    example: 'BibleRenderedExample'
  },
  tr: {
    flowchart: 'TranslationRoomFlowchart',
    concept: 'TranslationRoomConcept',
    example: 'TranslationRoomExample'
  },
  gr: {
    flowchart: 'GemsRoomFlowchart',
    concept: 'GemsRoomConcept',
    example: 'GemsRoomExample'
  }
};
