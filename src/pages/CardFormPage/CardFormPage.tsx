import { useState } from 'react';

import { CardPreview } from '../../features/card/components/CardPreview';
import { CreateCardForm } from '../../features/card/components/CreateCardForm';
import type { SubmittedCard } from '../../features/card/schema';
import { Header } from '../../shared/components/Header/Header';

import styles from './CardFormPage.module.css';

type View = 'form' | 'preview';
type Mode = 'create' | 'edit';

export function CardFormPage() {
  const [view, setView] = useState<View>('form');
  const [mode, setMode] = useState<Mode>('create');
  const [submittedCard, setSubmittedCard] = useState<SubmittedCard | null>(
    null,
  );
  const [formKey, setFormKey] = useState(0);

  const handleSubmitSuccess = (card: SubmittedCard) => {
    setSubmittedCard(card);
    setView('preview');
    setMode('create');
  };

  const handleEdit = () => {
    setMode('edit');
    setView('form');
  };

  const handleBackToForm = () => {
    setSubmittedCard(null);
    setMode('create');
    setView('form');
    setFormKey(key => key + 1);
  };

  const handleCancel = () => {
    if (mode === 'edit' && submittedCard) {
      setView('preview');
      return;
    }
  };

  return (
    <main className={styles.page}>
      <Header title={view === 'preview' ? 'Card Preview' : 'Create New Card'} />

      {view === 'preview' && submittedCard ? (
        <CardPreview
          card={submittedCard}
          onBackToForm={handleBackToForm}
          onEdit={handleEdit}
        />
      ) : (
        <CreateCardForm
          key={formKey}
          mode={mode}
          initialValues={mode === 'edit' ? submittedCard : null}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
}
