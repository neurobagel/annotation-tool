import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Typography, Collapse, Button, Tooltip, Box } from '@mui/material';
import { capitalize } from 'lodash';
import { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  tooltip: string;
}

const ExpandableSectionDefaultProps = {
  defaultExpanded: true,
};

function ExpandableSection({
  title,
  children,
  defaultExpanded = true,
  tooltip,
}: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const typography = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography data-cy={`side-column-nav-bar-${title}`}>{capitalize(title)}</Typography>
      {tooltip && (
        <InfoOutlinedIcon
          sx={{ fontSize: '1rem' }}
          color="action"
          data-cy={`side-column-nav-bar-${title}-info-icon`}
        />
      )}
    </Box>
  );

  return (
    <>
      <Tooltip title={tooltip} placement="right" arrow>
        <Button
          data-cy={`side-column-nav-bar-${title}-toggle-button`}
          className="justify-start pl-0"
          fullWidth
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        >
          {typography}
        </Button>
      </Tooltip>
      <Collapse in={expanded}>{children}</Collapse>
    </>
  );
}

ExpandableSection.defaultProps = ExpandableSectionDefaultProps;

export default ExpandableSection;
