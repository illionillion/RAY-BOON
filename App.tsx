
import type { BaseToastProps} from 'react-native-toast-message';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { RecoilRoot } from 'recoil';
import { BottomTabNavigate } from './src/Navigate/BottomTabNavigate';

export default function App() {

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#69C779' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
        }}
      />
    ),
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
        }}
      />
    ),
  };

  return (
    <RecoilRoot>
      <BottomTabNavigate />
      <Toast config={toastConfig} />
    </RecoilRoot>
  );
}
