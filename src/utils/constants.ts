import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { View, StepConfig } from './types';

export const steps: StepConfig[] = [
  { label: 'Upload', view: View.Upload, icon: CloudUploadIcon },
  { label: 'Column Annotation', view: View.ColumnAnnotation, icon: ViewAgendaIcon },
  { label: 'Value Annotation', view: View.ValueAnnotation, icon: FactCheckIcon },
  { label: 'Download', view: View.Download, icon: CloudDownloadIcon },
];
