import { useEffect, useState } from 'react';
import { onSnapshot, collection, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';

import { useAuthStore } from 'stores/useAuthStore';

export default function useGetUserTransfersSurvey(userID){
    const setUserSurvey = useAuthStore((state) => state.setUserSurvey);
    useEffect(() => {
        if (!userID) {
            return;
        }
        const userColRef = collection(db, 'users');
        const userQuery = query(userColRef, where('uid', '==', userID));

        const unsubscribe = onSnapshot(userQuery , (snapshotData) => {
            const userSurvey = [];
            snapshotData.forEach((doc) => {
                userSurvey.push({
                    ...doc.data(),
                    id: doc.id
                });
            });

            // console.log(userSurvey);
            setUserSurvey(userSurvey);
        });
        return unsubscribe;
    }, []);
}