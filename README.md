# DetailVlak | Sistema de Tasación & Gestión de Turnos

Aplicación web diseñada para **Maximiliano y Romina** para cotizar y atender a los clientes que llegan a través de su video y Google Forms.

Ubicación: **Av. Giannattasio y, 15000 Shangrilá, Departamento de Canelones**

---

## 🚀 Cómo abrir la aplicación en tu computadora (PC)

Simplemente hacé **doble clic en el archivo `iniciar.bat`** (o abrí directamente `index.html` con Google Chrome o Microsoft Edge).

---

## 📱 Cómo tenerla en el iPhone (Maxi y Romina)

Como ambos tienen iPhone, pueden acceder de dos maneras:

### Opción A: Alojada en la nube gratis (Recomendada para ambos celulares)
Para que Maxi y Romi tengan la misma app siempre sincronizada desde cualquier lugar en sus iPhone:
1. Subí esta carpeta a [Vercel](https://vercel.com) o [Netlify Drop](https://app.netlify.com/drop) (es 100% gratis, solo arrastrás la carpeta).
2. Te dará un enlace como: `https://detailvlak.vercel.app`.
3. Abrí ese enlace en Safari en el iPhone de Maxi y en el de Romina.
4. En Safari, tocá el botón **Compartir** (el cuadradito con la flecha hacia arriba) y elegí **"Agregar a pantalla de inicio"**.
5. ¡Listo! Les queda un ícono como si fuera una aplicación nativa instalada.

---

## 🔗 Cómo vincular las respuestas del Google Form

Tu Google Sheet ya está preconfigurado en la app (`1CCKm7B1q3YtC85SUp5Ub25u4t1DRhZ_0rlyHWCRurgg`). Para que la aplicación pueda leer las respuestas automáticamente en vivo sin pedir contraseñas:

1. Abrí la planilla de Google Sheets: [Ver Google Sheet](https://docs.google.com/spreadsheets/d/1CCKm7B1q3YtC85SUp5Ub25u4t1DRhZ_0rlyHWCRurgg/edit?gid=2130104281)
2. Hacé clic en el botón verde **"Compartir"** (arriba a la derecha).
3. En **Acceso general**, cambiá de *Restringido* a **"Cualquier persona que tenga el vínculo"** (en rol *Lector*).
4. Tocá **Listo**.
5. En la aplicación DetailVlak, tocá el botón **"Sincronizar"** arriba a la derecha. ¡Todas las respuestas del formulario se cargarán automáticamente!

---

## 🛠️ Funcionalidades Principales

1. **Selector de Operador:**
   - En la barra superior podés alternar entre **Maximiliano** y **Romina**. La app recuerda quién está trabajando y firma los mensajes de WhatsApp a su nombre.
2. **Filtros de Estado & Búsqueda:**
   - Visualizá solicitudes por estado: *🟡 Por Cotizar*, *🟣 Cotizados*, *🟢 Turno Agendado*, *✅ Finalizados*.
   - Buscador en tiempo real por cliente, vehículo, teléfono o servicio.
3. **Tasador Automático:**
   - Al tocar cualquier consulta, la app detecta el tamaño del auto (Chico, Mediano, SUV, Pick-up, Moto) y los servicios que marcó el cliente en el formulario.
   - Aplica los precios base en Pesos Uruguayos ($ UYU) de DetailVlak.
   - Podés sumar o quitar servicios, aplicar descuentos (10%, 15% o monto fijo) o recargos (suciedad extrema).
4. **Generador de Mensajes de WhatsApp (1 Clic):**
   - 5 plantillas automáticas:
     1. *✨ Formal Detallada* (Servicio por servicio con precios, tiempo de taller y formas de pago).
     2. *🎁 Promo Combo* (Propuesta rápida con bonificación).
     3. *📸 Pedir Fotos* (Para evaluar el estado antes de dar el número final).
     4. *⏳ Seguimiento* (Para recontactar clientes que no contestaron).
     5. *🗓️ Confirmar Turno* (Con fecha, dirección en Shangrilá y recomendaciones).
   - Botón **"Enviar por WhatsApp"**: abre la conversación directamente con el cliente en WhatsApp Web o en la app de WhatsApp del iPhone sin tener que agendar el contacto primero.
5. **Tarifario Editable:**
   - Tocando el botón **"Tarifario"** pueden ajustar los precios base de cada categoría cuando quieran.
