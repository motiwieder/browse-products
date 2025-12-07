import Header from '@/components/Header';
import styles from './loading.module.css';

const SKELETON_COUNT = 8;

/**
 * Loading UI for Suspense boundary.
 * Displays skeleton placeholders while products are loading.
 */
export default function Loading() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.filterSkeleton}></div>
          <div className={styles.grid}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.imageSkeleton}></div>
                <div className={styles.content}>
                  <div className={styles.categorySkeleton}></div>
                  <div className={styles.textSkeleton}></div>
                  <div className={styles.textSkeletonShort}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}


