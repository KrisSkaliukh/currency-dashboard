import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Select } from '../../../shared/components/Select/Select';

import styles from './CreateCardForm.module.css';

const priorities = ['Low', 'Medium', 'High'];

const statuses = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
];

const assignee = [
  { label: 'Kris Metus 1', value: 'km1' },
  { label: 'Kris Metus 2', value: 'km2' },
  { label: 'Kris Metus 3', value: 'km2' },
];

export function CreateCardForm() {
  return (
    <form className={styles.form}>
      <div className={styles.fields}>
        <div className={styles.column}>
          <div className={styles.field}>
            <Input
              id="title"
              name="title"
              label="Title *"
              placeholder="Enter card title"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter detailed description..."
              rows={5}
            />
          </div>

          <div className={styles.field}>
            <Select
              label="Priority *"
              name="priority"
              options={priorities}
              placeholder="Select priority"
              defaultValue=""
            />
          </div>

          <div className={styles.field}>
            <Select
              label="Status"
              name="status"
              options={statuses}
              placeholder="Select status"
              defaultValue=""
            />
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.field}>
            <Select
              label="Assignee"
              name="assignee"
              options={assignee}
              placeholder="Select status"
              defaultValue=""
            />
          </div>

          <div className={styles.field}>
            <Input id="deadline" name="deadline" label="Deadline" type="date" />
          </div>

          <div className={styles.field}>
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="Add tags..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="images">Images</label>
            <label className={styles.dropzone} htmlFor="images">
              <span className={styles.uploadIcon}>☁️</span>
              <span>Drag & drop images here</span>
              <span className={styles.uploadHint}>or click to browse</span>
            </label>

            <input
              className={styles.fileInput}
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" fullWidth={false} className={styles.cancelButton}>
          Cancel
        </Button>

        <Button type="submit" fullWidth={false} className={styles.submitButton}>
          Create Card
        </Button>
      </div>
    </form>
  );
}
