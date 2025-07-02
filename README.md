
# BingoMax - Sistema de Bingo y Rifas Online

## 🎯 Descripción del Proyecto

BingoMax es un sistema completo de Bingo y Rifas online desarrollado con tecnologías modernas. Permite la gestión integral de sorteos, jugadores, cartones digitales y físicos, billetera virtual, y administración completa del sistema.

## 🚀 Características Principales

### 🎮 Sistema de Juego
- ✅ Generación automática de cartones de bingo
- ✅ Cartones digitales y físicos
- ✅ Sorteo automático de números
- ✅ Detección automática de ganadores (línea, diagonal, bingo completo)
- ✅ Verificación por QR y digital
- ✅ Transmisión en vivo de sorteos
- ✅ Soporte para múltiples juegos en una noche

### 👥 Sistema de Usuarios
- ✅ Super Admin, Admin, Vendedor, Jugadores
- ✅ Autenticación segura
- ✅ Verificación con cédula de identidad y reconocimiento facial
- ✅ Solo mayores de 18 años
- ✅ Estados: pendiente, verificado, suspendido

### 💰 Billetera Virtual
- ✅ Moneda por defecto: Guaraníes (₲)
- ✅ Recarga de saldo (tarjeta, transferencia, billetera digital)
- ✅ Retiros con aprobación en 48-72 horas
- ✅ Historial completo de transacciones
- ✅ Compra de cartones con saldo

### 🏆 Sistema de Premios
- ✅ Configuración flexible de premios
- ✅ Múltiples tipos: línea, forma, bingo completo
- ✅ Verificación automática y manual
- ✅ Entrega controlada de premios

### 📊 Panel Administrativo
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de usuarios y verificaciones
- ✅ Control de sorteos y configuraciones
- ✅ Reportes financieros
- ✅ Gestión de retiros y aprobaciones

### 📱 Características Técnicas
- ✅ Diseño responsivo (móvil/tablet/desktop)
- ✅ Interfaz moderna y atractiva
- ✅ Sistema multiusuario
- ✅ Base de datos lista para conectar
- ✅ Generación de PDF para cartones
- ✅ Código QR para verificación

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Estado**: Context API + React Query
- **Routing**: React Router DOM
- **Iconos**: Lucide React
- **Build Tool**: Vite
- **Despliegue**: Lovable Platform

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <URL_DEL_REPOSITORIO>
cd bingomax-system
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Acceder a la aplicación**
- URL: `http://localhost:8080`
- Usuario admin de prueba: `admin@bingomax.com`
- Contraseña: `admin123`

### Build para Producción

```bash
npm run build
npm run preview
```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### usuarios
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  nombre VARCHAR NOT NULL,
  apellido VARCHAR NOT NULL,
  cedula VARCHAR UNIQUE NOT NULL,
  telefono VARCHAR,
  fecha_nacimiento DATE NOT NULL,
  rol VARCHAR CHECK (rol IN ('super_admin', 'admin', 'vendedor', 'jugador')),
  estado VARCHAR CHECK (estado IN ('pendiente', 'verificado', 'suspendido')),
  saldo DECIMAL(12,0) DEFAULT 0,
  fecha_registro TIMESTAMP DEFAULT NOW(),
  fotos_cedula TEXT[],
  foto_selfie TEXT,
  verificacion_facial BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR NOT NULL
);
```

#### sorteos
```sql
CREATE TABLE sorteos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado VARCHAR CHECK (estado IN ('programado', 'en_curso', 'finalizado', 'cancelado')),
  precio_carton DECIMAL(12,0) NOT NULL,
  numeros_llamados INTEGER[],
  transmision_url VARCHAR,
  configuracion JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### cartones
```sql
CREATE TABLE cartones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numeros INTEGER[][] NOT NULL,
  jugador_id UUID REFERENCES usuarios(id),
  sorteo_id UUID REFERENCES sorteos(id),
  precio DECIMAL(12,0) NOT NULL,
  fecha_compra TIMESTAMP DEFAULT NOW(),
  estado VARCHAR CHECK (estado IN ('activo', 'usado', 'ganador')),
  qr_code VARCHAR UNIQUE,
  tipo VARCHAR CHECK (tipo IN ('digital', 'fisico'))
);
```

#### transacciones
```sql
CREATE TABLE transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  tipo VARCHAR CHECK (tipo IN ('recarga', 'compra_carton', 'premio', 'retiro')),
  monto DECIMAL(12,0) NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMP DEFAULT NOW(),
  estado VARCHAR CHECK (estado IN ('pendiente', 'completada', 'rechazada')),
  metodo_pago VARCHAR,
  referencia_externa VARCHAR
);
```

## 🔧 Configuración de Supabase

1. **Crear proyecto en Supabase**
2. **Ejecutar las migraciones SQL**
3. **Configurar RLS (Row Level Security)**
4. **Configurar Authentication**
5. **Configurar Storage para imágenes**

### Políticas RLS Ejemplo

```sql
-- Política para usuarios
CREATE POLICY "Usuarios pueden ver su propia información" ON usuarios
  FOR SELECT USING (auth.uid() = id);

-- Política para cartones
CREATE POLICY "Jugadores pueden ver sus cartones" ON cartones
  FOR SELECT USING (auth.uid() = jugador_id);
```

## 🎨 Guía de Uso

### Para Jugadores
1. **Registro**: Completar datos personales y verificación
2. **Verificación**: Subir fotos de cédula y selfie
3. **Recarga**: Cargar saldo en la billetera virtual
4. **Compra**: Adquirir cartones para sorteos
5. **Juego**: Participar en sorteos en vivo
6. **Premios**: Reclamar premios ganados

### Para Administradores
1. **Gestión de Usuarios**: Verificar y administrar cuentas
2. **Crear Sorteos**: Configurar nuevos juegos
3. **Monitoreo**: Supervisar sorteos en vivo
4. **Finanzas**: Gestionar transacciones y retiros
5. **Reportes**: Generar estadísticas y análisis

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Verificación de identidad obligatoria
- ✅ Encriptación de contraseñas
- ✅ Validación de mayoría de edad
- ✅ Políticas de acceso por roles
- ✅ Transacciones seguras

## 📈 Funcionalidades Avanzadas

### Sistema de Verificación QR
- Generación única por cartón
- Validación en tiempo real
- Integración con sistema de premios

### Transmisión en Vivo
- Stream de sorteos en tiempo real
- Narración automática de números
- Interacción con jugadores

### Sistema de Reportes
- Estadísticas de ventas
- Análisis de jugadores
- Reportes financieros
- Exportación a PDF/Excel

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🏆 Créditos

Desarrollado con ❤️ por el equipo de BingoMax
- Sistema completo de Bingo online
- Tecnologías modernas y escalables
- Diseño centrado en el usuario
- Paraguay 🇵🇾

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@bingomax.com
- WhatsApp: +595 981 123 456
- Website: https://bingomax.com

---

**BingoMax** - El futuro del Bingo está aquí 🎰
