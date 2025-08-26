# 🔧 Variables de Entorno - Frontend

## 📋 **Configuración Requerida**

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=https://dactilo-backend.vercel.app
```

## 🔑 **Cómo Obtener las Credenciales**

### **1. NEXTAUTH_SECRET**
Genera un secreto aleatorio:
```bash
openssl rand -base64 32
```

### **2. Google OAuth Credentials**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configura:
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     - `http://localhost:3000/api/auth/callback/google` (desarrollo)
     - `https://tu-dominio.vercel.app/api/auth/callback/google` (producción)

### **3. NEXT_PUBLIC_API_URL**
Ya está configurado para apuntar al backend de Vercel.

## 🚀 **Para Producción**

Cuando despliegues en Vercel, configura estas variables en el dashboard de Vercel:

- `NEXTAUTH_URL`: Tu URL de producción
- `NEXTAUTH_SECRET`: El mismo secreto generado
- `GOOGLE_CLIENT_ID`: Tu Google Client ID
- `GOOGLE_CLIENT_SECRET`: Tu Google Client Secret
- `NEXT_PUBLIC_API_URL`: https://dactilo-backend.vercel.app

## ⚠️ **Importante**

- **NUNCA** subas el archivo `.env.local` a Git
- **Siempre** usa `.env.local.example` como plantilla
- **Regenera** las credenciales si se comprometen
