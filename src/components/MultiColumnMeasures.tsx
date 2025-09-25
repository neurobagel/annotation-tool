import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { Fab, Card, CardContent, CardHeader, Typography, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import {
  useMultiColumnMeasuresState,
  useMultiColumnMeasuresData,
  useActiveVariableData,
} from '../hooks';
import useDataStore from '../stores/data';
import { MultiColumnMeasuresInstructions } from '../utils/instructions';
import { MultiColumnMeasuresTerm } from '../utils/internal_types';
import { getColumnsAssignedText, createMappedColumnHeaders } from '../utils/util';
import Instruction from './Instruction';
import MultiColumnMeasuresCard from './MultiColumnMeasuresCard';

function MultiColumnMeasures() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const updateColumnStandardizedVariable = useDataStore(
    (state) => state.updateColumnStandardizedVariable
  );

  const stateManager = useMultiColumnMeasuresState();
  const { multiColumnVariables, columns } = useMultiColumnMeasuresData();
  const { activeVariableTab, currentVariableColumns, currentTermCards, variableAllMappedColumns } =
    useActiveVariableData(multiColumnVariables, activeTab);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddNewCard = () => {
    if (activeVariableTab) {
      stateManager.addTermCard(activeVariableTab.identifier);
    }
  };

  const handleTermSelect = (cardId: string, term: MultiColumnMeasuresTerm | null) => {
    if (activeVariableTab) {
      stateManager.updateTermInCard(activeVariableTab.identifier, cardId, term);
    }
  };

  const handleColumnSelect = (cardId: string, columnId: string | null) => {
    if (columnId && activeVariableTab) {
      stateManager.addColumnToCard(activeVariableTab.identifier, cardId, columnId);
    }
  };

  const handleRemoveColumn = (cardId: string, columnId: string) => {
    if (activeVariableTab) {
      stateManager.removeColumnFromCard(activeVariableTab.identifier, cardId, columnId);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    if (activeVariableTab) {
      stateManager.removeTermCard(activeVariableTab.identifier, cardId);
    }
  };

  const handleUnassignColumn = (columnId: string) => {
    if (!activeVariableTab) {
      return;
    }

    const cardWithColumn = currentTermCards.find((card) => card.mappedColumns.includes(columnId));

    if (cardWithColumn) {
      stateManager.removeColumnFromCard(activeVariableTab.identifier, cardWithColumn.id, columnId);
    }

    updateColumnStandardizedVariable(columnId, null);
  };

  if (!activeVariableTab) {
    return null;
  }

  return (
    <div className="flex justify-center p-4" data-cy="multi-column-measures">
      <div className="flex flex-row gap-6 max-w-[1200px] w-full">
        <div className="flex-1 min-w-0">
          <Instruction title="Multi-Column Measures" className="mb-2">
            <MultiColumnMeasuresInstructions />
          </Instruction>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Multi-column measures tabs"
          >
            {multiColumnVariables.map((variable, index) => (
              <Tab
                data-cy={`multi-column-measures-tab-${variable.label}`}
                key={variable.identifier}
                label={variable.label}
                id={`tab-${index}`}
              />
            ))}
          </Tabs>

          <div className="flex flex-col">
            <div className="w-full h-[65vh] overflow-y-auto">
              <div className="space-y-4">
                {currentTermCards.map((card, index) => (
                  <div key={card.id} className="w-full">
                    <MultiColumnMeasuresCard
                      card={card}
                      cardIndex={index}
                      mappedColumnHeaders={createMappedColumnHeaders(card.mappedColumns, columns)}
                      availableTerms={
                        stateManager.availableTermsForVariables[activeVariableTab.identifier]?.[
                          card.id
                        ] ||
                        stateManager.availableTermsForVariables[activeVariableTab.identifier]
                          ?.null ||
                        []
                      }
                      columnOptions={
                        stateManager.columnOptionsForVariables[activeVariableTab.identifier] || []
                      }
                      onTermSelect={(term) => handleTermSelect(card.id, term)}
                      onColumnSelect={(columnId) => handleColumnSelect(card.id, columnId)}
                      onRemoveColumn={(columnId) => handleRemoveColumn(card.id, columnId)}
                      onRemoveCard={() => handleRemoveCard(card.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Fab color="primary" onClick={handleAddNewCard} data-cy="add-term-card-button">
                <AddIcon />
              </Fab>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Card
            className="w-full shadow-lg"
            elevation={3}
            data-cy="multi-column-measures-columns-card"
          >
            <CardHeader className="bg-gray-50" title={`${activeVariableTab.label}: all columns`} />
            <CardContent className="text-center">
              <div className="max-h-[500px] overflow-auto">
                {currentVariableColumns.map(({ id, header }) => (
                  <div key={id} className="p-2 border-b flex items-center justify-between">
                    <Typography
                      sx={{
                        color: variableAllMappedColumns.includes(id)
                          ? theme.palette.primary.main
                          : 'inherit',
                      }}
                    >
                      {header}
                    </Typography>
                    <CancelIcon
                      sx={{
                        fontSize: 16,
                        color: theme.palette.grey[500],
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.error.main,
                        },
                      }}
                      onClick={() => handleUnassignColumn(id)}
                      data-cy={`unassign-column-${id}`}
                    />
                  </div>
                ))}
              </div>
              <Typography variant="body2" className="mt-8">
                {getColumnsAssignedText(variableAllMappedColumns.length)}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MultiColumnMeasures;
