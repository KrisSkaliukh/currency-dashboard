import type { SubmittedCard } from '../schema';
import { getTagColors } from '../tagColors';

import styles from './CardPreview.module.css';

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const assigneeLabels: Record<string, string> = {
  'alex-johnson': 'Alex Johnson',
  km1: 'Kris Metus 1',
  km2: 'Kris Metus 2',
  km3: 'Kris Metus 3',
};

function formatDeadline(value: string): string {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

type CardPreviewProps = {
  card: SubmittedCard;
  onBackToForm: () => void;
  onEdit: () => void;
};

export function CardPreview({ card, onBackToForm, onEdit }: CardPreviewProps) {
  const tags = parseTags(card.tags);
  const statusLabel = card.status
    ? (statusLabels[card.status] ?? card.status)
    : null;
  const assigneeLabel = card.assignee
    ? (assigneeLabels[card.assignee] ?? card.assignee)
    : '—';

  return (
    <div className={styles.wrapper}>
      <article className={styles.card}>
        <div className={styles.body}>
          <div className={styles.badges}>
            {statusLabel && (
              <span className={styles.statusBadge}>{statusLabel}</span>
            )}
            <span className={styles.priorityBadge}>{card.priority}</span>
          </div>

          <h2 className={styles.title}>{card.title}</h2>
          <p className={styles.description}>{card.description}</p>

          <div className={styles.divider} />

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Assignee</span>
              <span className={styles.metaValue}>{assigneeLabel}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Deadline</span>
              <span className={styles.metaValue}>
                {formatDeadline(card.deadline)}
              </span>
            </div>
          </div>

          {tags.length > 0 && (
            <>
              <div className={styles.tags}>
                {tags.map(tag => {
                  const colors = getTagColors(tag);
                  return (
                    <span
                      key={tag}
                      className={styles.tag}
                      style={{
                        backgroundColor: colors.background,
                        color: colors.color,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </>
          )}

          {card.images.length > 0 && (
            <>
              <div className={styles.imagesSection}>
                <span className={styles.imagesLabel}>
                  Images ({card.images.length})
                </span>
                <div className={styles.images}>
                  {card.images.map(image => (
                    <figure key={image.id} className={styles.imageFigure}>
                      <img src={image.url} alt={image.name} />
                      <figcaption>{image.name}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBackToForm}
            >
              ← Back to Form
            </button>
            <button
              type="button"
              className={styles.editButton}
              onClick={onEdit}
            >
              Edit Card
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
