'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.css';

export default function DashboardPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) return null;

    const displayName = user.displayName || 'ゲスト';
    const firstName = displayName.split(' ')[0];

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <header className={styles['dashboard-header']}>
                <div className={styles['header-left']}>
                    <span>🕊️</span>
                    MemoLive
                </div>
                <div className={styles['header-right']}>
                    <span className={styles['user-name']}>{displayName}</span>
                    {user.photoURL && (
                        <img
                            src={user.photoURL}
                            alt={displayName}
                            className={styles['user-avatar']}
                            referrerPolicy="no-referrer"
                        />
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={signOut}>
                        ログアウト
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles['dashboard-content']}>
                {/* Welcome */}
                <section className={`${styles['welcome-section']} animate-fade-in`}>
                    <h1>
                        おかえりなさい、{firstName}さん
                    </h1>
                    <p>大切な人とのつながりを、ここから始めましょう</p>
                </section>

                {/* AI Secretary */}
                <section className={styles['secretary-section']}>
                    <div
                        className={`${styles['secretary-card']} card animate-fade-in-up`}
                        onClick={() => router.push('/secretary')}
                    >
                        <div className={styles['secretary-icon']}>🎙️</div>
                        <div className={styles['secretary-text']}>
                            <h3>AIセクレタリー</h3>
                            <p>音声で何でも相談できるAIアシスタント</p>
                        </div>
                        <span className={styles['secretary-arrow']}>→</span>
                    </div>
                </section>

                {/* Profiles */}
                <section className={styles['profiles-section']}>
                    <h2>🕊️ 想いを繋ぐ人々</h2>
                    <div className={styles['profiles-grid']}>
                        {/* Add Profile Card */}
                        <div
                            className={`${styles['add-profile-card']} animate-fade-in-up`}
                            onClick={() => {/* Step 2で実装 */ }}
                        >
                            <div className={styles['add-icon']}>+</div>
                            <span>新しいプロフィールを登録</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
