import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import Head from 'next/head';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Pagination,
    Select,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { DashboardLayout } from '../../components/dashboard-layout';
import { colorCollection } from '__mocks__/accounts';
import ColorPicker from 'components/shared/ColorPicker';
import ColorPickerPanel from 'components/shared/ColorPickerPanel';
import IconOnlySelector from 'components/shared/IconOnlySelector';
import { ICON_NAMES } from 'constants/constant';
import { getLanguage } from 'utils/getLanguage'

import { useCategoryStore } from 'stores/useCategoryStore';
import { useAuthStore } from 'stores/useAuthStore';
import useSortCategories from 'hooks/useSortCategories';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 150,
            width: 250
        }
    }
};

const Page = () => {
    const router = useRouter();
    const { categoryId } = router.query;
    // FORM STATES
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [showColorWheel, setShowColorWheel] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('');

    // STORE
    const updateCategory = useCategoryStore((state) => state.updateCategory);
    const deleteCategory = useCategoryStore((state) => state.deleteCategory);
    const categories = useCategoryStore((state) => state.categories);
    const user_id = useAuthStore((state) => state.authState?.user?.uid);
    const [isExpense, setIsExpense, handleExpense, categoryData] = useSortCategories(setSelectedCategory);

    console.log(isEditing);
    const handleSubmit = async (values) => {
        const currentType = isExpense ? 'expense' : 'income';

        updateCategory(
            categoryId,
            {
                category_name: values.categoryName,
                category_color: selectedColor,
                category_type: currentType,
                user_id
            },
        ).then((success) => {
            if (success) {
                router.push('/');
            }
        });

        // RESET STATES
        formik.resetForm();
        setSelectedIcon('');
        setSelectedColor('');
        setOpen(false);
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

    const initialValues = {
        categoryName: '',
        categoryIcon: '',
    };

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit
    });

    const handleDelete = () => {
        deleteCategory(categoryId).then((success) => {
            if (success) {
                router.push('/');
            }
        });
    };

    useEffect(() => {
        const current = categories.find((item) => item.id === categoryId);

        const currentType = current?.type === 'expense';
        setSelectedIcon(current.category_icon);
        setSelectedColor(current.category_color);

        setCurrentCategory(current);

        formik.setFieldValue('categoryName', current.category_name);
    }, [categoryId]);

    if (!currentCategory)
        return (
            <Box
                sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <CircularProgress size={100} />
            </Box>
        );

    return (
        <>
            <Head>
                <title>Categories Detail | CASH</title>
            </Head>
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={'sm'}>
                    <Box
                        sx={{
                            width: {
                                lg: 500,
                                xs: '100%'
                            },
                            display: 'grid',
                            gap: 2
                        }}
                        component='form'
                    >
                        <Typography id='modal-modal-title' variant='h6' component='h2'>
                            {getLanguage().categoryDetails}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                id='category-name'
                                label={getLanguage().categoryName}
                                variant='filled'
                                fullWidth
                                name='categoryName'
                                value={formik.values.categoryName}
                                onChange={formik.handleChange}
                                type='text'
                                disabled={!isEditing}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

                        {/* DEFAULT MODE */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {!isEditing ? (
                                <>
                                    <Button
                                        variant='contained'
                                        sx={{ flex: 1 }}
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        {getLanguage().edit}
                                    </Button>
                                    <Button variant='outlined' sx={{ flex: 1 }} onClick={handleDelete}>
                                        {getLanguage().delete}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant='contained' sx={{ flex: 1 }} onClick={formik.handleSubmit}>
                                        {getLanguage().save}
                                    </Button>
                                    <Button variant='outlined' sx={{ flex: 1 }} onClick={() => setIsEditing(false)}>
                                        {getLanguage().cancel}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
