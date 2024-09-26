import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    Grid,
    InputLabel,
    Link,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import PollIcon from '@mui/icons-material/PollOutlined';
import Carousel from 'react-material-ui-carousel';

import { useAuthStore } from 'stores/useAuthStore';

import { DashboardLayout } from '../components/dashboard-layout';
import Image from 'next/image';
import { Icon } from 'components/shared/Icon';
import premadeCategories from 'data/categories';
import { useRouter } from 'next/router';
import { useLanguageStore } from 'stores/useLanguageStore';
import toast from 'react-hot-toast';

const categories = premadeCategories
    .filter((item) => item.category_type === 'expense')
    .map((item) => ({
        id: item.id,
        choice: item.category_name,
        value: item.id,
        text: item.category_name
    }));

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 150,
            width: {
                xs: '100%',
                md: 250
            }
        }
    }
};

const formControlStyle = {
    width: {
        xs: '100%',
        md: '80%'
    }
};

const multiplesOfTen = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const surveyList = [
    {
        id: 1,
        source: '/static/images/svg/survey-1.svg',
        question: 'What is your monthly salary? \n (Ano ang iyong buwanang sweldo?)',
        choices: [
            {
                id: 8,
                choice: 'H',
                value: '8',
                text: `I don't earn money / currently a student`,
                min: 0,
                max: 0
            },
            {
                id: 1,
                choice: 'A',
                value: '1',
                text: 'Less than ₱9,100',
                min: 0,
                max: 9100
            },
            {
                id: 2,
                choice: 'B',
                value: '2',
                text: 'Between ₱9,100 to ₱18,200',
                min: 9100,
                max: 18200
            },
            {
                id: 3,
                choice: 'C',
                value: '3',
                text: 'Between ₱18,200 to ₱36,400',
                min: 18200,
                max: 36400
            },
            {
                id: 4,
                choice: 'D',
                value: '4',
                text: 'Between ₱36,400 to ₱63,700',
                min: 36400,
                max: 63700
            },
            {
                id: 5,
                choice: 'E',
                value: '5',
                text: 'Between ₱63,700 to ₱109,200',
                min: 63700,
                max: 109200
            },
            {
                id: 6,
                choice: 'F',
                value: '6',
                text: 'Between ₱109,200 to ₱182,000',
                min: 109200,
                max: 182000
            },
            {
                id: 7,
                choice: 'G',
                value: '7',
                text: 'At least ₱182,000 and up',
                min: 182000,
                max: 0
            }
        ],
        count: 1
    },

    {
        id: 2,
        source: '/static/images/svg/survey-2.svg',
        question:
            'Choose categories you prioritize when spending money \n (Select 3) \n (Ito ang mga kategoryang binibigyan mong prayoridad sa paggastos ng pera.)',
        choices: categories,
        count: 1
    },

    {
        id: 3,
        source: '/static/images/svg/survey-3.svg',
        question: `How do you budget your finances? \n (Paano ang pagkakahati-hati o pag-bubudget ng iyong pera?) 
        `,
        choices: [
            {
                id: 1,
                choice: 'A',
                value: '1',
                text: '50% Needs, 30% Wants, 20% Savings'
            },
            {
                id: 2,
                choice: 'B',
                value: '2',
                text: '40% Needs, 30% Wants, 30% Savings'
            },
            {
                id: 3,
                choice: 'C',
                value: '3',
                text: '60% Needs, 30% Wants, 10% Savings'
            }
        ],
        count: 3
    },

    {
        id: 4,
        source: '/static/images/svg/survey-4.svg',
        question: 'HELLO.',
        choices: ['A', 'B', 'C', 'D'],
        count: 4,
        isMultiple: false,
        value: ''
    }
];

export default function SurveyBlock() {
    const router = useRouter();
    const [questionOne, setQuestionOne] = useState('');
    const [questionTwo, setQuestionTwo] = useState([]);
    const [questionThree, setQuestionThree] = useState({
        needs: 0,
        wants: 0,
        savings: 0,
        total: 0
    });
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
    const [dataPrivacyAnswer, setDataPrivacyAnswer] = useState(false);
    const user = useAuthStore((state) => state.authState.user);
    const [isDone, setIsDone] = useState(false);
    const manageSurvey = useAuthStore((state) => state.manageSurvey);

    const handleSubmit = () => {
        setIsBtnDisabled(true);
        const firstAnswer = surveyList[0].choices.find((item) => questionOne === item.value);
        const secondAnswer = [];

        questionTwo.forEach((item) => {
            const found = premadeCategories.find((current) => current.category_name === item);
            if (found) secondAnswer.push(found);
        });

        manageSurvey(
            {
                questionOne: firstAnswer,
                questionTwo: secondAnswer,
                questionThree
            },
            user.uid
        ).then((_) => {
            setIsBtnDisabled(false);
            setIsDone(true);

            setTimeout(() => {
                router.push('/accounts');
            }, 5000);
        });
    };

    const handleChange = (e) => {
        const value = e.target.value;
        const updated = { ...questionThree };
        updated[e.target.name] = value;

        let total = updated.needs + updated.wants + updated.savings;

        if (total > 100) {
            // console.log({ total });
            toast.error('Total is over 100. You might want to fix that.', { id: 'budget' });
        }
        if (total < 100) {
            // console.log({ total });
            toast.error('Total is less than 100. You might want to fix that.', { id: 'budget' });
        }
        if (total !== 100) {
            // console.log(Object.values(updated));
            // const keysName = Object.keys(updated);
            // let remaining = 100 - total;
            // const targetIndex = Object.values(updated).findIndex((item) => item <= 0);
            // if (targetIndex !== -1) {
            //     updated[keysName[targetIndex]] = remaining;
            // }
            // updated.total = updated.needs + updated.savings + updated.wants;
            // // console.log({ remaining });
        } else {
            console.log('100%');
        }

        // console.log(updated);
        setQuestionThree({ ...updated, total });
    };

    return (
        <Box
            component='main'
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            {isDone && (
                <Paper
                    sx={{
                        background: 'white',
                        position: 'absolute',
                        p: 3,
                        textAlign: 'center',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        zIndex: 90999,
                        height: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        width: {
                            md: '50%',
                            xs: '80%'
                        }
                    }}
                    elevation={20}
                >
                    <Typography variant='h5'>
                        <Typography sx={{ fontSize: 120 }}>😊</Typography>
                        You finished the survey 🎉
                        <br />
                        You will now be redirected to the main dashboard.{' '}
                    </Typography>
                </Paper>
            )}
            <Container maxWidth='md'>
                <Typography variant='h3' sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                    Initial Survey
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ position: 'relative', width: '100%', height: { xs: 200, md: '100%' } }}>
                            <Image src={surveyList[1].source} alt='Image' layout='fill' />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Carousel autoPlay={false} animation='slide' navButtonsAlwaysVisible cycleNavigation={false}>
                            <Paper p={4} sx={{ height: '50vh', p: 4 }}>
                                <Typography variant='h6' mb={2}>
                                    Socio-economic Standing
                                </Typography>
                                <Typography variant='h6' mb={4}>
                                    {surveyList[0].question}
                                </Typography>
                                <Box mb={2}>
                                    <Link
                                        href='https://www.imoney.ph/articles/middle-class-sector-philippines'
                                        target='_blank'
                                    >
                                        <Typography color='textSecondary' variant='caption'>
                                            Source: IMoney PH{' '}
                                        </Typography>
                                    </Link>
                                </Box>
                                <FormControl sx={formControlStyle}>
                                    <InputLabel id='demo-simple-select-label'>Choose Answer</InputLabel>
                                    <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        value={questionOne}
                                        label='Choose Answer'
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setQuestionOne(value);
                                        }}
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                        MenuProps={MenuProps}
                                        inputProps={{ width: '100%', background: 'red' }}
                                    >
                                        {surveyList[0].choices.map((choice, i) => {
                                            return (
                                                <MenuItem key={choice.id + i} value={choice.value}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <ListItemText>{choice.text}</ListItemText>
                                                    </Box>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Paper>

                            {/* QUESTION TWO */}
                            <Paper p={4} sx={{ height: '50vh', p: 4 }}>
                                <Typography variant='h6' mb={4}>
                                    {surveyList[1].question}
                                </Typography>
                                <FormControl sx={formControlStyle}>
                                    <InputLabel id='demo-simple-select-label'>Choose Answer</InputLabel>
                                    <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        value={questionTwo}
                                        label='Choose Answer'
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setQuestionTwo(typeof value === 'string' ? value.split(',') : value);
                                        }}
                                        renderValue={(selected) => {
                                            return (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            );
                                        }}
                                        multiple
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                        MenuProps={MenuProps}
                                    >
                                        {surveyList[1].choices.map((choice, i) => {
                                            return (
                                                <MenuItem key={choice.id + i} value={choice.text}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <ListItemText>{choice.text}</ListItemText>
                                                    </Box>
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Paper>

                            {/* QUESTION 3 */}
                            <Paper p={4} sx={{ height: '50vh', p: 4 }}>
                                <Typography variant='h6' mb={4}>
                                    {surveyList[2].question}
                                </Typography>
                                <Typography variant='h6' mb={4}>
                                    Example: 50% Needs, 30% Wants, 20% Savings
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                                    <FormControl>
                                        <InputLabel id='demo-simple-select-label'>Needs</InputLabel>
                                        <Select
                                            labelId='demo-simple-select-label'
                                            id='demo-simple-select'
                                            value={questionThree.needs}
                                            label='Choose Answer'
                                            onChange={handleChange}
                                            sx={{ display: 'flex', alignItems: 'center', width: 'max-content' }}
                                            MenuProps={MenuProps}
                                            name='needs'
                                        >
                                            {multiplesOfTen.map((choice, i) => {
                                                return (
                                                    <MenuItem key={choice} value={choice}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <ListItemText>{choice} %</ListItemText>
                                                        </Box>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel id='demo-simple-select-label'>Wants</InputLabel>
                                        <Select
                                            labelId='demo-simple-select-label'
                                            id='demo-simple-select'
                                            value={questionThree.wants}
                                            label='Choose Answer'
                                            onChange={handleChange}
                                            sx={{ display: 'flex', alignItems: 'center', width: 'max-content' }}
                                            MenuProps={MenuProps}
                                            name='wants'
                                        >
                                            {multiplesOfTen.map((choice, i) => {
                                                return (
                                                    <MenuItem key={choice} value={choice}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <ListItemText>{choice} %</ListItemText>
                                                        </Box>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel id='demo-simple-select-label'>Savings</InputLabel>
                                        <Select
                                            labelId='demo-simple-select-label'
                                            id='demo-simple-select'
                                            value={questionThree.savings}
                                            label='Choose Answer'
                                            onChange={handleChange}
                                            sx={{ display: 'flex', alignItems: 'center', width: 'max-content' }}
                                            MenuProps={MenuProps}
                                            name='savings'
                                        >
                                            {multiplesOfTen.map((choice, i) => {
                                                return (
                                                    <MenuItem key={choice} value={choice}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <ListItemText>{choice} %</ListItemText>
                                                        </Box>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Paper>
                        </Carousel>

                        <Button
                            variant='contained'
                            size='large'
                            sx={{ display: 'block', width: '80%', marginX: 'auto', mt: 4 }}
                            disabled={
                                !questionOne || questionTwo.length !== 3 || questionThree.total !== 100 || isBtnDisabled
                            }
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
