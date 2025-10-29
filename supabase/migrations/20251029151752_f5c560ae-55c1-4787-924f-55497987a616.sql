-- Add Phototheology columns to strongs_dictionary
ALTER TABLE strongs_dictionary
ADD COLUMN IF NOT EXISTS sanctuary_link TEXT,
ADD COLUMN IF NOT EXISTS time_zone_code TEXT,
ADD COLUMN IF NOT EXISTS dimension_code TEXT,
ADD COLUMN IF NOT EXISTS cycle_code TEXT,
ADD COLUMN IF NOT EXISTS prophecy_link TEXT,
ADD COLUMN IF NOT EXISTS pt_notes TEXT;

-- Create index for faster lookups  
CREATE INDEX IF NOT EXISTS idx_strongs_dictionary_number 
ON strongs_dictionary(strongs_number);

-- Add helpful comments
COMMENT ON COLUMN strongs_dictionary.sanctuary_link IS 'Link to Sanctuary furniture/location (e.g., SAN-ARK for Most Holy Place)';
COMMENT ON COLUMN strongs_dictionary.time_zone_code IS 'Time-Zone placement (e.g., Hpa→Ef for Heaven past to Earth future)';
COMMENT ON COLUMN strongs_dictionary.dimension_code IS 'Dimension Room code (e.g., 3D for Christ-centered)';
COMMENT ON COLUMN strongs_dictionary.cycle_code IS 'Cycle code (e.g., @Mo for Mosaic, @CyC for Cyrus-Christ)';
COMMENT ON COLUMN strongs_dictionary.prophecy_link IS 'Link to prophetic timeline or pattern';
COMMENT ON COLUMN strongs_dictionary.pt_notes IS 'Full Phototheology teaching notes and connections';