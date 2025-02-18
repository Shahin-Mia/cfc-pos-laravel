import '../css/app.css';
import './bootstrap';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { createInertiaApp } from '@inertiajs/react';
import { ThemeProvider } from '@mui/material';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import cfcTheme from './utils/theme';
import { CartProvider } from './utils/CartProvider';

const appName = import.meta.env.VITE_APP_NAME || 'CFC_POS';


createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <CartProvider>
                <ThemeProvider theme={cfcTheme}>
                    <App {...props} />
                </ThemeProvider>
            </CartProvider>
        );
    },
    progress: {
        color: '#000',
    },
});
