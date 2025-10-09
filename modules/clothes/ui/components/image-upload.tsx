'use client'

import { useCallback } from 'react'

import { ImageIcon, Trash2Icon, UploadIcon, XIcon } from 'lucide-react'

import { useDropzone } from 'react-dropzone'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  disabled?: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
}

export const ImageUpload = ({
  value = [],
  onChange,
  maxFiles = 5,
  disabled = false
}: ImageUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles)
      onChange(newFiles)
    },
    [value, onChange, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: MAX_FILE_SIZE,
      maxFiles: maxFiles - value.length,
      disabled: disabled || value.length >= maxFiles,
      multiple: true
    })

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const removeAllFiles = () => {
    onChange([])
  }

  return (
    <div className='space-y-4'>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          'border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/10 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          (disabled || value.length >= maxFiles) &&
            'cursor-not-allowed opacity-60',
          fileRejections.length > 0 && 'border-destructive bg-destructive/5'
        )}
      >
        <input {...getInputProps()} />

        <div className='flex flex-col items-center justify-center gap-2 text-center'>
          <div
            className={cn(
              'bg-muted flex h-10 w-10 items-center justify-center rounded-full',
              isDragActive && 'bg-primary/10',
              fileRejections.length > 0 && 'bg-destructive/10'
            )}
          >
            {isDragActive ? (
              <UploadIcon className='text-primary h-5 w-5' />
            ) : (
              <ImageIcon
                className={cn(
                  'text-muted-foreground h-5 w-5',
                  fileRejections.length > 0 && 'text-destructive'
                )}
              />
            )}
          </div>

          <div className='space-y-0.5'>
            <p className='text-sm font-medium'>
              {isDragActive
                ? 'Suelta las imágenes aquí'
                : 'Arrastra y suelta tus imágenes'}
            </p>
            <p className='text-muted-foreground text-xs'>
              o haz clic para seleccionar archivos
            </p>
          </div>

          <div className='text-muted-foreground mt-1 text-xs'>
            <p>PNG, JPG o WEBP (máx. 5MB)</p>
            <p>
              {value.length} de {maxFiles} imágenes
            </p>
          </div>
        </div>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className='bg-destructive/10 border-destructive/50 rounded-lg border p-4'>
          <p className='text-destructive mb-2 text-sm font-medium'>
            Algunos archivos no pudieron ser cargados:
          </p>
          <ul className='text-destructive/80 space-y-1 text-xs'>
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                <strong>{file.name}</strong>:{' '}
                {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-medium'>
              Imágenes seleccionadas ({value.length})
            </p>
            {value.length > 0 && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={removeAllFiles}
                disabled={disabled}
                className='text-destructive hover:text-destructive h-auto p-0 text-xs'
              >
                <Trash2Icon className='mr-1 h-3 w-3' />
                Eliminar todas
              </Button>
            )}
          </div>

          <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5'>
            {value.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className='group bg-muted relative aspect-square overflow-hidden rounded-md border'
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className='h-full w-full object-cover'
                  onLoad={e => {
                    URL.revokeObjectURL((e.target as HTMLImageElement).src)
                  }}
                />

                {/* Overlay with delete button */}
                <div className='absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    className='h-7 w-7'
                  >
                    <XIcon className='h-3.5 w-3.5' />
                    <span className='sr-only'>Eliminar imagen</span>
                  </Button>
                </div>

                {/* File name tooltip */}
                <div className='absolute right-0 bottom-0 left-0 bg-black/75 px-1 py-0.5 text-center'>
                  <p className='truncate text-[9px] text-white'>{file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
