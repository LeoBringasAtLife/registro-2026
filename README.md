# 📅 Registro de Actividades Diarias 2026

### ¿Qué es esto?

Aplicación personal para registrar mis actividades diarias durante todo el año 2026.

Un calendario interactivo estilo GitHub donde puedo registrar qué tan productivo fue cada día del año, con notas personales.

### Archivos del Proyecto

- **`in.html`** - Página principal con la estructura del calendario
- **`sty.css`** - Estilos visuales (colores, diseño, responsividad)
- **`man.js`** - Lógica de la aplicación (guardar datos, abrir modal, etc.)

### ¿Cómo Usar?

1. Abrir `in.html` en el navegador
2. Hacer clic en cualquier día del calendario
3. Seleccionar nivel de actividad (Ninguna, Poca, Media, Alta, Máxima)
4. Escribir nota del día (opcional)
5. Guardar

### Niveles de Intensidad

- **Gris** - Sin actividad
- **Verde claro** - Poca actividad
- **Verde medio** - Actividad media
- **Verde oscuro** - Alta actividad
- **Verde muy oscuro** - Máxima actividad

### Datos

Los datos se guardan en **localStorage** del navegador con la clave `year2026`.

**Importante**: Si borra los datos del navegador, pierde todo el registro.

### Personalización Rápida

### Cambiar colores (en `sty.css`):

```css
:root {
  --level-0: #f0f2f5; /* Sin actividad */
  --level-1: #9be9a8; /* Poca */
  --level-2: #40c463; /* Media */
  --level-3: #30a14e; /* Alta */
  --level-4: #164b27; /* Máxima */
}
```

### Cambiar año (en `man.js`):

```javascript
const YEAR = 2026; // Cambiar a 2027, 2028, etc.
```

### Notas Técnicas

### HTML (`in.html`)

- Estructura del calendario de 365 días
- Modal para editar cada día
- Sección de historial de actividades
- Footer con enlace a mi GitHub

### CSS (`sty.css`)

- Variables CSS para colores personalizables
- Grid layout para el calendario
- Diseño responsivo (móvil, tablet, desktop)
- Animaciones y transiciones suaves

### JavaScript (`man.js`)

- Genera dinámicamente los 365 días del año
- Guarda/carga datos en localStorage
- Valida y sanitiza las entradas del usuario
- Muestra historial ordenado por fecha
- Contador regresivo hasta fin de año

### Implementaciones Futuras

- [ ] Integrar Firebase para acceder desde cualquier dispositivo
- [ ] Exportar datos a JSON
- [ ] Modo oscuro
- [ ] Estadísticas mensuales

---

**Creado por LeoBringasAtLife [Leonardo Bringas] - 2026** 💡
