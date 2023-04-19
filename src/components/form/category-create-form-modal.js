import * as React from 'react';
import { useState, forwardRef } from 'react';
import { Box, Switch, Snackbar, Alert as MuiAlert, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import toast from 'react-hot-toast';

import { useFormik } from 'formik';
import { colorCollection } from '__mocks__/accounts';
import { ICON_NAMES, modalStyle } from 'constants/constant';
import ColorPicker from 'components/shared/ColorPicker';
import ColorPickerPanel from 'components/shared/ColorPickerPanel';
import IconOnlySelector from 'components/shared/IconOnlySelector';
import { getLanguage } from 'utils/getLanguage'

import { useCategoryStore } from 'stores/useCategoryStore';
import { useAuthStore } from 'stores/useAuthStore';

export default function CategoryCreateModal({ open, setOpen }) {
    const [isExpense, setIsExpense] = useState(true);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [showColorWheel, setShowColorWheel] = useState(false);

    const user = useAuthStore((state) => state.authState?.user);

    const createCategory = useCategoryStore((state) => state.createCategory);

    const initialValues = {
        categoryName: '',
        categoryIcon: '',
        categoryColor: ''
    };

    const handleExpense = () => {
        setIsExpense(!isExpense);
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
        formik.setFieldValue('categoryIcon', icon);
    };

    const handleSubmit = (values) => {
        console.log(values);
        const loader = toast.loading('Creating Category');
        const currentType = isExpense ? 'expense' : 'income';
        createCategory({
            category_name: values.categoryName,
            category_color: selectedColor,
            category_icon: values.categoryIcon,
            category_type: currentType,
            user_id: user?.uid
        });
        formik.resetForm();
        setSelectedIcon('');
        setSelectedColor('');

        toast.dismiss(loader);
        toast.success('Category successfully created!');
        setOpen(false);
    };

    const handleClose = () => setOpen(false);

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit
    });

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={{ ...modalStyle, alignContent: 'start' }}>
                    <IconButton
                        color='primary'
                        sx={{ position: 'absolute', top: 5, right: 5 }}
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id='modal-modal-title' variant='h6'>
                        {getLanguage().createCategory}
                    </Typography>
                    <FormControl fullWidth onSubmit={formik.handleSubmit}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                            <TextField
                                id='filled-basic'
                                label={getLanguage().categoryName}
                                variant='filled'
                                name='categoryName'
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.categoryName}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                            <Typography variant='body1'>{getLanguage().income}</Typography>
                            <Switch
                                checked={isExpense}
                                onChange={handleExpense}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <Typography variant='body1'>{getLanguage().expense}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
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
                                iconData={Object.values(ICON_NAMES.CATEGORY_ICONS)}
                                onIconClick={handleIconClick}
                                selectedIcon={selectedIcon}
                                setSelectedIcon={setSelectedIcon}
                            />
                        </Box>
                        <Box sx={{ py: 2 }}>
                            <Button variant='contained' fullWidth onClick={formik.handleSubmit}>
                                {getLanguage().submit}
                            </Button>
                        </Box>
                    </FormControl>
                </Box>
            </Modal>
        </>
    );
}
