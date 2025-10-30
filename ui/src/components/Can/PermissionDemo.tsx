import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Can,
  CanWithConditions,
  Cannot,
  PermissionGate,
  PermissionProvider,
  usePermissions,
  permissions,
  defineAbility,
  PermissionPatterns
} from './index';

// Example user data
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

// Example component using Can components
const PostActions: React.FC<{ post: Post; currentUser: User }> = ({ post, currentUser }) => {
  return (
    <View style={styles.postActions}>
      <Text style={styles.postTitle}>{post.title}</Text>
      
      {/* Basic permission check */}
      <Can I="read" a="Post">
        <Text style={styles.action}>✓ Can read this post</Text>
      </Can>

      {/* Object-level permission with conditions */}
      <CanWithConditions I="edit" this={post}>
        <Text style={styles.action}>✓ Can edit this post</Text>
      </CanWithConditions>

      {/* Permission with fallback */}
      <CanWithConditions 
        I="delete" 
        this={post}
        fallback={<Text style={styles.denied}>✗ Cannot delete this post</Text>}
      >
        <Text style={styles.action}>✓ Can delete this post</Text>
      </CanWithConditions>

      {/* Cannot component - shows when permission is denied */}
      <Cannot I="publish" a="Post">
        <Text style={styles.denied}>✗ Cannot publish posts</Text>
      </Cannot>

      {/* Permission gate requiring multiple permissions */}
      <PermissionGate
        permissions={[
          { action: 'edit', subject: 'Post' },
          { action: 'manage', subject: 'Comments' }
        ]}
        fallback={<Text style={styles.denied}>✗ Missing required permissions</Text>}
      >
        <Text style={styles.action}>✓ Can edit post and manage comments</Text>
      </PermissionGate>
    </View>
  );
};

// Component using hooks
const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  const { ability } = usePermissions();

  const canEditProfile = ability.can('edit', user);
  const canDeleteAccount = ability.can('delete', user);
  const canViewAnalytics = ability.can('view', 'Analytics');

  return (
    <View style={styles.profile}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userRole}>Role: {user.role}</Text>
      
      {canEditProfile && (
        <Text style={styles.action}>✓ Can edit profile</Text>
      )}
      
      {canDeleteAccount && (
        <Text style={styles.action}>✓ Can delete account</Text>
      )}
      
      {canViewAnalytics && (
        <Text style={styles.action}>✓ Can view analytics</Text>
      )}
    </View>
  );
};

// Example permission definitions
const createUserAbility = (user: User) => {
  return defineAbility((builder) => {
    if (user.role === 'admin') {
      // Admin can do everything
      builder.manage('*');
    } else if (user.role === 'user') {
      // Users can read public content
      builder.allow('read', 'Post');
      builder.allow('read', 'Comment');
      
      // Users can manage their own content
      builder.allowIf('edit', 'Post', { authorId: user.id });
      builder.allowIf('delete', 'Post', { authorId: user.id });
      builder.allowIf('edit', 'User', { id: user.id });
      
      // Users can create new content
      builder.allow('create', 'Post');
      builder.allow('create', 'Comment');
      
      // But cannot publish without review
      builder.forbid('publish', 'Post');
    } else {
      // Guests can only read published content
      builder.allowIf('read', 'Post', { isPublished: true });
      builder.allow('read', 'Comment');
    }
  });
};

// Alternative: Using pattern builders
const createUserAbilityWithPatterns = (user: User) => {
  switch (user.role) {
    case 'admin':
      return PermissionPatterns.admin().build();
    case 'user':
      return PermissionPatterns.user(user.id).build();
    default:
      return PermissionPatterns.guest().build();
  }
};

// Alternative: Using fluent builder
const createUserAbilityFluent = (user: User) => {
  const builder = permissions();

  if (user.role === 'admin') {
    return builder.manage('*').build();
  }

  if (user.role === 'user') {
    return builder
      .allow('read', 'Post')
      .allow('create', 'Post')
      .allowIf('edit', 'Post', { authorId: user.id })
      .allowIf('delete', 'Post', { authorId: user.id })
      .forbid('publish', 'Post')
      .build();
  }

  return builder
    .allowIf('read', 'Post', { isPublished: true })
    .build();
};

// Main demo component
export const PermissionDemo: React.FC = () => {
  const currentUser: User = {
    id: '123',
    role: 'user',
    name: 'John Doe'
  };

  const samplePost: Post = {
    id: '456',
    title: 'Sample Post',
    authorId: '123', // Same as current user
    isPublished: false
  };

  const ability = createUserAbility(currentUser);

  return (
    <PermissionProvider rules={ability.getRules()} user={currentUser}>
      <View style={styles.container}>
        <Text style={styles.header}>Permission System Demo</Text>
        
        <UserProfile user={currentUser} />
        <PostActions post={samplePost} currentUser={currentUser} />
        
        {/* Development helper */}
        <Can I="*" a="*" passthrough={true}>
          <Text style={styles.debug}>🚧 Development mode - permissions bypassed</Text>
        </Can>
      </View>
    </PermissionProvider>
  );
};

const styles = StyleSheet.create({
  action: {
    color: '#28a745',
    marginBottom: 5,
  },
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  debug: {
    color: '#ffc107',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  denied: {
    color: '#dc3545',
    marginBottom: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  postActions: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profile: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userRole: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
});