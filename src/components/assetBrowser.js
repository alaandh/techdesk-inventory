//  PreCondicion:
//  Recibe un estado de búsqueda y su función actualizadora: setSearchTerm.
//  PostCondicion:
//  Captura el evento onChange del input y actualiza el estado superior de forma síncrona.

export function AssetSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Filtrar activos por id, modelo o empleado en tiempo real"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
