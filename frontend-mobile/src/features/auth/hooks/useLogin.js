import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../../store/authStore';

const useLogin = () => {
  const navigation = useNavigation();
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (username, password) => {
    const result = await login(username, password);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        messageKey: result.messageKey,
      };
    }

    if (result.mustChangePassword) {
      navigation.navigate('ChangePassword');
      return { success: true };
    }

    return { success: true };
  };

  return { handleLogin, isLoading };
};

export default useLogin;
