import { useTranslation } from 'react-i18next';
import type { Floor, Room } from '@/data/palaceData';

/**
 * Hook that provides translated palace data.
 * Falls back to English (the palaceData.ts defaults) when no translation exists.
 */
export function usePalaceTranslation() {
  const { t } = useTranslation();

  const translateFloor = (floor: Floor): Floor => ({
    ...floor,
    name: t(`palace.floors.${floor.number}.name`, floor.name),
    subtitle: t(`palace.floors.${floor.number}.subtitle`, floor.subtitle),
    description: t(`palace.floors.${floor.number}.description`, floor.description),
    rooms: floor.rooms.map(room => translateRoom(room)),
  });

  const translateRoom = (room: Room): Room => ({
    ...room,
    name: t(`palace.rooms.${room.id}.name`, room.name),
    purpose: t(`palace.rooms.${room.id}.purpose`, room.purpose),
    coreQuestion: t(`palace.rooms.${room.id}.coreQuestion`, room.coreQuestion),
    action: room.action ? t(`palace.rooms.${room.id}.action`, room.action) : room.action,
    output: room.output ? t(`palace.rooms.${room.id}.output`, room.output) : room.output,
    deliverable: t(`palace.rooms.${room.id}.deliverable`, room.deliverable),
  });

  return { translateFloor, translateRoom, t };
}
