import { z } from 'zod';

export const cardPriorityOptions = ['Low', 'Medium', 'High', 'Urgent'] as const;
export const cardStatusOptions = ['Backlog', 'To Do', 'In Progress', 'Done'] as const;
export const cardAssigneeOptions = [
  'Alex Johnson',
  'Olivia Chen',
  'Noah Williams',
  'Mia Patel',
] as const;

export const cardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(80, 'Title must be 80 characters or fewer'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(600, 'Description must be 600 characters or fewer'),
  priority: z
    .string()
    .min(1, 'Please select a priority')
    .refine(
      value => cardPriorityOptions.includes(value as (typeof cardPriorityOptions)[number]),
      'Please select a valid priority',
    ),
  status: z.string().refine(
    value =>
      value === '' || cardStatusOptions.includes(value as (typeof cardStatusOptions)[number]),
    'Please select a valid status',
  ),
  assignee: z.string().refine(
    value =>
      value === '' || cardAssigneeOptions.includes(value as (typeof cardAssigneeOptions)[number]),
    'Please select a valid assignee',
  ),
  deadline: z.string(),
  tags: z.array(z.string()).max(12, 'You can add up to 12 tags'),
});

export type CardFormValues = z.infer<typeof cardSchema>;

export interface CardImageAttachment {
  id: string;
  file: File;
  previewUrl: string;
}

export const emptyCardFormValues: CardFormValues = {
  title: '',
  description: '',
  priority: '',
  status: '',
  assignee: '',
  deadline: '',
  tags: [],
};
