-- Fix broken UPDATE policy on game_rooms (was comparing game_room_players.room_id to game_room_players.id)
DROP POLICY IF EXISTS "Players can update game rooms" ON public.game_rooms;

CREATE POLICY "Players can update game rooms"
ON public.game_rooms
FOR UPDATE
TO authenticated
USING (
  host_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.game_room_players grp
    WHERE grp.room_id = game_rooms.id
      AND grp.user_id = auth.uid()
      AND grp.is_active = true
  )
)
WITH CHECK (
  host_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.game_room_players grp
    WHERE grp.room_id = game_rooms.id
      AND grp.user_id = auth.uid()
      AND grp.is_active = true
  )
);