import * as yup from 'yup';

export const createAccountHolderSchema = yup.object().shape({
    full_name: yup
        .string()
        .strict(true)
        .required('The property full_name is required'),
    cpf: yup
        .string()
        .strict(true)
        .matches(/^\d{3}\d{3}\d{3}\d{2}$/)
        .required('The property cpf is required'),
});

export const updateAccountHolderSchema = yup.object().shape({
    full_name: yup.string().strict(true).optional(),
});
