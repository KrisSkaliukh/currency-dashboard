import { CreateCardForm } from '../../features/card/components/CreateCardForm';
import { Header } from '../../shared/components/Header/Header';

export function CardFormPage() {
  return (
    <main>
      <Header title="Create New Card" />
      <CreateCardForm />
    </main>
  );
}
