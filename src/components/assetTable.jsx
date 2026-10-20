// PreCondicion:
//  Recibe un arreglo con la lista de activos filtrados: assets y las funciones del CRUD.

// PostCondicion:
//  Renderiza la tabla de inventario con diseño responsivo o adaptativo.
//  Expone o bloquea dinámicamente los botones de control según el estado actual en el ciclo de vida del activo.

export function AssetTable({
  assets = [],
  assignAsset,
  returnAsset,
  changeAssetStatus,
}) {
  return (
    <div className="asset-table-container">
      <div className="table-header">
        <h5>Listado Maestro de Activos</h5>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID / Tag</th>
              <th>Modelo del Equipo</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Custodio / Usuario</th>
              <th>Ubicación Física</th>
              <th>Observaciones de Falla</th>
              <th>Acciones Operativas</th>
            </tr>
          </thead>
          <tbody>
            {!assets || assets.length === 0 ? ( // Manejo de caso cuando no hay activos filtrados
              <tr>
                <td colSpan="8" className="text-center">
                  No hay activos registrados en el inventario.
                </td>
              </tr>
            ) : (
              assets.map((asset) => {
                // Mapeo flexible de propiedades para soportar ambos esquemas de datos
                const assetId = asset.id_tag || asset.id;
                const modelo = asset.nombre_modelo || asset.modelo || "-";
                const categoria = asset.categoria || "General";
                const estado = asset.estado || "Disponible";
                const usuario =
                  asset.custodio_asignado || asset.usuario || "Sin asignar";
                const ubicacion =
                  asset.ubicacion_fisica ||
                  asset.ubicacion ||
                  "Depósito Central";
                const observaciones = asset.observaciones || "-";

                const isDeBaja =
                  estado === "De Baja" || estado === "Dado de Baja";
                const isEnMantenimiento = estado === "En Mantenimiento";

                return (
                  <tr key={assetId}>
                    <td>
                      <span>{assetId}</span>
                    </td>
                    <td>{modelo}</td>
                    <td>
                      <span>{categoria}</span>
                    </td>
                    <td>
                      <span // Etiqueta de estado con colores dinámicos según el estado del activo
                        className={`badge ${
                          estado === "Disponible"
                            ? "bg-success text-white"
                            : estado === "Asignado"
                              ? "bg-primary text-white"
                              : estado === "En Mantenimiento"
                                ? "bg-warning text-dark"
                                : "bg-danger text-white"
                        }`}
                      >
                        {estado}
                      </span>
                    </td>
                    <td>{usuario}</td>
                    <td>{ubicacion}</td>
                    <td>
                      <small>{observaciones}</small>
                    </td>
                    <td>
                      {isDeBaja ? (
                        <span>Sin acciones</span>
                      ) : (
                        <div className="btn-group" role="group">
                          {/* Botón Asignar */}
                          {estado === "Disponible" && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => assignAsset(asset)}
                            >
                              Asignar
                            </button>
                          )}

                          {/* Botón Devolver */}
                          {estado === "Asignado" && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => returnAsset(asset)}
                            >
                              Devolver
                            </button>
                          )}

                          {/* Botón Reparar / Mantenimiento */}
                          {!isEnMantenimiento && (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() =>
                                changeAssetStatus(assetId, "En Mantenimiento")
                              }
                            >
                              Mantenimiento
                            </button>
                          )}

                          {/* Botón Baja */}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              changeAssetStatus(assetId, "De Baja")
                            }
                          >
                            Dar de Baja
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
