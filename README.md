# Frutiandante - Feria Online

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## Cómo subir a GitHub desde aquí

Como la herramienta `gh` no está instalada, seguiremos el método estándar:

### 1. Crea el repositorio en la web
1. Ve a [github.com/new](https://github.com/new).
2. Ponle de nombre `frutiandante`.
3. Haz clic en **"Create repository"** (no marques ninguna otra casilla).

### 2. Inicializa y sube el código
Copia y pega estos comandos uno por uno en la terminal:

```bash
# Inicializar el repositorio local
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "Primer commit: Frutiandante MVP"

# Crear la rama principal
git branch -M main

# Enlazar con tu repositorio de GitHub
# REEMPLAZA "TU_USUARIO" con tu nombre de usuario real de GitHub
git remote add origin https://github.com/TU_USUARIO/frutiandante.git

# Subir los cambios
# Al ejecutar esto, se te pedirá que inicies sesión en tu cuenta
git push -u origin main
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
