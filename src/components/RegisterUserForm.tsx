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
import { userSchema, UserInput } from '@/schemas/userSchema';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const FormGrid = styled(Grid2)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function RegisterUserForm({
  onSubmit,
  apiResponse,
  isLoading,
}: Readonly<{
  onSubmit: SubmitHandler<UserInput>;
  apiResponse?: Record<string, string>;
  isLoading: boolean;
}>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const handleFormSubmit = (data: FieldValues) => {
    onSubmit(data as UserInput);
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
