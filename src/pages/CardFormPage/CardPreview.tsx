import type { CardFormValues, CardImageAttachment } from './cardSchema';

import styles from './CardFormPage.module.css';

const priorityClasses: Record<string, string> = {
  Low: styles.priorityLow,
  Medium: styles.priorityMedium,
  High: styles.priorityHigh,
  Urgent: styles.priorityUrgent,
};

interface CardPreviewProps {
  card: CardFormValues;
  images: CardImageAttachment[];
  notice: 'created' | 'updated' | null;
  onBackToForm: () => void;
  onEdit: () => void;
}

function formatDeadline(deadline: string) {
  if (!deadline) return 'No deadline';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${deadline}T12:00:00Z`));
}

export function CardPreview({
  card,
  images,
  notice,
  onBackToForm,
  onEdit,
}: CardPreviewProps) {
  return (
    <section className={styles.previewPanel} aria-label="Card preview">
      {notice && (
        <div className={styles.successNotice} role="status">
          <span className={styles.successMark} aria-hidden="true">
            ✓
          </span>
          <span>{notice === 'created' ? 'Card Created' : 'Changes Saved'}</span>
        </div>
      )}

      <article className={styles.previewCard}>
        <div className={styles.previewCardHeader}>
          <div className={styles.previewBadges}>
            {card.status && <span className={styles.statusBadge}>{card.status}</span>}
            <span className={`${styles.priorityBadge} ${priorityClasses[card.priority] ?? ''}`}>
              <span className={styles.priorityDot} aria-hidden="true" />
              {card.priority}
            </span>
          </div>
          <span className={styles.previewEyebrow}>Card details</span>
        </div>

        <h2 className={styles.previewTitle}>{card.title}</h2>
        <p className={styles.previewDescription}>{card.description}</p>

        <dl className={styles.metadataGrid}>
          <div className={styles.metadataItem}>
            <dt className={styles.metadataLabel}>Assignee</dt>
            <dd className={styles.metadataValue}>{card.assignee || 'Unassigned'}</dd>
          </div>
          <div className={styles.metadataItem}>
            <dt className={styles.metadataLabel}>Deadline</dt>
            <dd className={styles.metadataValue}>{formatDeadline(card.deadline)}</dd>
          </div>
        </dl>

        {card.tags.length > 0 && (
          <section className={styles.previewSection} aria-label="Card tags">
            <h3 className={styles.previewSectionTitle}>Tags</h3>
            <ul className={styles.previewTagList}>
              {card.tags.map(tag => (
                <li className={styles.previewTag} key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.previewSection} aria-label="Card images">
          <h3 className={styles.previewSectionTitle}>Images ({images.length})</h3>
          {images.length > 0 ? (
            <ul className={styles.previewImageGrid}>
              {images.map(image => (
                <li className={styles.previewImageTile} key={image.id}>
                  <img src={image.previewUrl} alt={image.file.name} />
                  <span title={image.file.name}>{image.file.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyImages}>No images attached.</p>
          )}
        </section>
      </article>

      <div className={styles.previewFooter}>
        <button type="button" className={styles.backButton} onClick={onBackToForm}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6M9 12h11" />
          </svg>
          Back to Form
        </button>
        <button type="button" className={styles.editButton} onClick={onEdit}>
          Edit Card
        </button>
      </div>
    </section>
  );
}
