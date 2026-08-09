'use client';

import React from 'react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportJSON: (jsonText: string) => void;
  onResetDefault: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = () => {
  return null;
};
