# WineHouse Cabañas

Plataforma de alquiler de cabañas en Mendoza. Los dueños publican su cabaña,
eligen un plan de suscripción mensual y aparecen ordenados en el listado según
cuánto pagan (Oro > Plata > Bronce). Los huéspedes filtran por región, ven las
comodidades de forma interactiva, y reservan con un calendario que bloquea las
fechas ya ocupadas. El home además muestra la cotización del dólar, el clima
de Mendoza y noticias locales para generar tráfico recurrente.

## Stack

- React 18 + Vite + Tailwind CSS
- Supabase (Postgres + Auth + Storage) — capa de datos completa, con RLS
- react-day-picker para el calendario de reservas
- framer-motion para las animaciones
- APIs públicas sin key: [dolarapi.com](https://dolarapi.com), [open-meteo.com](https://open-meteo.com), Google News vía rss2json

## Puesta en marcha

### 1. Crear el proyecto Supabase

1. Entrá a [app.supabase.com](https://app.supabase.com) y creá un proyecto nuevo.
2. Andá a **SQL Editor**, pegá el contenido completo de
   `supabase/migrations/0001_init.sql` y ejecutalo. Esto crea las tablas,
   las políticas de seguridad (RLS), los buckets de Storage y los datos
   semilla (regiones de Mendoza, comodidades y planes Bronce/Plata/Oro).
3. En **Project Settings > API**, copiá la `Project URL` y la `anon public key`.

### 2. Variables de entorno

```bash
cp .env.example .env
```

Completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los datos del
paso anterior. También podés ajustar `VITE_BANK_ALIAS`, `VITE_BANK_CBU`,
`VITE_BANK_HOLDER` (se muestran a los dueños al publicar su cabaña) y
`VITE_WHATSAPP_CONTACTO`.

### 3. Instalar y correr

```bash
npm install
npm run dev
```

### 4. Crear tu usuario administrador

1. Registrate normalmente desde `/registro` en la web.
2. En Supabase, andá a **Table Editor > profiles**, buscá tu usuario y
   cambiá la columna `role` de `owner` a `admin`. Desde ese momento vas a
   ver el link "Admin" en la barra de navegación (`/admin`), donde se
   aprueban los pagos de suscripción y se modera el listado de cabañas.

## Cómo funciona el flujo de pago (transferencia manual)

1. El dueño carga su cabaña en `/publicar` y elige un plan.
2. Se crea la cabaña en estado `pending_review` y una fila en
   `subscriptions` en estado `pending`.
3. El dueño transfiere el monto y opcionalmente sube un comprobante.
4. Desde `/admin`, el administrador aprueba o rechaza la suscripción.
   Al aprobarla, un trigger de base de datos (`handle_subscription_status_change`)
   activa la suscripción por 30 días y publica la cabaña automáticamente.

### Migrar a MercadoPago más adelante

El esquema ya soporta múltiples suscripciones por cabaña con estados
`pending / active / expired / rejected`, así que agregar Checkout Pro de
MercadoPago más adelante es cuestión de:

1. Crear una Supabase Edge Function que reciba el webhook de MercadoPago.
2. Que esa función llame `approve_subscription` (o actualice `subscriptions`
   directamente) cuando el pago se acredite, en vez de esperar la aprobación
   manual del admin.

No hace falta tocar el resto de la plataforma.

## Vencimiento automático de suscripciones (opcional)

La función `expire_subscriptions()` vence las suscripciones cuyo
`period_end` ya pasó y suspende la cabaña si no tiene otra activa. Para
automatizarla, habilitá la extensión `pg_cron` desde el dashboard de
Supabase (**Database > Extensions**) y corré una vez:

```sql
select cron.schedule(
  'expire-subscriptions',
  '0 3 * * *',
  $$select public.expire_subscriptions();$$
);
```

## Escalar a toda Argentina

Las regiones tienen un campo `province` (hoy todas son `'Mendoza'`). Para
sumar otra provincia alcanza con insertar nuevas filas en `regions` — el
filtro del home y el selector de "Publicar cabaña" las van a mostrar
automáticamente.

## Deploy

`npm run build` genera la carpeta `dist/`, lista para cualquier hosting
estático (Vercel, Netlify, Cloudflare Pages). Recordá configurar las mismas
variables de entorno (`VITE_SUPABASE_URL`, etc.) en el panel del hosting.
