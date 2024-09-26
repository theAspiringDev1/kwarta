import * as React from 'react';
import { useState, forwardRef } from 'react';
import Router from 'next/router';
import { Box, Switch, Snackbar, Alert as MuiAlert, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/Close';

import toast from 'react-hot-toast';

import { useFormik } from 'formik';
import { colorCollection } from '__mocks__/accounts';
import { ICON_NAMES, modalStyle } from 'constants/constant';
import ColorPicker from 'components/shared/ColorPicker';
import ColorPickerPanel from 'components/shared/ColorPickerPanel';
import IconOnlySelector from 'components/shared/IconOnlySelector';
import { getLanguage } from 'utils/getLanguage';

import { useAccountStore } from 'stores/useAccountStore';
import { useAuthStore } from 'stores/useAuthStore';
import { useLanguageStore } from 'stores/useLanguageStore';
import AccountDropdownType from 'components/shared/AccountDropdownType';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: '80vh',
    bgcolor: 'background.paper',
    overflowY: 'scroll',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'grid',
    gap: 4
};

export default function AccountCreateFormModal({ open, setOpen }) {
    const [openAlert, setOpenAlert] = React.useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [showColorWheel, setShowColorWheel] = useState(false);
    const [accountType, setAccountType] = useState('');

    const createAccount = useAccountStore((state) => state.createAccount);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
    const user = useAuthStore((state) => state.authState.user);

    const initialValues = {
        accountName: '',
        accountAmount: '',
        accountIcon: '',
        userId: user?.uid,
        accountDescription: ''
    };

    const handleAccountTypeChange = (e) => {
        console.log(e.target.value);
        setAccountType(e.target.value);
    };

    const handleOpenAlert = () => {
        setOpenAlert(true);
        handleClose();
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    const handleColorClick = (color) => {
        setSelectedColor(color);
        setShowColorWheel(false);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color.hex);
    };

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
        formik.setFieldValue('accountIcon', icon);
    };

    const handleSubmit = (values) => {
        console.log(values);
        const loader = toast.loading('Creating Account');
        createAccount({
            account_name: values.accountName,
            account_amount: Number(values.accountAmount),
            account_color: selectedColor,
            account_icon: values.accountIcon,
            account_description: values.accountDescription,
            account_type: accountType,
            user_id: values.userId
        });
        formik.resetForm();
        setSelectedIcon('');
        setSelectedColor('');
        toast.dismiss(loader);
        setOpen(false);
    };

    const handleClose = () => setOpen(false);

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit
    });

    return (
        <>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity='success' sx={{ width: '100%' }}>
                    {getLanguage(currentLanguage).accountCreated}
                </Alert>
            </Snackbar>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={modalStyle}>
                    <IconButton
                        color='primary'
                        sx={{ position: 'absolute', top: 20, right: 20 }}
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id='modal-modal-title' variant='h6' component='h2'>
                        {getLanguage(currentLanguage).createAccount}
                    </Typography>
                    <FormControl fullWidth onSubmit={formik.handleSubmit}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                            <TextField
                                id='filled-basic'
                                label={getLanguage(currentLanguage).accountName}
                                variant='filled'
                                name='accountName'
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.accountName}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                            <TextField
                                id='filled-basic'
                                label={getLanguage(currentLanguage).accountAmount}
                                variant='filled'
                                name='accountAmount'
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.accountAmount}
                                fullWidth
                            />
                        </Box>

                        <AccountDropdownType handleChange={handleAccountTypeChange} accountType={accountType} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginY: 2 }}>
                            <TextField
                                id='filled-basic'
                                label={getLanguage(currentLanguage).accountDescription || 'Account Description'}
                                variant='filled'
                                multiline
                                name='accountDescription'
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.accountDescription}
                                fullWidth
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginY: 2 }}>
                            <ColorPickerPanel
                                colorList={colorCollection}
                                onColorPress={handleColorClick}
                                selectedColor={selectedColor}
                                setShowColorWheel={setShowColorWheel}
                            />
                            {showColorWheel && (
                                <ColorPicker
                                    handleColorSelect={handleColorSelect}
                                    setShowColorWheel={setShowColorWheel}
                                    selectedColor={selectedColor}
                                />
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                            <IconOnlySelector
                                iconData={Object.values(ICON_NAMES.ACCOUNT_ICONS)}
                                onIconClick={handleIconClick}
                                selectedIcon={selectedIcon}
                                setSelectedIcon={setSelectedIcon}
                            />
                        </Box>
                        <Box sx={{ py: 2 }}>
                            <Button variant='contained' fullWidth onClick={formik.handleSubmit}>
                                {getLanguage(currentLanguage).submit}
                            </Button>
                        </Box>
                    </FormControl>
                </Box>
            </Modal>
        </>
    );
}
