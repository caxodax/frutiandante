# Frutiandante - Feria Online

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## Características
- Catálogo de productos frescos (Frutas, Verduras, Despensa).
- Sistema de carrito de compras sincronizado.
- Checkout con selección de método de pago (Transferencia/Efectivo).
- Integración con WhatsApp para finalizar pedidos.
- Panel de Administración para gestionar productos, categorías y configuración del sitio.

## Cómo subir a GitHub

Para subir este proyecto a un nuevo repositorio de GitHub desde este entorno, sigue estos pasos:

### 1. Autenticación (Recomendado)
Para vincular tu cuenta de forma segura y sencilla, usa la GitHub CLI:
```bash
gh auth login
```
Sigue las instrucciones: elige `GitHub.com`, `HTTPS`, y `Login with a web browser`. Copia el código que te den en la página que se abrirá.

### 2. Inicializar Git y Subir Código
Una vez autenticado, ejecuta:
```bash
# Inicializar el repositorio local
git init

# Añadir los archivos
git add .

# Hacer el primer commit
git commit -m "Primer commit: Frutiandante MVP"

# Crear el repositorio en GitHub (opcional si ya lo creaste manualmente)
# gh repo create nombre-de-tu-repo --public --source=. --remote=origin --push

# O vincular con un repo ya existente en GitHub:
# git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPOSITORIO.git
# git branch -M main
# git push -u origin main
```

## Desarrollo
Para correr el proyecto localmente:
```bash
npm install
npm run dev
```
