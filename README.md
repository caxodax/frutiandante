# Frutiandante - Feria Online

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## Configuración de Firebase (IMPORTANTE)

Para que la aplicación funcione correctamente y las colecciones aparezcan en tu consola, debes aplicar estas reglas en tu consola de Firebase:

### 1. Firestore Rules (Base de Datos)
Copia esto en la pestaña **Rules** de Firestore. Estas reglas permiten que los usuarios creen su perfil como 'cliente' y que tú puedas gestionarlo todo.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función auxiliar para verificar si el usuario es admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Usuarios: Lectura y creación permitida para el propio usuario
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
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
      // Lectura pública para que los clientes vean las fotos
      allow read: if true;
      // Escritura solo para usuarios autenticados (Admin)
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
