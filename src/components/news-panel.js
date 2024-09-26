import { Button, CircularProgress, Grid, Paper, Typography, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useNews } from 'hooks/swr/useNews';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

import { getLanguage } from 'utils/getLanguage';
import { useLanguageStore } from 'stores/useLanguageStore';

export default function NewsPanel(props) {
    const { data, isLoading, isError } = useNews();

    const currentLanguage = useLanguageStore((state) => state.currentLanguage);

    if (isError) {
        return (
            <>
                <Tooltip title={getLanguage(currentLanguage).tooltipLatestNews}>
                    <Typography variant='h6' mb={4} className={props.className}>
                        Latest News
                    </Typography>
                </Tooltip>

                <Typography variant='body1' mb={4}>
                    Error fetching News 🥲
                </Typography>
            </>
        );
    }

    return (
        <>
            <Tooltip title={getLanguage(currentLanguage).tooltipLatestNews}>
                <Typography variant='h6' mb={4} className={props.className}>
                    Latest News
                </Typography>
            </Tooltip>

            <Grid container spacing={2}>
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            p: 2
                        }}
                    >
                        <CircularProgress size={50} />
                    </Box>
                ) : (
                    data.newsList?.map((news) => (
                        <Grid item xs={12} md={6} key={news.title}>
                            <Paper sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ height: '100%' }}>
                                    <img
                                        src={news?.image || '/static/images/articles/general.jpg'}
                                        alt=''
                                        style={{ height: 100, display: 'block', width: 150 }}
                                    />
                                </Box>
                                <Box sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
                                    <Button sx={{ p: 0, fontSize: 12 }} variant='text' href={news.link} target='_blank'>
                                        {news.title}
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </>
    );
}
