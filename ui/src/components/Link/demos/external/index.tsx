import { Link, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={12}>
      <Link 
        href="https://reactnative.dev" 
        external
        color="primary"
      >
        React Native Documentation
      </Link>
      <Link 
        href="https://expo.dev" 
        external
        color="secondary"
      >
        Expo Documentation
      </Link>
      <Link 
        href="mailto:support@example.com" 
        external
        color="gray"
      >
        Email Support
      </Link>
    </Column>
  );
}


