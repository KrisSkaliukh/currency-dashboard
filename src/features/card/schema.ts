import { z } from 'zod';

export const createCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.string().min(1, 'Please select a priority'),
  status: z.string(),
  assignee: z.string(),
  deadline: z.string(),
  tags: z.string(),
});

export type CreateCardFormValues = z.infer<typeof createCardSchema>;

export type CardImage = {
  id: string;
  name: string;
  url: string;
};

export type SubmittedCard = CreateCardFormValues & {
  images: CardImage[];
};
