
-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to generate daily content at 6am UTC
SELECT cron.schedule(
  'generate-daily-content',
  '0 6 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://tdjtumtdkjicnhlpqqzd.supabase.co/functions/v1/daily-content-generator',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkanR1bXRka2ppY25obHBxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzIxNzMsImV4cCI6MjA3Njc0ODE3M30.jwQgnjHjz2v2w9-mKVKMy8mT8Q9VgknxFammzW4V9ng"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Add equation code reference table for consistency
CREATE TABLE IF NOT EXISTS equation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  biblical_reference TEXT,
  floor_association TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE equation_codes ENABLE ROW LEVEL SECURITY;

-- Everyone can view equation codes
CREATE POLICY "Equation codes viewable by all"
  ON equation_codes FOR SELECT
  USING (true);

-- Insert sanctuary furniture codes
INSERT INTO equation_codes (code, category, name, description, biblical_reference, floor_association) VALUES
('BA', 'sanctuary', 'Brazen Altar', 'The altar of burnt offering where sacrifices were made, symbolizing Christ''s sacrifice on the cross', 'Exodus 27:1-8', 'foundation'),
('LA', 'sanctuary', 'Laver', 'The bronze basin for washing, symbolizing baptism and sanctification through God''s Word', 'Exodus 30:17-21', 'foundation'),
('ST', 'sanctuary', 'Showbread Table', 'Table with twelve loaves representing the twelve tribes and Christ as the Bread of Life', 'Exodus 25:23-30', 'wisdom'),
('GC', 'sanctuary', 'Golden Candlestick', 'Seven-branched menorah providing light, symbolizing Christ as the Light and the Holy Spirit', 'Exodus 25:31-40', 'wisdom'),
('AI', 'sanctuary', 'Altar of Incense', 'Golden altar where incense ascended, symbolizing prayers and Christ''s intercession', 'Exodus 30:1-10', 'grace'),
('AR', 'sanctuary', 'Ark of Covenant', 'Most holy object containing the law, symbolizing God''s throne and mercy seat', 'Exodus 25:10-22', 'law'),
('MS', 'sanctuary', 'Mercy Seat', 'Cover of the Ark where God''s presence dwelt, symbolizing atonement through Christ''s blood', 'Exodus 25:17-22', 'grace'),
('VL', 'sanctuary', 'Veil', 'Curtain separating Holy from Most Holy Place, torn at Christ''s death to open access to God', 'Exodus 26:31-35', 'prophecy');

-- Insert feast codes
INSERT INTO equation_codes (code, category, name, description, biblical_reference, floor_association) VALUES
('PO', 'feast', 'Passover', 'Commemoration of deliverance from Egypt, fulfilled in Christ our Passover Lamb', 'Exodus 12:1-14', 'foundation'),
('UB', 'feast', 'Unleavened Bread', 'Seven days of eating bread without leaven, symbolizing sinlessness of Christ', 'Leviticus 23:6-8', 'foundation'),
('FF', 'feast', 'Firstfruits', 'Offering of first harvest, fulfilled in Christ''s resurrection as firstfruits from the dead', 'Leviticus 23:9-14', 'prophecy'),
('PN', 'feast', 'Pentecost', 'Feast of Weeks celebrating harvest, fulfilled in outpouring of Holy Spirit', 'Leviticus 23:15-22', 'grace'),
('TR', 'feast', 'Trumpets', 'Day of trumpet blasts, symbolizing warning and gathering of God''s people', 'Leviticus 23:23-25', 'prophecy'),
('AT', 'feast', 'Day of Atonement', 'Most solemn day of cleansing and judgment, being fulfilled in heavenly sanctuary', 'Leviticus 16:1-34', 'law'),
('TB', 'feast', 'Tabernacles', 'Feast of Booths celebrating God''s provision, pointing to eternal dwelling with God', 'Leviticus 23:33-43', 'glory'),
('SB', 'feast', 'Sabbath', 'Weekly day of rest commemorating creation and redemption, sign of God''s covenant', 'Exodus 20:8-11', 'new_creation');

-- Insert memory palace floor codes
INSERT INTO equation_codes (code, category, name, description, biblical_reference, floor_association) VALUES
('FD', 'palace', 'Foundation', 'First floor: Essential biblical truths and foundations of faith', '1 Corinthians 3:11', 'foundation'),
('WS', 'palace', 'Wisdom', 'Second floor: Understanding and applying God''s wisdom', 'Proverbs 9:10', 'wisdom'),
('KG', 'palace', 'Kingdom', 'Third floor: God''s sovereign rule and kingdom principles', 'Daniel 2:44', 'kingdom'),
('LW', 'palace', 'Law', 'Fourth floor: God''s commandments and righteous standards', 'Psalm 119:105', 'law'),
('GR', 'palace', 'Grace', 'Fifth floor: Salvation by grace through faith in Christ', 'Ephesians 2:8', 'grace'),
('PR', 'palace', 'Prophecy', 'Sixth floor: Prophetic timelines and fulfillment', 'Daniel 8:14', 'prophecy'),
('GL', 'palace', 'Glory', 'Seventh floor: God''s glory revealed in His presence', 'Exodus 40:34', 'glory'),
('NC', 'palace', 'New Creation', 'Eighth floor: New heaven and earth, eternal state', 'Revelation 21:1', 'new_creation');

-- Insert additional symbolic codes
INSERT INTO equation_codes (code, category, name, description, biblical_reference, floor_association) VALUES
('CH', 'christ', 'Christ', 'Jesus the Messiah, Savior and Lord', 'John 1:14', 'foundation'),
('HS', 'spirit', 'Holy Spirit', 'Third person of the Godhead, Comforter and Guide', 'John 14:26', 'grace'),
('CL', 'calvary', 'Calvary', 'The cross where Christ died for our sins', 'Luke 23:33', 'foundation'),
('RS', 'resurrection', 'Resurrection', 'Christ rising from the dead, our hope of eternal life', '1 Corinthians 15:20', 'prophecy'),
('SC', 'second_coming', 'Second Coming', 'Christ''s return in glory to gather His people', '1 Thessalonians 4:16', 'glory'),
('NJ', 'new_jerusalem', 'New Jerusalem', 'Holy city descending from heaven, God''s dwelling with men', 'Revelation 21:2', 'new_creation');
