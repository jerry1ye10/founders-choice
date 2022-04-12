import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

// TODO: Split auth, profile and investors into seperate contexts
export function AppWrapper({ children }) {
    const [investors, setInvestors] = useState([]);
    const sharedState = {
        investors,
        setInvestors
    }

    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
  return useContext(AppContext);
}
