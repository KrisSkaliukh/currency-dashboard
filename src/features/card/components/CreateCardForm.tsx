import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';
import { Textarea } from '../../../shared/components/Textarea/Textarea';
import {
  createCardSchema,
  type CardImage,
  type CreateCardFormValues,
  type SubmittedCard,
} from '../schema';
import { getTagColors } from '../tagColors';

import styles from './CreateCardForm.module.css';

const MAX_IMAGES = 5;

const priorities = ['Low', 'Medium', 'High'];
const statuses = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
];
const assignees = [
  { label: 'Kris Metus 1', value: 'km1' },
  { label: 'Kris Metus 2', value: 'km2' },
  { label: 'Kris Metus 3', value: 'km3' },
];

const emptyValues: CreateCardFormValues = {
  title: '',
  description: '',
  priority: '',
  status: '',
  assignee: '',
  deadline: '',
  tags: '',
};

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

type CreateCardFormProps = {
  mode: 'create' | 'edit';
  initialValues?: SubmittedCard | null;
  formKey: number;
  onSubmitSuccess: (card: SubmittedCard) => void;
  onCancel: () => void;
};

export function CreateCardForm({
  mode,
  initialValues,
  formKey,
  onSubmitSuccess,
  onCancel,
}: CreateCardFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<CardImage[]>(
    () => initialValues?.images ?? [],
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(() =>
    initialValues?.tags ? parseTags(initialValues.tags) : [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCardFormValues>({
    resolver: zodResolver(createCardSchema),
    defaultValues: initialValues
      ? {
          title: initialValues.title,
          description: initialValues.description,
          priority: initialValues.priority,
          status: initialValues.status ?? '',
          assignee: initialValues.assignee ?? '',
          deadline: initialValues.deadline ?? '',
          tags: initialValues.tags ?? '',
        }
      : emptyValues,
  });

  useEffect(() => {
    const nextTags = initialValues?.tags
      ? parseTags(initialValues.tags)
      : [];
    const nextImages = initialValues?.images ?? [];

    reset(
      initialValues
        ? {
            title: initialValues.title,
            description: initialValues.description,
            priority: initialValues.priority,
            status: initialValues.status ?? '',
            assignee: initialValues.assignee ?? '',
            deadline: initialValues.deadline ?? '',
            tags: initialValues.tags ?? '',
          }
        : emptyValues,
    );
    setTags(nextTags);
    setImages(nextImages);
    setTagInput('');
  }, [formKey, initialValues, reset]);

  const syncTags = (next: string[]) => {
    setTags(next);
    setValue('tags', next.join(', '), { shouldDirty: true });
  };

  const addTag = (raw: string) => {
    const nextTag = raw.trim();
    if (!nextTag || tags.includes(nextTag)) {
      setTagInput('');
      return;
    }
    syncTags([...tags, nextTag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    syncTags(tags.filter(item => item !== tag));
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    setImages(prev => {
      const slotsLeft = MAX_IMAGES - prev.length;
      if (slotsLeft <= 0) return prev;

      const next = Array.from(fileList)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, slotsLeft)
        .map(file => ({
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          name: file.name,
          url: URL.createObjectURL(file),
        }));

      return [...prev, ...next];
    });
  };

  const imagesFull = images.length >= MAX_IMAGES;

  const removeImage = (id: string) => {
    setImages(prev => {
      const target = prev.find(image => image.id === id);
      const isShared =
        !!target &&
        (initialValues?.images ?? []).some(image => image.url === target.url);
      if (target && !isShared) URL.revokeObjectURL(target.url);
      return prev.filter(image => image.id !== id);
    });
  };

  const onSubmit = (data: CreateCardFormValues) => {
    const card: SubmittedCard = {
      ...data,
      tags: tags.join(', '),
      images: images.map(({ id, name, url }) => ({ id, name, url })),
    };

    alert(
      JSON.stringify(
        {
          title: card.title,
          description: card.description,
          priority: card.priority,
          status: card.status,
          assignee: card.assignee,
          deadline: card.deadline,
          tags: tags,
          images: images.map(image => image.name),
        },
        null,
        2,
      ),
    );

    setImages([]);
    onSubmitSuccess(card);
  };

  const handleCancel = () => {
    if (mode === 'create') {
      images.forEach(image => URL.revokeObjectURL(image.url));
      reset(emptyValues);
      setTags([]);
      setImages([]);
      setTagInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      const keptUrls = new Set(
        (initialValues?.images ?? []).map(image => image.url),
      );
      images.forEach(image => {
        if (!keptUrls.has(image.url)) URL.revokeObjectURL(image.url);
      });
    }
    onCancel();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.fields}>
        <div className={styles.column}>
          <Input
            id="title"
            label="Title *"
            placeholder="Enter card title"
            className={styles.control}
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            id="description"
            label="Description *"
            placeholder="Enter detailed description..."
            rows={5}
            error={errors.description?.message}
            {...register('description')}
          />

          <Select
            label="Priority *"
            options={priorities}
            placeholder="Select priority"
            error={errors.priority?.message}
            {...register('priority')}
          />

          <Select
            label="Status"
            options={statuses}
            placeholder="Select status"
            {...register('status')}
          />
        </div>

        <div className={styles.column}>
          <Select
            label="Assignee"
            options={assignees}
            placeholder="Select assignee"
            {...register('assignee')}
          />

          <div className={styles.dateField}>
            <span className={styles.dateIcon}>
              🗓️
            </span>
            <Input
              id="deadline"
              label="Deadline"
              type="date"
              className={`${styles.control} ${styles.dateInput}`}
              {...register('deadline')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="tags">
              Tags
            </label>
            <div className={styles.tagsBox}>
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
                    <button
                      type="button"
                      className={styles.tagRemove}
                      style={{ color: colors.color }}
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              <input
                id="tags"
                className={styles.tagInput}
                placeholder={tags.length ? '' : 'Add tags...'}
                value={tagInput}
                onChange={event => setTagInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault();
                    addTag(tagInput.replace(/,/g, ''));
                  }
                  if (
                    event.key === 'Backspace' &&
                    !tagInput &&
                    tags.length > 0
                  ) {
                    removeTag(tags[tags.length - 1]);
                  }
                }}
                onBlur={() => {
                  if (tagInput.trim()) addTag(tagInput);
                }}
              />
            </div>
            <span className={styles.errorSlot} />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              Images ({images.length}/{MAX_IMAGES})
            </span>

            {images.length > 0 && (
              <ul className={styles.imageList}>
                {images.map(image => (
                  <li key={image.id} className={styles.imageItem}>
                    <img src={image.url} alt={image.name} />
                    <span className={styles.imageName} title={image.name}>
                      {image.name}
                    </span>
                    <button
                      type="button"
                      className={styles.imageRemove}
                      onClick={() => removeImage(image.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {imagesFull ? (
              <div className={`${styles.dropzone} ${styles.dropzoneFull}`}>
                <span className={styles.uploadIcon}>
                  ☁️
                </span>
                <span>Maximum {MAX_IMAGES} images reached</span>
                <span className={styles.uploadHint}>
                  Remove an image to add another
                </span>
              </div>
            ) : (
              <label
                className={styles.dropzone}
                htmlFor="images"
                onDragOver={event => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onDrop={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleFiles(event.dataTransfer.files);
                }}
              >
                <span className={styles.uploadIcon}>
                  ☁️
                </span>
                <span>Drag & drop images here</span>
                <span className={styles.uploadHint}>
                  or click to browse
                </span>
              </label>
            )}

            <input
              ref={fileInputRef}
              className={styles.fileInput}
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              disabled={imagesFull}
              onChange={event => {
                handleFiles(event.target.files);
                event.target.value = '';
              }}
            />
            <span className={styles.errorSlot} />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          fullWidth={false}
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          fullWidth={false}
          className={styles.submitButton}
        >
          {mode === 'edit' ? 'Save Card' : 'Create Card'}
        </Button>
      </div>
    </form>
  );
}
