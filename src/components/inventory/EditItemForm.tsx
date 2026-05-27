/**
 * EditItemForm component
 *
 * Form for editing an existing inventory item. Fetches item data on mount,
 * populates form fields, and submits updates to parent component.
 */
import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Grid2,
  OutlinedInput,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { itemSchema, ItemFormData } from '@/schemas/itemSchema';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const FormGrid = styled(Grid2)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

type Props = {
  /** Initial values loaded from backend for editing */
  defaultValues: { name: string; quantity: number; description: string };
  /** Submit handler provided by page-level component */
  onSubmit: SubmitHandler<ItemFormData>;
  /** Indicates whether a submission is in progress */
  isLoading: boolean;
  /** Server-side validation or API errors mapped by field */
  apiResponse?: Record<string, string>;
};

export default function EditItemForm({
  defaultValues,
  onSubmit,
  apiResponse,
  isLoading,
}: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });

  // Forward validated form data to parent submit handler
  const handleFormSubmit: SubmitHandler<ItemFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      aria-label="edit inventory item form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {apiResponse?.success && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {apiResponse.success}
        </Typography>
      )}

      {apiResponse?.error && (
        <Typography color="error.main" sx={{ mb: 2 }}>
          {apiResponse.error}
        </Typography>
      )}

      <Grid2 container spacing={2}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <OutlinedInput
            id="name"
            type="text"
            required
            size="small"
            autoFocus
            {...register('name')}
          />
          {errors.name && (
            <FormHelperText error>
              {(errors.name as { message: string }).message}
            </FormHelperText>
          )}
          {apiResponse?.name && (
            <FormHelperText error>{apiResponse.name}</FormHelperText>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="quantity">Quantity</FormLabel>
          <OutlinedInput
            id="quantity"
            type="number"
            required
            size="small"
            {...register('quantity', { valueAsNumber: true })}
          />
          {errors.quantity && (
            <FormHelperText error>
              {(errors.quantity as { message: string }).message}
            </FormHelperText>
          )}
          {apiResponse?.quantity && (
            <FormHelperText error>{apiResponse.quantity}</FormHelperText>
          )}
        </FormGrid>
        <FormGrid size={12}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <OutlinedInput
            id="description"
            type="text"
            multiline
            minRows={3}
            {...register('description')}
          />
          {errors.description && (
            <FormHelperText error>
              {(errors.description as { message: string }).message}
            </FormHelperText>
          )}
          {apiResponse?.description && (
            <FormHelperText error>{apiResponse.description}</FormHelperText>
          )}
        </FormGrid>
      </Grid2>
      <Button
        variant="contained"
        type="submit"
        endIcon={<SendIcon />}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Box>
  );
}
