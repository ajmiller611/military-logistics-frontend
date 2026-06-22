/**
 * Form component for creating a new user.
 *
 * Handles client-side validation using Zod and displays
 * field-level API errors returned from the backend.
 * Submission logic is delegated to the parent component.
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
import { createUserSchema, CreateUserInput } from '@/schemas/userSchema';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserRequest } from '@/types/UserRequest';

const FormGrid = styled(Grid2)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

type Props = {
  /** Callback invoked with validated form data */
  onSubmit: SubmitHandler<CreateUserRequest>;
  /** Indicates whether a submission is in progress */
  isLoading: boolean;
  /** API-level validation or server errors mapped by field name */
  apiResponse?: Record<string, string>;
  /** Default email for invitation workflow */
  defaultEmail?: string;
};

export default function UserRegistrationForm({
  onSubmit,
  apiResponse,
  isLoading,
  defaultEmail,
}: Readonly<Props>) {
  // react-hook-form handles form state and integrates schema validation via Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: defaultEmail ?? '',
    },
  });

  const handleFormSubmit: SubmitHandler<CreateUserInput> = (data) => {
    const request: CreateUserRequest = {
      username: data.username,
      password: data.password,
      email: data.email,
    };
    onSubmit(request);
  };

  return (
    <Box
      component="form"
      aria-label="user registration form"
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
          <FormLabel htmlFor="username" required>
            Username
          </FormLabel>
          <OutlinedInput
            id="username"
            type="text"
            placeholder="username"
            required
            size="small"
            autoFocus
            {...register('username')}
          />
          {errors.username && (
            <FormHelperText error>
              {(errors.username as { message: string }).message}
            </FormHelperText>
          )}
          {apiResponse?.username && (
            <FormHelperText error>{apiResponse.username}</FormHelperText>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <OutlinedInput
            id="email"
            type="email"
            placeholder="email@example.com"
            required
            size="small"
            {...register('email')}
            readOnly={Boolean(defaultEmail)}
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
          <FormLabel htmlFor="password" required>
            Password
          </FormLabel>
          <OutlinedInput
            id="password"
            type="password"
            placeholder="password"
            required
            size="small"
            {...register('password')}
          />
          {errors.password && (
            <FormHelperText error>
              {(errors.password as { message: string }).message}
            </FormHelperText>
          )}
          {apiResponse?.password && (
            <FormHelperText error>{apiResponse.password}</FormHelperText>
          )}
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }}>
          <FormLabel htmlFor="confirmPassword" required>
            Confirm Password
          </FormLabel>
          <OutlinedInput
            id="confirmPassword"
            type="password"
            placeholder="confirm password"
            required
            size="small"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <FormHelperText error>
              {(errors.confirmPassword as { message: string }).message}
            </FormHelperText>
          )}
        </FormGrid>
      </Grid2>
      <Button
        variant="contained"
        type="submit"
        endIcon={<SendIcon />}
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
}
