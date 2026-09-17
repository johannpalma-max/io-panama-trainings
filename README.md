# EO Panamá · Trainings para Foros

Landing page + sistema de reservas de entrenamientos para los foros del capítulo.

## Qué hace

- **Página principal** con la marca de EO Panamá: explica la propuesta y muestra los temas en tarjetas.
- **Detalle de cada tema**: descripción, facilitador y formulario para reservar (fecha y hora).
- Al reservar, se envía **correo automático al administrador** (para confirmar) y al solicitante (acuse de recibo).
- **Panel de administración** (usuario + clave) para:
  - Ver todas las reservas: pendientes, confirmadas e impartidas.
  - **Confirmar** una reserva (envía correo de confirmación con enlace de calendario).
  - **Invitar a otras personas** a una sesión confirmada (correo con archivo `.ics`).
  - Crear, editar y ocultar **temas**.
  - Editar **textos, colores, logo y correo de contacto** del sitio.

## Stack

Next.js (App Router) · Upstash Redis (datos) · Resend (correo) · Vercel (hosting).
No requiere base de datos relacional ni servidor propio.

## Variables de entorno

Ver `.env.example`. En Vercel: Project → Settings → Environment Variables.

| Variable | Para qué |
|---|---|
| `AUTH_SECRET` | Firma de la sesión del admin (cadena aleatoria larga). |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Credenciales del panel. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Persistencia de temas y reservas. |
| `RESEND_API_KEY` | Envío de correos. |
| `EMAIL_FROM` | Remitente de los correos. |

> Sin Upstash, el sitio funciona pero los datos **no persisten** entre visitas (modo demo).
> Sin Resend, los correos solo se registran en la consola (no se envían).

## Desarrollo local (requiere Node 18+)

```bash
npm install
cp .env.example .env.local   # completa los valores
npm run dev
```

El panel está en `/admin`.
