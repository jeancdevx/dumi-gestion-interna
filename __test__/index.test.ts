import {
  formatPrice,
  getGenderApiValue,
  getSizeApiValue
} from '../modules/clothes/helpers'

jest.mock('../modules/clothes/types', () => ({
  CLOTHES_GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    UNISEX: 'unisex'
  }
}))

describe('helpers de clothes', () => {
  // ----------- getSizeApiValue -----------
  describe('getSizeApiValue', () => {
    it('devuelve el mismo nombre de talla', () => {
      expect(getSizeApiValue('M')).toBe('M')
      expect(getSizeApiValue('XL')).toBe('XL')
    })
  })

  // ----------- getGenderApiValue -----------
  describe('getGenderApiValue', () => {
    it('devuelve el valor correspondiente a "hombre"', () => {
      expect(getGenderApiValue('hombre')).toBe('male')
    })

    it('devuelve el valor correspondiente a "mujer"', () => {
      expect(getGenderApiValue('mujer')).toBe('female')
    })

    it('devuelve el valor correspondiente a "unisex"', () => {
      expect(getGenderApiValue('unisex')).toBe('unisex')
    })

    it('devuelve "unisex" por defecto si el valor no coincide', () => {
      expect(getGenderApiValue('otro')).toBe('unisex')
      expect(getGenderApiValue('')).toBe('unisex')
    })
  })

  // ----------- formatPrice -----------
  describe('formatPrice', () => {
    it('formatea el precio correctamente en moneda peruana (PEN)', () => {
      const resultado = formatPrice(30)
      // Suele venir como 'S/ 30.00' (a veces con espacio no separable)
      expect(resultado.replace(/\s+/g, ' ')).toContain('S/')
    })

    it('muestra dos decimales en el formato', () => {
      const resultado = formatPrice(30)
      expect(resultado).toMatch(/30\.00/)
    })

    it('formatea correctamente valores grandes', () => {
      const resultado = formatPrice(1000)
      // En es-PE suele ser '1,000.00'
      expect(resultado).toMatch(/1,000\.00/)
    })
  })
})
