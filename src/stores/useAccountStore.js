import { create } from 'zustand';
import toast from 'react-hot-toast';

import { addDoc, collection, serverTimestamp, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

import { db, storage } from '../../firebase.config';

const accountStore = (set, get) => ({
    accounts: [],
    resetAccounts: () => set({ accounts: [] }),
    setAccounts: (data) => set({ accounts: data }),
    createAccount: async (newAccount) => {
        try {
            // console.log(newAccount);
            // console.log(get().accounts.map((account) => account.account_name.toLowerCase()));
            if (
                !get()
                    .accounts.map((account) => account.account_name.toLowerCase())
                    .includes(newAccount.account_name)
            ) {
                await addDoc(collection(db, 'accounts'), {
                    ...newAccount,
                    timestamp: serverTimestamp()
                });
                toast.success('Account successfully created!');
                // console.log('NEW DOCUMENT CREATED');
            } else {
                throw new Error('Account name is already taken. Think of another account name');
            }
        } catch (err) {
            // console.log('addAccountError:', err);
            toast.error(err.message);
        }
    },
    updateAccount: async (documentId, updatedAccount) => {
        const editLoader = toast.loading('Updating Account');
        try {
            const docRef = doc(db, 'accounts', documentId);
            const currentAccountResponse = await getDoc(docRef);
            const currentAccount = currentAccountResponse.data();
            // SAME ACCOUNTS
            console.log(currentAccount);
            // CREATE A REFERENCE TO THE DOCUMENT AND THE FILE
            await updateDoc(docRef, {
                ...updatedAccount
            });

            toast.success('Updated Successfully.');

            return true;
        } catch (err) {
            console.log('updateAccountError:', err);
            toast.error(err.message);

            return false;
        } finally {
            toast.dismiss(editLoader);
        }
    },
    deleteAccount: async (documentId) => {
        console.log('Delete', documentId);
        const deleteLoader = toast.loading('Deleting Account');
        // CREATE A REFERENCE FOR THE DOCUMENT AND THE FILE
        const docRef = doc(db, 'accounts', documentId);
        try {
            // DELETE THE DOCUMENT AND OBJECT
            await deleteDoc(docRef);
            // ALERT A MESSAGE

            toast.success('Deleted Successfully!');

            return true;
        } catch (err) {
            console.log('deleteAccountError:', err);
            toast.error(err.message);
        } finally {
            toast.dismiss(deleteLoader);
        }
    }
});

export const useAccountStore = create(accountStore);
