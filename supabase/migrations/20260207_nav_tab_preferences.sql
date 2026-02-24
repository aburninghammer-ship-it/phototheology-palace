-- Add columns for customizable navigation tabs
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS pinned_nav_tabs text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS nav_tab_order text[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN user_preferences.pinned_nav_tabs IS 'Array of tab IDs that are pinned to appear first in navigation';
COMMENT ON COLUMN user_preferences.nav_tab_order IS 'Custom order of remaining navigation tabs (by tab ID)';
