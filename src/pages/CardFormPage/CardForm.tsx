import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';

import { Button } from '../../shared/components/Button/Button';
import { Input } from '../../shared/components/Input/Input';
import { cardAssigneeOptions, cardPriorityOptions, cardStatusOptions } from './cardSchema';
import type { CardFormValues, CardImageAttachment } from './cardSchema';

import styles from './CardFormPage.module.css';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_TAGS = 12;

interface CardFormProps {
  form: UseFormReturn<CardFormValues>;
  isEditing: boolean;
  images: CardImageAttachment[];
  onSubmit: SubmitHandler<CardFormValues>;
  onCancel: () => void;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
}

export function CardForm({
  form,
  isEditing,
  images,
  onSubmit,
  onCancel,
  onAddImages,
  onRemoveImage,
}: CardFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagDraft, setTagDraft] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = form;
  const tags = watch('tags');

  const addTag = () => {
    const nextTag = tagDraft.trim().replace(/\s+/g, ' ');
    if (!nextTag) return;

    if (tags.some(tag => tag.toLocaleLowerCase() === nextTag.toLocaleLowerCase())) {
      setError('tags', { type: 'manual', message: 'That tag has already been added.' });
      return;
    }

    if (tags.length >= MAX_TAGS) {
      setError('tags', { type: 'manual', message: `You can add up to ${MAX_TAGS} tags.` });
      return;
    }

    setValue('tags', [...tags, nextTag], { shouldDirty: true, shouldValidate: true });
    clearErrors('tags');
    setTagDraft('');
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (event.nativeEvent.isComposing || event.keyCode === 229) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    addTag();
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter(tag => tag !== tagToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
    clearErrors('tags');
  };

  const addFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const problems: string[] = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        problems.push('Only image files can be attached.');
      } else if (file.size > MAX_IMAGE_SIZE) {
        problems.push('Each image must be 5 MB or smaller.');
      } else {
        validFiles.push(file);
      }
    });

    const remainingSlots = Math.max(0, MAX_IMAGES - images.length);
    if (validFiles.length > remainingSlots) {
      problems.push(`You can attach up to ${MAX_IMAGES} images.`);
    }

    const acceptedFiles = validFiles.slice(0, remainingSlots);
    if (acceptedFiles.length > 0) onAddImages(acceptedFiles);
    setFileError(problems.length > 0 ? [...new Set(problems)].join(' ') : null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      addFiles(Array.from(event.currentTarget.files));
    }
    event.currentTarget.value = '';
  };

  return (
    <form
      className={styles.formPanel}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={isEditing ? 'Edit card' : 'Create a card'}
    >
      <div className={styles.fieldGrid}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.fieldLabel} htmlFor="card-title">
            Title <span className={styles.required}>*</span>
          </label>
          <Input
            id="card-title"
            placeholder="Enter card title"
            maxLength={80}
            autoComplete="off"
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.fieldLabel} htmlFor="card-description">
            Description <span className={styles.required}>*</span>
          </label>
          <textarea
            id="card-description"
            className={`${styles.control} ${styles.textarea} ${errors.description ? styles.controlError : ''}`}
            placeholder="Enter detailed description..."
            maxLength={600}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'card-description-error' : undefined}
            {...register('description')}
          />
          {errors.description?.message && (
            <span id="card-description-error" className={styles.fieldError} role="alert">
              {errors.description.message}
            </span>
          )}
          <span className={styles.fieldHint}>Up to 600 characters.</span>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="card-priority">
            Priority <span className={styles.required}>*</span>
          </label>
          <select
            id="card-priority"
            className={`${styles.control} ${styles.select} ${errors.priority ? styles.controlError : ''}`}
            aria-invalid={Boolean(errors.priority)}
            aria-describedby={errors.priority ? 'card-priority-error' : undefined}
            {...register('priority')}
          >
            <option value="">Select priority</option>
            {cardPriorityOptions.map(priority => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          {errors.priority?.message && (
            <span id="card-priority-error" className={styles.fieldError} role="alert">
              {errors.priority.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="card-status">
            Status
          </label>
          <select id="card-status" className={`${styles.control} ${styles.select}`} {...register('status')}>
            <option value="">Select status</option>
            {cardStatusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="card-assignee">
            Assignee
          </label>
          <select id="card-assignee" className={`${styles.control} ${styles.select}`} {...register('assignee')}>
            <option value="">Select assignee</option>
            {cardAssigneeOptions.map(assignee => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="card-deadline">
            Deadline
          </label>
          <Input id="card-deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.fieldLabel} htmlFor="card-tags">
            Tags
          </label>
          <div className={styles.tagInputRow}>
            <input
              id="card-tags"
              className={styles.control}
              value={tagDraft}
              placeholder="Add tags..."
              autoComplete="off"
              aria-describedby={errors.tags ? 'card-tags-error' : 'card-tags-help'}
              aria-invalid={Boolean(errors.tags)}
              onChange={event => setTagDraft(event.currentTarget.value)}
              onKeyDown={handleTagKeyDown}
            />
            <button
              type="button"
              className={styles.addTagButton}
              onClick={addTag}
              aria-label="Add tag"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          {errors.tags?.message && (
            <span id="card-tags-error" className={styles.fieldError} role="alert">
              {errors.tags.message}
            </span>
          )}
          {!errors.tags && (
            <span id="card-tags-help" className={styles.fieldHint}>
              Press Enter or use the plus button to add a tag.
            </span>
          )}
          {tags.length > 0 && (
            <ul className={styles.tagList} aria-label="Added tags">
              {tags.map(tag => (
                <li key={tag} className={styles.tagChip}>
                  <span>{tag}</span>
                  <button
                    type="button"
                    className={styles.removeTagButton}
                    aria-label={`Remove ${tag} tag`}
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <div className={styles.uploadHeading}>
            <div>
              <span className={styles.fieldLabel}>Images</span>
              <p className={styles.fieldHint}>Attach up to {MAX_IMAGES} images, 5 MB each.</p>
            </div>
            <span className={styles.imageCount}>{images.length}/{MAX_IMAGES}</span>
          </div>
          <div
            className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <span className={styles.uploadIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 16V8m0 0 3 3m-3-3-3 3" />
                <path d="M20.2 16.2A4.6 4.6 0 0 0 18 7.5a6.5 6.5 0 0 0-12.4 1.7A3.7 3.7 0 0 0 6.3 17H8" />
              </svg>
            </span>
            <div className={styles.dropzoneCopy}>
              <strong>Drag &amp; drop images here</strong>
              <span>or click below to browse</span>
            </div>
            <button
              type="button"
              className={styles.browseButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
            >
              Browse images
            </button>
            <input
              ref={fileInputRef}
              className={styles.fileInput}
              type="file"
              accept="image/*"
              multiple
              tabIndex={-1}
              aria-label="Choose card images"
              onChange={handleFileSelection}
            />
          </div>
          {fileError && (
            <span className={styles.fieldError} role="alert">
              {fileError}
            </span>
          )}
          {images.length > 0 && (
            <ul className={styles.imageGrid} aria-label="Attached images">
              {images.map(image => (
                <li className={styles.imageTile} key={image.id}>
                  <img src={image.previewUrl} alt={image.file.name} />
                  <span className={styles.imageName} title={image.file.name}>
                    {image.file.name}
                  </span>
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    aria-label={`Remove ${image.file.name}`}
                    onClick={() => onRemoveImage(image.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.formFooter}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <Button className={styles.submitButton} fullWidth={false} type="submit">
          {isEditing ? 'Save Card' : 'Create Card'}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
