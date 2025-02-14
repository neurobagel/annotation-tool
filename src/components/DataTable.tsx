import React, { useState, useRef } from 'react';
import {
  Button,
  Paper,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Collapse,
  useTheme,
} from '@mui/material';
import { CloudUpload, ExpandMore, ExpandLess } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import useStore from '../stores/store';

function DataTable() {
  // component state
  const [TSVFile, setTSVFile] = useState<File | null>(null);
  const [data, setData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  // store state
  const setDataTable = useStore((state) => state.setDataTable);
  const initializeColumns = useStore((state) => state.initializeColumns);

  const transformDataToColumns = (rows: string[][]) => {
    const columnData: { [key: number]: string[] } = {};
    if (rows.length > 0) {
      const numColumns = rows[0].length;
      for (let col = 0; col < numColumns; col += 1) {
        columnData[col + 1] = rows.map((row) => row[col]);
      }
    }
    return columnData;
  };

  const transformHeadersToColumns = (tsvHeaders: string[]) => {
    const columns: { [key: number]: { header: string } } = {};
    tsvHeaders.forEach((header, index) => {
      columns[index + 1] = { header };
    });
    return columns;
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const rows = content.split('\n').map((row) => row.split('\t'));
      setHeaders(rows[0]);
      setData(rows.slice(1));

      const columnData = transformDataToColumns(rows.slice(1));
      setDataTable(columnData);

      const columnHeaders = transformHeadersToColumns(rows[0]);
      initializeColumns(columnHeaders);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setTSVFile(uploadedFile);
      processFile(uploadedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setTSVFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const handleClickToUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto w-full max-w-[1024px] px-4">
      <Card
        data-cy="data-table-card"
        className="rounded-3xl border-2 border-solid border-gray-300 p-4 text-center"
      >
        <Typography variant="h5" component="h2" className="mb-4 text-left">
          Data Table
        </Typography>

        <Card
          data-cy="upload-area"
          elevation={3}
          className="mx-auto max-w-[768px] cursor-pointer rounded-3xl border-2 border-dashed border-gray-300 p-8 transition-colors"
          onClick={handleClickToUpload}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            '&:hover': {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <CloudUpload
            className="mb-4 text-4xl text-gray-400"
            style={{ color: theme.palette.primary.main }}
          />
          <Typography variant="body1" className="mb-2">
            Upload your tabular phenotypic file (.tsv format)
          </Typography>
          <Typography variant="body2" className="mb-4 text-gray-500">
            <span
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                color: theme.palette.primary.main,
              }}
            >
              Click to upload
            </span>{' '}
            or drag and drop
          </Typography>
          <input type="file" hidden accept=".tsv" onChange={handleFileUpload} ref={fileInputRef} />
        </Card>

        {TSVFile && (
          <div className="mt-4">
            <Typography variant="body1" className="mb-2" data-cy="uploaded-datatable-file-name">
              <strong>{TSVFile.name}</strong>
            </Typography>
            <Button
              data-cy="toggle-datatable-preview"
              variant="outlined"
              onClick={togglePreview}
              endIcon={isPreviewOpen ? <ExpandLess /> : <ExpandMore />}
            >
              {isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>
        )}
      </Card>

      <Collapse in={isPreviewOpen} timeout="auto" unmountOnExit>
        {TSVFile && (
          <div className="mt-6">
            <TableContainer
              component={Paper}
              elevation={3}
              className="w-full overflow-x-auto shadow-lg"
            >
              <Table className="min-w-[768px]" data-cy="data-table">
                <TableHead>
                  <TableRow className="bg-blue-50">
                    {headers.map((header) => (
                      <TableCell
                        key={uuidv4()}
                        align="left"
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={uuidv4()} className="hover:bg-gray-50">
                      {row.map((cell) => (
                        <TableCell key={uuidv4()} align="left">
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                data-cy="datatable-preview-pagination"
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </div>
        )}
      </Collapse>
    </div>
  );
}

export default DataTable;
