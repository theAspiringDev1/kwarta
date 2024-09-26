import { create } from 'zustand';

import { addDoc, collection, serverTimestamp, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { db, storage } from '../../firebase.config';
import { blue, deepPurple, green, red, yellow } from '@mui/material/colors';
import { ICON_NAMES } from 'constants/constant';

const transactionStore = (set, get) => ({
    transactions: [],
    isEmpty: false,
    getTransaction: () => {},
    resetTransactions: () => {
        set({ transactions: [] });
    },
    createTransaction: async (newTransaction, currentFile) => {
        const loader = toast.loading('Creating Transaction');
        try {
            if (newTransaction.amount === '' || newTransaction.targetAccount === '' || newTransaction.category === '') {
                throw new Error('Check the input fields');
            }

            if (newTransaction.amount === 0 || newTransaction.amount === '') {
                throw new Error('Please enter a valid amount');
            }
            // console.log('CURRENT FILE: ', currentFile);
            const accountRef = doc(db, 'accounts', newTransaction.targetAccount.id);
            const currentAccount = await getDoc(accountRef);

            // UPLOAD IMAGE
            let fileUrl, fileRefName;
            if (currentFile) {
                fileRefName = `transactions/${uuidv4()}-${currentFile.name}`;
                const imageRef = ref(storage, fileRefName);

                const fileUpload = await uploadBytes(imageRef, currentFile);
                fileUrl = await getDownloadURL(fileUpload.ref);
                console.log('UPLOADED');
            }

            // SUBTRACT
            if (
                newTransaction.type === 'expense' ||
                newTransaction.type === 'savings' ||
                newTransaction.type === 'investments'
            ) {
                if (currentAccount.data().account_amount > newTransaction.amount) {
                    await updateDoc(accountRef, {
                        account_amount: currentAccount.data().account_amount - newTransaction.amount
                    });
                } else {
                    throw new Error("You don't have enough money!");
                }
            } else {
                // INCOME
                await updateDoc(accountRef, {
                    account_amount: currentAccount.data().account_amount + newTransaction.amount
                });
            }

            await addDoc(collection(db, 'transactions'), {
                ...newTransaction,
                photoRef: fileRefName || '',
                photoUrl: fileUrl || '',
                timestamp: serverTimestamp()
            });
            console.log('NEW DOCUMENT CREATED');
            // HANDLE TOAST
            toast.dismiss(loader);
            toast.success('Transaction successfully created!');
        } catch (err) {
            console.log('addTransactionError:', err);
            toast.error(err.message);
            toast.dismiss(loader);
        }
    },
    updateTransaction: async (documentId, updatedTransaction, newFile) => {
        const editLoader = toast.loading('Updating Transaction');
        try {
            const docRef = doc(db, 'transactions', documentId);
            const currentTransactionResponse = await getDoc(docRef);
            const currentTransaction = currentTransactionResponse.data();
            let accountRef, originalAmount, updatedAmount, currentAccountResponse, currentAccount;
            // SAME ACCOUNTS
            console.log(currentTransaction);
            if (currentTransaction.targetAccount.id === updatedTransaction.targetAccount.id) {
                accountRef = doc(db, 'accounts', updatedTransaction.targetAccount.id);
                currentAccountResponse = await getDoc(accountRef);
                currentAccount = currentAccountResponse.data();
                // RETURN THE ORIGINAL AMOUNT
                if (
                    currentTransaction.type === 'expense' ||
                    currentTransaction.type === 'savings' ||
                    currentTransaction.type === 'investments'
                ) {
                    originalAmount = currentAccount.account_amount + currentTransaction.amount;
                } else {
                    originalAmount = currentAccount.account_amount - currentTransaction.amount;
                }
                // UPDATE THE ACCOUNT AMOUNT
                if (
                    updatedTransaction.type === 'expense' ||
                    updatedTransaction.type === 'savings' ||
                    updatedTransaction.type === 'investments'
                ) {
                    updatedAmount = originalAmount - updatedTransaction.amount;
                } else {
                    updatedAmount = originalAmount + updatedTransaction.amount;
                }

                // UPDATE THE ACCOUNT DOCUMENT IN THE FIRESTORE
                await updateDoc(accountRef, {
                    account_amount: updatedAmount
                });
            } else {
                const oldAccountRef = doc(db, 'accounts', currentTransaction.targetAccount.id);
                const oldAccountResponse = await getDoc(oldAccountRef);
                const oldAccount = oldAccountResponse.data();
                // RESTORE MONEY TO THE OLD ACCOUNT
                if (currentTransaction.type === 'expense') {
                    originalAmount = oldAccount.account_amount + currentTransaction.amount;
                } else {
                    originalAmount = oldAccount.account_amount - currentTransaction.amount;
                }
                const newAccountRef = doc(db, 'accounts', updatedTransaction.target_account);
                const newAccountResponse = await getDoc(newAccountRef);
                const newAccount = newAccountResponse.data();
                // SUBTRACT MONEY TO THE NEW ACCOUNT
                if (updatedTransaction.type === 'expense') {
                    updatedAmount = newAccount.account_amount - updatedTransaction.amount;
                } else {
                    updatedAmount = newAccount.account_amount + updatedTransaction.amount;
                }
                // UPDATE THE ACCOUNT DOCUMENT IN THE FIRESTORE
                await updateDoc(oldAccountRef, {
                    account_amount: originalAmount
                });
                await updateDoc(newAccountRef, {
                    account_amount: updatedAmount
                });
            }

            // UPDATE THE FILES
            // UPLOAD IMAGE
            const fileRef = ref(storage, currentTransaction.photoRef);
            let fileUrl, fileRefName;
            if (currentTransaction.photoUrl !== newFile?.source) {
                if (currentTransaction.photoUrl !== '') {
                    // DELETE THE OBJECT
                    await deleteObject(fileRef);
                }

                if (newFile) {
                    {
                        fileRefName = `transactions/${uuidv4()}-${newFile.file.name}`;
                        const imageRef = ref(storage, fileRefName);

                        const fileUpload = await uploadBytes(imageRef, newFile.file);
                        fileUrl = await getDownloadURL(fileUpload.ref);
                        console.log('UPLOADED');
                    }
                }
            }
            // CREATE A REFERENCE TO THE DOCUMENT AND THE FILE
            await updateDoc(docRef, {
                ...updatedTransaction,
                photoRef: fileRefName || currentTransaction.photoRef,
                photoUrl: fileUrl || currentTransaction.photoUrl
            });

            toast.success('Updated Successfully.');

            return true;
        } catch (err) {
            console.log('updateTransactionError:', err);
            toast.error(err.message);

            return false;
        } finally {
            toast.dismiss(editLoader);
        }
    },
    deleteTransaction: async (documentId, fileReference) => {
        console.log('Delete', documentId);
        const deleteLoader = toast.loading('Deleting Transaction');
        // CREATE A REFERENCE FOR THE DOCUMENT AND THE FILE
        const docRef = doc(db, 'transactions', documentId);
        const fileRef = ref(storage, fileReference);
        try {
            const currentTransactionResponse = await getDoc(docRef);
            const currentTransaction = currentTransactionResponse.data();
            const accountRef = doc(db, 'accounts', currentTransaction.targetAccount.id);
            const currentAccountResponse = await getDoc(accountRef);
            const currentAccount = currentAccountResponse.data();
            if (currentAccount) {
                // RETURN THE SUBTRACTED AMOUNT
                if (
                    currentTransaction.type === 'expense' ||
                    currentTransaction.type === 'savings' ||
                    currentTransaction.type === 'investments'
                ) {
                    await updateDoc(accountRef, {
                        account_amount: currentAccount.account_amount + currentTransaction.amount
                    });
                } else {
                    // INCOME
                    await updateDoc(accountRef, {
                        account_amount: currentAccount.account_amount - currentTransaction.amount
                    });
                }
            }

            // DELETE THE DOCUMENT AND OBJECT
            await deleteDoc(docRef);
            if (fileReference) {
                await deleteObject(fileRef);
            }
            // ALERT A MESSAGE

            toast.success('Deleted Successfully!');

            return true;
        } catch (err) {
            console.log('deleteTransactionError:', err);
            toast.error(err.message);
        } finally {
            toast.dismiss(deleteLoader);
        }
    },
    setTransactions: (transactionList, isEmpty = false) => {
        set({
            transactions: transactionList,
            isEmpty
        });
    },
    getExpenseList: (user_id) => {
        const expenseList = get().transactions.filter((transaction) => transaction.type === 'expense');

        const expenseCategoryList = expenseList.reduce((acc, currentExpense) => {
            if (!acc.includes(currentExpense.category.category_name)) {
                acc.push(currentExpense.category.category_name);
            }
            return acc;
        }, []);

        // create an initial data holder
        const expenseDataList = expenseCategoryList.map((category) => {
            const targetCategory = expenseList.find((item) => item.category.category_name === category);
            return {
                user_id,
                amount: 0,
                type: 'expense',
                category_name: category,
                transaction_icon: targetCategory.category.category_icon,
                color: targetCategory?.category?.category_color,
                transaction_color: targetCategory.category.category_color
            };
        });

        // add the amount to the initial data
        expenseList.forEach((item) => {
            // find the data
            const targetCategory = expenseDataList.find(
                (currentData) => item.category.category_name === currentData.category_name
            );

            if (item.category.category_name === targetCategory.category_name) {
                targetCategory.amount += item.amount;
            }
        });

        return expenseDataList;
    },
    getIncomeList: (user_id) => {
        const incomeList = get().transactions.filter((transaction) => transaction.type === 'income');

        const incomeCategoryList = incomeList.reduce((acc, currentIncome) => {
            if (!acc.includes(currentIncome.category.category_name)) {
                acc.push(currentIncome.category.category_name);
            }
            return acc;
        }, []);

        // create an initial data holder
        const incomeDataList = incomeCategoryList.map((category) => {
            const targetCategory = incomeList.find((item) => item.category.category_name === category);
            return {
                user_id,
                amount: 0,
                type: 'income',
                category_name: category,
                transaction_icon: targetCategory.category.category_icon,
                color: targetCategory.category.category_color,
                transaction_color: targetCategory.category.category_color
            };
        });

        // add the amount to the initial data
        incomeList.forEach((item) => {
            // find the data
            const targetCategory = incomeDataList.find(
                (currentData) => item.category.category_name === currentData.category_name
            );

            if (item.category.category_name === targetCategory.category_name) {
                targetCategory.amount += item.amount;
            }
        });

        return incomeDataList;
    },
    getSavingsList: (user_id) => {
        const savingsList = get().transactions.filter((transaction) => transaction.type === 'savings');

        const savingsCategoryList = savingsList.reduce((acc, currentIncome) => {
            if (!acc.includes(currentIncome.category.category_name)) {
                acc.push(currentIncome.category.category_name);
            }
            return acc;
        }, []);

        // create an initial data holder
        const savingsDataList = savingsCategoryList.map((category) => {
            const targetCategory = savingsList.find((item) => item.category.category_name === category);
            return {
                user_id,
                amount: 0,
                type: 'savings',
                category_name: category,
                transaction_icon: targetCategory.category.category_icon,
                color: targetCategory.category.category_color,
                transaction_color: targetCategory.category.category_color
            };
        });

        // add the amount to the initial data
        savingsList.forEach((item) => {
            // find the data
            const targetCategory = savingsDataList.find(
                (currentData) => item.category.category_name === currentData.category_name
            );

            if (item.category.category_name === targetCategory.category_name) {
                targetCategory.amount += item.amount;
            }
        });

        return savingsDataList;
    },
    getInvestmentsList: (user_id) => {
        const investmentsList = get().transactions.filter((transaction) => transaction.type === 'investments');

        const investmentsCategoryList = investmentsList.reduce((acc, currentIncome) => {
            if (!acc.includes(currentIncome.category.category_name)) {
                acc.push(currentIncome.category.category_name);
            }
            return acc;
        }, []);

        // create an initial data holder
        const investmentsDataList = investmentsCategoryList.map((category) => {
            const targetCategory = investmentsList.find((item) => item.category.category_name === category);
            return {
                user_id,
                amount: 0,
                type: 'investments',
                category_name: category,
                transaction_icon: targetCategory.category.category_icon,
                color: targetCategory.category.category_color,
                transaction_color: targetCategory.category.category_color
            };
        });

        // add the amount to the initial data
        investmentsList.forEach((item) => {
            // find the data
            const targetCategory = investmentsDataList.find(
                (currentData) => item.category.category_name === currentData.category_name
            );

            if (item.category.category_name === targetCategory.category_name) {
                targetCategory.amount += item.amount;
            }
        });

        return investmentsDataList;
    },
    getExpenseTypeList: (user_id) => {
        const expenseList = get().transactions.filter((transaction) => transaction.type === 'expense');
        console.log(expenseList);

        const totalSavings = get()
            .transactions.filter((item) => item.type === 'savings')
            .reduce((acc, cur) => {
                acc += cur.amount;
                return acc;
            }, 0);

        // create an initial data holder

        const expenseTypeDataList = [
            {
                name: 'Needs',
                amount: 0,
                type: 'needs',
                color: green[500],
                icon: ICON_NAMES.SYSTEM_ICONS.WANTS
            },
            {
                name: 'Wants',
                amount: 0,
                type: 'wants',
                color: red[500],
                icon: ICON_NAMES.SYSTEM_ICONS.NEEDS
            },
            {
                name: 'Savings',
                amount: totalSavings,
                type: 'savings',
                color: deepPurple[500],
                icon: ICON_NAMES.CATEGORY_ICONS.SAVINGS
            }
        ];

        // add the amount to the initial data
        expenseList.forEach((item) => {
            // find the data
            console.log({ item });
            const targetCategory = expenseTypeDataList.find((currentData) => {
                console.log({ currentData });
                if (item.category.expense_type === currentData.type) return currentData;
            });

            console.log({ targetCategory });

            if (targetCategory) {
                if (item.category.expense_type === targetCategory.type) {
                    targetCategory.amount += item.amount;
                }
            }
        });

        return expenseTypeDataList;
    }
});

export const useTransactionStore = create(transactionStore);
