# Frutiandante - Feria Online

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## Cómo subir a GitHub desde aquí

Si al hacer el commit te sale `nothing to commit, working tree clean`, significa que tus archivos ya están listos. **Sigue con estos pasos para subirlo a tu cuenta:**

### 1. Crea el repositorio en la web
1. Ve a [github.com/new](https://github.com/new).
2. Ponle de nombre `frutiandante`.
3. Haz clic en **"Create repository"** (no marques ninguna otra casilla).

### 2. Enlaza y sube tu código
Copia y pega estos comandos en la terminal (si ya hiciste `git init` y `git commit`, empieza desde el paso de la rama):

```bash
# 1. Asegurarte de que estás en la rama principal correcta
git branch -M main

# 2. Enlazar con tu repositorio de GitHub
# IMPORTANTE: Reemplaza "TU_USUARIO" con tu nombre real de GitHub en el link de abajo
git remote add origin https://github.com/TU_USUARIO/frutiandante.git

# 3. Subir los cambios
# Se te pedirá que inicies sesión. Sigue las instrucciones que aparezcan.
git push -u origin main
```

> **Nota sobre el error "remote origin already exists":**
> Si te sale este error al ejecutar el paso 2, usa este comando primero:
> `git remote remove origin`
> Y luego vuelve a intentar el paso 2.

## Comandos Útiles de Git

Si quieres revisar tu progreso:

- **Ver estado de los archivos:** `git status`
- **Ver qué se va a subir:** `git log --oneline`
- **Ver cambios actuales:** `git diff`
- **Bajar cambios de GitHub:** `git pull origin main`

## Desarrollo
Para correr el proyecto localmente:
```bash
npm install
npm run dev
```
