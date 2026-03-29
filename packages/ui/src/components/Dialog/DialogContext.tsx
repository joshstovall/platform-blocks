import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { DialogConfig, DialogContextValue } from './types';

// Split contexts for API vs state to minimize re-renders
const DialogApiContext = createContext<Pick<DialogContextValue, 'openDialog' | 'closeDialog' | 'removeDialog' | 'closeAllDialogs'> | null>(null);
const DialogsStateContext = createContext<DialogConfig[] | null>(null);

type DialogApi = Pick<DialogContextValue, 'openDialog' | 'closeDialog' | 'removeDialog' | 'closeAllDialogs'>;

let dialogApiRef: DialogApi | null = null;
let dialogsStateRef: DialogConfig[] = [];
const pendingDialogOperations: Array<(api: DialogApi) => void> = [];
let pendingDialogIdCounter = 0;

function enqueueDialogOperation(operation: (api: DialogApi) => void) {
  pendingDialogOperations.push(operation);
  notifyDialogListeners();
}

function flushPendingDialogOperations() {
  if (!dialogApiRef) return;
  while (pendingDialogOperations.length > 0) {
    const operation = pendingDialogOperations.shift();
    try {
      operation?.(dialogApiRef);
    } catch (error) {
      if (__DEV__) {
        console.error('[dialog] queued operation failed', error);
      }
    }
  }
}

function ensureDialogId(providedId?: string) {
  if (providedId) return providedId;
  pendingDialogIdCounter += 1;
  return `pending-dialog-${Date.now()}-${pendingDialogIdCounter}`;
}

const dialogBridge: DialogContextValue = {
  dialogs: dialogsStateRef,
  openDialog: (config: Omit<DialogConfig, 'id'> & { id?: string }) => {
    const id = ensureDialogId(config.id);
    const payload = { ...config, id } as DialogConfig;
    if (dialogApiRef) {
      return dialogApiRef.openDialog(payload);
    }
    enqueueDialogOperation(api => api.openDialog(payload));
    return id;
  },
  closeDialog: (id: string) => {
    if (dialogApiRef) {
      dialogApiRef.closeDialog(id);
      return;
    }
    enqueueDialogOperation(api => api.closeDialog(id));
  },
  removeDialog: (id: string) => {
    if (dialogApiRef) {
      dialogApiRef.removeDialog(id);
      return;
    }
    enqueueDialogOperation(api => api.removeDialog(id));
  },
  closeAllDialogs: () => {
    if (dialogApiRef) {
      dialogApiRef.closeAllDialogs();
      return;
    }
    enqueueDialogOperation(api => api.closeAllDialogs());
  }
};

const dialogApiBridge: DialogApi = {
  openDialog: (config) => dialogBridge.openDialog(config),
  closeDialog: (id) => dialogBridge.closeDialog(id),
  removeDialog: (id) => dialogBridge.removeDialog(id),
  closeAllDialogs: () => dialogBridge.closeAllDialogs(),
};

type DialogRequestListener = () => void;

const dialogRequestListeners = new Set<DialogRequestListener>();
let pendingDialogRequest = false;

function notifyDialogListeners() {
  if (dialogRequestListeners.size === 0) {
    pendingDialogRequest = true;
    return;
  }

  pendingDialogRequest = false;
  dialogRequestListeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      if (__DEV__) {
        console.error('[dialog] listener error', error);
      }
    }
  });
}

export function onDialogsRequested(listener: DialogRequestListener) {
  dialogRequestListeners.add(listener);
  if (pendingDialogRequest) {
    pendingDialogRequest = false;
    listener();
  }
  return () => {
    dialogRequestListeners.delete(listener);
  };
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogConfig[]>([]);

  const openDialog = useCallback((config: Omit<DialogConfig, 'id'> & { id?: string }) => {
    const id = config.id ?? Math.random().toString(36).substr(2, 9);
    const dialogConfig: DialogConfig = {
      id,
      closable: true,
      backdrop: true,
      backdropClosable: true,
      ...config,
    } as DialogConfig;

    setDialogs(prev => [...prev, dialogConfig]);
    return id;
  }, []);

  const closeDialog = useCallback((id: string) => {
    setDialogs(prev => prev.map(dialog => 
      dialog.id === id 
        ? { ...dialog, isClosing: true }
        : dialog
    ));
  }, []);

  const removeDialog = useCallback((id: string) => {
    setDialogs(prev => {
      const dialog = prev.find(d => d.id === id);
      if (dialog?.onClose) {
        dialog.onClose();
      }
      return prev.filter(d => d.id !== id);
    });
  }, []);

  const closeAllDialogs = useCallback(() => {
    setDialogs(prev => {
      prev.forEach(dialog => {
        if (dialog.onClose) {
          dialog.onClose();
        }
      });
      return [];
    });
  }, []);

  const apiValue = useMemo(() => ({
    openDialog,
    closeDialog,
    removeDialog,
    closeAllDialogs,
  }), [openDialog, closeDialog, removeDialog, closeAllDialogs]);

  useEffect(() => {
    dialogsStateRef = dialogs;
    dialogBridge.dialogs = dialogs;
  }, [dialogs]);

  useEffect(() => {
    dialogApiRef = apiValue;
    flushPendingDialogOperations();
    return () => {
      if (dialogApiRef === apiValue) {
        dialogApiRef = null;
        dialogsStateRef = [];
        dialogBridge.dialogs = [];
      }
    };
  }, [apiValue]);

  return (
    <DialogApiContext.Provider value={apiValue}>
      <DialogsStateContext.Provider value={dialogs}>
        {children}
      </DialogsStateContext.Provider>
    </DialogApiContext.Provider>
  );
}

// Back-compat: full object (re-renders on dialog list changes)
export function useDialog(): DialogContextValue {
  const api = useContext(DialogApiContext);
  const dialogs = useContext(DialogsStateContext);
  useEffect(() => {
    if (!api || !dialogs) {
      notifyDialogListeners();
    }
  }, [api, dialogs]);
  if (api && dialogs) {
    return { dialogs, ...api } as DialogContextValue;
  }
  return dialogBridge;
}

export function useDialogApi() {
  const api = useContext(DialogApiContext);
  useEffect(() => {
    if (!api) {
      notifyDialogListeners();
    }
  }, [api]);
  return api ?? dialogApiBridge;
}

export function useDialogs() {
  const dialogs = useContext(DialogsStateContext);
  useEffect(() => {
    if (!dialogs) {
      notifyDialogListeners();
    }
  }, [dialogs]);
  return dialogs ?? dialogsStateRef;
}
