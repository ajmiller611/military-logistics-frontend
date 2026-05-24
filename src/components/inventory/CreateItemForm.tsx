/**
 * Form component for creating a new item
 *
 * Handles client-side validation using Zod and displays
 * field-level API errors returned from the backend.
 * Submission logic is delegated to the parent component.
 */
import {
  Box,
  Typography,
  FormHelperText,
  Grid2,
  FormLabel,
  OutlinedInput,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createItemSchema, CreateItemFormData } from '@/schemas/itemSchema';
import { zodResolver } from '@hookform/resolvers/zod';

// Reusable styled grid component
const FormGrid = styled(Grid2)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

type Props = {
  /** Callback function to handle form submission */
  onSubmit: SubmitHandler<CreateItemFormData>;
  /** Loading state for the form submission */
  isLoading: boolean;
  /** API-level validation or server errors mapped by field name */
  apiResponse?: Record<string, string>;
};

export default function CreateItemForm({
  onSubmit,
  apiResponse,
  isLoading,
}: Readonly<Props>) {
  // react-hook-form handles form state and integrates schema validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
  });

  const handleFormSubmit: SubmitHandler<CreateItemFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      aria-label="item creation form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      {apiResponse?.success && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {apiResponse.success}
        </Typography>
      )}

      {apiResponse?.error && (
        <FormHelperText error sx={{ mb: 2 }}>
          {apiResponse.error}
        </FormHelperText>
      )}

      <Grid2 container spacing={2}>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="itemName" required>
            Item Name
          </FormLabel>
          <OutlinedInput
            id="itemName"
            type="text"
            placeholder="Item Name"
            required
            size="small"
            autoFocus
            {...register('itemName')}
          />
          {errors.itemName && (
            <FormHelperText error>
              {(errors.itemName as { message: string }).message}
            </FormHelperText>
          )}
          {apiResponse?.itemName && (
            <FormHelperText error>{apiResponse.itemName}</FormHelperText>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="quantity" required>
            Quantity
          </FormLabel>
          <OutlinedInput
            id="quantity"
            type="number"
            placeholder="Quantity"
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
        <FormGrid size={{ xs: 12 }}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <OutlinedInput
            id="description"
            type="text"
            placeholder="Description"
            multiline
            rows={3}
            size="small"
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
        {isLoading ? 'Submitting...' : 'Create Item'}
      </Button>
    </Box>
  );
}
