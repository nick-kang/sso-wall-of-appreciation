import { apiRoutes, CreateVendor, CreateVendorResponse } from '@app/common'
import {
  Box,
  Button,
  Flex,
  FormErrorMessage,
  Link,
  Stack,
  useToast,
} from '@chakra-ui/react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import ky from 'ky'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiPlus } from 'react-icons/fi'

import { clientConfig } from '../config/clientConfig'
import { VendorFormFields } from './VendorFormFields'

interface Props {
  categories: string[]
  alternativeTo: string[]
}

export function AnonymousRequestForm({
  categories,
  alternativeTo,
}: Props): JSX.Element {
  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateVendor>({
    resolver: zodResolver(CreateVendor),
    // resolver: async (data, context, options) => {
    //   // you can debug your validation schema here
    //   console.log('formData', data)
    //   console.log(
    //     'validation result',
    //     await zodResolver(CreateVendor)(data, context, options),
    //   )
    //   return zodResolver(CreateVendor)(data, context, options)
    // },
  })

  const toast = useToast()

  const onSubmit = useCallback(
    async (request: CreateVendor) => {
      const response = await ky
        .post(apiRoutes.requests, { json: request })
        .json<CreateVendorResponse>()

      toast({
        status: 'success',
        title: 'Go to link below for request status',
        description: (
          <Link href={response.url} target="_blank" rel="noreferrer noopener">
            {response.url}
          </Link>
        ),
      })
    },
    [toast],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="4">
        <VendorFormFields
          categories={categories}
          alternativeTo={alternativeTo}
          control={control}
          register={register}
        />
        <Flex justify="center">
          <Controller
            control={control}
            name="captchaToken"
            render={({ field }): JSX.Element => (
              <HCaptcha
                sitekey={clientConfig.hcaptchaSitKey}
                onError={(message): void =>
                  setError('captchaToken', { message })
                }
                onExpire={(): void =>
                  setError('captchaToken', {
                    message: 'Captcha expired. Refresh page.',
                  })
                }
                onVerify={(token): void => field.onChange(token)}
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="captchaToken"
            render={({ message }): JSX.Element => (
              <FormErrorMessage>{message}</FormErrorMessage>
            )}
          />
        </Flex>
        <input
          type="hidden"
          {...register('updatedAt')}
          defaultValue={new Date().toISOString()}
        />
        <Box textAlign="center">
          <Button
            leftIcon={<FiPlus />}
            type="submit"
            variant="outline"
            isLoading={isSubmitting}
          >
            Request new vendor
          </Button>
        </Box>
      </Stack>
    </form>
  )
}
