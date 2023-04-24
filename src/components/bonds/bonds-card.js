import { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types'
import { 
    Box,
    Button,
    Card, 
    CardContent, 
    Container,
    Grid, 
    Typography, 
    FormControl,
    Paper,
    Select,
    MenuItem,
    TextField,
    FormHelperText,
    ListItemIcon,
    ListItemText,
    Link
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Icon } from 'components/shared/Icon';
import { ICON_NAMES } from 'constants/constant';

import { formatPrice } from 'utils/format-price'
import { getLanguage } from 'utils/getLanguage'

import { useAccountStore } from 'stores/useAccountStore';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 150,
            width: 250
        }
    }
};

export const BondsCard = ({ ...rest }) => {
    //SELECTED ACCOUNT STATES
    const [selectedAccount, setSelectedAccount] = useState('');
    const [amount, setAmount] = useState(0);
    const [bonds, setBonds] = useState('');
    //CALCULATE BOND STATES
    const [initialDeposit, setInitialDeposit] = useState('');
    const [bondReturn, setBondReturn] = useState('');

    const accounts = useAccountStore((state) => state.accounts);

    const data = [
        {
            id: 1,
            text: 'Affordable',
            icon: ICON_NAMES.SYSTEM_ICONS.PRICE_CHECK,
        },
        {
            id: 2,
            text: 'Convenient',
            icon: ICON_NAMES.SYSTEM_ICONS.CHECK,
        },
        {
            id: 3,
            text: 'Low-risk Investment',
            icon: ICON_NAMES.SYSTEM_ICONS.TRENDING_DOWN,
        },
        {
            id: 4,
            text: 'Short-term Investment',
            icon: ICON_NAMES.SYSTEM_ICONS.TIME,
        },
        {
            id: 5,
            text: 'Higher yielding than Time Deposits',
            icon: ICON_NAMES.SYSTEM_ICONS.UP,
        },
        {
            id: 6,
            text: 'Negotiable and Transferrable',
            icon:ICON_NAMES.SYSTEM_ICONS.ADD_TRANSFER,
        },
        {
            id: 7,
            text: 'Quarterly Interest Payments',
            icon: ICON_NAMES.SYSTEM_ICONS.CALENDAR,
        },
    ]

    function calculateBonds(currentAmount) {
        const total = (currentAmount * (6.125 / 100) * (1 - (20 / 100)) * 5.5).toFixed(2);
        setBondReturn(total);
    }

    const handleCalculate = async () => {
        calculateBonds(initialDeposit);
    }

    const handleAccountChange = (e) => {
        const currentAccountId = e.target.value;
        const currentAccount = accounts.find((account) => account.id === currentAccountId);

        // console.log(currentAccount);
        setAmount(currentAccount.account_amount);
        setSelectedAccount(e.target.value);
    };

    useEffect(() => {
        function computeInterest(productName, interestRate, taxRate, time, currentAmount) {
            const total = (currentAmount * (interestRate / 100) * (1 - (taxRate / 100)) * time).toFixed(2);
            const percent = (((total - currentAmount) / currentAmount) * 100).toFixed(2);
            return { productName, total, percent };
        }
    
        const computedRTBs = computeInterest('Retail Treasury Bonds', 6.125, 20, 5.5, amount);

        setBonds(computedRTBs);
        
    }, [selectedAccount]);

    console.log(selectedAccount)
    console.log(amount);

    return(
        <>
            <Box
                sx={{
                    justifyContent: 'center',
                    mb: 2
                }}
            >
                <Typography sx={{ m: 1 }} variant='body1'>
                    Bonds are a type of investment that can offer several benefits to investors, including regular income payments and a relatively low-risk profile compared to other investments.
                </Typography>
                <Typography sx={{ m: 1 }} variant='body1'>
                    Bonds are essentially loans that investors make to governments, corporations, or other entities. In exchange for the loan, the issuer of the bond agrees to pay interest to the investor at a fixed rate over a specified period of time. At the end of the bond term, the investor receives the principal amount back.
                </Typography>
                <Typography sx={{ m: 1 }} variant='h5'>
                    Select an Account below to to which will be used for investing to bonds.
                </Typography>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={selectedAccount}
                    label='Choose Account'
                    onChange={handleAccountChange}
                    sx={{ display: 'flex', alignItems: 'center' }}
                    defaultValue=''
                    MenuProps={MenuProps}
                >
                    {accounts.map((account) => {
                        return (
                            <MenuItem key={account.id} value={account.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ListItemIcon>
                                            <Icon name={account.account_icon} />
                                        </ListItemIcon>
                                        <ListItemText>{account.account_name}</ListItemText>
                                </Box>
                            </MenuItem>
                        );
                    })}
                </Select>
            </Box>
            
            {amount > 4999 ?
            <Box sx={{ p: 3 }}>
                <Typography align='center' sx={{ m: 1 }} variant='body1'>
                    You have {formatPrice(amount, true)} in your selected bank account. You may invest in bonds.
                </Typography>
                <Box sx={{ p: 3, mx: 'auto', width: 500 }}>
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            position: 'relative'
                            }}
                            // {...rest}
                            elevation={10}
                        >
                        <CardContent>
                            <Typography align='center' color='textPrimary' gutterBottom variant='h5'>
                                {bonds.productName}
                            </Typography>
                            <Typography align='center' color='primary' gutterBottom variant='h4'>
                                {formatPrice(bonds.total, true)}
                            </Typography>
                            <Typography align='center' color='textPrimary' gutterBottom variant='body2'>
                                Return after 5.5 years
                            </Typography>
                            <Typography align='center' color='textPrimary' gutterBottom variant='body2'>
                                Calculated amount based on you selected account.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box component='main'
                    sx={{
                        flexGrow: 1,
                        py: 6
                    }}>
                    <Container maxWidth={false}>                        
                        <Paper sx={{ py: 4, px: 4, mx: 'auto', width: 600}}>
                            <Box sx={{ p: 1}}>
                                <Typography  sx={{ m: 1, textAlign: 'center' }} color='textPrimary' gutterBottom variant='h5'>
                                    Retail Treasury Bonds Calculator
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    m: 1,
                                }}
                            >
                                <Grid container spacing={2} justifyContent='center' mb={4}>
                                    <Grid item xs={12} lg={8}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id='standard-basic'
                                                label='Initial Investment'
                                                variant='outlined'
                                                type='number'
                                                value={initialDeposit}
                                                onChange={(e) => setInitialDeposit(e.target.value)}
                                            />
                                            <FormHelperText>How much would you like to invest at first?</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid maxWidth item lg={4}>
                                        <Button onClick={handleCalculate} variant='contained'>
                                            Calculate Money Growth
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Grid container spacing={4} textAlign='center'>
                                <Grid item xs={12}>
                                    <Box sx={{ fontSize: 70 }}>
                                        <AccountBalanceIcon fontSize='inherit' color='primary' />
                                    </Box>
                                    <Typography variant='body1'>Your Total Investment</Typography>
                                    <Typography variant='h4'>{formatPrice(bondReturn, true)}</Typography>
                                    <Typography variant='body1'>
                                        After 5.5 years, these could be the projected return of your investment
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ pt: 3 }}>
                                <Typography sx={{ m: 1, textAlign: 'center' }} color='textSecondary' variant='caption'>
                                    DISCLAIMER: This calculation is for illustration purposes only and should not be able to taken as professional advice to invest in RTB 29. It should not be used as the sole basis to measure returns in said securities. Terms and conditions of the RTB 29 is governed by the applicable Program Mechanics and Notice of Offering issued for the purpose. Returns displayed assume an interest period of 5.5 years and are net of 20% final withholding tax. Investment amount in RTB 29 is for a minimum of PHP5,000 and in integral multiples thereof. 
                                </Typography>
                            </Box>
                        </Paper>
                    </Container>

                    
                </Box>

                <Box sx={{ p: 3 }}>
                    <Paper sx={{ py: 8, px: 4 }}>
                        <Typography sx={{ m: 1, textAlign: 'center' }} variant='h5'>
                            Why invest in Retail Treasury Bonds?
                        </Typography>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={4} textAlign='center'>
                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.SYSTEM_ICONS.PRICE_CHECK}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Affordable</Typography>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.SYSTEM_ICONS.CHECK}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Convenient</Typography>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.SYSTEM_ICONS.TRENDING_DOWN}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Low-risk Investment</Typography>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.SYSTEM_ICONS.TIME}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Short-term Investment</Typography>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.SYSTEM_ICONS.UP}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>High yielding than Time Deposits</Typography>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.SYSTEM_ICONS.ADD_TRANSFER}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Negotiable and Transferrable</Typography>
                                </Grid>
                                <Grid item lg={12}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.SYSTEM_ICONS.CALENDAR}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Quarterly Interest Payments</Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Typography sx={{ m: 1, textAlign: 'center' }} variant='h5'>
                            Where I can apply for investment in Retail Treasury Bonds?
                        </Typography>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={4} textAlign='center'>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.BDO}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>BDO</Typography>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.BPI}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>BPI</Typography>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.CHINABANK}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Chinabank</Typography>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.BANK}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Landbank</Typography>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.METROBANK}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Metrobank</Typography>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.PNB}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>PNB</Typography>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.SECURITYBANK}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Security Bank</Typography>
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                    <Box sx={{ fontSize: 50 }}>
                                        <Icon
                                            name={ICON_NAMES.ACCOUNT_ICONS.UNIONBANK}
                                            color='primary'
                                            fontSize='inherit'
                                        />
                                    </Box>
                                    <Typography variant='h7'>Unionbank</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Link href='https://www.treasury.gov.ph/rtb29/'>
                            <Typography sx={{ m: 1, textAlign: 'center' }} variant='body1'>
                                For more information about Retail Treasury Bonds. Click here.
                            </Typography>
                        </Link>
                    </Paper>
                </Box>
            </Box>
            :
            <Box sx={{ p: 3 }}>
                <Typography sx={{ m: 1, textAlign: 'center' }} variant='h5'>
                    Your selected account have insufficient maintaining balance.
                </Typography>
            </Box>
            }
        </>
    )
}

BondsCard.propTypes = {
    product: PropTypes.object.isRequired
}
