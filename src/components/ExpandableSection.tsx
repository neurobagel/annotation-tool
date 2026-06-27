import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Typography, Collapse, Button, Tooltip } from '@mui/material';
import { capitalize } from 'lodash';
import { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  tooltip?: string;
}

const ExpandableSectionDefaultProps = {
  defaultExpanded: true,
  tooltip: undefined,
};

function ExpandableSection({
  title,
  children,
  defaultExpanded = true,
  tooltip,
}: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const typography = (
    <Typography data-cy={`side-column-nav-bar-${title}`}>{capitalize(title)}</Typography>
  );

  return (
    <>
      <Button
        data-cy={`side-column-nav-bar-${title}-toggle-button`}
        className="justify-start pl-0"
        fullWidth
        onClick={() => setExpanded(!expanded)}
        startIcon={expanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
      >
        {tooltip ? (
          <Tooltip title={tooltip} placement="right" arrow>
            {typography}
          </Tooltip>
        ) : (
          typography
        )}
      </Button>
      <Collapse in={expanded}>{children}</Collapse>
    </>
  );
}

ExpandableSection.defaultProps = ExpandableSectionDefaultProps;

export default ExpandableSection;
