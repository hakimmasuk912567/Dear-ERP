import test from 'node:test';
import assert from 'node:assert/strict';
import { initialSettings } from '../data/mockData';
import {
  mergeRemoteSettings,
  shouldApplyRemoteCollectionSnapshot,
} from './firebaseSyncHelpers';

test('mergeRemoteSettings preserves local Firebase credentials and connection flag when missing remotely', () => {
  const local = {
    ...initialSettings,
    firebaseApiKey: 'AIzaSyTestKey',
    firebaseProjectId: 'my-erp-prod',
    firebaseConnected: true,
    brandName: 'Old Brand',
  };

  const merged = mergeRemoteSettings(local, {
    brandName: 'Dear Health Care',
    firebaseConnected: false,
    firebaseApiKey: '',
    firebaseProjectId: '',
  });

  assert.equal(merged.brandName, 'Dear Health Care');
  assert.equal(merged.firebaseApiKey, 'AIzaSyTestKey');
  assert.equal(merged.firebaseProjectId, 'my-erp-prod');
  assert.equal(merged.firebaseConnected, true);
});

test('shouldApplyRemoteCollectionSnapshot avoids wiping local records when remote collection starts empty', () => {
  assert.equal(
    shouldApplyRemoteCollectionSnapshot([], [{ id: '1' }], false),
    false
  );
  assert.equal(
    shouldApplyRemoteCollectionSnapshot([{ id: 'r1' }], [{ id: '1' }], false),
    true
  );
  assert.equal(
    shouldApplyRemoteCollectionSnapshot([], [{ id: '1' }], true),
    true
  );
});
