import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid2, Paper, TextField } from '@mui/material';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Grid2 size={{ xs: 12, sm: 8, md: 6, lg: 4 }} sx={{ margin: 'auto' }}>

                <Paper elevation={3} sx={{ p: 4 }}>
                    <Avatar src='/storage/images/cfc-logo.png' alt='chairman-fried-chicken-logo' sx={{ width: 100, height: 100, marginX: 'auto', marginBottom: 2 }} />
                    <form onSubmit={submit}>
                        <div>

                            <TextField
                                id="email"
                                label="Email"
                                name='email'
                                variant="standard"
                                value={data.email}
                                autoComplete='current-email'
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email ? true : false}
                                helperText={errors.email}
                                sx={{ width: '100%' }}
                                required
                            />
                        </div>

                        <div>

                            <TextField
                                id="password"
                                type="password"
                                name="password"
                                variant='standard'
                                label="Password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password ? true : false}
                                helperText={errors.password}
                                sx={{ width: '100%', mt: 1 }}
                                required
                            />
                        </div>

                        <div>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="remember"
                                        size='small'
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                    />
                                }
                                label="Remember Me"
                                sx={{
                                    mt: 2,
                                    fontSize: 1,
                                }}
                            />
                        </div>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: '100%',
                                mt: 2
                            }}
                        >
                            {/* {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Forgot your password?
                                </Link>
                            )} */}

                            <Button sx={{ marginLeft: 4 }} variant='contained' type='submit' disabled={processing}>
                                Log in
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Grid2>
        </GuestLayout>
    );
}
