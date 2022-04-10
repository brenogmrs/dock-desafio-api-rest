import * as yup from 'yup';

export const idParamSchema = yup.object().shape({
    id: yup.string().uuid().strict(true).required('The property id is required'),
});
