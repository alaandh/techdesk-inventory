# 📦 TechDesk Inventory — Sistema de Control y Auditoría de Activos IT

**MVP (Producto Mínimo Viable) desarrollado para la Evaluación Técnica Exprés de El Mundo del Juguete S.A.**  
Sistema web ligero diseñado para gestionar el inventario, las asignaciones, el mantenimiento y la trazabilidad del ciclo de vida de los equipos tecnológicos del departamento de IT.

---

## 📋 Alcance del Proyecto y Estado Actual del MVP

El sistema resuelve de punta a punta las operaciones fundamentales del pañol de IT mediante una interfaz dinámica y responsiva:

1. **Listado Maestro de Activos (`AssetTable.jsx`):**
   - Muestra el estado operativo de los equipos con insignias de color (_Disponible_, _Asignado_, _En Mantenimiento_, _De Baja_).
   - **Control de acciones dinámico:** Expone u oculta botones operativos según la precondición del activo para prevenir errores humanos en la carga.

2. **Circuito Operativo Completo (CRUD Controlado):**
   - **Asignación y Entrega:** Registra la salida de un equipo hacia un custodio/usuario final especificando su ubicación física.
   - **Devolución / Reingreso:** Remueve al custodio, reubica el equipo en el Depósito Central y lo vuelve a habilitar como _Disponible_.
   - **Mantenimiento Técnico:** Envía equipos con fallas a _Servicio Técnico_, registrando obligatoriamente la observación del problema.
   - **Baja Definitiva:** Congela el activo de forma inmutable como _De Baja_ (_Fuera de Circulación_), bloqueando acciones futuras pero conservando el historial.

3. **Buscador Reactivo en Tiempo Real (`AssetBrowser.js`):**
   - Filtrado dinámico multicriterio por **ID/Tag**, **Modelo de equipo** o **Nombre del custodio/usuario**.

4. **Registro Inmutable de Auditoría (`AuditTable.jsx`):**
   - Log cronológico de movimientos que genera un ID de evento único (`MOV-timestamp`), fecha, hora, tipo de operación y detalle descriptivo.

---

## 🏗️ Arquitectura y Stack Tecnológico

- **Frontend:** React (SPA) bootstrapped con _Create React App_.
- **Estilos &amp; Layout:** Bootstrap 5 (clases responsivas y diseño adaptable a dispositivos móviles y desktop).
- **Persistencia de Datos:** `LocalStorage` embebido en el navegador (elimina la complejidad de un backend dedicado y garantiza respuesta inmediata).
- **Organización Modular:** Pattern de **archivo de barril** (`index.js`) para desacoplar componentes y mantener el punto de entrada (`App.jsx`) limpio.

---

## 🔄 Ciclo de Vida del Activo y Reglas de Negocio

El sistema implementa 4 estados estrictos con pre y post-condiciones:

| Estado                 | Precondición de Ingreso                          | Postcondición / Efecto                                          | Acciones Disponibles                |
| :--------------------- | :----------------------------------------------- | :-------------------------------------------------------------- | :---------------------------------- |
| **`Disponible`**       | Equipo sin fallas en Depósito Central.           | Listo para ser entregado.                                       | **Asignar**, **Reparar**, **Baja**  |
| **`Asignado`**         | Debe estar previamente `Disponible`.             | Registra nombre de usuario y ubicación física.                  | **Devolver**, **Reparar**, **Baja** |
| **`En Mantenimiento`** | Falla reportada desde `Disponible` o `Asignado`. | Ubicación pasa a _Servicio Técnico_ con motivo obligatorio.     | **Baja**                            |
| **`De Baja`**          | Equipo obsoleto o con rotura irreparable.        | Se reubica a _Fuera de Circulación_ y se congelan sus acciones. | _Sin acciones (Inmutable)_          |

---

## 📁 Estructura del Repositorio

```text
techdesk-inventory/
├── public/
├── src/
│   ├── components/
│   │   ├── AssetBrowser.js      # Componente de búsqueda en tiempo real
│   │   ├── AssetTable.jsx       # Grilla principal con acciones según estado
│   │   ├── AuditTable.jsx       # Tabla de logs inmutables para auditoría
│   │   └── index.js             # Archivo de barril (exportación unificada)
│   ├── data/
│   │   └── inventory.json       # Semilla inicial con 20 activos de prueba
│   ├── App.jsx                  # Estado global, lógica de negocio y persistencia
│   ├── index.css                # Estilos globales
│   └── index.jsx                # Punto de entrada de React con Bootstrap
├── package.json
└── README.md

```

---

## 🚀 Instrucciones de Instalación y Ejecución Local

Siga estos pasos para clonar y ejecutar el proyecto en su entorno local:

### Requisitos Previos

- **Node.js** (versión 16.x o superior recomendada).
- **npm** (incluido con Node.js).

### 1\. Clonar el repositorio

```
git clone [suspicious link removed]
cd techdesk-inventory

```

### 2\. Instalar dependencias

```
npm install

```

### 3\. Iniciar la aplicación en modo desarrollo

```
npm start

```

La aplicación se abrirá automáticamente en [http://localhost:3000](https://www.google.com/url?sa=E&q=http%3A%2F%2Flocalhost%3A3000) en su navegador.

### 4\. Compilar para producción (Opcional)

```
npm run build

```

Genera los archivos optimizados listos para despliegue en la carpeta `build/`.
