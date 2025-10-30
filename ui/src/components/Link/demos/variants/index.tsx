import { Link, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={12}>
      <Link href="#" variant="default">
        Default link (underlined)
      </Link>
      <Link href="#" variant="hover-underline">
        Hover underline link
      </Link>
      <Link href="#" variant="subtle" color="primary">
        Subtle link style
      </Link>
      <Link href="#" variant="subtle" color="gray">
        Subtle gray link
      </Link>
    </Column>
  );
}


