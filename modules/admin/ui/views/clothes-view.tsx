import { GarmentsListHeader } from '../components/garments-list-header'

const ClothesView = () => {
  return (
    <div className='space-y-6'>
      <GarmentsListHeader />

      {/* TODO: Implementar tabla de prendas */}
      <div className='flex flex-col items-center justify-center gap-y-4 rounded-lg border-2 border-dashed py-12'>
        <p className='text-muted-foreground text-sm'>
          No hay prendas registradas
        </p>
        <p className='text-muted-foreground text-xs'>
          Haz clic en &quot;Crear Prenda&quot; para comenzar
        </p>
      </div>
    </div>
  )
}

export { ClothesView }
