/**
 * AgendaYA — Tests unitarios del módulo M06 (Notificaciones)
 * Tarea C del TP6. 40 tests en total: cada uno de los 8 integrantes del
 * equipo desarrolló 5 tests, cubriendo al menos 2 funciones/comportamientos
 * distintos con casos normales, límite/borde y de error, según exige la
 * sección 7.1 de la consigna. Asistidos con IA (ver prompts documentados
 * en el informe, sección Tarea C).
 */

const {
  esEmailValido,
  generarAsunto,
  calcularEsPorDefecto,
  puedeQuitarPorDefecto,
  construirCuerpoEmail,
  puedeEliminarPlantilla,
  esElegibleParaRecordatorio,
  validarCamposPlantilla,
  enmascararEmail,
} = require('../src/logica-negocio');

// ============================================================================
// Responsable: Nuñez Martina
// Funciones: esEmailValido (3 tests) + generarAsunto (2 tests)
// ============================================================================
describe('Nuñez Martina — esEmailValido y generarAsunto', () => {
  test('[esEmailValido] caso normal: email con formato correcto retorna true', () => {
    expect(esEmailValido('usuario@dominio.com')).toBe(true);
  });

  test('[esEmailValido] caso de error: falta el dominio (usuario@) retorna false', () => {
    expect(esEmailValido('usuario@')).toBe(false);
  });

  test('[esEmailValido] caso borde: string vacío retorna false', () => {
    expect(esEmailValido('')).toBe(false);
  });

  test('[generarAsunto] caso normal: asunto de confirmación sigue el patrón exacto', () => {
    expect(generarAsunto('confirmacion', { nombreProfesional: 'Dr. García' }))
      .toBe('Tu reserva con Dr. García está confirmada');
  });

  test('[generarAsunto] caso normal: asunto de recordatorio sigue el patrón exacto', () => {
    expect(generarAsunto('recordatorio', { nombreProfesional: 'Dr. García' }))
      .toBe('Recordatorio: tu turno con Dr. García es mañana');
  });
});
// ============================================================================
// Responsable: Aguiar Josefina
// Funciones: calcularEsPorDefecto (3 tests) + puedeQuitarPorDefecto (2 tests)
// ============================================================================
describe('Aguiar Josefina — calcularEsPorDefecto y puedeQuitarPorDefecto', () => {
  test('[calcularEsPorDefecto] caso normal: primera plantilla del tipo queda por defecto aunque el tick esté apagado', () => {
    expect(calcularEsPorDefecto({ existeOtraPlantillaDelTipo: false, tickActivado: false })).toBe(true);
  });

  test('[calcularEsPorDefecto] caso normal: nueva plantilla con tick activado desplaza a la anterior', () => {
    expect(calcularEsPorDefecto({ existeOtraPlantillaDelTipo: true, tickActivado: true })).toBe(true);
  });

  test('[calcularEsPorDefecto] caso normal: nueva plantilla sin tick activado queda como alternativa', () => {
    expect(calcularEsPorDefecto({ existeOtraPlantillaDelTipo: true, tickActivado: false })).toBe(false);
  });

  test('[puedeQuitarPorDefecto] caso de error: no se puede quitar el tick si es la única plantilla del tipo', () => {
    expect(puedeQuitarPorDefecto({ esUnicaPlantillaDelTipo: true })).toBe(false);
  });

  test('[puedeQuitarPorDefecto] caso normal: se puede quitar el tick si existe otra plantilla del tipo', () => {
    expect(puedeQuitarPorDefecto({ esUnicaPlantillaDelTipo: false })).toBe(true);
  });
});

// ============================================================================
// Responsable: Tejada Rocío
// Funciones: validarCamposPlantilla (3 tests) + calcularEsPorDefecto (2 tests)
// ============================================================================
describe('Tejada Rocío — validarCamposPlantilla y calcularEsPorDefecto', () => {
  test('[validarCamposPlantilla] caso borde: un campo con solo espacios en blanco cuenta como vacío', () => {
    const resultado = validarCamposPlantilla({
      nombre: 'Plantilla X', asunto: 'Asunto', saludo: '   ', cuerpo: 'Cuerpo', firma: 'Firma',
    });
    expect(resultado.valido).toBe(false);
    expect(resultado.camposFaltantes).toEqual(['saludo']);
  });

  test('[validarCamposPlantilla] caso de error: objeto de campos vacío marca los 5 campos como faltantes', () => {
    const resultado = validarCamposPlantilla({});
    expect(resultado.valido).toBe(false);
    expect(resultado.camposFaltantes).toHaveLength(5);
  });

  test('[validarCamposPlantilla] caso normal: no marca como faltante un campo con contenido real', () => {
    const resultado = validarCamposPlantilla({
      nombre: 'X', asunto: 'Y', saludo: 'Z', cuerpo: 'Contenido válido', firma: 'F',
    });
    expect(resultado.camposFaltantes).not.toContain('cuerpo');
  });

  test('[calcularEsPorDefecto] caso borde: al editar sin tick activado, deja de calcularse como por defecto', () => {
    // Nota: el bloqueo real de "no permitir quitar el tick" se valida aparte
    // con puedeQuitarPorDefecto; esta función solo calcula el resultado pedido.
    const resultado = calcularEsPorDefecto({
      existeOtraPlantillaDelTipo: true, tickActivado: false, yaEraPorDefecto: true,
    });
    expect(resultado).toBe(false);
  });

  test('[calcularEsPorDefecto] caso borde: primera plantilla del tipo con tick ya activado también da por defecto', () => {
    const resultado = calcularEsPorDefecto({
      existeOtraPlantillaDelTipo: false, tickActivado: true, yaEraPorDefecto: false,
    });
    expect(resultado).toBe(true);
  });
});

// ============================================================================
// Responsable: Perez Juliana
// Funciones: generarAsunto (3 tests) + validarCamposPlantilla (2 tests)
// ============================================================================
describe('Perez Juliana — generarAsunto y validarCamposPlantilla', () => {
  test('[generarAsunto] caso normal: asunto de notificación al admin por nueva reserva', () => {
    expect(generarAsunto('nueva_reserva_admin', {
      nombreInvitado: 'María Gómez', fecha: '14/05', hora: '10:30',
    })).toBe('Nueva reserva — María Gómez — 14/05 10:30');
  });

  test('[generarAsunto] caso normal: asunto de cancelación al admin', () => {
    expect(generarAsunto('cancelacion_admin', {
      nombreInvitado: 'Juan Pérez', fecha: '12/05', hora: '15:00',
    })).toBe('Cancelación — Juan Pérez — 12/05 15:00');
  });

  test('[generarAsunto] caso de error: tipo de notificación inexistente lanza excepción', () => {
    expect(() => generarAsunto('tipo_inventado', {})).toThrow('Tipo de notificación desconocido');
  });

  test('[validarCamposPlantilla] caso normal: todos los campos completos es válido', () => {
    const resultado = validarCamposPlantilla({
      nombre: 'Confirmación formal', asunto: 'Asunto', saludo: 'Hola', cuerpo: 'Cuerpo', firma: 'Firma',
    });
    expect(resultado).toEqual({ valido: true, camposFaltantes: [] });
  });

  test('[validarCamposPlantilla] caso de error: detecta varios campos faltantes a la vez', () => {
    const resultado = validarCamposPlantilla({ nombre: 'Recordatorio', asunto: '', saludo: undefined, cuerpo: 'Texto', firma: '' });
    expect(resultado.valido).toBe(false);
    expect(resultado.camposFaltantes).toEqual(expect.arrayContaining(['asunto', 'saludo', 'firma']));
  });
});
