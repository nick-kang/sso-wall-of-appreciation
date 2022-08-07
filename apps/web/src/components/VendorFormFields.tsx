import { CreateVendor } from '@app/common'
import {
  Input,
  InputGroup,
  InputLeftAddon,
  useDisclosure,
} from '@chakra-ui/react'
import { CreatableSelect } from 'chakra-react-select'
import { Control, Controller, UseFormRegister } from 'react-hook-form'

import { FormItem } from './FormItem'

interface Props {
  register: UseFormRegister<CreateVendor>
  control: Control<CreateVendor>
  categories: string[]
  alternativeTo: string[]
}

export function VendorFormFields({
  control,
  register,
  categories,
  alternativeTo,
}: Props): JSX.Element {
  const {
    isOpen: isCategoriesOpen,
    onOpen: onCategoriesOpen,
    onClose: onCategoriesClose,
  } = useDisclosure()
  const {
    isOpen: isAlternativeToOpen,
    onOpen: onAlternativeToOpen,
    onClose: onAlternativeToClose,
  } = useDisclosure()

  return (
    <>
      <FormItem control={control} name="name" label="Vendor Name">
        <Input {...register('name')} />
      </FormItem>
      <FormItem
        control={control}
        name="ssoPrice"
        label="SSO Price"
        help="$0 if free"
      >
        <InputGroup>
          <InputLeftAddon>$</InputLeftAddon>
          <Input
            type="number"
            {...register('ssoPrice', {
              valueAsNumber: true,
            })}
          />
        </InputGroup>
      </FormItem>
      <FormItem
        control={control}
        name="planPrice"
        label="Plan Price"
        help="$0 if free"
      >
        <InputGroup>
          <InputLeftAddon>$</InputLeftAddon>
          <Input
            type="number"
            {...register('planPrice', {
              valueAsNumber: true,
            })}
          />
        </InputGroup>
      </FormItem>
      <FormItem control={control} name="ssoSourceUrl" label="SSO Pricing URL">
        <Input {...register('ssoSourceUrl')} type="url" />
      </FormItem>
      <FormItem control={control} name="planSourceUrl" label="Main Pricing URL">
        <Input {...register('planSourceUrl')} type="url" />
      </FormItem>
      <FormItem control={control} name="homepageUrl" label="Homepage URL">
        <Input {...register('homepageUrl')} type="url" />
      </FormItem>
      <FormItem control={control} name="categories" label="Categories">
        <Controller
          control={control}
          name="categories"
          defaultValue={[]}
          render={({ field: { onChange, value, ref } }): JSX.Element => (
            <CreatableSelect
              ref={ref as any}
              value={value.map((c) => ({ label: c, value: c }))}
              onChange={(values): void => onChange(values.map((v) => v.value))}
              options={categories.map((c) => ({ label: c, value: c }))}
              isMulti
              onMenuOpen={onCategoriesOpen}
              onMenuClose={onCategoriesClose}
              menuIsOpen={isCategoriesOpen}
              placeholder={isCategoriesOpen ? 'Type to create...' : 'Select'}
              onCreateOption={(newCategory): void =>
                onChange([...value, newCategory].sort())
              }
            />
          )}
        />
      </FormItem>
      <FormItem control={control} name="alternativeTo" label="Alternative to">
        <Controller
          control={control}
          name="alternativeTo"
          defaultValue={[]}
          render={({ field: { onChange, value, ref } }): JSX.Element => (
            <CreatableSelect
              ref={ref as any}
              value={value.map((c) => ({ label: c, value: c }))}
              onChange={(values): void => onChange(values.map((v) => v.value))}
              options={alternativeTo.map((c) => ({ label: c, value: c }))}
              isMulti
              onMenuOpen={onAlternativeToOpen}
              onMenuClose={onAlternativeToClose}
              menuIsOpen={isAlternativeToOpen}
              placeholder={isAlternativeToOpen ? 'Type to create...' : 'Select'}
              onCreateOption={(newAlternativeTo): void =>
                onChange([...value, newAlternativeTo].sort())
              }
            />
          )}
        />
      </FormItem>
    </>
  )
}
