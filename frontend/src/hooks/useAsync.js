import { useCallback, useState } from 'react';

export const useAsync = (asyncFn) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setIsLoading(true);
        setError(null);

        try {
            return await asyncFn(...args);
        } catch (nextError) {
            setError(nextError.message);
            throw nextError;
        } finally {
            setIsLoading(false);
        }
    }, [asyncFn]);

    return { execute, isLoading, error };
};
