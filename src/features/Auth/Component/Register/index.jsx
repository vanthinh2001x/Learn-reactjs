import React from 'react';
import PropTypes from 'prop-types';
import RegisterForm from '../RegisterForm';
import { useDispatch } from 'react-redux';
import { register } from 'features/Auth/userSlice';
import { useSnackbar } from 'notistack';

Register.propTypes = {
    closeDialog: PropTypes.func,
};

function Register(props) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const handleSubmit = async (values) => {
        try {
            values.username = values.email;
            console.log(values);
            const action = register(values);
            const user = await dispatch(action).unwrap();
            enqueueSnackbar('Register successfully!', { variant: 'success' });
            const { closeDialog } = props;
            if (closeDialog) closeDialog();
            console.log(user);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            console.log('Failed to register: ', error);
        }
    };
    return <RegisterForm onSubmit={handleSubmit} />;
}

export default Register;
