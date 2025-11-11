# 🔍 Verificar Usuarios en el Backend

## ❓ Problema Común

Si el login falla, es muy probable que **no haya usuarios creados en la base de datos del backend**.

## ✅ Cómo Verificar

### Opción 1: Revisar los Logs del Backend

1. Ve a tu proyecto en [Railway Dashboard](https://railway.app/dashboard)
2. Selecciona tu servicio del backend
3. Ve a la pestaña **Deployments** → Último deployment → **View Logs**
4. Intenta hacer login desde el frontend
5. Revisa los logs para ver qué error muestra el backend

**Errores comunes que verás:**
- `User not found` → No existe el usuario en la base de datos
- `Invalid credentials` → El usuario existe pero la contraseña es incorrecta
- `Database connection error` → Problema con la conexión a la base de datos

### Opción 2: Probar el Endpoint Directamente

Puedes probar el endpoint de login directamente usando curl o Postman:

```bash
curl -X POST https://tu-backend.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -v
```

O desde la consola del navegador (en tu app desplegada):

```javascript
fetch('https://tu-backend.railway.app/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
})
.then(r => r.json())
.then(data => console.log('Respuesta:', data))
.catch(err => console.error('Error:', err))
```

## 🔧 Soluciones

### Solución 1: Crear Usuarios en el Backend

Dependiendo de tu backend, necesitas crear usuarios. Algunas opciones:

**Si tienes un script de seed/migración:**
```bash
# Ejecutar en Railway o localmente
npm run seed
# o
npm run migrate
```

**Si tienes un endpoint de registro:**
- Crea usuarios a través de la API de registro
- O crea un endpoint admin para crear usuarios

**Si tienes acceso a la base de datos:**
- Conecta directamente a la base de datos
- Inserta usuarios manualmente

### Solución 2: Verificar la Base de Datos

1. **Si usas Railway con PostgreSQL/MySQL:**
   - Ve a Railway Dashboard
   - Selecciona tu servicio de base de datos
   - Usa el cliente SQL o las herramientas de Railway para conectarte
   - Ejecuta: `SELECT * FROM users;` (o el nombre de tu tabla)

2. **Si usas MongoDB:**
   - Conecta a tu cluster de MongoDB
   - Verifica la colección de usuarios

### Solución 3: Crear un Usuario de Prueba

Si tu backend tiene un endpoint de registro, puedes crear un usuario:

```javascript
// Desde la consola del navegador o Postman
fetch('https://tu-backend.railway.app/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin User'
  })
})
.then(r => r.json())
.then(data => console.log('Usuario creado:', data))
```

## 📋 Checklist

- [ ] Verifico los logs del backend cuando intento hacer login
- [ ] Pruebo el endpoint de login directamente
- [ ] Verifico que existan usuarios en la base de datos
- [ ] Creo un usuario de prueba si no existe ninguno
- [ ] Verifico que las credenciales sean correctas
- [ ] Reviso que el backend esté respondiendo correctamente

## 🐛 Errores Comunes y Soluciones

### Error: "User not found" o 404

**Causa:** El usuario no existe en la base de datos.

**Solución:**
1. Crea el usuario en la base de datos
2. O usa un endpoint de registro si está disponible
3. O ejecuta un script de seed/migración

### Error: "Invalid credentials" o 401

**Causa:** El usuario existe pero la contraseña es incorrecta.

**Solución:**
1. Verifica que estés usando la contraseña correcta
2. Si no recuerdas la contraseña, resetea la contraseña o crea un nuevo usuario

### Error: "Database connection error" o 500

**Causa:** Problema con la conexión a la base de datos.

**Solución:**
1. Verifica que la base de datos esté corriendo
2. Verifica las variables de entorno de conexión a la base de datos
3. Revisa los logs del backend para más detalles

## 💡 Tips

- **Usa la consola del navegador:** Los errores ahora se muestran con más detalle en la consola
- **Revisa la pestaña Network:** Verás la respuesta exacta del backend
- **Prueba con diferentes credenciales:** Si tienes múltiples usuarios, prueba con cada uno
- **Verifica el formato del email:** Asegúrate de que el email tenga el formato correcto

## 🔗 Próximos Pasos

1. Revisa los logs del backend cuando intentas hacer login
2. Verifica si hay usuarios en la base de datos
3. Crea un usuario si no existe ninguno
4. Prueba hacer login nuevamente

