'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createAccount, signInUser } from '@/lib/actions/user.actions'
import OTPModal from './OTPModal'

type FormType = 'login-in' | 'sign-up'

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email({ message: '请输入正确的电子邮箱' }),
    fullName:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
  })
}

export default function AuthForm({ type }: { type: FormType }) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [accountId, setAccountId] = useState(null)
  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const user =
        type === 'sign-up'
          ? await createAccount({
              fullName: values.fullName || '',
              email: values.email,
            })
          : await signInUser({ email: values.email })

      setAccountId(user.accountId)
    } catch {
      setErrorMessage('创建账户失败，请重新尝试')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === 'login-in' ? '登 录' : '注 册'}
          </h1>
          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">用户名</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入用户名"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                  {/*<FormDescription>这是你的用户名</FormDescription>*/}
                </FormItem>
              )}
            ></FormField>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">邮箱</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入电子邮箱"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
                {/*<FormDescription>这是你的用户名</FormDescription>*/}
              </FormItem>
            )}
          ></FormField>
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === 'login-in' ? '登 录' : '注 册'}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === 'login-in'
                ? '还没有账号 前往注册？'
                : '已有账号 前往登录？'}
            </p>
            <Link
              href={type === 'login-in' ? '/sign-up' : '/login-in'}
              className="ml-1 font-medium text-brand"
            >
              {' '}
              {type === 'login-in' ? '注 册' : '登 录'}
            </Link>
          </div>
        </form>
      </Form>
      {accountId && (
        <OTPModal email={form.getValues('email')} accountId={accountId} />
      )}
    </>
  )
}
