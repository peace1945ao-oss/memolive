'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useChatHistory, Message } from '@/hooks/useChatHistory';
import styles from './page.module.css';

export default function SecretaryPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { isListening, isSupported, transcript, interimTranscript, startListening, stopListening, resetTranscript } = useVoiceInput();
    const { loadRecentChat, saveMessages, startNewChat } = useChatHistory();
    const [chatLoaded, setChatLoaded] = useState(false);

    // Auth guard
    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Load recent chat on mount
    useEffect(() => {
        if (user && !chatLoaded) {
            loadRecentChat(user.uid).then((loaded) => {
                if (loaded.length > 0) {
                    setMessages(loaded);
                }
                setChatLoaded(true);
            });
        }
    }, [user, chatLoaded, loadRecentChat]);

    // Voice transcript → input
    useEffect(() => {
        if (transcript) {
            setInput((prev) => prev + transcript);
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    // Auto-scroll to bottom
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isStreaming]);

    // Auto-resize textarea
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }, []);

    // Send message
    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || isStreaming) return;

        const userMessage: Message = { role: 'user', content: text };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsStreaming(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            const response = await fetch('/api/secretary/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response body');

            const decoder = new TextDecoder();
            let assistantContent = '';

            // Add empty assistant message
            const updatedMessages = [...newMessages, { role: 'assistant' as const, content: '' }];
            setMessages(updatedMessages);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                assistantContent += chunk;

                setMessages([
                    ...newMessages,
                    { role: 'assistant', content: assistantContent },
                ]);
            }

            // Save to Firestore
            const finalMessages = [...newMessages, { role: 'assistant' as const, content: assistantContent }];
            setMessages(finalMessages);
            if (user) {
                saveMessages(user.uid, finalMessages);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages([
                ...newMessages,
                { role: 'assistant', content: '申し訳ございません。通信エラーが発生しました。もう一度お試しください。' },
            ]);
        } finally {
            setIsStreaming(false);
        }
    }, [input, isStreaming, messages, user, saveMessages]);

    // Handle Enter key
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    // Handle new chat
    const handleNewChat = useCallback(() => {
        setMessages([]);
        setInput('');
        startNewChat();
    }, [startNewChat]);

    // Handle voice button
    const handleVoiceToggle = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className={styles.secretary}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/dashboard')}
                        aria-label="戻る"
                    >
                        ←
                    </button>
                    <span className={styles.headerTitle}>AIセクレタリー</span>
                </div>
                <button
                    className={styles.newChatButton}
                    onClick={handleNewChat}
                    aria-label="新しいチャット"
                >
                    +
                </button>
            </header>

            {/* Messages */}
            <div className={styles.messageList}>
                {messages.length === 0 && (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>🎙️</span>
                        <p>
                            AIセクレタリーです。<br />
                            何でもお気軽にご相談ください。<br />
                            マイクボタンで音声入力もできます。
                        </p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`${styles.messageBubble} ${
                            msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className={styles.typingIndicator}>
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                    </div>
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Input Bar */}
            <div className={styles.inputBar}>
                {isSupported && (
                    <button
                        className={`${styles.voiceButton} ${isListening ? styles.voiceButtonListening : ''}`}
                        onClick={handleVoiceToggle}
                        aria-label={isListening ? '音声入力停止' : '音声入力開始'}
                    >
                        🎤
                    </button>
                )}
                <textarea
                    ref={textareaRef}
                    className={styles.textInput}
                    value={input + (interimTranscript ? interimTranscript : '')}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? '聞いています...' : 'メッセージを入力...'}
                    rows={1}
                    disabled={isStreaming}
                />
                <button
                    className={styles.sendButton}
                    onClick={sendMessage}
                    disabled={!input.trim() || isStreaming}
                    aria-label="送信"
                >
                    ➤
                </button>
            </div>
        </div>
    );
}
