# Frutiandante 🍎🥦

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## 🚀 Cómo subir este proyecto a GitHub

Si quieres conectar este código con un nuevo repositorio en GitHub, sigue estos pasos desde tu terminal:

1. **Inicializa git y guarda tus cambios locales**:
   ```bash
   git init
   git add .
   git commit -m "Subida inicial Frutiandante"
   ```

2. **Conecta con tu repositorio en la nube**:
   *(Copia la URL de tu repositorio de GitHub, ej: https://github.com/usuario/proyecto.git)*
   ```bash
   git branch -M main
   git remote add origin <URL_DE_TU_REPOSITORIO>
   ```

3. **Sube los cambios**:
   ```bash
   git push -u origin main
   ```

## 🛠️ Configuración de Firebase (IMPORTANTE)

Para que la aplicación funcione correctamente y las colecciones aparezcan en tu consola, debes aplicar estas reglas en tu consola de Firebase:

### 1. Firestore Rules (Base de Datos)
Copia esto en la pestaña **Rules** de Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }

    match /config/site {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /orders/{orderId} {
      allow create: if true;
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
      allow update: if isAdmin();
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

## 💻 Desarrollo Local

Para correr el proyecto localmente:
```bash
npm install
npm run dev
```