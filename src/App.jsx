import { useState, useEffect } from "react";
import initialData from "./data/inventory.json";
import { AssetBrowser, AssetTable, AuditTable } from "./components";

export function App() {
  // Manejo de estado de la aplicación: inventario de activos, historial de movimientos y término de búsqueda
  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. CARGA INICIAL: Sincronización con LocalStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem("techdesk_inventory"); // guardo el inventario en localstorage
    const savedHistory = localStorage.getItem("techdesk_history"); // guardo el historial en localstorage

    if (savedInventory) {
      setAssets(JSON.parse(savedInventory)); // parseo la cadena de texto a objeto para el estado inicial
    } else {
      localStorage.setItem("techdesk_inventory", JSON.stringify(initialData)); // inicializo el inventario con los datos de prueba si no hay datos previos
      setAssets(initialData); // seteo el estado inicial con los datos de prueba
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory)); // parseo la cadena de texto a objeto para el estado inicial del historial
    }
  }, []);

  // precondición: recibe un array de activos y un array de historial, actualiza el estado y persiste en LocalStorage
  // postcondición: el inventario y el historial se actualizan en el estado y en LocalStorage
  const updateLocalStorage = (newAssets, newHistory) => {
    setAssets(newAssets);
    setHistory(newHistory);
    localStorage.setItem("techdesk_inventory", JSON.stringify(newAssets));
    localStorage.setItem("techdesk_history", JSON.stringify(newHistory));
  };

  // precondición: recibe el id del activo, la operación realizada y los detalles, genera un nuevo evento de movimiento y lo agrega al historial
  // postcondición: el historial se actualiza con el nuevo evento de movimiento
  const logMovement = (assetId, operation, details) => {
    const newEvent = {
      id: `MOV-${Date.now()}`,
      activoId: assetId,
      operacion: operation,
      fecha: new Date().toLocaleString(),
      detalles: details,
    };
    return [newEvent, ...history]; // despues de asignar, devuelvo el nuevo historial con el evento agregado al inicio
  };

  // precondición: recibe el id del activo, verifica que esté disponible, solicita el custodio y la ubicación, actualiza el estado del activo a "Asignado" y registra el movimiento
  // postcondición: el activo cambia su estado a "Asignado", se registra el custodio y la ubicación, y se agrega un evento al historial
  const assignAsset = (id) => {
    const currentAsset = assets.find((a) => a.id === id); // busco el activo por id
    if (currentAsset.estado !== "Disponible") return; // si no está disponible, no hago nada

    const user = prompt("Ingrese el nombre del empleado / custodio:");
    const location = prompt(
      "Ingrese la ubicación física (ej: Home Office, Sucursal Palermo):",
    );

    if (!user || !location) {
      alert("Operación cancelada: El custodio y la ubicación son requeridos.");
      return;
    }

    const newAssets = assets.map(
      (
        a, // actualizo el estado del activo a "Asignado" y registro el custodio y la ubicación
      ) =>
        a.id === id
          ? { ...a, estado: "Asignado", usuario: user, ubicacion: location }
          : a,
    );
    const newHistory = logMovement(
      // registro el movimiento en el historial
      id,
      "Asignación",
      `Entregado a ${user} en ${location}`,
    );
    updateLocalStorage(newAssets, newHistory);
  };

  // precondición: recibe el id del activo, verifica que esté asignado, actualiza el estado del activo a "Disponible", remueve el custodio y la ubicación, y registra el movimiento
  // postcondición: el activo cambia su estado a "Disponible", se remueve el custodio y la ubicación, y se agrega un evento al historial
  const returnAsset = (id) => {
    const currentAsset = assets.find((a) => a.id === id); // busco el activo por id
    if (currentAsset.estado !== "Asignado") return; // si no está asignado, no hago nada

    const newAssets = assets.map(
      (
        a, // actualizo el estado del activo a "Disponible" y remuevo el custodio y la ubicación
      ) =>
        a.id === id
          ? {
              estado: "Disponible",
              usuario: "",
              ubicacion: "Depósito Central",
            }
          : a,
    );
    const newHistory = logMovement(
      // registro el movimiento en el historial
      id,
      "Devolución",
      "Reingreso al depósito central. Custodio removido.",
    );
    updateLocalStorage(newAssets, newHistory);
  };

  // precondición: recibe el id del activo y el nuevo estado, verifica que no esté de baja, solicita la observación de la falla, actualiza el estado del activo y registra el movimiento
  // postcondición: el activo cambia su estado a "En Mantenimiento" o "De Baja", se registra la observación de la falla, y se agrega un evento al historial
  const changeAssetStatus = (id, newStatus) => {
    const currentAsset = assets.find((a) => a.id === id);
    if (!currentAsset || currentAsset.estado === "De Baja") return;

    const failureReason = prompt(
      `Ingrese la observación de la falla técnica para pasar a [${newStatus}]:`,
    );
    if (!failureReason) {
      alert("Operación cancelada: Debe registrar el motivo obligatoriamente.");
      return;
    }

    // Cambiamos con un mapeo estricto aislando por ID único
    const newAssets = assets.map((assetItem) => {
      if (assetItem.id === id) {
        return {
          ...assetItem,
          estado: newStatus,
          usuario: "",
          ubicacion:
            newStatus === "En Mantenimiento"
              ? "Servicio Técnico"
              : "Fuera de Circulación",
          observaciones: failureReason,
        };
      }
      return assetItem; // Si no es el ID buscado, devuelve el activo intacto
    });

    const newHistory = logMovement(id, newStatus, `Motivo: ${failureReason}`);
    updateLocalStorage(newAssets, newHistory);
  };

  // Filtrado de activos según el término de búsqueda ingresado en tiempo real
  // precondición: recibe un array de activos y un término de búsqueda, filtra los activos que coincidan con el id, modelo o usuario
  // postcondición: retorna un array de activos filtrados que coinciden con el término de búsqueda

  const filteredAssets = assets.filter((a) => {
    // filtro los activos según el término de búsqueda
    const id = a.id ? a.id.toLowerCase() : ""; // convierto a minúsculas para hacer la búsqueda insensible a mayúsculas
    const modelo = a.modelo ? a.modelo.toLowerCase() : "";
    const usuario = a.usuario ? a.usuario.toLowerCase() : "";

    return (
      // retorno true si el id, modelo o usuario incluye el término de búsqueda
      id.includes(searchTerm.toLowerCase()) ||
      modelo.includes(searchTerm.toLowerCase()) ||
      usuario.includes(searchTerm.toLowerCase())
    );
  });

  // Renderizado principal de la aplicación con diseño responsivo y modular
  return (
    <div className="container-fluid px-4 py-4">
      {/* Encabezado Principal */}
      <header className="bg-dark text-white p-4 rounded-3 mb-4 shadow-sm d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h1 className="h2 mb-1">TechDesk Inventory</h1>
          <p className="mb-0 text-muted">
            MVP de Control de Activos IT - El Mundo del Juguete.
          </p>
        </div>
        <div className="text-end">
          <span className="badge bg-light text-dark border font-monospace">
            {assets.length} Activos Registrados
          </span>
        </div>
      </header>

      {/* Renderizado de los componentes modulares inyectando sus props */}
      <AssetBrowser searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <AssetTable
        assets={filteredAssets}
        assignAsset={assignAsset}
        returnAsset={returnAsset}
        changeAssetStatus={changeAssetStatus}
      />

      <AuditTable history={history} />
    </div>
  );
}
