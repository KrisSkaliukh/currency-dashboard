import styles from './Header.module.css';

interface IHeaderProps {
  title: string;
}

export function Header({ title }: IHeaderProps) {
  return <h1 className={styles.title}>{title}</h1>;
}
