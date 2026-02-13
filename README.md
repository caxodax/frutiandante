# Frutiandante - Feria Online

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## Configuración de Firebase (Reglas de Seguridad)

Para que la aplicación funcione correctamente y sea segura, debes aplicar estas reglas en tu consola de Firebase:

### 1. Firestore Rules (Base de Datos)
Copia esto en la pestaña **Rules** de Firestore. Estas reglas garantizan que solo los administradores gestionen el sitio y que los clientes tengan sus roles protegidos.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función auxiliar para verificar si el usuario es admin
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Configuración del sitio: Lectura pública, escritura solo administradores
    match /config/site {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Productos y Categorías: Lectura pública, gestión solo administradores
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Pedidos: Creación libre, lectura para el dueño o administradores
    match /orders/{orderId} {
      allow create: if true;
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Usuarios: 
    // - El usuario puede leer y crear su propio perfil.
    // - El rol 'admin' solo puede ser asignado manualmente en la consola de Firebase.
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId && request.resource.data.role == 'cliente';
      allow update: if request.auth != null && request.auth.uid == userId && request.resource.data.role == resource.data.role;
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

## Desarrollo
Para correr el proyecto localmente:
```bash
npm install
npm run dev
```