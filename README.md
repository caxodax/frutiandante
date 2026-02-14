# Frutiandante 🍎🥦

Este es el proyecto de **Frutiandante**, un ecommerce especializado en el despacho de víveres y productos frescos del campo chileno directamente al hogar.

## 🚀 Cómo subir este proyecto a GitHub

Si quieres subir tus cambios a un nuevo repositorio, sigue estos pasos:

1. **Crea un repositorio en GitHub** (vacío).
2. **Inicializa git** en la carpeta local:
   ```bash
   git init
   git add .
   git commit -m "Subida inicial"
   ```
3. **Vincula y sube**:
   ```bash
   git branch -M main
   git remote add origin <URL_DE_TU_REPOSITORIO>
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
