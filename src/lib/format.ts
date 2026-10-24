const entero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const decimales = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** $1,284,000 */
export const pesos = (n: number) => (n < 0 ? '−$' : '$') + entero.format(Math.abs(n));

/** $14,286.40 */
export const pesosCentavos = (n: number) => (n < 0 ? '−$' : '$') + decimales.format(Math.abs(n));

/** Recibe millones: 186.4 → "$186.4 M" */
export const millones = (m: number) => '$' + m.toFixed(1) + ' M';

export const numero = (n: number) => entero.format(n);

export const pct = (n: number, d = 0) => n.toFixed(d) + '%';

/** Redondea a un decimal evitando errores de punto flotante al sumar millones. */
export const r1 = (n: number) => Math.round(n * 10) / 10;

export const suma = <T,>(xs: T[], f: (x: T) => number) => xs.reduce((acc, x) => acc + f(x), 0);
