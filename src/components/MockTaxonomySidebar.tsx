import { useDraggable, useDroppable } from '@dnd-kit/core';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Typography,
    Badge,
    TextField,
    IconButton,
    InputAdornment,
    Collapse,
} from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import React, { useState } from 'react';

export interface TaxonomyNode {
    id: string;
    label: string;
    count: number;
    children?: TaxonomyNode[];
    isMultiColumn?: boolean;
}

interface MockTaxonomySidebarProps {
    nodes: TaxonomyNode[];
    selectedNodeId: string | null;
    onNodeSelect: (nodeId: string | null) => void;
}

interface DraggableTreeItemProps {
    nodeId: string;
    label: React.ReactNode;
    children?: React.ReactNode;
    isSelected?: boolean;
}

function DraggableTreeItem({ nodeId, label, children, isSelected }: DraggableTreeItemProps) {
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `sidebar - ${nodeId} `,
        data: { type: 'sidebar', id: nodeId },
    });

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        isDragging,
    } = useDraggable({
        id: `sidebar - drag - ${nodeId} `,
        data: { type: 'sidebar', id: nodeId },
    });

    return (
        <TreeItem
            itemId={nodeId}
            label={
                <Box
                    ref={(node: HTMLElement | null) => {
                        setDroppableRef(node);
                        setDraggableRef(node);
                    }}
                    {...listeners}
                    {...attributes}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        opacity: isDragging ? 0.5 : 1,
                        backgroundColor: isOver
                            ? 'rgba(25, 118, 210, 0.12)'
                            : isSelected
                                ? 'rgba(25, 118, 210, 0.08)'
                                : 'transparent',
                        borderRadius: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                            backgroundColor: isOver
                                ? 'rgba(25, 118, 210, 0.12)'
                                : isSelected
                                    ? 'rgba(25, 118, 210, 0.12)'
                                    : 'action.hover',
                        }
                    }}
                >
                    {label}
                </Box>
            }
        >
            {children}
        </TreeItem>
    );
}

export default function MockTaxonomySidebar({
    nodes,
    selectedNodeId,
    onNodeSelect,
}: MockTaxonomySidebarProps) {
    const [assessmentQuery, setAssessmentQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState<string[]>(['demographics', 'std_assessment', 'data_types']);

    const handleExpansionChange = (event: React.SyntheticEvent | null, itemIds: string[]) => {
        if (event && event.type === 'click') {
            const target = event.target as HTMLElement;
            // Only allow toggling expansion if clicking the icon container explicitly
            if (!target.closest('.MuiTreeItem-iconContainer')) {
                return;
            }
        }
        setExpandedNodes(itemIds);
    };

    const handleSelect = (event: React.SyntheticEvent | null, nodeId: string | null) => {
        const target = event?.target as HTMLElement;
        // Ignore selection requests if the click originated from the expansion icon
        if (target && target.closest('.MuiTreeItem-iconContainer')) {
            return;
        }

        if (nodeId === selectedNodeId) {
            onNodeSelect(null);
        } else {
            onNodeSelect(nodeId);
        }
    };

    const renderTree = (nodesToRender: TaxonomyNode[]) =>
        nodesToRender.map((node) => {
            let childrenToRender = node.children;

            // Apply local search filtering for the assessment tool terms
            if (node.id === 'std_assessment' && childrenToRender) {
                let filteredChildren = childrenToRender;

                if (assessmentQuery.trim() !== '') {
                    const lowerQuery = assessmentQuery.toLowerCase();
                    filteredChildren = filteredChildren.filter(
                        (child) =>
                            child.label.toLowerCase().includes(lowerQuery) ||
                            child.id === 'unassigned_std_assessment'
                    );
                } else {
                    // Copy to avoid mutating original array when sorting
                    filteredChildren = [...filteredChildren];
                }

                // Sort: Unassigned first, then terms with count > 0, then the rest
                filteredChildren.sort((a, b) => {
                    if (a.id === 'unassigned_std_assessment') return -1;
                    if (b.id === 'unassigned_std_assessment') return 1;
                    if (a.count > 0 && b.count === 0) return -1;
                    if (a.count === 0 && b.count > 0) return 1;
                    return 0;
                });

                // Limit to 50 items to prevent rendering thousands of Draggable nodes
                childrenToRender = filteredChildren.slice(0, 50);
            }

            const labelContent = (
                <div className="flex items-center w-full group">
                    <DragIndicatorIcon
                        fontSize="small"
                        className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mr-1 -ml-1 flex-shrink-0"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {node.label}
                    </Typography>
                    <Badge
                        badgeContent={node.count}
                        color="primary"
                        sx={{
                            '& .MuiBadge-badge': {
                                position: 'static',
                                transform: 'none',
                                ml: 1,
                            },
                        }}
                        max={999}
                    />
                </div>
            );

            return (
                <DraggableTreeItem
                    key={node.id}
                    nodeId={node.id}
                    label={labelContent}
                    isSelected={selectedNodeId === node.id}
                >
                    {node.id === 'std_assessment' && (
                        <Box
                            sx={{ px: 2, py: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        >
                            {!isSearchVisible ? (
                                <Box
                                    onClick={() => setIsSearchVisible(true)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'text.secondary',
                                        cursor: 'pointer',
                                        '&:hover': { color: 'primary.main' },
                                        transition: 'color 0.2s',
                                        py: 0.5,
                                    }}
                                >
                                    <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Search terms...
                                    </Typography>
                                </Box>
                            ) : (
                                <Collapse in={isSearchVisible}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search terms..."
                                        variant="outlined"
                                        value={assessmentQuery}
                                        onChange={(e) => setAssessmentQuery(e.target.value)}
                                        autoFocus
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" color="disabled" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: assessmentQuery ? (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setAssessmentQuery('')}>
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setIsSearchVisible(false)}>
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 4, backgroundColor: 'grey.50' },
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'transparent' },
                                                '&:hover fieldset': { borderColor: 'grey.300' },
                                                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                            },
                                        }}
                                    />
                                </Collapse>
                            )}
                        </Box>
                    )}
                    {Array.isArray(childrenToRender) ? renderTree(childrenToRender) : null}
                </DraggableTreeItem>
            );
        });

    return (
        <Box
            sx={{
                minWidth: 250,
                maxWidth: 300,
                borderRight: 1,
                borderColor: 'divider',
                height: '100%',
                overflowY: 'auto',
                p: 2,
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Terminology & Data Types
            </Typography>
            <SimpleTreeView
                aria-label="taxonomy sidebar"
                selectedItems={selectedNodeId || ''}
                onSelectedItemsChange={handleSelect}
                expandedItems={expandedNodes}
                onExpandedItemsChange={handleExpansionChange}
                expansionTrigger="iconContainer"
                sx={{
                    // Disable default row-level hover and selection backgrounds
                    '& .MuiTreeItem-content': {
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focused': {
                            backgroundColor: 'transparent',
                        },
                    },
                    // Add distinct hover state to the expansion icon
                    '& .MuiTreeItem-iconContainer': {
                        borderRadius: 1,
                        p: 0.5,
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    },
                }}
            >
                {renderTree(nodes)}
            </SimpleTreeView>
        </Box>
    );
}
