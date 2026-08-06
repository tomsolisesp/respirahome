# RespiraHome — Tema de Shopify

Tema de **Shopify (Online Store 2.0)** para **RespiraHome**, empresa de
**kinesiología a domicilio** en Santiago de Chile. Modelo **informativo +
WhatsApp** (los servicios se muestran con precios; el agendamiento se coordina
por WhatsApp, sin checkout).

---

## 1. Cómo editar el contenido (sin tocar código)

Una vez el tema esté en Shopify, casi todo se edita desde el **Personalizador de
temas** (Online Store → Themes → Customize) y desde la **Configuración del tema**:

- **WhatsApp, redes, email, horario y recargo fuera de horario** →
  Personalizador → **Configuración del tema (⚙️)** → *Contacto y WhatsApp*,
  *Redes sociales*, *Horario y recargos*.
- **Servicios, precios y adicionales** → sección **Servicios** (cada servicio es
  un bloque editable con nombre, precio, ícono y hasta 2 adicionales).
- **Comunas y recargos por zona** → sección **Cobertura** (cada zona es un bloque
  con su recargo y su lista de comunas, una por línea).
- **Preguntas frecuentes** → sección **Preguntas frecuentes** (agrega/edita
  bloques; si dejas la respuesta vacía muestra un texto "próximamente").
- **Menú y pie de página** → secciones *Encabezado* y *Pie de página*.

> El **cotizador** se alimenta solo de lo que cargues en *Servicios* y
> *Cobertura* (más el recargo fuera de horario). No hay que configurarlo aparte.

### Valores a reemplazar antes de publicar
| Ajuste | Estado |
|---|---|
| Número de WhatsApp (hoy `56900000000`) | ⚠️ falta |
| URLs de Instagram y Facebook | ⚠️ falta |
| Email de contacto | ⚠️ falta |
| Recargo fuera de horario (hoy `$8.000`) | 🟡 confirmar |
| Recargos por zona (`$0 / $5.000 / $10.000`) | 🟡 ajustar |
| Respuestas de FAQ vacías | 🟡 completar |

---

## 2. Conectar este repositorio de GitHub a Shopify

1. En tu panel de Shopify: **Online Store → Themes**.
2. Baja a **Theme library → Add theme → Connect from GitHub**.
3. Autoriza Shopify en GitHub y elige el repo **`onfuego/respirahome`**, rama
   **`main`**.
4. Shopify importa el tema. Aparecerá en *Theme library* → **Customize** para
   revisarlo, o **Publish** para dejarlo en vivo.
5. Cada `git push` a `main` sincroniza los cambios con Shopify (y los cambios que
   hagas en el Personalizador se pueden guardar de vuelta al repo).

> Alternativa para desarrollo local: [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
> → `shopify theme dev` (previsualización en vivo) y `shopify theme push`.

---

## 3. SEO en Shopify — qué está hecho y qué debes hacer

**Shopify genera automáticamente** `sitemap.xml`, `robots.txt` y las etiquetas
Open Graph básicas (por eso ya no están en el repo). El tema además incluye:
- Título y `meta description` dinámicos en `layout/theme.liquid`.
- **Datos estructurados JSON-LD** tipo `MedicalBusiness` (`snippets/seo-jsonld.liquid`).
- HTML semántico, responsive, `lang`, favicon y `theme-color`.

**Pasos que debes hacer tú:**
1. **Título y descripción del sitio:** Shopify admin → *Preferences* → edita
   *Homepage title* y *Homepage meta description*.
2. **Google Search Console** (https://search.google.com/search-console): agrega tu
   dominio, verifícalo y envía el sitemap `https://TU-DOMINIO/sitemap.xml` (lo
   genera Shopify).
3. **Perfil de Empresa de Google** (https://business.google.com): lo más
   importante para un negocio local. Crea la ficha "RespiraHome", marca el área
   de servicio (comunas), horario y WhatsApp.
4. **Dominio propio:** Shopify admin → *Settings → Domains* → conecta `respirahome.cl`.
5. **(Opcional) Google Analytics 4:** Shopify admin → *Preferences* → conecta GA4.
6. **Consistencia NAP** (mismo nombre, comuna y teléfono en sitio, Google, IG y FB).

---

## 4. Estructura del tema

```
RespiraHome/
├─ assets/            → styles.css, theme.js, logo.svg, favicon.svg, app-icon.svg
├─ config/            → settings_schema.json (ajustes) + settings_data.json (valores)
├─ layout/theme.liquid → esqueleto (head con SEO + header/footer + JS)
├─ locales/es.default.json → textos traducibles del sistema
├─ sections/          → hero, benefits, services, coverage, quote, steps, faq, cta, header, footer
├─ snippets/          → brand-mark (isotipo), wa-link, clp (formato $),
│                       service-icon, benefit-icon, icon-whatsapp, seo-jsonld
└─ templates/         → index.json (home), page.liquid, 404.liquid
```

**Cómo fluye el precio en el cotizador:** las secciones *Servicios* y *Cobertura*
imprimen sus datos como JSON en el DOM (`#data-services`, `#data-zones`), y
`assets/theme.js` los lee para poblar los selectores y calcular el total. El
recargo fuera de horario viene de la config global (`#data-config`).

---

## 5. Análisis de mercado y recomendación de precios

> Rango de referencia del mercado de **kinesiología a domicilio en Santiago (RM)**.
> Revísalo cada temporada porque los precios se ajustan seguido.

| Servicio | Rango de mercado (CLP/sesión) | **Sugerido RespiraHome** |
|---|---|---|
| Respiratoria **adulto mayor** | $22.000 – $38.000 | **$28.000** |
| Respiratoria **pediátrica** | $22.000 – $38.000 | **$28.000** |
| **Rehabilitación musculoesquelética** | $20.000 – $40.000 | **$27.000** |
| **Rehabilitación cardiopulmonar** | $28.000 – $45.000 | **$32.000** |
| **Terapia manual ortopédica** | $25.000 – $42.000 | **$30.000** |

- **Adicionales (respiratoria adulto mayor):** aspiración +$6.000, nebulización +$4.000.
- **Recargo por distancia desde Ñuñoa:** Zona 1 $0 · Zona 2 +$5.000 · Zona 3 +$10.000.
- **Recargo fuera de horario:** por definir (placeholder $8.000; sugerido $6.000–$10.000 o +25–30%).

**Racional:** respeta el piso de $25.000 y posiciona a RespiraHome en calidad
media-alta sin competir por precio bajo. Cardiopulmonar más caro por tiempo y
monitoreo. Respiratoria adulto mayor y pediátrica al mismo valor (misma
complejidad). A futuro conviene evaluar **packs de sesiones** y **valor de primera
evaluación** para subir el ticket promedio.

---

## 6. Identidad de marca

El sitio sigue el manual visual de RespiraHome: **azul acero + blanco**, trazo
limpio y un único motivo gráfico.

**Isotipo — casa + pulso.** Una casa de línea abierta atravesada por un
electrocardiograma que se prolonga a ambos lados. Vive en
[snippets/brand-mark.liquid](snippets/brand-mark.liquid), dibujado con
`currentColor`, así que **hereda el color del contexto** (azul en el encabezado,
blanco en el pie y dentro del recuadro del hero). Las versiones en archivo:

| Archivo | Uso |
|---|---|
| `assets/logo.svg` | Isotipo azul sobre transparente (JSON-LD, respaldo) |
| `assets/favicon.svg` | Ícono de app 48px (fondo azul, marca blanca) |
| `assets/app-icon.svg` | Mismo ícono a 512px (`apple-touch-icon`) |

**Wordmark.** «**Respira**Home» junto: *Respira* en Poppins 700 y *Home* en
Poppins 400 azul medio. Se edita desde el Personalizador (Encabezado y Pie).

**Paleta** (variables en [assets/styles.css](assets/styles.css), no escribas hex
sueltos):

| Token | Hex | Uso |
|---|---|---|
| `--brand-900` | `#1e3a4c` | Fondos oscuros: franja de beneficios, pie |
| `--brand-700` | `#35708f` | Color principal sobre blanco (texto de acento, botones) |
| `--brand-500` | `#4a88ab` | Azul firma del manual (isotipo, detalles) |
| `--brand-300` | `#9cc1d6` | Texto y íconos sobre fondo oscuro |
| `--brand-100/50` | `#e1edf4` / `#f2f7fa` | Fondos suaves de tarjetas e íconos |

No hay segundo color de marca: la jerarquía se arma con la escala de azules. El
verde solo aparece en lo de WhatsApp (marca externa) y el verde/rojo semántico en
las etiquetas de recargo por zona.

**Tipografías.** Poppins (títulos, wordmark, cifras) + Inter (texto corrido).

**Íconos.** Todos de línea, mismo grosor y extremos redondeados que el isotipo:
[snippets/service-icon.liquid](snippets/service-icon.liquid) (servicios) y
[snippets/benefit-icon.liquid](snippets/benefit-icon.liquid) (franja de
beneficios; si el valor no coincide con un ícono conocido imprime el texto tal
cual, por si quedaron emojis cargados).

---

## 7. Pendientes (para más adelante)
- Integrar **agendamiento real** (app de reservas de Shopify o Calendly); hoy es
  WhatsApp con mensaje pre-cargado.
- Confirmar **recargo fuera de horario** y afinar **recargos por zona**.
- Completar **respuestas de FAQ**.
- Subir un **logo/favicon propios** en Configuración del tema solo si se quiere
  reemplazar el isotipo SVG por un archivo distinto (el del tema ya sigue el
  manual de marca).
- (Opcional) Si a futuro quieren **vender packs de sesiones online**, se agregan
  como productos Shopify y una plantilla de producto.
