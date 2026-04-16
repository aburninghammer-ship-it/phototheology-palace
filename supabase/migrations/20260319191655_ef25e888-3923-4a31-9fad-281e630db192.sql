-- Mark truncated devotionals as failed so cron regenerates them
UPDATE daily_audio_devotionals 
SET status = 'failed', 
    error_message = 'Text truncated - marked for regeneration',
    updated_at = now()
WHERE day_number IN (52, 136, 139, 157, 166, 171, 172)
AND status IN ('ready', 'text_ready');