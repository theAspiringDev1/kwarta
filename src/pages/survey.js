import Head from 'next/head';
import { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    Grid,
    InputLabel,
    ListItemIcon,
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
import SurveyBlock from 'components/SurveyBlock';

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

const Page = () => {
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
    const setLanguage = useLanguageStore((state) => state.setLanguage);
    const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
    const [dataPrivacyAnswer, setDataPrivacyAnswer] = useState(false);

    const LanguageBlock = () => (
        <Box sx={{ py: 8 }}>
            <Container maxWidth='md'>
                <Typography variant='h4' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    What language do you want to view the website ? (Anong lenggwahe mo nais basahin ang website?)
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            setLanguage('en');
                            setHasSelectedLanguage(true);
                        }}
                    >
                        English
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            setLanguage('ph');
                            setHasSelectedLanguage(true);
                        }}
                    >
                        Filipino
                    </Button>
                </Box>
            </Container>
        </Box>
    );

    const DataPrivacyBlock = () => (
        <Box sx={{ py: 8 }}>
            <Container maxWidth='md'>
                <Typography variant='h3' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    Welcome to CASH.
                </Typography>
                <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    Data Privacy Agreement
                </Typography>

                <Box sx={{ display: 'grid', gap: 2, mb: 6 }}>
                    <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                        We highly value your privacy and are committed to protecting the confidentiality of your
                        personal information. The data collected in this survey form will be used solely for the
                        application and analytical purposes, and will be handled with the utmost care and diligence.
                    </Typography>
                    <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                        By accessing and participating in this survey, you acknowledge and consent that the information
                        you provide may be utilized and analyzed in accordance with legal and regulatory standards, as
                        well as in compliance with the Data Privacy Act of 2012. Your responses will be aggregated and
                        anonymized, ensuring that individual identities remain confidential.
                    </Typography>
                    <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                        We assure you that your data will be treated with the highest level of security and privacy. It
                        will only be used for research purposes and will not be shared or disclosed to any third parties
                        without your explicit consent. Thank you for your participation and trust in our survey process.
                    </Typography>
                </Box>

                <Button variant='contained' onClick={() => setDataPrivacyAnswer(true)}>
                    Agree, proceed to the survey
                </Button>
            </Container>
        </Box>
    );

    return (
        <>
            <Head>
                <title>Initial Survey | CASH</title>
            </Head>

            {!hasSelectedLanguage ? <LanguageBlock /> : !dataPrivacyAnswer ? <DataPrivacyBlock /> : <SurveyBlock />}

        </>
    );
};

export default Page;
