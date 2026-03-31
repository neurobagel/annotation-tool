import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import ExpandableSection from './ExpandableSection';

interface GlobalSettingsNavProps {
  isSelected: boolean;
  onSelect: () => void;
}

function GlobalSettingsNav({ isSelected, onSelect }: GlobalSettingsNavProps) {
  return (
    <ExpandableSection title="Global Settings" defaultExpanded>
      <List>
        <ListItem disablePadding sx={{ paddingLeft: 2 }}>
          <ListItemButton selected={isSelected} onClick={onSelect} sx={{ borderRadius: 1 }}>
            <ListItemText primary="Global Missing Values" />
          </ListItemButton>
        </ListItem>
      </List>
    </ExpandableSection>
  );
}

export default GlobalSettingsNav;
