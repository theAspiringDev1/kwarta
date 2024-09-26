import { Box, Card, CardContent, Typography, Tooltip } from '@mui/material'
import React from 'react';

import { Icon } from 'components/shared/Icon';
import { ICON_NAMES } from 'constants/constant';

import { formatPrice } from 'utils/format-price'
import { getLanguage } from 'utils/getLanguage';
import { useLanguageStore } from 'stores/useLanguageStore';

export default function DealsCard({bankName, iconName, savings}){
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);

    return (
        <Box sx={{ pt: 3, height: '100%' }}>
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
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 5}}>
                            <Icon name={iconName} color='primary' sx={{ fontSize: '50px'}} />
                            <Typography align='center' color='primary' gutterBottom variant='h5' sx={{paddingTop: 2}}>
                                {bankName}
                            </Typography>
                        </Box>
                        <Box>
                            <Tooltip title={getLanguage(currentLanguage).tooltipSavingsProductName}>
                                <Typography align='center' color='textPrimary' gutterBottom variant='h5'>
                                    {savings.productName}
                                </Typography>
                            </Tooltip>

                            <Tooltip title={getLanguage(currentLanguage).tooltipSavingsTotal}>
                                <Typography align='center' color='textPrimary' gutterBottom variant='h6'>
                                    {formatPrice(savings.total, true)}
                                </Typography>
                            </Tooltip>

                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
                                <Tooltip title={getLanguage(currentLanguage).tooltipSavingsPercent}>
                                    <Typography align='center' color='textPrimary' gutterBottom variant='body1'>
                                        {savings.percent}%
                                    </Typography>
                                </Tooltip>
                                <Icon
                                    name={ICON_NAMES.SYSTEM_ICONS.UP}
                                    color='primary'
                                    sx={{ fontSize: '25px', color: '#2ECC71' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}