/**
 * Permission System Usage Examples
 * 
 * This file demonstrates how to use the Can components in your React Native app.
 * These examples show the complete API surface of the permission system.
 */

import React from 'react';
import { View, Text, Button } from 'react-native';
import {
  Can,
  Cannot,
  CanWithConditions,
  PermissionGate,
  PermissionProvider,
  usePermissions,
  defineAbility,
  permissions,
  PermissionPatterns,
  PermissionBuilder
} from './index';
import type { Ability } from './index';

// Example data types
interface User {
  id: string;
  role: 'admin' | 'user' | 'guest';
  name: string;
}

interface Post {
  id: string;
  title: string;
  authorId: string;
  isPublished: boolean;
}

// Example 1: Basic Permission Setup
const createUserAbility = (user: User): Ability => {
  return defineAbility((builder: PermissionBuilder) => {
    if (user.role === 'admin') {
      builder.manage('*'); // Admin can do everything
    } else if (user.role === 'user') {
      builder.allow('read', 'Post');
      builder.allow('create', 'Post');
      builder.allowIf('edit', 'Post', { authorId: user.id });
      builder.allowIf('delete', 'Post', { authorId: user.id });
      builder.forbid('publish', 'Post');
    } else {
      builder.allowIf('read', 'Post', { isPublished: true });
    }
  });
};

// Example 2: Using Can Components
const PostComponent: React.FC<{ post: Post; user: User }> = ({ post, user }) => {
  return (
    <View>
      <Text>{post.title}</Text>
      
      {/* Basic permission check */}
      <Can I="read" a="Post">
        <Text>✓ You can read posts</Text>
      </Can>

      {/* Permission with fallback */}
      <Can 
        I="edit" 
        a="Post" 
        fallback={<Text>✗ You cannot edit posts</Text>}
      >
        <Button title="Edit Post" onPress={() => {}} />
      </Can>

      {/* Object-level permission */}
      <CanWithConditions I="delete" this={post}>
        <Button title="Delete Post" onPress={() => {}} />
      </CanWithConditions>

      {/* Inverse permission check */}
      <Cannot I="admin" a="Dashboard">
        <Text>Regular user interface</Text>
      </Cannot>

      {/* Multiple permissions required */}
      <PermissionGate
        permissions={[
          { action: 'edit', subject: 'Post' },
          { action: 'publish', subject: 'Post' }
        ]}
        fallback={<Text>Need edit AND publish permissions</Text>}
      >
        <Button title="Edit & Publish" onPress={() => {}} />
      </PermissionGate>
    </View>
  );
};

// Example 3: Using Hooks
const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { ability, can, cannot } = usePermissions();

  const canCreatePost = can('create', 'Post');
  const canViewAnalytics = can('view', 'Analytics');
  const cannotDeleteAccount = cannot('delete', 'Account');

  return (
    <View>
      <Text>Welcome, {user.name}!</Text>
      
      {canCreatePost && (
        <Button title="Create New Post" onPress={() => {}} />
      )}
      
      {canViewAnalytics && (
        <Button title="View Analytics" onPress={() => {}} />
      )}
      
      {cannotDeleteAccount && (
        <Text>Account deletion is not available</Text>
      )}

      {/* Check specific object permissions */}
      <Button 
        title="Check Post Permissions"
        onPress={() => {
          const samplePost = { id: '1', authorId: user.id, isPublished: false };
          console.log('Can edit this post:', ability.can('edit', samplePost));
          console.log('Can delete this post:', ability.can('delete', samplePost));
        }}
      />
    </View>
  );
};

// Example 4: Using Permission Patterns
const createRoleBasedAbility = (user: User): Ability => {
  switch (user.role) {
    case 'admin':
      return PermissionPatterns.admin().build();
    case 'user':
      return PermissionPatterns.user(user.id).build();
    default:
      return PermissionPatterns.guest().build();
  }
};

// Example 5: Using Fluent Builder
const createCustomAbility = (user: User): Ability => {
  return permissions()
    .allow('read', 'Post')
    .allow('create', 'Comment')
    .allowIf('edit', 'Post', { authorId: user.id })
    .role('moderator', (role) => {
      role.can('moderate', 'Comment');
      role.can('ban', 'User');
    })
    .forbid('delete', 'System')
    .build();
};

// Example 6: Main App Component
const App: React.FC = () => {
  const currentUser: User = {
    id: '123',
    role: 'user',
    name: 'John Doe'
  };

  const samplePost: Post = {
    id: '456',
    title: 'My First Post',
    authorId: '123',
    isPublished: false
  };

  const userAbility = createUserAbility(currentUser);

  return (
    <PermissionProvider 
      rules={userAbility.getRules()} 
      user={currentUser}
      dev={{
        logChecks: __DEV__,
        allowPassthrough: __DEV__
      }}
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          Permission System Example
        </Text>
        
        <UserDashboard user={currentUser} />
        <PostComponent post={samplePost} user={currentUser} />
        
        {/* Development helper */}
        <Can I="*" a="*" passthrough={true}>
          <Text style={{ color: 'orange', fontStyle: 'italic' }}>
            🚧 Development mode - permissions bypassed
          </Text>
        </Can>
      </View>
    </PermissionProvider>
  );
};

export default App;