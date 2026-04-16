import classNames from "classnames";
import styles from "./Facts.module.css";

export function FactList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <dl className={classNames(styles.facts, className)}>{children}</dl>;
}

export function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
