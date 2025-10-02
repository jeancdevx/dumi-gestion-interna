'use client'

import { useState } from 'react'

import { EyeIcon, EyeOffIcon, OctagonAlertIcon } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { SignInFormData, signInSchema } from '@/modules/auth/schemas'
import { signInAction } from '@/modules/auth/server/actions'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = await signInAction(formData)

      if (!result.success) {
        if ('errors' in result && result.errors) {
          const emailError = result.errors.email?.[0]
          const passwordError = result.errors.password?.[0]

          if (emailError) {
            form.setError('email', { message: emailError })
          }
          if (passwordError) {
            form.setError('password', { message: passwordError })
          }
        }

        if (result.message) {
          setErrorMessage(result.message)
        }
      }
    } catch {
      setErrorMessage(
        'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        className='w-[320px] space-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {errorMessage && (
          <Alert
            variant='destructive'
            className='bg-destructive/10 flex items-center gap-x-4 border-none text-sm'
          >
            <div className='flex'>
              <OctagonAlertIcon className='size-4' />
            </div>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    {...field}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className='h-4 w-4' />
                    ) : (
                      <EyeIcon className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </Form>
  )
}

export { SignInForm }
