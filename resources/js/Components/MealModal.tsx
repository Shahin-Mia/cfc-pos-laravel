import { useCartStore } from '@/store/useCartStore';
import { Box, Button, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MealModal({
    open,
    setOpen,
    meal
}: any) {
    const addToCart = useCartStore((state: any) => state.addToCart);
    const handleClose = () => {
        setOpen(false);
    };

    const handleAddVarientToCart = (varient: any) => {
        const mealData = {
            ...meal,
            title: meal.title + '-' + varient.name,
            varient_id: varient.id,
            sale_price: Number(varient.extra_price) + Number(meal.sale_price),
        };
        addToCart(mealData);
        setOpen(false);
    }



    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle>{meal?.title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    {meal?.description}
                </Typography>
                <Stack direction="column" spacing={2} mt={2}>
                    {
                        meal?.varients.map((varient: any) => (
                            <Button
                                key={varient.id}
                                sx={{
                                    border: '1px solid #ccc',
                                    padding: 2,
                                    borderRadius: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexDirection: 'column',
                                }}
                                onClick={() => handleAddVarientToCart(varient)}>
                                <Typography variant="button">{varient.name}</Typography>
                                <Typography variant="button">Extra Price: {varient.extra_price}</Typography>
                            </Button>
                        ))
                    }
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
