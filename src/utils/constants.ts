import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import { View, StepConfig } from './internal_types';

export const steps: StepConfig[] = [
  { label: 'Upload', view: View.Upload, icon: CloudUploadIcon },
  { label: 'Column Annotation', view: View.ColumnAnnotation, icon: ViewAgendaIcon },
  { label: 'Value Annotation', view: View.ValueAnnotation, icon: FactCheckIcon },
  { label: 'Download', view: View.Download, icon: CloudDownloadIcon },
];

export const fetchConfigGitHubURL =
  'https://api.github.com/repos/neurobagel/communities/contents/configs';

export const githubRawBaseURL =
  'https://raw.githubusercontent.com/neurobagel/communities/main/configs/';

export const defaultConfigPath = '/default_config/';
