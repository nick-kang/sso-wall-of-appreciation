import { Control, FieldValues, get, Path, useFormState } from 'react-hook-form'

import { BaseFormItem, BaseFormItemProps } from './BaseFormItem'

interface Props<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> extends BaseFormItemProps {
  children: React.ReactNode
  control: Control<TFieldValues, object>
  name: TName
  className?: string
}

export function FormItem<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  children,
  className,
  control,
  help,
  name,
  validateStatus,
  ...formItemProps
}: Props<TFieldValues, TName>): JSX.Element {
  const { errors } = useFormState({
    control,
    exact: true,
    name,
  })
  // https://github.com/react-hook-form/error-message/blob/master/src/ErrorMessage.tsx
  const error = get(errors, name)
  const messageFromRegister = error?.message

  return (
    <BaseFormItem
      className={className}
      help={help}
      error={messageFromRegister}
      validateStatus={
        validateStatus ?? messageFromRegister ? 'error' : undefined
      }
      {...formItemProps}
    >
      {children}
    </BaseFormItem>
  )
}
