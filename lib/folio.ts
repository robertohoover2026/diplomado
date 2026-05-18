export function generarFolio(): string {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `DIPLO-${anio}-${random}`
}
