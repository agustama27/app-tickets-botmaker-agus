# 🔍 Diagnóstico: Problema de Redirección al Login

Si al acceder a la página te redirige inmediatamente al login, sigue estos pasos para identificar el problema.

## 📋 Checklist de Diagnóstico

### 1. Verificar que el Backend esté Funcionando

**Paso 1**: Verifica que el backend responda correctamente:

```bash
curl https://tu-backend.up.railway.app/health
```

Deberías ver: `{"ok":true}`

**Paso 2**: Verifica el endpoint de sesión:

```bash
curl https://tu-backend.up.railway.app/auth/session
```

**Posibles respuestas:**
- `401` con `{"error":"Not authenticated","message":"No users found in database"}` → **Problema: No hay usuarios en la BD**
- `401` con `{"error":"Not authenticated"}` → **Problema: Autenticación**
- `CORS error` → **Problema: CORS no configurado correctamente**
- `200` con `{"user":{...}}` → **Backend OK, problema en el frontend**

### 2. Verificar CORS en el Backend

**Problema común**: El frontend no puede hacer peticiones porque CORS está bloqueando.

**Solución**:

1. Ve a Railway > Variables
2. Verifica que `ALLOWED_ORIGINS` incluya la URL de tu frontend:
   ```
   ALLOWED_ORIGINS=https://*.vercel.app
   ```
   O si tienes una URL específica:
   ```
   ALLOWED_ORIGINS=https://tu-app.vercel.app
   ```

3. **Verifica los logs de Railway**:
   - Ve a Railway > Deployments > Logs
   - Busca mensajes como:
     - `CORS: Origin NOT allowed: https://tu-app.vercel.app` → CORS está bloqueando
     - `CORS: Origin matched` → CORS está OK

### 3. Verificar que Haya Usuarios en la Base de Datos

**Problema común**: El endpoint `/auth/session` devuelve 401 porque no hay usuarios.

**Solución**:

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Ejecuta:

```sql
SELECT * FROM user_app LIMIT 5;
```

**Si no hay usuarios:**
- Crea al menos un usuario en la tabla `user_app`
- O modifica el endpoint para que no requiera usuarios (solo para desarrollo)

### 4. Verificar el Frontend

**Abre las DevTools del navegador (F12)** y verifica:

#### En la pestaña Network (Red):

1. Busca la petición a `/auth/session`
2. Verifica:
   - **Status**: ¿Es 200, 401, o CORS error?
   - **Request Headers**: ¿Incluye `Origin: https://tu-app.vercel.app`?
   - **Response Headers**: ¿Incluye `Access-Control-Allow-Origin`?

#### Errores Comunes:

**Error: "CORS policy: No 'Access-Control-Allow-Origin' header"**
- **Causa**: CORS no está configurado en el backend
- **Solución**: Verifica `ALLOWED_ORIGINS` en Railway

**Error: "401 Unauthorized"**
- **Causa**: No hay usuarios en la BD o el endpoint está rechazando
- **Solución**: Crea usuarios en la BD o verifica los logs del backend

**Error: "Network Error" o "Failed to fetch"**
- **Causa**: El backend no está accesible o la URL es incorrecta
- **Solución**: Verifica que la URL del backend sea correcta en las variables de entorno del frontend

### 5. Verificar Variables de Entorno del Frontend

En Vercel (o tu plataforma de deployment):

1. Ve a Settings > Environment Variables
2. Verifica que estén configuradas:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://tu-backend.up.railway.app
   ```
   (o `VITE_API_BASE_URL` si usas Vite)

3. **IMPORTANTE**: Después de agregar/modificar variables, debes hacer un **nuevo deployment**

### 6. Verificar los Logs del Backend

En Railway:

1. Ve a tu servicio > Deployments
2. Haz clic en el deployment activo
3. Ve a la pestaña "Logs"
4. Busca:
   - `GET /auth/session` → Ver si la petición llega
   - `CORS: Origin NOT allowed` → Problema de CORS
   - `Session: No users found` → No hay usuarios en la BD
   - `Session: User found` → Backend OK

## 🔧 Soluciones Rápidas

### Solución 1: Crear un Usuario en la Base de Datos

Si no hay usuarios, crea uno:

```sql
INSERT INTO user_app (id, email, name, role, created_at)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin User',
  'ADMIN',
  NOW()
);
```

### Solución 2: Configurar CORS Correctamente

En Railway, configura:

```
ALLOWED_ORIGINS=https://*.vercel.app
```

Esto acepta todas las URLs de Vercel automáticamente.

### Solución 3: Verificar que el Frontend Haga Peticiones con Credenciales

El frontend debe hacer peticiones con `credentials: true`:

```javascript
// Ejemplo con axios
axios.get('https://tu-backend.up.railway.app/auth/session', {
  withCredentials: true
})

// Ejemplo con fetch
fetch('https://tu-backend.up.railway.app/auth/session', {
  credentials: 'include'
})
```

## 🐛 Debugging Avanzado

### Habilitar Logs Detallados

El backend ahora incluye logs de debugging. Para verlos:

1. En Railway, ve a Logs
2. Busca mensajes que empiecen con:
   - `GET /auth/session` → Peticiones de sesión
   - `CORS:` → Validación de CORS
   - `Session:` → Estado de la sesión

### Probar el Endpoint Manualmente

Usa curl o Postman para probar:

```bash
# Probar health
curl https://tu-backend.up.railway.app/health

# Probar sesión (debería devolver 401 si no hay usuarios)
curl https://tu-backend.up.railway.app/auth/session

# Probar con CORS (simulando el frontend)
curl -H "Origin: https://tu-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://tu-backend.up.railway.app/auth/session
```

## 📝 Resumen de Problemas Comunes

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **CORS bloqueado** | Error en consola: "CORS policy" | Configurar `ALLOWED_ORIGINS` en Railway |
| **No hay usuarios** | 401 con "No users found" | Crear usuarios en la BD |
| **URL incorrecta** | "Network Error" | Verificar `NEXT_PUBLIC_API_BASE_URL` |
| **Variables no aplicadas** | Frontend usa localhost | Redesplegar frontend después de agregar variables |
| **Backend caído** | No responde | Verificar que Railway esté desplegado |

## ✅ Checklist Final

- [ ] Backend responde en `/health`
- [ ] Backend responde en `/auth/session` (puede ser 401, pero debe responder)
- [ ] `ALLOWED_ORIGINS` configurado en Railway con la URL del frontend
- [ ] Hay al menos un usuario en la tabla `user_app`
- [ ] Variables de entorno del frontend configuradas correctamente
- [ ] Frontend redesplegado después de agregar variables
- [ ] No hay errores CORS en la consola del navegador
- [ ] Los logs de Railway muestran que las peticiones llegan

---

**¿Seguís con problemas?** Revisa los logs de Railway y la consola del navegador para ver mensajes de error específicos.

