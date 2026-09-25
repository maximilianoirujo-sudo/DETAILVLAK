# DetailVlak | Sistema Integral de Tasación, Stock, Gastos, Comisiones & Dashboard

Aplicación web ERP & CRM diseñada para **Maximiliano y Romina** para gestionar presupuestos, turnos, stock de insumos, gastos operativos, liquidación de comisiones y balance financiero del taller.

Ubicación: **Av. Giannattasio y, 15000 Shangrilá, Departamento de Canelones**

---

## ☁️ Cómo activar la Sincronización Total en Google Sheets (Apps Script)

Para que **Tasaciones, Tarifario, Stock, MovimientosStock, Gastos y Comisiones** se sincronicen automáticamente entre todos los dispositivos (iPhones de Maximiliano y Romina y PC) sin que la hoja de cálculo tenga que estar pública:

1. Abrí tu planilla de Google Sheets: [Ver Google Sheet](https://docs.google.com/spreadsheets/d/1CCKm7B1q3YtC85SUp5Ub25u4t1DRhZ_0rlyHWCRurgg/edit?gid=2130104281)
2. En el menú superior de Google Sheets, entrá en **Extensiones > Apps Script**.
3. Borrá el contenido que aparezca y pegá el código del archivo [`google-apps-script.gs`](file:///C:/Users/maxim/.gemini/antigravity/scratch/detailing-app/google-apps-script.gs) (también podés copiarlo con 1 clic desde el botón **Configuración ⚙️ > Copiar Código Google Apps Script** dentro de la app).
4. Tocá el ícono de **Guardar** (disquete).
5. Hacé clic en el botón azul **Implementar > Nueva implementación**.
6. Elegí el tipo **Aplicación web** y configurá:
   - **Ejecutar como:** *Yo*
   - **Quién tiene acceso:** *Cualquier persona*
7. Tocá **Implementar**, autorizá el acceso y copiá la **URL de la aplicación web** (`https://script.google.com/macros/s/.../exec`).
8. Abrí la app **DetailVlak**, tocá el ícono de **Configuración (⚙️)** arriba a la derecha, pegá esa URL en el campo **URL de Web App (Google Apps Script)** y tocá **Guardar Configuración**.

¡Listo! El script creará automáticamente las pestañas `Tasaciones`, `Tarifario`, `Stock`, `MovimientosStock`, `Gastos`, `Comisiones` y `Configuracion` en tu Google Sheet, y ya podés dejar la hoja en modo **Restringido (Privado)**.

---

## 🛠️ Módulos Incluidos

1. **📋 Tasaciones & Turnos (CRM WhatsApp):**
   - Sincronización de consultas desde Google Forms y botón **`+ Tasar`** para clientes presenciales en el taller.
   - Calculadora automática por tamaño de vehículo (*Chico, Mediano, SUV, Pick-up, Moto*) con descuentos, recargos y 5 plantillas de WhatsApp listas para enviar.
   - Cambio de estado rápido en 1 clic desde la tarjeta (`🟡 Por Cotizar`, `🟣 Cotizado`, `🟢 Turno`, `✅ Completado`).
2. **📊 Dashboard Financiero & Operativo:**
   - Filtro por mes con **Ingresos del Mes**, **Gastos del Mes**, **Comisiones de Maximiliano** y **Resultado Neto** ($\text{Ingresos} - \text{Gastos} - \text{Comisiones}$).
   - Cantidad de trabajos completados, ticket promedio, gráfico comparativo de los **últimos 6 meses**, ranking de **servicios más vendidos** y alertas de **stock bajo**.
3. **📦 Control de Stock (100% Manual):**
   - Alta y edición de productos por categoría (*Químicos, Paños/Microfibras, Pads, Herramientas, Accesorios, Otros*) con alerta visual roja/amarilla cuando están en o debajo del stock mínimo.
   - Botones rápidos **`+ Entrada`** y **`– Salida`** con registro en `MovimientosStock` (fecha, cantidad, operador y nota) y opción de cargar la compra directamente como gasto en categoría *Insumos*.
   - Cálculo en vivo del **Valor Total del Inventario ($UYU)**.
4. **💸 Control de Gastos:**
   - Carga rápida en menos de 10 segundos desde el celular con fecha, monto en `$UYU`, categoría, medio de pago (*Efectivo, Transferencia, Tarjeta*) y descripción.
   - Filtros por mes y categoría con totalizador automático.
5. **🤝 Comisiones (Maximiliano):**
   - Cálculo automático del **30%** (editable en Configuración) sobre el total final cobrado para todos los trabajos con `Atendido Por = Maximiliano` y estado `✅ Trabajo Completado`.
   - Si el estado vuelve atrás o se cancela, la comisión se elimina automáticamente. Romina no genera comisión.
   - Control de comisiones **Pendientes** y **Pagadas** filtrable por mes.
