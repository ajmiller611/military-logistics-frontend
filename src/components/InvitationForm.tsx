import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Grid2,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  InvitationFormData,
  invitationSchema,
} from '@/schemas/invitationSchema';
import { zodResolver } from '@hookform/resolvers/zod';

const FormGrid = styled(Grid2)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

type Props = {
  /** Callback invoked with validated form data */
  onSubmit: SubmitHandler<InvitationFormData>;
  /** Indicates whether a submission is in progress */
  isLoading: boolean;
  /** API-level validation or server errors mapped by field name */
  apiResponse?: Record<string, string>;
};

/**
 * Form used by administrators to create user invitations.
 *
 * Collects an email address and role, validates input using
 * React Hook Form and Zod, and submits the invitation data
 * to the parent component.
 */
export default function InvitationForm({
  onSubmit,
  apiResponse,
  isLoading,
}: Readonly<Props>) {
  // react-hook-form handles form state and integrates schema validation via Zod
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
  });

  const handleFormSubmit: SubmitHandler<InvitationFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Box
      component="form"
      aria-label="user invitation form"
      noValidate // Disable HTML5 validation to rely on React Hook Form + Zod
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
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <OutlinedInput
            id="email"
            type="email"
            size="small"
            {...register('email')}
          />
          {errors.email && (
            <FormHelperText error>
              {(errors.email as { message: string }).message}
            </FormHelperText>
          )}
          {apiResponse?.email && (
            <FormHelperText error>{apiResponse.email}</FormHelperText>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <InputLabel id="role-label" required>
            Role
          </InputLabel>
          <Controller
            name="role"
            control={control}
            defaultValue="USER"
            render={({ field }) => (
              <Select labelId="role-label" label="Role" size="small" {...field}>
                <MenuItem value="USER">User</MenuItem>
              </Select>
            )}
          />
          {errors.role && (
            <FormHelperText error>{errors.role.message}</FormHelperText>
          )}
          {apiResponse?.role && (
            <FormHelperText error>{apiResponse.role}</FormHelperText>
          )}
        </FormGrid>
      </Grid2>
      <Button
        variant="contained"
        type="submit"
        endIcon={<SendIcon />}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Invitation'}
      </Button>
    </Box>
  );
}
