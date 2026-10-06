import React, { useState, useEffect} from 'react'


function useLocalStorage(key, initialState) {
    const [state, setState] = useState(() => {
        const value = JSON.parse(localStorage.getItem(key) || 'null');
        return value || initialState;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

export default useLocalStorage