import { useTranslation } from 'react-i18next';
import { palaceFloors, type Floor, type Room } from '@/data/palaceData';

/**
 * Hook that wraps palaceData with i18n translations.
 * Falls back to English originals if translation key is missing.
 */
export function useTranslatedPalaceData() {
  const { t } = useTranslation();

  const translatedFloors: Floor[] = palaceFloors.map(floor => ({
    ...floor,
    name: t(`palaceData.floors.f${floor.number}.name`, floor.name),
    subtitle: t(`palaceData.floors.f${floor.number}.subtitle`, floor.subtitle),
    description: t(`palaceData.floors.f${floor.number}.description`, floor.description),
    rooms: floor.rooms.map(room => ({
      ...room,
      name: t(`palaceData.rooms.${room.id}.name`, room.name),
      purpose: t(`palaceData.rooms.${room.id}.purpose`, room.purpose),
      coreQuestion: t(`palaceData.rooms.${room.id}.coreQuestion`, room.coreQuestion),
      deliverable: t(`palaceData.rooms.${room.id}.deliverable`, room.deliverable),
      action: t(`palaceData.rooms.${room.id}.action`, room.action || ''),
      output: t(`palaceData.rooms.${room.id}.output`, room.output || ''),
      method: t(`palaceData.rooms.${room.id}.method`, room.method),
      examples: room.examples.map((ex, i) =>
        t(`palaceData.rooms.${room.id}.examples.${i}`, ex)
      ),
      pitfalls: room.pitfalls.map((p, i) =>
        t(`palaceData.rooms.${room.id}.pitfalls.${i}`, p)
      ),
      ...(room.quickMode ? {
        quickMode: room.quickMode.map((q, i) =>
          t(`palaceData.rooms.${room.id}.quickMode.${i}`, q)
        ),
      } : {}),
    })),
  }));

  return { translatedFloors };
}

/**
 * Get translated floor by number
 */
export function useTranslatedFloor(floorNumber: number) {
  const { translatedFloors } = useTranslatedPalaceData();
  return translatedFloors.find(f => f.number === floorNumber);
}

/**
 * Get translated room by floor number and room ID
 */
export function useTranslatedRoom(floorNumber: number, roomId: string) {
  const floor = useTranslatedFloor(floorNumber);
  return {
    floor,
    room: floor?.rooms.find(r => r.id === roomId),
  };
}
