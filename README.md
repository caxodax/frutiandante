# Frutiandante - Feria Online

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## Configuración de Firebase (Reglas de Seguridad)

Para que la aplicación funcione correctamente y sea segura, debes aplicar estas reglas en tu consola de Firebase:

### 1. Firestore Rules (Base de Datos)
Copia esto en la pestaña **Rules** de Firestore. Estas reglas permiten el acceso dinámico basado en el rol de usuario almacenado en la base de datos.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Configuración del sitio: Lectura pública, escritura solo para administradores
    match /config/site {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Productos y Categorías: Lectura pública, gestión solo para administradores
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Pedidos: Creación libre, lectura para el dueño del pedido o administradores
    match /orders/{orderId} {
      allow create: if true;
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Usuarios: Cada usuario puede leer y escribir su propio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2. Storage Rules (Imágenes)
Copia esto en la pestaña **Rules** de Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Cómo subir a GitHub desde aquí

Si al hacer el commit te sale `nothing to commit, working tree clean`, significa que tus archivos ya están listos. **Sigue con estos pasos para subirlo a tu cuenta:**

### 1. Crea el repositorio en la web
1. Ve a [github.com/new](https://github.com/new).
2. Ponle de nombre `frutiandante`.
3. Haz clic en **"Create repository"** (no marques ninguna otra casilla).

### 2. Enlaza y sube tu código
Copia y pega estos comandos en la terminal:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/frutiandante.git
git push -u origin main
```

## Desarrollo
Para correr el proyecto localmente:
```bash
npm install
npm run dev
```
