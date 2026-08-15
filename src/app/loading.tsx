import styles from "./loading.module.css";

export default function Loading() {
  return <div className={styles.screen} role="status" aria-live="polite" aria-label="Loading page"><div className={styles.content}><div className={styles.mark} aria-hidden="true"><span>N</span></div><div className={styles.brand}><strong>Navill Tech</strong><small>Preparing your experience</small></div><div className={styles.track} aria-hidden="true"><i/></div></div></div>;
}
