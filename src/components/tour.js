import 'react-responsive-carousel/lib/styles/carousel.min.css';
import React, { useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import { useMeasure, useMount, useSetState } from 'react-use';
import { Box, Button, Modal, Typography } from '@mui/material';

import { theme } from 'theme';
import { useLanguageStore } from 'stores/useLanguageStore';

const isPortrait = window.innerHeight > window.innerWidth;
const imageHeight = isPortrait ? 700 : 300;
const imageWidth = 1000;
const ratio = imageHeight / imageWidth;

function logGroup(type, data) {
    console.groupCollapsed(type);
    console.log(data);
    console.groupEnd();
}

export default function Tour({ open, handleClose, handleOpen }) {
    const [ref, { width }] = useMeasure();
    // accounts_step_one
    const TOUR_STEPS = [
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>Welcome to CASH: Financial Monitoring Application Tutorial</Typography>
            ),
            disableBeacon: true,
            source: '/static/images/steps/intro1.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    Before we start, let's have a short tutorial about our application
                </Typography>
            ),
            disableBeacon: true,
            source: '/static/images/steps/intro2.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: <Typography variant='body2'>Welcome to CASH: Financial Monitoring Application</Typography>,
            disableBeacon: true,
            source: '/static/images/steps/step1.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    To get started, you need to create an account first. Go to the Accounts tab (1). Click add account
                    (2).
                </Typography>
            ),
            source: '/static/images/steps/step2.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    Fill the Account Name field (1). Fill the Account Amount field (2). Select an Account type (3).
                </Typography>
            ),
            source: '/static/images/steps/step3.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    Fill the Account Description field (1). Select a Color (2). Select an Icon (3). If all fields are filled, click submit (4).
                </Typography>
            ),
            source: '/static/images/steps/step4.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    After adding an account, you can now add a transaction. Click the Add Transaction.
                </Typography>
            ),
            source: '/static/images/steps/step5.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    Fill the Amount field (1). Select Transaction Type (2). Select an Account (3). Select a Category
                    (4).
                </Typography>
            ),
            source: '/static/images/steps/step6.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    Change the date (1). Fill the Comment field (2). Upload a picture (3). If all fields are filled,
                    click submit (4).
                </Typography>
            ),
            source: '/static/images/steps/step7.png',
            placement: 'bottom'
        },
        {
            target: '.app__carousel',
            content: (
                <Typography variant='body2'>
                    Congratulations! You just started your first step in using CASH.
                </Typography>
            ),
            source: '/static/images/steps/outro1.png',
            placement: 'bottom'
        }
    ];
    const [{ run, stepIndex, steps }, setState] = useSetState({
        run: false,
        stepIndex: 0,
        steps: TOUR_STEPS
    });

    const isTutorialOpen = useLanguageStore((state) => state.isTutorialOpen);
    const setIsTutorialOpen = useLanguageStore((state) => state.setIsTutorialOpen);

    useMount(() => {
        if (open) {
            setState({ run: true });
        }
    });

    const handleClickReset = () => {
        console.log('RESET ');
        handleOpen();
        setState({ run: true, stepIndex: 0 });
    };

    useEffect(() => {
        if (isTutorialOpen) {
            handleClickReset();
        }
    }, [isTutorialOpen, setIsTutorialOpen]);

    const handleJoyrideCallback = (data) => {
        const { action, index, status, type } = data;

        if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            // Update state to advance the tour
            setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
        } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            // Need to set our running state to false, so we can restart if we click start again.
            setState({ run: false });
            handleClose();
            setIsTutorialOpen(false);
        }

        // logGroup(type, data);
    };

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                hideCloseButton
                run={run}
                scrollToFirstStep
                showSkipButton
                stepIndex={stepIndex}
                steps={TOUR_STEPS}
                styles={{
                    tooltip: {
                        width: 750
                    },
                    tooltipContainer: {
                        textAlign: 'center'
                    },
                    buttonBack: {
                        marginRight: 10
                    },
                    buttonNext: {
                        backgroundColor: theme.palette.primary.main
                    },
                    options: {
                        zIndex: 1000000
                    }
                }}
            />

            <Modal open={open} onClose={handleClose}>
                <Box ref={ref} className='app__carousel'>
                    <Carousel
                        selectedItem={stepIndex}
                        showArrows={!run}
                        showIndicators={false}
                        showStatus={false}
                        showThumbs={false}
                    >
                        {TOUR_STEPS.map((item) => (
                            <Box
                                sx={{
                                    height: {
                                        xs: '100vh',
                                        md: '65vh'
                                    },
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                                key={item.source}
                            >
                                <Box
                                    sx={{
                                        width: {
                                            xs: '90%',
                                            md: '70%'
                                        },
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <img
                                        alt='1'
                                        src={item.source}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'block',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Carousel>
                </Box>
            </Modal>
        </>
    );
}
