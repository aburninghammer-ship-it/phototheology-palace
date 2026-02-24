import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { getValidatedRoom } from "@/utils/palaceValidation";

interface RoomLinkProps {
  roomTag: string;
  inline?: boolean;
}

export const RoomLink: React.FC<RoomLinkProps> = ({ roomTag, inline = false }) => {
  const { t } = useTranslation();
  const validatedRoom = getValidatedRoom(roomTag);

  if (!validatedRoom) return <span>{roomTag}</span>;

  if (inline) {
    return (
      <Link
        to={`/palace?floor=${validatedRoom.floor}&room=${roomTag.toLowerCase()}`}
        className="text-primary hover:underline font-semibold"
      >
        {validatedRoom.name}
      </Link>
    );
  }

  return (
    <Link to={`/palace?floor=${validatedRoom.floor}&room=${roomTag.toLowerCase()}`}>
      <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
        {t('roomLink.tagNameFloor', { tag: validatedRoom.tag, name: validatedRoom.name, floor: validatedRoom.floor })}
      </Badge>
    </Link>
  );
};
