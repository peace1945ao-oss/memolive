'use client';

import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch {
      // Error handled in AuthContext
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={styles.landing}>
      {/* Header */}
      <header className={styles['landing-header']}>
        <div className={styles.logo}>
          <span className={styles['logo-icon']}>🕊️</span>
          MemoLive
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleSignIn}>
          ログイン
        </button>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles['hero-badge']} animate-fade-in`}>
          ✨ AIメモリアルサービス
        </div>
        <h1 className="animate-fade-in-up stagger-1">
          大切な人と、
          <br />
          <span className={styles.accent}>もう一度</span>
        </h1>
        <p className={`${styles['hero-description']} animate-fade-in-up stagger-2`}>
          故人の写真と声から、AIがリアルタイムに通話体験を再現。
          あの人の声で、あの人の表情で、
          もう一度語り合うことができます。
        </p>
        <div className={`${styles['hero-cta']} animate-fade-in-up stagger-3`}>
          <button className="btn btn-primary btn-lg" onClick={handleSignIn}>
            <svg className={styles['google-icon']} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Googleで無料で始める
          </button>
          <a href="#features" className="btn btn-secondary btn-lg">
            詳しく見る
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles['features-header']}>
          <h2>MemoLiveの特徴</h2>
          <p>最先端のAI技術で、大切な人との思い出を特別な体験に</p>
        </div>
        <div className={styles['features-grid']}>
          <div className={`card ${styles['feature-card']}`}>
            <span className={styles['feature-icon']}>📞</span>
            <h3>リアルタイム音声通話</h3>
            <p>
              まるで電話をかけるように、故人のAIアバターと
              自然な音声で会話ができます。
            </p>
          </div>
          <div className={`card ${styles['feature-card']}`}>
            <span className={styles['feature-icon']}>🎙️</span>
            <h3>音声クローニング</h3>
            <p>
              わずか数秒の音声サンプルから、故人の声を
              AIが忠実に再現します。
            </p>
          </div>
          <div className={`card ${styles['feature-card']}`}>
            <span className={styles['feature-icon']}>🖼️</span>
            <h3>顔アニメーション</h3>
            <p>
              写真1枚から表情豊かなアニメーションを生成し、
              ビデオ通話のような体験を提供します。
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles['how-it-works']}>
        <h2>使い方は簡単</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles['step-number']}>1</span>
            <span className={styles['step-icon']}>📸</span>
            <h3>写真をアップロード</h3>
            <p>故人の正面写真を1枚アップロード</p>
          </div>
          <div className={styles.step}>
            <span className={styles['step-number']}>2</span>
            <span className={styles['step-icon']}>🎵</span>
            <h3>音声を登録</h3>
            <p>ボイスメモや動画から声を登録</p>
          </div>
          <div className={styles.step}>
            <span className={styles['step-number']}>3</span>
            <span className={styles['step-icon']}>💬</span>
            <h3>人柄を入力</h3>
            <p>性格や話し方のクセを入力</p>
          </div>
          <div className={styles.step}>
            <span className={styles['step-number']}>4</span>
            <span className={styles['step-icon']}>📱</span>
            <h3>通話を開始</h3>
            <p>ボタンを押すだけで通話開始</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles['cta-section']}>
        <h2>大切な人の声を、<br />もう一度聴きませんか</h2>
        <p>無料でお試しいただけます</p>
        <button className="btn btn-primary btn-lg" onClick={handleSignIn}>
          <svg className={styles['google-icon']} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          今すぐ始める
        </button>
      </section>

      {/* Footer */}
      <footer className={styles['landing-footer']}>
        <p>© 2026 MemoLive. AIにより生成されたコンテンツです。故人の尊厳を最優先に考えています。</p>
      </footer>
    </div>
  );
}
