'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { FormBlock, Page, Post, Setting } from '@/payload-types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import router from 'next/router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { buildDefaultValues, buildSchema, FieldType, NormalizedFields } from './utils'
import { FormRegistration } from './formRegistration'
import { getClientSideURL } from '@/lib/get-url'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { SearchParams } from '@/types/search-params'

export function FormBlockUI({
  searchParams,
  setting,
  page,
  ...formBlock
}: FormBlock & { searchParams: SearchParams } & { setting: Setting | null } & {
  page: Post | Page | null
}) {
  const payloadForm = typeof formBlock.form === 'number' ? null : formBlock.form

  // Initialize all hooks first - BEFORE any conditional returns
  const fields: FieldType[] = payloadForm ? NormalizedFields(formBlock) : []
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formSchema = buildSchema(fields)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaultValues(fields),
  })

  // NOW check if we should render
  if (!payloadForm) return null

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(undefined)
    const dataToSend = Object.entries(values).map(([field, value]) => ({
      field,
      value,
    }))

    try {
      const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: payloadForm?.id,
          submissionData: dataToSend,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        setError({
          message: result.errors?.[0]?.message || 'Internal Server Error',
          status: result.status,
        })
        return
      }
      setHasSubmitted(true)
      form.reset()
      if (payloadForm?.confirmationType === 'redirect' && payloadForm?.redirect?.url) {
        router.push(payloadForm?.redirect.url)
      }
    } catch {
      setError({ message: 'Something went wrong.' })
      setHasSubmitted(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{payloadForm?.title}</CardTitle>
        {formBlock?.enableDescription && formBlock?.enableDescription && (
          <CardDescription>
            <LexicalRenderer
              content={formBlock.description}
              searchParams={searchParams}
              setting={setting}
              page={page}
            />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <FormRegistration
          fields={fields}
          form={form}
          searchParams={searchParams}
          page={page}
          setting={setting}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonLabel={payloadForm.submitButtonLabel || 'Submit'}
        />
      </CardContent>
      {(hasSubmitted || error) && (
        <CardFooter>
          {hasSubmitted && payloadForm.confirmationType === 'message' && (
            <Alert>
              <AlertDescription className="text-foreground">
                {payloadForm.confirmationMessage && (
                  <LexicalRenderer
                    content={payloadForm.confirmationMessage}
                    searchParams={searchParams}
                    setting={setting}
                    page={page}
                  />
                )}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-foreground">{`${error.status || '500'}: ${error.message || ''}`}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
