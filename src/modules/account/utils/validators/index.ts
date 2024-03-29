import * as yup from 'yup';

export const createAccountSchema = yup.object().shape({
    agency: yup.string().strict(true).required('The property agency is required'),
    number: yup.string().strict(true).required('The property number is required'),
    accountHolderCpf: yup
        .string()
        .strict(true)
        .matches(/^\d{3}\d{3}\d{3}\d{2}$/)
        .required('The property cpf is required'),
});

export const updateAccountSchema = yup.object().shape({
    active: yup.boolean().strict(true).optional(),
    status: yup.string().strict(true).oneOf(['AVAILABLE', 'BLOCKED']).optional(),
});

export const depositOrWithdrawAmountSchema = yup.object().shape({
    amount: yup
        .number()
        .positive()
        .strict(true)
        .required('The property amount is required'),
});

export const getAccountStatementSchema = yup.object().shape({
    startDateFilter: yup
        .string()
        .strict(true)
        .matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
        .optional(),
    endDateFilter: yup
        .string()
        .strict(true)
        .matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
        .optional(),
});
