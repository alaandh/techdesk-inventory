// precondicio:
// Recibe la lista inmutable con el historial de eventos: history.
// Postcondicion
// Muestra de manera cronológica en pantalla los movimientos registrados para auditoría de IT.

export function AuditTable({ history }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-secondary text-white">
        <h5 className="mb-0">Registro de Auditoría de Sistemas</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: "300px" }}>
          <table className="table table-sm table-striped mb-0 text-center">
            <thead className="table-light sticky-top">
              <tr>
                <th>ID Movimiento</th>
                <th>ID Activo</th>
                <th>Operación</th>
                <th>Fecha y Hora</th>
                <th>Detalles del Registro</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted py-4">
                    No se han registrado movimientos todavía en la base de datos
                    local.
                  </td>
                </tr>
              ) : (
                history.map((registro) => (
                  <tr key={registro.id}>
                    <td className="text-muted font-monospace">{registro.id}</td>
                    <td>
                      <strong>{registro.activoId}</strong>
                    </td>
                    <td>
                      <span
                        className={`badge bg-${
                          registro.operacion === "Asignación"
                            ? "primary"
                            : registro.operacion === "Devolución"
                              ? "success"
                              : registro.operacion === "En Mantenimiento"
                                ? "warning text-dark"
                                : "danger"
                        }`}
                      >
                        {registro.operacion}
                      </span>
                    </td>
                    <td className="small">{registro.fecha}</td>
                    <td className="text-start ps-3">{registro.detalles}</td>
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
