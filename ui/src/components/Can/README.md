# Can Components - Permission System

A powerful and flexible permission system for React Native applications, inspired by CASL but tailored specifically for React Native with TypeScript support.

## Features

- 🔒 **Declarative Permission Checks** - Use `<Can>` and `<Cannot>` components
- 🎯 **Object-Level Permissions** - Check permissions on specific objects with conditions
- 🏗️ **Fluent API Builder** - Build complex permission rules with an intuitive API
- 🚀 **Performance Optimized** - Built-in caching and efficient rule matching
- 📱 **React Native First** - Designed specifically for React Native applications
- 🎨 **TypeScript Support** - Full type safety with comprehensive interfaces
- 🔄 **Context Provider** - Easy integration with React Context
- 🧪 **Development Tools** - Debug mode, passthrough, and logging capabilities

## Installation

The permission system is part of the PlatformBlocks UI library:

```bash
npm install @platform-blocks/ui
```

## Quick Start

### 1. Basic Setup

```tsx
import React from 'react';
import { PermissionProvider, defineAbility } from '@platform-blocks/ui';

// Define permissions for your user
const userAbility = defineAbility((builder) => {
  builder.allow('read', 'Post');
  builder.allow('create', 'Comment');
  builder.allowIf('edit', 'Post', { authorId: user.id });
});

function App() {
  return (
    <PermissionProvider rules={userAbility.getRules()}>
      {/* Your app components */}
    </PermissionProvider>
  );
}
```

### 2. Using Can Components

```tsx
import { Can, Cannot, CanWithConditions } from '@platform-blocks/ui';

function PostComponent({ post, user }) {
  return (
    <View>
      {/* Basic permission check */}
      <Can I="read" a="Post">
        <Text>You can read this post</Text>
      </Can>

      {/* Permission with fallback */}
      <Can 
        I="edit" 
        a="Post" 
        fallback={<Text>You cannot edit posts</Text>}
      >
        <Button title="Edit Post" />
      </Can>

      {/* Object-level permission */}
      <CanWithConditions I="delete" this={post}>
        <Button title="Delete" />
      </CanWithConditions>

      {/* Inverse permission check */}
      <Cannot I="admin" a="Dashboard">
        <Text>Regular user view</Text>
      </Cannot>
    </View>
  );
}
```

### 3. Using Hooks

```tsx
import { usePermissions } from '@platform-blocks/ui';

function UserProfile() {
  const { ability, can, cannot } = usePermissions();

  const canEdit = can('edit', 'Profile');
  const cannotDelete = cannot('delete', 'Account');

  return (
    <View>
      {canEdit && <Button title="Edit Profile" />}
      {cannotDelete && <Text>Account deletion not allowed</Text>}
    </View>
  );
}
```

## API Reference

### Components

#### `<Can>`
Renders children if permission is granted.

```tsx
interface CanProps {
  I: string;                    // Action (e.g., 'read', 'edit', 'delete')
  a?: any;                      // Subject (e.g., 'Post', 'User', object)
  field?: string;               // Specific field (optional)
  children: React.ReactNode;    // Content to render when allowed
  fallback?: React.ReactNode;   // Content to render when denied
  ability?: Ability;            // Custom ability instance
  style?: ViewStyle;            // Container styles
  testID?: string;              // Test identifier
  passthrough?: boolean;        // Development bypass
}
```

#### `<CanWithConditions>`
For object-level permissions with condition checking.

```tsx
<CanWithConditions I="edit" this={post}>
  <EditButton />
</CanWithConditions>
```

#### `<Cannot>`
Inverse of `<Can>` - renders when permission is NOT granted.

```tsx
<Cannot I="admin" a="Dashboard">
  <RegularUserView />
</Cannot>
```

#### `<PermissionGate>`
Requires ALL specified permissions to pass.

```tsx
<PermissionGate
  permissions={[
    { action: 'edit', subject: 'Post' },
    { action: 'manage', subject: 'Comments' }
  ]}
  fallback={<AccessDenied />}
>
  <AdminPanel />
</PermissionGate>
```

### Context & Hooks

#### `<PermissionProvider>`
Provides permission context to child components.

```tsx
interface PermissionProviderProps {
  rules?: PermissionRule[];     // Permission rules
  user?: any;                   // User context
  children: React.ReactNode;    // Child components
  dev?: {                       // Development options
    logChecks?: boolean;
    warnMissing?: boolean;
    allowPassthrough?: boolean;
  };
}
```

#### `usePermissions()`
Access permission context in components.

```tsx
const { 
  ability,      // Ability instance
  can,          // Check permission function
  cannot,       // Check inverse permission
  user,         // Current user
  updateAbility // Update permissions
} = usePermissions();
```

### Permission Builder

#### Fluent API

```tsx
import { permissions, defineAbility } from '@platform-blocks/ui';

// Using the fluent builder
const ability = permissions()
  .allow('read', 'Post')
  .allow('create', 'Comment')
  .allowIf('edit', 'Post', { authorId: userId })
  .forbid('delete', 'User')
  .manage('AdminPanel')  // Allow all actions
  .build();

// Using defineAbility helper
const ability = defineAbility((builder) => {
  builder.allow('read', 'Post');
  builder.allowIf('edit', 'Post', { authorId: userId });
});
```

#### Role-Based Permissions

```tsx
import { PermissionPatterns } from '@platform-blocks/ui';

// Pre-built patterns
const adminAbility = PermissionPatterns.admin().build();
const userAbility = PermissionPatterns.user(userId).build();
const guestAbility = PermissionPatterns.guest().build();

// Custom role builder
const customAbility = permissions()
  .role('moderator', (role) => {
    role.can('read', 'Post');
    role.can('edit', 'Post');
    role.cannot('delete', 'User');
  })
  .build();
```

### Higher-Order Components

```tsx
import { withCan, withCannot } from '@platform-blocks/ui';

// Wrap component with permission check
const SecureComponent = withCan('admin', 'Dashboard')(MyComponent);
const PublicComponent = withCannot('banned', 'Site')(MyComponent);
```

## Permission Rules

### Basic Rules

```tsx
// Simple allow/deny
builder.allow('read', 'Post');
builder.forbid('delete', 'User');

// Wildcard permissions
builder.manage('*');           // All actions on all subjects
builder.allow('read', '*');    // Read anything
builder.allow('*', 'Post');    // Any action on posts
```

### Conditional Rules

```tsx
// Object-level conditions
builder.allowIf('edit', 'Post', { authorId: userId });
builder.allowIf('view', 'Document', { isPublic: true });

// Complex conditions
builder.allowIf('approve', 'Post', { 
  status: 'pending', 
  authorId: { $ne: userId } 
});
```

### Field-Level Permissions

```tsx
// Specific field access
builder.allow('read', 'User', 'email');
builder.forbid('edit', 'User', 'role');

// Multiple fields
builder.allow('read', 'Post', ['title', 'content']);
```

## Common Patterns

### User Resource Ownership

```tsx
const userAbility = defineAbility((builder) => {
  // Users can manage their own resources
  builder.allowIf('*', 'Profile', { userId });
  builder.allowIf('edit', 'Post', { authorId: userId });
  builder.allowIf('delete', 'Comment', { authorId: userId });
});
```

### Role-Based Access

```tsx
const createRoleAbility = (user) => {
  return defineAbility((builder) => {
    switch (user.role) {
      case 'admin':
        builder.manage('*');
        break;
      case 'moderator':
        builder.manage('Post');
        builder.manage('Comment');
        builder.forbid('delete', 'User');
        break;
      case 'user':
        builder.allow('read', '*');
        builder.allowIf('edit', '*', { authorId: user.id });
        break;
      default:
        builder.allow('read', 'public');
    }
  });
};
```

### Organization/Team Permissions

```tsx
const teamAbility = defineAbility((builder) => {
  // Team members can view team resources
  builder.allowIf('read', 'Project', { teamId: user.teamId });
  
  // Team leaders can manage team
  if (user.isTeamLead) {
    builder.allowIf('*', 'Project', { teamId: user.teamId });
  }
});
```

## Development & Debugging

### Debug Mode

```tsx
<PermissionProvider 
  rules={rules}
  dev={{
    logChecks: true,        // Log all permission checks
    warnMissing: true,      // Warn about missing permissions
    allowPassthrough: true  // Allow passthrough in development
  }}
>
```

### Development Passthrough

```tsx
// Bypass permissions in development
<Can I="admin" a="Panel" passthrough={__DEV__}>
  <AdminPanel />
</Can>
```

### Permission Debugging

```tsx
const { ability } = usePermissions();

// Check what user can do
console.log('Can edit posts:', ability.can('edit', 'Post'));
console.log('All rules:', ability.getRules());

// Debug specific object
const post = { id: 1, authorId: 123 };
console.log('Can edit this post:', ability.can('edit', post));
```

## Best Practices

### 1. Define Clear Permission Structure

```tsx
// Good: Clear, specific permissions
builder.allow('read', 'Post');
builder.allow('create', 'Comment');
builder.allowIf('edit', 'Post', { authorId: userId });

// Avoid: Overly broad wildcards
builder.manage('*'); // Only for admin roles
```

### 2. Use Meaningful Action Names

```tsx
// Good: Specific actions
'read', 'create', 'edit', 'delete', 'publish', 'approve'

// Good: Domain-specific actions
'withdraw_funds', 'approve_loan', 'view_analytics'
```

### 3. Leverage TypeScript

```tsx
// Define your permission types
type AppActions = 'read' | 'create' | 'edit' | 'delete';
type AppSubjects = 'Post' | 'User' | 'Comment';

// Use with components
<Can I="read" a="Post">...</Can>
```

### 4. Test Permissions

```tsx
// Unit test your permission logic
describe('User Permissions', () => {
  it('should allow users to edit own posts', () => {
    const ability = createUserAbility(user);
    expect(ability.can('edit', { authorId: user.id })).toBe(true);
  });
});
```

## Performance Considerations

- **Caching**: Permission checks are automatically cached
- **Rule Optimization**: More specific rules should come first
- **Conditional Checks**: Complex conditions may impact performance
- **Context Updates**: Minimize ability updates to prevent re-renders

## Migration from CASL

If you're migrating from CASL:

```tsx
// CASL
import { Can } from '@casl/react';

// PlatformBlocks UI
import { Can } from '@platform-blocks/ui';

// Similar API, React Native optimized
<Can I="read" a="Post">...</Can>
```

## Contributing

Found a bug or want to contribute? Check out our [GitHub repository](https://github.com/your-org/platform-blocks).

## License

MIT License - see LICENSE file for details.