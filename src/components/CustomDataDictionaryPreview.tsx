import { ExpandMore, ExpandLess } from '@mui/icons-material';
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
import React, { useState } from 'react';
import { DataDictionary } from '../utils/types';

function CustomDataDictionaryPreview({ dataDictionary }: { dataDictionary: DataDictionary }) {
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

  const renderValue = (value: unknown, key: string): React.ReactNode => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const isExpanded = expandedKeys.has(key);
      return (
        <div>
          <IconButton
            // TODO: use unique values for keys since many columns are going to have `Annotations`
            onClick={() => toggleExpand(key)}
            size="small"
            sx={{ color: theme.palette.primary.main }}
            // TODO: update the data-cy selector to be more specific
            data-cy={`${key}-expand-collapse-button`}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit data-cy={`${key}-nested-section`}>
            <List dense>
              {Object.entries(value).map(([nestedKey, nestedValue]) => (
                <ListItem key={nestedKey}>
                  <ListItemText
                    primary={
                      <Typography fontWeight="bold" data-cy={`${key}-${nestedKey}-nested-key`}>
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
    <div className="mt-6" data-cy="datadictionary-preview">
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
              <div key={key} data-cy={key}>
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

export default CustomDataDictionaryPreview;
