import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import { View, StepConfig } from './internal_types';

export const steps: StepConfig[] = [
  { label: 'Load data files', view: View.Upload, icon: CloudUploadIcon },
  { label: 'Column Annotation', view: View.ColumnAnnotation, icon: ViewAgendaIcon },
  { label: 'Value Annotation', view: View.ValueAnnotation, icon: FactCheckIcon },
  { label: 'Dataset Description', view: View.DatasetDescription, icon: DescriptionIcon },
  { label: 'Save', view: View.Download, icon: SaveAltIcon },
];

export const fetchConfigGitHubURL =
  'https://api.github.com/repos/neurobagel/communities/contents/configs';

export const githubRawBaseURL =
  'https://raw.githubusercontent.com/neurobagel/communities/main/configs/';

export const defaultConfigPath = '/default_config/';
