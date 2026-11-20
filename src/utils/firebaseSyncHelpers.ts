import { SystemSettings } from '../data/mockData';

/**
 * Safely merges remote Firestore settings/config into local settings
 * while ensuring active Firebase connection credentials are never lost.
 */
export const mergeRemoteSettings = (
  localSettings: SystemSettings,
  remoteSettings?: Partial<SystemSettings> | null
): SystemSettings => {
  if (!remoteSettings || typeof remoteSettings !== 'object') {
    return localSettings;
  }

  return {
    ...localSettings,
    ...remoteSettings,
    firebaseApiKey: remoteSettings.firebaseApiKey || localSettings.firebaseApiKey,
    firebaseProjectId: remoteSettings.firebaseProjectId || localSettings.firebaseProjectId,
    firebaseAuthDomain: remoteSettings.firebaseAuthDomain || localSettings.firebaseAuthDomain,
    firebaseStorageBucket:
      remoteSettings.firebaseStorageBucket || localSettings.firebaseStorageBucket,
    firebaseMessagingSenderId:
      remoteSettings.firebaseMessagingSenderId || localSettings.firebaseMessagingSenderId,
    firebaseAppId: remoteSettings.firebaseAppId || localSettings.firebaseAppId,
    firebaseConnected: Boolean(
      localSettings.firebaseConnected || remoteSettings.firebaseConnected
    ),
    firebaseLastSync:
      remoteSettings.firebaseLastSync || localSettings.firebaseLastSync || '',
  };
};

/**
 * Determines whether an incoming Firestore collection snapshot should overwrite local state.
 * Prevents an empty Firestore collection from wiping existing local data on initial connect,
 * while still allowing real-time deletions once the collection has been observed with data.
 */
export const shouldApplyRemoteCollectionSnapshot = <T>(
  remoteItems: T[],
  localItems: T[],
  hasObservedRemoteData: boolean
): boolean => {
  if (remoteItems.length > 0) return true;
  if (hasObservedRemoteData) return true;
  return localItems.length === 0;
};
