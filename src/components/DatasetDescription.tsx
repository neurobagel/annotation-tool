import { usePageAlerts } from '../hooks/usePageAlerts';
import { View } from '../utils/internal_types';
import DatasetDescriptionForm from './DatasetDescriptionForm';
import PageAlert from './PageAlert';

function DatasetDescription() {
  const alerts = usePageAlerts(View.DatasetDescription);

  return (
    <div className="flex flex-col items-center p-6" data-cy="dataset-description-page">
      {alerts.map((alert) => (
        <PageAlert key={alert.id} {...alert} className="mb-6 w-full max-w-2xl" />
      ))}

      <div className="w-full max-w-2xl">
        <DatasetDescriptionForm />
      </div>
    </div>
  );
}

export default DatasetDescription;
