# erp-prudencio-web

Interfaz web del ERP de Construcciones Prudencio. Consume [erp-prudencio-api](../erp-prudencio-api).

React 19 · Vite · TypeScript · React Router

## Arranque local

```bash
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev            # http://localhost:5173
```

El backend debe estar corriendo y tener `http://localhost:5173` en `CORS_ORIGINS`.

## Cómo habla con el backend

```text
Página → hook (useConsulta) → api.ts del módulo → api() en lib/api.ts ──fetch──▶ VITE_API_BASE_URL/api/...
```

- **A dónde llama:** `VITE_API_BASE_URL`. Si está vacía, las peticiones van al mismo origen
  (frontend y API detrás del mismo proxy inverso).
- **Credenciales:** cookies HttpOnly que pone el backend; el código nunca ve los tokens.
  `fetch` usa `credentials: 'include'`.
- **Renovación:** ante `401 NO_AUTENTICADO`, `api()` llama una vez a `/api/auth/refresh` y repite
  la petición. Si el backend cierra la sesión (`SESION_CERRADA`), se vuelve al login con el motivo.
- **Presencia:** la sesión envía `/api/auth/latido` cada 30 s.

Las variables `VITE_*` quedan dentro del bundle: nunca se ponen secretos en `.env`.

## Organización

```text
src/
├── app/          App (providers) y rutas
├── auth/         sesión (AuthContext, RequireAuth), login y cambio de contraseña
├── components/   layout/ (shell, barra lateral) y ui/ compartidos
├── lib/          cliente api(), useConsulta, formatos
├── modulos/      un directorio por módulo, igual que el backend
│   └── <modulo>/   tipos.ts · api.ts · hooks.ts · *Page.tsx
└── data/         datos de ejemplo
```

Cada módulo sigue el mismo flujo: la página usa un hook, el hook llama a `api.ts` y `api.ts` es el
único que sabe de dónde vienen los datos. Mientras un endpoint no existe, `api.ts` resuelve con los
datos de ejemplo de `src/data/` ya convertidos a la forma de `tipos.ts`; al conectarlo solo cambia
`api.ts`. Los Context se reservan para estado transversal (la sesión).

Los datos de ejemplo están fechados el miércoles 16 sep 2026 y sus totales se calculan a partir de
los arreglos para que todas las pantallas cuadren entre sí.
