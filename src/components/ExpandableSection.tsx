import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Typography, Collapse, Button } from '@mui/material';
import { capitalize } from 'lodash';
import { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSectionDefaultProps = {
  defaultExpanded: true,
};

function ExpandableSection({ title, children, defaultExpanded = true }: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <>
      <Button
        data-cy={`side-column-nav-bar-${title}-toggle-button`}
        className="justify-start pl-0"
        fullWidth
        onClick={() => setExpanded(!expanded)}
        startIcon={expanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
      >
        <Typography data-cy={`side-column-nav-bar-${title}`}>{capitalize(title)}</Typography>
      </Button>
      <Collapse in={expanded}>{children}</Collapse>
    </>
  );
}

ExpandableSection.defaultProps = ExpandableSectionDefaultProps;

export default ExpandableSection;
