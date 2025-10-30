import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PermissionProviderProps, PermissionContextValue, PermissionRule } from './types';
import { createAbility } from './ability';

/**
 * Permission Context
 */
const PermissionContext = createContext<PermissionContextValue | null>(null);

/**
 * Permission Provider Component
 */
export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  rules = [],
  user,
  children,
  dev = {}
}) => {
  const [ability] = useState(() => createAbility(rules));
  const [currentUser, setCurrentUser] = useState(user);

  const updateAbility = useCallback((newRules: PermissionRule[]) => {
    ability.update(newRules);
  }, [ability]);

  const can = useCallback((action: string, subject: any, field?: string) => {
    const result = ability.can(action, subject, field);
    
    if (dev.logChecks) {
      console.log(`[Permissions] Can ${action} ${subject}${field ? `.${field}` : ''}:`, result);
    }
    
    return result;
  }, [ability, dev.logChecks]);

  const cannot = useCallback((action: string, subject: any, field?: string) => {
    const result = ability.cannot(action, subject, field);
    
    if (dev.logChecks) {
      console.log(`[Permissions] Cannot ${action} ${subject}${field ? `.${field}` : ''}:`, result);
    }
    
    return result;
  }, [ability, dev.logChecks]);

  const setUser = useCallback((newUser: any) => {
    setCurrentUser(newUser);
  }, []);

  const contextValue = useMemo((): PermissionContextValue => ({
    ability,
    updateAbility,
    can,
    cannot,
    user: currentUser,
    setUser
  }), [ability, updateAbility, can, cannot, currentUser, setUser]);

  return React.createElement(
    PermissionContext.Provider,
    { value: contextValue },
    children
  );
};

/**
 * Hook to access permission context
 */
export const usePermissions = (options: { required?: boolean; debug?: boolean } = {}) => {
  const context = useContext(PermissionContext);
  
  if (!context) {
    if (options.required) {
      throw new Error('usePermissions must be used within a PermissionProvider');
    }
    
    if (options.debug) {
      console.warn('[Permissions] usePermissions called outside of PermissionProvider');
    }
    
    // Return a fallback context that allows everything
    return {
      ability: createAbility([{ action: '*', subject: '*' }]),
      updateAbility: () => {},
      can: () => true,
      cannot: () => false,
      user: null,
      setUser: () => {}
    };
  }
  
  return context;
};

/**
 * Hook to check a specific permission
 */
export const useCan = (action: string, subject: any, field?: string) => {
  const { can } = usePermissions();
  return can(action, subject, field);
};

/**
 * Hook to check if permission is denied
 */
export const useCannot = (action: string, subject: any, field?: string) => {
  const { cannot } = usePermissions();
  return cannot(action, subject, field);
};

/**
 * Hook to get the current ability instance
 */
export const useAbility = () => {
  const { ability } = usePermissions();
  return ability;
};