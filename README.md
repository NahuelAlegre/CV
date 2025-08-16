# Sitio CV de Nahuel Alegre

Este repositorio contiene un sitio web de currículum vitae construido con Vite, HTML, CSS y JavaScript.

## Instalación

```bash
cd cv
npm install
```

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: generar versión de producción
- `npm run preview`: previsualizar la build
- `npm test`: ejecutar comprobaciones automáticas

## Edición de contenido

Todos los datos se encuentran en `src/data.js`. Modifica ese archivo para actualizar información sin tocar el HTML.

## Generar PDF

En el sitio, pulsa **Descargar PDF** o ejecuta `Ctrl+P` para obtener una versión imprimible gracias a los estilos `@media print`.

## Tests

- `tests/colors.js` verifica que no existan colores prohibidos.
- `tests/a11y.js` realiza un chequeo básico de accesibilidad con axe-core.

## Imágenes requeridas

Por restricciones de almacenamiento, los íconos no se incluyen en el repositorio. Crea o descarga los siguientes archivos y colócalos en `cv/public/`:

- `favicon.ico`
- `icon-192.png`
- `icon-512.png`

Puedes generarlos, por ejemplo, en [favicon.io](https://favicon.io/) usando el emoji de maletín 💼 o cualquier símbolo de tu preferencia.
