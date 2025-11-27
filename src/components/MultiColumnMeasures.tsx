import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useMultiColumnMeasureCardData } from '../hooks/useMultiColumnMeasureCardData';
import { useMultiColumnMeasureDraftCard } from '../hooks/useMultiColumnMeasureDraftCard';
import { useMultiColumnMeasureTabs } from '../hooks/useMultiColumnMeasureTabs';
import { usePersistedMultiColumnCards } from '../hooks/usePersistedMultiColumnCards';
import { useColumns, useDataActions } from '../stores/data';
import { MultiColumnMeasuresInstructions } from '../utils/instructions';
import Instruction from './Instruction';
import MultiColumnMeasureTabs from './MultiColumnMeasureTabs';
import MultiColumnMeasuresCard from './MultiColumnMeasuresCard';
import MultiColumnMeasuresColumnsSidebar from './MultiColumnMeasuresColumnsSidebar';

function MultiColumnMeasures() {
  const {
    variables: multiColumnVariables,
    activeTab,
    activeVariable,
    setActiveTab,
  } = useMultiColumnMeasureTabs();
  const activeVariableId = activeVariable?.id || '';
  const persistedCards = usePersistedMultiColumnCards(activeVariableId);
  const { draftMeasureCards, createDraft, createCollectionFromDraft, removeDraft, hasDraft } =
    useMultiColumnMeasureDraftCard(activeVariableId);
  const combinedCards = [...persistedCards, ...draftMeasureCards];
  const { cardData, variableAllMappedColumns } = useMultiColumnMeasureCardData(
    activeVariableId,
    combinedCards,
    persistedCards
  );
  const columns = useColumns();
  const actions = useDataActions();
  const currentVariableColumns = activeVariable
    ? Object.entries(columns)
        .filter(([_, column]) => column.standardizedVariable === activeVariable.id)
        .map(([id, column]) => ({ id, header: column.name }))
    : [];
  const canAddDraft = !hasDraft;

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddNewCard = () => {
    if (!canAddDraft) return;
    createDraft();
  };

  const handleCreateCollection = (cardId: string, termId: string | null) => {
    if (!termId) return;
    createCollectionFromDraft(cardId, termId);
  };

  const handleColumnSelect = (termId: string, columnId: string | null) => {
    if (!columnId) return;
    actions.userUpdatesColumnToCollectionMapping(columnId, termId);
  };

  const handleRemoveColumn = (columnId: string) => {
    actions.userUpdatesColumnToCollectionMapping(columnId, null);
  };

  const handleRemoveCard = (cardId: string) => {
    const card = combinedCards.find((c) => c.id === cardId);
    if (card?.term) {
      card.mappedColumns.forEach((colId) => {
        actions.userUpdatesColumnToCollectionMapping(colId, null);
      });
      actions.userDeletesCollection(card.term.id);
    } else {
      removeDraft(cardId);
    }
  };

  const handleUnassignColumn = (columnId: string) => {
    actions.userUpdatesColumnStandardizedVariable(columnId, null);
  };

  if (!activeVariable) {
    return null;
  }

  return (
    <div className="flex justify-center p-4" data-cy="multi-column-measures">
      <div className="flex flex-col max-w-[1200px] w-full">
        <div className="mb-4">
          <Instruction title="Multi-Column Measures">
            <MultiColumnMeasuresInstructions />
          </Instruction>
        </div>
        <div className="flex flex-row gap-6 w-full">
          <div className="flex-1 min-w-0">
            <MultiColumnMeasureTabs
              variables={multiColumnVariables}
              selectedTabIndex={activeTab}
              onChange={handleTabChange}
            />

            <div className="flex flex-col">
              <div className="w-full max-h-[65vh] overflow-y-auto">
                <div className="space-y-4">
                  {cardData.map((card, index) => (
                    <div key={card.id} className="w-full">
                      <MultiColumnMeasuresCard
                        card={card.cardDisplay}
                        cardIndex={index}
                        availableTerms={card.availableTerms}
                        columnOptions={card.columnOptions}
                        mappedColumnHeaders={card.mappedColumnHeaders}
                        onCreateCollection={(termId) => handleCreateCollection(card.id, termId)}
                        onColumnSelect={(termId, columnId) => handleColumnSelect(termId, columnId)}
                        onRemoveColumn={handleRemoveColumn}
                        onRemoveCard={() => handleRemoveCard(card.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Fab
                  color="primary"
                  onClick={handleAddNewCard}
                  disabled={!canAddDraft}
                  data-cy="add-term-card-button"
                >
                  <AddIcon />
                </Fab>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <MultiColumnMeasuresColumnsSidebar
              variableName={activeVariable.name}
              columns={currentVariableColumns}
              mappedColumnIds={variableAllMappedColumns}
              onUnassignColumn={handleUnassignColumn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiColumnMeasures;
