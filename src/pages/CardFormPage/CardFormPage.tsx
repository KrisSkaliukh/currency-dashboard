import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';

import { ROUTES } from '../../app/paths';
import { Header } from '../../shared/components/Header/Header';
import { CardForm } from './CardForm';
import { CardPreview } from './CardPreview';
import {
  cardSchema,
  emptyCardFormValues,
} from './cardSchema';
import type { CardFormValues, CardImageAttachment } from './cardSchema';

import styles from './CardFormPage.module.css';

type CardView = 'form' | 'preview';

type CardNotice = 'created' | 'updated' | null;

export function CardFormPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<CardView>('form');
  const [isEditing, setIsEditing] = useState(false);
  const [savedCard, setSavedCard] = useState<CardFormValues | null>(null);
  const [notice, setNotice] = useState<CardNotice>(null);
  const [images, setImages] = useState<CardImageAttachment[]>([]);
  const imagesRef = useRef<CardImageAttachment[]>([]);
  const savedImagesRef = useRef<CardImageAttachment[]>([]);

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: emptyCardFormValues,
  });

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(image => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const addImages = (files: File[]) => {
    const nextImages = [
      ...imagesRef.current,
      ...files.map(file => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ];
    imagesRef.current = nextImages;
    setImages(nextImages);
  };

  const removeImage = (id: string) => {
    const removedImage = imagesRef.current.find(image => image.id === id);
    if (removedImage) URL.revokeObjectURL(removedImage.previewUrl);

    const nextImages = imagesRef.current.filter(image => image.id !== id);
    imagesRef.current = nextImages;
    setImages(nextImages);
  };

  const clearImages = () => {
    imagesRef.current.forEach(image => URL.revokeObjectURL(image.previewUrl));
    imagesRef.current = [];
    setImages([]);
  };

  const submitCard: SubmitHandler<CardFormValues> = values => {
    const card = { ...values, tags: [...values.tags] };
    const wasEditing = isEditing;
    const alertPayload = {
      ...card,
      status: card.status || null,
      assignee: card.assignee || null,
      deadline: card.deadline || null,
      images: imagesRef.current.map(image => image.file.name),
    };

    setSavedCard(card);
    savedImagesRef.current = imagesRef.current.map(image => ({ ...image }));
    setNotice(wasEditing ? 'updated' : 'created');
    setIsEditing(false);
    setView('preview');
    window.alert(JSON.stringify(alertPayload, null, 2));
  };

  const openEditor = () => {
    if (!savedCard) return;
    savedImagesRef.current = imagesRef.current.map(image => ({ ...image }));
    form.reset(savedCard);
    setIsEditing(true);
    setView('form');
  };

  const restoreSavedImages = () => {
    const currentImages = new Map(
      imagesRef.current.map(image => [image.id, image] as const),
    );
    const restoredImages = savedImagesRef.current.map(savedImage => {
      const currentImage = currentImages.get(savedImage.id);
      return currentImage ?? {
        ...savedImage,
        previewUrl: URL.createObjectURL(savedImage.file),
      };
    });
    const restoredIds = new Set(restoredImages.map(image => image.id));

    imagesRef.current.forEach(image => {
      if (!restoredIds.has(image.id)) URL.revokeObjectURL(image.previewUrl);
    });

    imagesRef.current = restoredImages;
    savedImagesRef.current = restoredImages.map(image => ({ ...image }));
    setImages(restoredImages);
  };

  const cancelForm = () => {
    if (isEditing && savedCard) {
      form.reset(savedCard);
      restoreSavedImages();
      setIsEditing(false);
      setView('preview');
      return;
    }

    form.reset(emptyCardFormValues);
    clearImages();
    navigate(ROUTES.currencies);
  };

  return (
    <section className={styles.page} aria-label="Card management">
      <div className={styles.pageHeader}>
        <Header title={view === 'form' ? 'Create New Card' : 'Card Preview'} />
        <p className={styles.pageDescription}>
          {view === 'form'
            ? 'Add the details below, then review your card before saving.'
            : 'Review the card details and make any changes before continuing.'}
        </p>
      </div>

      {view === 'form' ? (
        <CardForm
          form={form}
          isEditing={isEditing}
          images={images}
          onSubmit={submitCard}
          onCancel={cancelForm}
          onAddImages={addImages}
          onRemoveImage={removeImage}
        />
      ) : (
        savedCard && (
          <CardPreview
            card={savedCard}
            images={images}
            notice={notice}
            onBackToForm={openEditor}
            onEdit={openEditor}
          />
        )
      )}
    </section>
  );
}
