import AddIcon from '@mui/icons-material/Add';
import {
  Fab,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePagination } from '../hooks';
import useDataStore from '../stores/data';
import { MultiColumnMeasuresTerm, MultiColumnMeasuresTermCard } from '../utils/internal_types';
import {
  initializeTermCards,
  getAvailableTerms,
  getColumnOptions,
  getAllMappedColumns,
  getAssignedTermIdentifiers,
  createDeterministicIdGenerator,
} from '../utils/util';
import MultiColumnMeasuresCard from './MultiColumnMeasuresCard';

interface MultiColumnMeasuresProps {
  generateID?: () => string;
}

interface VariableState {
  terms: MultiColumnMeasuresTerm[];
  termCards: MultiColumnMeasuresTermCard[];
}

const defaultProps = {
  generateID: createDeterministicIdGenerator(),
};

function MultiColumnMeasures({
  generateID = createDeterministicIdGenerator(),
}: MultiColumnMeasuresProps) {
  const theme = useTheme();
  const columns = useDataStore((state) => state.columns);
  const updateColumnIsPartOf = useDataStore((state) => state.updateColumnIsPartOf);
  const getStandardizedVariableColumns = useDataStore(
    (state) => state.getStandardizedVariableColumns
  );
  const getTermOptions = useDataStore((state) => state.getTermOptions);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [variableStates, setVariableStates] = useState<Record<string, VariableState>>({});

  // Memoized to prevent new array reference on every render from Zustand selector
  const multiColumnVariables = useDataStore
    .getState()
    .getMappedMultiColumnMeasureStandardizedVariables();

  // Memoized to prevent recalculation on every render since it depends on two values
  const activeVariableTab = useMemo(
    () => multiColumnVariables[activeTab] || null,
    [multiColumnVariables, activeTab]
  );

  // Memoized to prevent object lookup on every render. CurrentState contains the columns and cards of the active multi-column variable
  const currentState = useMemo(
    () => (activeVariableTab ? variableStates[activeVariableTab.identifier] : null),
    [activeVariableTab, variableStates]
  );

  // Memoized to prevent new array reference on every render from Zustand selector
  const currentVariableColumns = useMemo(
    () => (activeVariableTab ? getStandardizedVariableColumns(activeVariableTab) : []),
    [activeVariableTab, getStandardizedVariableColumns]
  );

  const currentTerms = currentState?.terms || [];

  // Memoized to maintain stable reference for dependent hooks (useMemo and useCallback)
  const currentTermCards = useMemo(() => currentState?.termCards || [], [currentState]);

  const itemsPerPage = 3;
  const { currentPage, totalPages, handlePaginationChange } =
    usePagination<MultiColumnMeasuresTermCard>(currentTermCards, itemsPerPage);

  // Memoized to prevent expensive array slicing operation on every render
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return currentTermCards.slice(startIndex, startIndex + itemsPerPage);
  }, [currentTermCards, currentPage, itemsPerPage]);

  const variableAllMappedColumns = getAllMappedColumns(currentTermCards);

  const loadTermsAndInitializeCards = useCallback(async () => {
    if (multiColumnVariables.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const variablePromises = multiColumnVariables
        .filter((variable) => !variableStates[variable.identifier])
        .map(async (variable) => {
          try {
            const terms = await getTermOptions(variable);
            const variableColumns = getStandardizedVariableColumns(variable);
            const termCards = initializeTermCards({
              columns,
              terms,
              variableColumns,
              generateID,
            });

            return {
              identifier: variable.identifier,
              state: { terms, termCards },
            };
          } catch (error) {
            // show a notif error
            return {
              identifier: variable.identifier,
              state: {
                terms: [],
                termCards: [{ id: generateID(), term: null, mappedColumns: [] }],
              },
            };
          }
        });

      const results = await Promise.all(variablePromises);

      const newStates = results.reduce(
        (acc, { identifier, state }) => ({
          ...acc,
          [identifier]: state,
        }),
        {}
      );

      if (Object.keys(newStates).length > 0) {
        setVariableStates((prev) => ({ ...prev, ...newStates }));
      }
    } catch (error) {
      // show a notif error
    } finally {
      setLoading(false);
    }
  }, [
    multiColumnVariables,
    columns,
    getTermOptions,
    getStandardizedVariableColumns,
    generateID,
    variableStates,
  ]);

  useEffect(() => {
    loadTermsAndInitializeCards();
  }, [loadTermsAndInitializeCards]);

  // Reset pagination when changing tabs
  useEffect(() => {
    handlePaginationChange({} as React.ChangeEvent<unknown>, 1);
  }, [activeTab, handlePaginationChange]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const handleAddNewCard = useCallback(() => {
    if (!activeVariableTab) return;

    const newCard: MultiColumnMeasuresTermCard = {
      id: generateID(),
      term: null,
      mappedColumns: [],
    };

    setVariableStates((prev) => {
      const currentCards = prev[activeVariableTab.identifier]?.termCards || [];
      const newTermCards = [...currentCards, newCard];

      return {
        ...prev,
        [activeVariableTab.identifier]: {
          terms: prev[activeVariableTab.identifier]?.terms || [],
          termCards: newTermCards,
        },
      };
    });

    // Update pagination after state update
    setTimeout(() => {
      const newTotalPages = Math.ceil((currentTermCards.length + 1) / itemsPerPage);
      if (newTotalPages > totalPages) {
        handlePaginationChange({} as React.ChangeEvent<unknown>, newTotalPages);
      }
    }, 0);
  }, [
    activeVariableTab,
    currentTermCards.length,
    generateID,
    handlePaginationChange,
    itemsPerPage,
    totalPages,
  ]);

  const handleTermSelect = useCallback(
    (cardId: string, term: MultiColumnMeasuresTerm | null) => {
      if (!activeVariableTab) return;

      setVariableStates((prev) => {
        const currentCards = prev[activeVariableTab.identifier]?.termCards || [];
        const updatedCards = currentCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                term,
              }
            : card
        );

        return {
          ...prev,
          [activeVariableTab.identifier]: {
            terms: prev[activeVariableTab.identifier]?.terms || [],
            termCards: updatedCards,
          },
        };
      });
    },
    [activeVariableTab]
  );

  const handleColumnSelect = useCallback(
    (cardId: string, columnId: string | null) => {
      if (!columnId || !activeVariableTab) return;

      setVariableStates((prev) => {
        const currentCards = prev[activeVariableTab.identifier]?.termCards || [];
        const updatedCards = currentCards.map((card) =>
          card.id === cardId && !card.mappedColumns.includes(columnId)
            ? { ...card, mappedColumns: [...card.mappedColumns, columnId] }
            : card
        );

        return {
          ...prev,
          [activeVariableTab.identifier]: {
            terms: prev[activeVariableTab.identifier]?.terms || [],
            termCards: updatedCards,
          },
        };
      });

      const card = currentTermCards.find((c) => c.id === cardId);
      if (card?.term) {
        updateColumnIsPartOf(columnId, {
          identifier: card.term.identifier,
          label: card.term.label,
        });
      }
    },
    [activeVariableTab, currentTermCards, updateColumnIsPartOf]
  );

  const removeColumnFromCard = useCallback(
    (cardId: string, columnId: string) => {
      if (!activeVariableTab) return;

      setVariableStates((prev) => {
        const currentCards = prev[activeVariableTab.identifier]?.termCards || [];
        const updatedCards = currentCards.map((card) =>
          card.id === cardId
            ? {
                ...card,
                mappedColumns: card.mappedColumns.filter((id) => id !== columnId),
              }
            : card
        );

        return {
          ...prev,
          [activeVariableTab.identifier]: {
            terms: prev[activeVariableTab.identifier]?.terms || [],
            termCards: updatedCards,
          },
        };
      });
      updateColumnIsPartOf(columnId, null);
    },
    [activeVariableTab, updateColumnIsPartOf]
  );

  const removeCard = useCallback(
    (cardId: string) => {
      if (!activeVariableTab) return;

      const card = currentTermCards.find((c) => c.id === cardId);
      if (card) {
        card.mappedColumns.forEach((columnId) => {
          updateColumnIsPartOf(columnId, null);
        });
      }

      setVariableStates((prev) => {
        const currentCards = prev[activeVariableTab.identifier]?.termCards || [];
        const newCards = currentCards.filter((termCard) => termCard.id !== cardId);

        return {
          ...prev,
          [activeVariableTab.identifier]: {
            terms: prev[activeVariableTab.identifier]?.terms || [],
            termCards:
              newCards.length === 0
                ? [{ id: generateID(), term: null, mappedColumns: [] }]
                : newCards,
          },
        };
      });

      if (currentTermCards.length <= 1) {
        handlePaginationChange({} as React.ChangeEvent<unknown>, 1);
      } else {
        const newTotalPages = Math.ceil((currentTermCards.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages) {
          handlePaginationChange({} as React.ChangeEvent<unknown>, newTotalPages);
        }
      }
    },
    [
      activeVariableTab,
      currentTermCards,
      currentPage,
      generateID,
      handlePaginationChange,
      itemsPerPage,
      updateColumnIsPartOf,
    ]
  );

  const columnsAssigned = useCallback(() => {
    if (variableAllMappedColumns.length === 0) return 'No columns assigned';
    if (variableAllMappedColumns.length === 1) return '1 column assigned';
    return `${variableAllMappedColumns.length} columns assigned`;
  }, [variableAllMappedColumns.length]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4" data-cy="multi-column-measures">
      <div className="flex flex-row gap-6 max-w-[1200px] w-full">
        <div className="flex-1 min-w-0">
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

          <div className="flex flex-col items-center">
            <div className="w-full flex flex-col gap-4 mb-4">
              {paginatedItems.map((card) => (
                <MultiColumnMeasuresCard
                  key={card.id}
                  card={card}
                  mappedColumnHeaders={Object.fromEntries(
                    card.mappedColumns.map((id) => [id, columns[id]?.header || `Column ${id}`])
                  )}
                  availableTerms={getAvailableTerms(
                    currentTerms,
                    getAssignedTermIdentifiers(currentTermCards, card.id)
                  )}
                  columnOptions={getColumnOptions(
                    columns,
                    activeVariableTab.identifier,
                    variableAllMappedColumns
                  )}
                  onTermSelect={(term) => handleTermSelect(card.id, term)}
                  onColumnSelect={(columnId) => handleColumnSelect(card.id, columnId)}
                  onRemoveColumn={(columnId) => removeColumnFromCard(card.id, columnId)}
                  onRemoveCard={() => removeCard(card.id)}
                />
              ))}
            </div>

            <Fab
              color="primary"
              onClick={handleAddNewCard}
              className="mt-4"
              data-cy="add-term-card-button"
            >
              <AddIcon />
            </Fab>
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
                  <div key={id} className="p-2 border-b">
                    <Typography
                      sx={{
                        color: variableAllMappedColumns.includes(id)
                          ? theme.palette.primary.main
                          : 'inherit',
                      }}
                    >
                      {header}
                    </Typography>
                  </div>
                ))}
              </div>
              <Typography variant="body2" className="mt-8">
                {columnsAssigned()}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

MultiColumnMeasures.defaultProps = defaultProps;
export default MultiColumnMeasures;
