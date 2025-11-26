import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: false,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? null,
        type: state.type,
      });
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? null,
        type: state.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return networkState;
};

export const getNetworkStatus = async (): Promise<NetworkState> => {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable ?? null,
    type: state.type,
  };
};

