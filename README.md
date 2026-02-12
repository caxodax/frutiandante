# Frutiandante - Feria Online

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## Características
- Catálogo de productos frescos (Frutas, Verduras, Despensa).
- Sistema de carrito de compras sincronizado.
- Checkout con selección de método de pago (Transferencia/Efectivo).
- Integración con WhatsApp para finalizar pedidos.
- Panel de Administración para gestionar productos, categorías y configuración del sitio.

## Cómo subir a GitHub desde aquí

Sigue estos pasos en la terminal para crear tu repositorio y subir el código:

### 1. Autenticación
Usa la GitHub CLI para vincular tu cuenta:
```bash
gh auth login
```
*Sigue las instrucciones: elige `GitHub.com`, `HTTPS`, y `Login with a web browser`. Copia el código que te den en la página que se abrirá automáticamente.*

### 2. Crear el Repositorio y Subir Código
Una vez autenticado, ejecuta estos comandos uno por uno:

```bash
# Inicializar el repositorio local
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "Primer commit: Frutiandante MVP"

# Crear el repositorio en tu cuenta de GitHub y subir todo
gh repo create frutiandante --public --source=. --remote=origin --push
```

## Comandos Útiles de Git

Si quieres revisar tu progreso antes de subir cambios:

- **Ver estado de los archivos:** `git status` (Muestra qué archivos han cambiado).
- **Ver cambios detallados:** `git diff` (Muestra las líneas exactas que modificaste).
- **Ver cambios preparados:** `git diff --staged` (Muestra lo que se incluirá en el siguiente commit).
- **Bajar cambios de GitHub:** `git pull origin main`
- **Subir nuevos cambios:** `git push origin main` (Después de hacer `add` y `commit`).

## Desarrollo
Para correr el proyecto localmente si lo descargas en otro lugar:
```bash
npm install
npm run dev
```
