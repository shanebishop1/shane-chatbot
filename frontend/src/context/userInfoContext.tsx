import React, {
    createContext,
    useState,
    ReactNode,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { AccessToken, AuthResponse, UserInfoContextType } from '../types/types';
import { refreshAccessToken, login } from '../api/auth';

export const UserInfoContext = createContext<UserInfoContextType | null>(null);

export const UserInfoProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [googleIdToken, setGoogleIdToken] = useState<string>('');
    const [accessToken, setAccessToken] = useState<AccessToken | null>(null);
    const [email, setEmail] = useState<string>('');
    const [isLoadingLogin, setIsLoading] = useState<boolean>(false);
    const refreshTimer = useRef<number | null>(null);

    const isAccessTokenValid =
        !!accessToken && Date.now() < accessToken.exp * 1000;

    const attemptTokenRefresh = async () => {
        const newAccessToken: AccessToken | null = await refreshAccessToken();
        if (newAccessToken) {
            setAccessToken(newAccessToken);
            startTokenRefreshTimer(newAccessToken);
        }
    };

    const startTokenRefreshTimer = (token: AccessToken) => {
        if (token) {
            // Set a timer to refresh the token 2 minutes before it expires
            const timeoutDuration: number =
                token.exp * 1000 - Date.now() - 2 * 60 * 1000;
            if (refreshTimer.current) {
                clearTimeout(refreshTimer.current); // Clear any existing timer before setting a new one
            }
            const timer: number = setTimeout(() => {
                attemptTokenRefresh();
            }, timeoutDuration);
            refreshTimer.current = timer; // Store the timer so we can clear it if needed
        }
    };

    useEffect(() => {
        if (!accessToken) {
            attemptTokenRefresh();
        }
    }, []);

    useEffect(() => {
        const logInUser = async () => {
            const loginResponse: AuthResponse = await login(googleIdToken);
            if (loginResponse) {
                const newAccessToken: AccessToken = {
                    access_token: loginResponse.access_token,
                    exp: loginResponse.exp,
                };
                setAccessToken(newAccessToken);
                startTokenRefreshTimer(newAccessToken);
                setEmail(loginResponse.email);
            }
            setIsLoading(false);
        };
        if (googleIdToken) {
            setIsLoading(true);
            logInUser();
        }
    }, [googleIdToken]);

    useEffect(() => {
        return () => {
            if (refreshTimer.current) {
                clearTimeout(refreshTimer.current);
            }
        };
    }, [refreshTimer]);

    return (
        <UserInfoContext.Provider
            value={{
                googleIdToken,
                accessToken,
                email,
                setGoogleIdToken,
                isLoadingLogin,
                isAccessTokenValid,
            }}
        >
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => {
    const context: UserInfoContextType | null = useContext(UserInfoContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};
