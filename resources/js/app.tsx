import '../css/app.css';
import './bootstrap';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Author: MD SHAHIN MIA

import { createInertiaApp, router } from '@inertiajs/react';
import { ThemeProvider } from '@mui/material';
import { createRoot } from 'react-dom/client';
import cfcTheme from './utils/theme';
import { CartProvider } from './utils/CartProvider';
import { useEffect, useState } from 'react';
import ProgressModal from './Components/ProgressModal';

const appName = import.meta.env.VITE_APP_NAME || 'CFC_POS';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        function AppWithLoader() {
            const [loading, setLoading] = useState(false);

            useEffect(() => {
                router.on('start', () => setLoading(true));
                router.on('finish', () => setLoading(false));
            }, []);

            return (
                <CartProvider>
                    <ThemeProvider theme={cfcTheme}>
                        <ProgressModal open={loading} setOpen={setLoading} />
                        <App {...props} />
                    </ThemeProvider>
                </CartProvider>
            );
        }

        createRoot(el).render(<AppWithLoader />);
    }
});
