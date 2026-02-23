import { Box, Typography, Badge } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import React from 'react';

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

export default function MockTaxonomySidebar({
    nodes,
    selectedNodeId,
    onNodeSelect,
}: MockTaxonomySidebarProps) {
    const handleSelect = (_event: React.SyntheticEvent | null, nodeId: string | null) => {
        // If selecting the currently selected node again, unselect it
        if (nodeId === selectedNodeId) {
            onNodeSelect(null);
        } else {
            // "root" is a dummy ID if we used one for a top level group, 
            // but let's just make it unselectable or clear selection
            if (nodeId === 'demographics' || nodeId === 'assessments') {
                // Optionally allow selecting the group folder itself
                onNodeSelect(nodeId);
            } else {
                onNodeSelect(nodeId);
            }
        }
    };

    const renderTree = (nodesToRender: TaxonomyNode[]) =>
        nodesToRender.map((node) => (
            <TreeItem
                key={node.id}
                itemId={node.id}
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
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
                    </Box>
                }
            >
                {Array.isArray(node.children) ? renderTree(node.children) : null}
            </TreeItem>
        ));

    return (
        <Box sx={{ minWidth: 250, maxWidth: 300, borderRight: 1, borderColor: 'divider', height: '100%', overflowY: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Columns
            </Typography>
            <SimpleTreeView
                aria-label="taxonomy sidebar"
                selectedItems={selectedNodeId || ''}
                onSelectedItemsChange={handleSelect}
                defaultExpandedItems={['demographics', 'std_assessment']}
            >
                {renderTree(nodes)}
            </SimpleTreeView>
        </Box>
    );
}
