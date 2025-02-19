import React, { useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  IconButton,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface DataDictionaryPreviewProps {
  dataDictionary: Record<string, any>;
}

function DataDictionaryPreview({ dataDictionary }: DataDictionaryPreviewProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const theme = useTheme();

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedKeys(new Set());
    } else {
      const allKeys = Object.keys(dataDictionary);
      setExpandedKeys(new Set(allKeys));
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const renderValue = (value: any, key: string): React.ReactNode => {
    if (typeof value === 'object' && value !== null) {
      const isExpanded = expandedKeys.has(key);
      return (
        <div>
          <IconButton
            onClick={() => toggleExpand(key)}
            size="small"
            sx={{ color: theme.palette.primary.main }}
            data-cy={`${key}-expand-collapse-button`}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List dense>
              {Object.entries(value).map(([nestedKey, nestedValue]) => (
                <ListItem key={nestedKey}>
                  <ListItemText
                    primary={
                      <Typography fontWeight="bold" data-cy={`${nestedKey}-nested-key`}>
                        {nestedKey}
                      </Typography>
                    }
                    secondary={renderValue(nestedValue, nestedKey)}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </div>
      );
    }
    return (
      <Typography variant="body2" data-cy={`${key}-value`}>
        {JSON.stringify(value)}
      </Typography>
    );
  };

  return (
    <div className="mt-6" data-cy="data-dictionary-preview">
      <Paper elevation={3} className="w-full overflow-x-auto shadow-lg">
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button
              variant="outlined"
              onClick={toggleExpandAll}
              startIcon={isAllExpanded ? <ExpandLess /> : <ExpandMore />}
              data-cy="expand-collapse-all-button"
            >
              {isAllExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>
          <List dense>
            {Object.entries(dataDictionary).map(([key, value]) => (
              <div key={key} data-cy={`dictionary-item-${key}`}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight="bold"
                        color={theme.palette.primary.main}
                        data-cy={`${key}-key`}
                      >
                        {key}
                      </Typography>
                    }
                    secondary={renderValue(value, key)}
                  />
                </ListItem>
                <Divider component="li" />
              </div>
            ))}
          </List>
        </div>
      </Paper>
    </div>
  );
}

export default DataDictionaryPreview;
