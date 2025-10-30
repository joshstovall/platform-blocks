import { Link, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={8}>
      <Link href="#" color="primary">
        Primary link
      </Link>
      <Link href="#" color="secondary">
        Secondary link
      </Link>
      <Link href="#" color="success">
        Success link
      </Link>
      <Link href="#" color="error">
        Error link
      </Link>
    </Column>
  );
}


