# 🔧 Solucionar Error CORS - Frontend (Vercel) ↔ Backend (Railway)

## ❌ Error que estás viendo

```
Access to XMLHttpRequest at 'https://app-tickets-botmaker-agus-production.up.railway.app/auth/session' 
from origin 'https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## ✅ Solución: Configurar CORS en el Backend

Tu backend en Railway necesita permitir peticiones desde tu dominio de Vercel.

### Tu dominio de Vercel:
```
https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app
```

**Nota:** Si tienes un dominio personalizado en Vercel, también agrégalo.

---

## 📋 Configuración según el Framework

### Opción 1: Express.js (Node.js)

Si tu backend usa Express, agrega esto:

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS
app.use(cors({
  origin: [
    'https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app',
    'https://frontend-tickets.vercel.app', // Si tienes dominio personalizado
    // Agrega otros dominios si los tienes
  ],
  credentials: true, // Importante si usas cookies o autenticación
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// O si quieres permitir todos los orígenes (solo para desarrollo/testing):
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

// Resto de tu código...
```

**Instalar cors si no lo tienes:**
```bash
npm install cors
# o
pnpm add cors
```

### Opción 2: FastAPI (Python)

Si tu backend usa FastAPI:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app",
        "https://frontend-tickets.vercel.app",  # Si tienes dominio personalizado
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# O para permitir todos los orígenes (solo desarrollo):
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
```

### Opción 3: Flask (Python)

Si tu backend usa Flask:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configurar CORS
CORS(app, 
     origins=[
         "https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app",
         "https://frontend-tickets.vercel.app",
     ],
     supports_credentials=True)

# O para permitir todos los orígenes:
# CORS(app, resources={r"/*": {"origins": "*"}})
```

**Instalar flask-cors:**
```bash
pip install flask-cors
```

### Opción 4: NestJS (Node.js)

Si tu backend usa NestJS:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: [
      'https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app',
      'https://frontend-tickets.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(3000);
}
bootstrap();
```

### Opción 5: Spring Boot (Java)

Si tu backend usa Spring Boot:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app",
                        "https://frontend-tickets.vercel.app"
                    )
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 🚀 Pasos para Aplicar la Solución

1. **Identifica tu framework** (Express, FastAPI, Flask, NestJS, etc.)

2. **Agrega la configuración CORS** usando el código de arriba según tu framework

3. **Reemplaza el dominio** con tu dominio real de Vercel:
   - Dominio actual: `https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app`
   - Si tienes dominio personalizado, agrégalo también

4. **Haz commit y push** de los cambios al repositorio del backend

5. **Railway detectará los cambios** y hará un nuevo deploy automáticamente

6. **Espera a que termine el deploy** (2-5 minutos)

7. **Prueba nuevamente** desde tu frontend en Vercel

---

## 🔍 Verificar que Funciona

Después del deploy, puedes verificar:

1. **Desde la consola del navegador:**
   - Abre tu app en Vercel
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña **Network**
   - Intenta hacer login o cualquier acción
   - Las peticiones deberían funcionar sin errores CORS

2. **Desde el backend:**
   - Puedes probar con curl:
   ```bash
   curl -H "Origin: https://frontend-tickets-8kpu8ndgt-ferminariasml-gmailcoms-projects.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://app-tickets-botmaker-agus-production.up.railway.app/auth/session
   ```
   - Deberías ver headers `Access-Control-Allow-Origin` en la respuesta

---

## ⚠️ Importante: Credentials

Si tu frontend usa `withCredentials: true` (como en `lib/axios.ts`), el backend DEBE:

1. Permitir `credentials: true` en CORS
2. Responder con `Access-Control-Allow-Credentials: true`
3. NO usar `origin: "*"` cuando `credentials: true` (debe especificar dominios)

---

## 🐛 Si Aún No Funciona

1. **Verifica que el deploy terminó:**
   - Ve a Railway Dashboard
   - Verifica que el servicio esté **Running**
   - Revisa los logs para ver si hay errores

2. **Verifica los headers en la respuesta:**
   - Abre Network en el navegador
   - Haz clic en una petición fallida
   - Ve a la pestaña **Headers**
   - Busca `Access-Control-Allow-Origin` en la respuesta

3. **Verifica que el dominio sea exacto:**
   - El dominio debe coincidir exactamente (incluyendo `https://`)
   - Sin barras finales
   - Sin espacios

4. **Prueba permitir todos los orígenes temporalmente:**
   - Solo para verificar que el problema es CORS
   - Luego vuelve a restringir a tu dominio específico

---

## 📝 Notas Adicionales

- **Dominios de Preview:** Si usas preview deployments en Vercel, cada uno tiene un dominio diferente. Puedes:
  - Agregar todos los dominios de preview a la lista de orígenes permitidos
  - O usar un patrón/wildcard si tu framework lo soporta
  - O permitir `*.vercel.app` si es posible

- **WebSockets:** Si usas WebSockets (Socket.IO), también necesitas configurar CORS para las conexiones WebSocket

- **Producción:** En producción, es mejor especificar dominios exactos en lugar de permitir todos (`*`)

---

## ✅ Checklist

- [ ] Identifiqué mi framework de backend
- [ ] Agregué la configuración CORS con mi dominio de Vercel
- [ ] Hice commit y push de los cambios
- [ ] Railway hizo el deploy automáticamente
- [ ] El deploy terminó correctamente
- [ ] Probé desde el frontend y ya no hay errores CORS
- [ ] Las peticiones funcionan correctamente

