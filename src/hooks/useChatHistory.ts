'use client';

import { useState, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy,
    limit,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatDocument {
    title: string;
    messages: Message[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

interface UseChatHistoryReturn {
    chatId: string | null;
    isLoading: boolean;
    loadRecentChat: (userId: string) => Promise<Message[]>;
    saveMessages: (userId: string, messages: Message[]) => Promise<void>;
    startNewChat: () => void;
}

export function useChatHistory(): UseChatHistoryReturn {
    const [chatId, setChatId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadRecentChat = useCallback(async (userId: string): Promise<Message[]> => {
        setIsLoading(true);
        try {
            const chatsRef = collection(db, 'users', userId, 'chats');
            const q = query(chatsRef, orderBy('updatedAt', 'desc'), limit(1));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const chatDoc = snapshot.docs[0];
                const data = chatDoc.data() as ChatDocument;
                setChatId(chatDoc.id);
                return data.messages || [];
            }
            return [];
        } catch (error) {
            console.error('Failed to load chat history:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveMessages = useCallback(async (userId: string, messages: Message[]) => {
        try {
            const chatsRef = collection(db, 'users', userId, 'chats');
            const id = chatId || doc(chatsRef).id;

            if (!chatId) {
                setChatId(id);
            }

            const title = messages.find((m) => m.role === 'user')?.content.slice(0, 50) || '新しいチャット';

            const chatDoc: ChatDocument = {
                title,
                messages,
                createdAt: chatId ? Timestamp.now() : Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            await setDoc(doc(chatsRef, id), chatDoc, { merge: true });
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }, [chatId]);

    const startNewChat = useCallback(() => {
        setChatId(null);
    }, []);

    return {
        chatId,
        isLoading,
        loadRecentChat,
        saveMessages,
        startNewChat,
    };
}
