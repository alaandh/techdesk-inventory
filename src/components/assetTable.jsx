// PreCondicion:
//  Recibe un arreglo con la lista de activos filtrados: assets y las funciones del CRUD.

// PostCondicion:
//  Renderiza la tabla de inventario con diseño responsivo o adaptativo.
//  Expone o bloquea dinámicamente los botones de control según el estado actual en el ciclo de vida del activo.

export function AssetTable({
  assets,
  assignAsset,
  returnAsset,
  changeAssetStatus,
}) {
  return (
    <div className="card shadow-sm mb-5">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Listado Maestro de Activos</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID / Tag</th>
                <th>Modelo del Equipo</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Custodio / Usuario</th>
                <th>Ubicación Física</th>
                <th>Observaciones de Falla</th>
                <th className="text-center">Acciones Operativas</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-muted text-center py-4">
                    No hay activos registrados en el inventario.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <span className="badge bg-light text-dark border font-monospace">
                        {asset.id}
                      </span>
                    </td>
                    <td className="fw-semibold">{asset.modelo}</td>
                    <td>{asset.categoria}</td>
                    <td>
                      <span
                        className={`badge w-100 p-2 bg-${
                          asset.estado === "Disponible"
                            ? "success"
                            : asset.estado === "Asignado"
                              ? "primary"
                              : asset.estado === "En Mantenimiento"
                                ? "warning text-dark"
                                : "danger"
                        }`}
                      >
                        {asset.estado}
                      </span>
                    </td>
                    <td>
                      {asset.usuario || (
                        <em className="text-muted">Ninguno (En Depósito)</em>
                      )}
                    </td>
                    <td>{asset.ubicacion}</td>
                    <td>
                      <small className="text-danger fw-medium">
                        {asset.observaciones || "-"}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-1">
                        {/* ASIGNAR Y ENTREGA precondicion: Disponible */}
                        {asset.estado === "Disponible" && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => assignAsset(asset.id)}
                          >
                            Asignar
                          </button>
                        )}

                        {/* DEVOLUCIÓN precondicion: Asignado */}
                        {asset.estado === "Asignado" && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => returnAsset(asset.id)}
                          >
                            Devolver
                          </button>
                        )}

                        {/* MANTENIMIENTO Y BAJA Precondición: No estar de Baja*/}
                        {asset.estado !== "De Baja" && (
                          <>
                            {asset.estado !== "En Mantenimiento" && (
                              <button
                                className="btn btn-sm btn-outline-warning text-dark"
                                onClick={() =>
                                  changeAssetStatus(
                                    asset.id,
                                    "En Mantenimiento",
                                  )
                                }
                              >
                                Reparar
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                changeAssetStatus(asset.id, "De Baja")
                              }
                            >
                              Baja
                            </button>
                          </>
                        )}

                        {asset.estado === "De Baja" && (
                          <span className="text-muted small">Sin acciones</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
