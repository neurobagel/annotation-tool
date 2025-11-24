import Ajv from 'ajv';
import { useMemo } from 'react';
import { DataDictionary } from '../../internal_types';
import schema from '../assets/neurobagel_data_dictionary.schema.json';

export function useSchemaValidation(dataDictionary: DataDictionary) {
  return useMemo(() => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const isValid = validate(dataDictionary);

    if (!isValid) {
      const errors =
        validate.errors?.map((error) => {
          const pathSegments = error.instancePath.slice(1).split('/');
          return pathSegments[0];
        }) || [];

      const uniqueErrors = Array.from(new Set(errors));

      return { schemaValid: false, schemaErrors: uniqueErrors };
    }

    return { schemaValid: true, schemaErrors: [] };
  }, [dataDictionary]);
}

export default useSchemaValidation;
