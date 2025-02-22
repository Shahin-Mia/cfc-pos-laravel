import '../css/app.css';
import './bootstrap';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { createInertiaApp } from '@inertiajs/react';
import { ThemeProvider } from '@mui/material';
import { createRoot } from 'react-dom/client';
import cfcTheme from './utils/theme';
import { CartProvider } from './utils/CartProvider';

const appName = import.meta.env.VITE_APP_NAME || 'CFC_POS';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
        return pages[`./Pages/${name}.tsx`]
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <CartProvider>
                <ThemeProvider theme={cfcTheme}>
                    <App {...props} />
                </ThemeProvider>
            </CartProvider>
        )
    },
})
