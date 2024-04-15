import * as React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { Button } from 'react-native';

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '176571807676-nnel138rrmf5t41gkaf31549klndj4ae.apps.googleusercontent.com',
    iosClientId: '176571807676-nnel138rrmf5t41gkaf31549klndj4ae.apps.googleusercontent.com',
    androidClientId: '176571807676-nnel138rrmf5t41gkaf31549klndj4ae.apps.googleusercontent.com',
    webClientId: '176571807676-nnel138rrmf5t41gkaf31549klndj4ae.apps.googleusercontent.com'
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { accessToken } = response.authentication;
      verifyTokenWithBackend(accessToken);
    }
  }, [response]);

  const verifyTokenWithBackend = async (accessToken) => {
    const response = await fetch('https://app.qrla.io/auth/google/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken: accessToken })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data.token);
      // Proceed to use the token within your app
    } else {
      console.error('Failed to log in');
    }
  };

  return (
    <Button
      disabled={!request}
      title="Login with Google"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
