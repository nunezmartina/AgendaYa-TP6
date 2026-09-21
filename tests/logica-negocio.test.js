/**
 * AgendaYA — Tests unitarios del módulo M06 (Notificaciones)
 * Tarea C del TP6. Cada bloque `describe` indica, en comentario, qué
 * integrante lo desarrolló (según la distribución del informe) y fue
 * generado/asistido con IA (ver documentación de prompts en el informe).
 */

const {
  esEmailValido,
  generarAsunto,
  calcularEsPorDefecto,
  puedeQuitarPorDefecto,
  construirCuerpoEmail,
  puedeEliminarPlantilla,
  esElegibleParaRecordatorio,
} = require('../src/logica-negocio');

// ============================================================
// Responsable: Nuñez Martina — función: esEmailValido
// (asistido con IA — ver prompt/output en el informe, Tarea C)
// ============================================================
describe('esEmailValido', () => {
  test('caso normal: email con formato correcto retorna true', () => {
    expect(esEmailValido('usuario@dominio.com')).toBe(true);
  });

  test('caso normal: email con subdominio retorna true', () => {
    expect(esEmailValido('maria.garcia@clinica.agendaya.com')).toBe(true);
  });

  test('caso de error: falta el dominio (usuario@) retorna false', () => {
    expect(esEmailValido('usuario@')).toBe(false);
  });

  test('caso de error: falta el @ (usuario.com) retorna false', () => {
    expect(esEmailValido('usuario.com')).toBe(false);
  });

  test('caso borde: string vacío retorna false', () => {
    expect(esEmailValido('')).toBe(false);
  });

  test('caso borde: contiene espacios retorna false', () => {
    expect(esEmailValido('usuario @dominio.com')).toBe(false);
  });
});

// ============================================================
// Responsable: Nuñez Martina — función: generarAsunto
// ============================================================
describe('generarAsunto', () => {
  test('caso normal: asunto de confirmación sigue el patrón exacto', () => {
    expect(generarAsunto('confirmacion', { nombreProfesional: 'Dr. García' }))
      .toBe('Tu reserva con Dr. García está confirmada');
  });

  test('caso normal: asunto de recordatorio sigue el patrón exacto', () => {
    expect(generarAsunto('recordatorio', { nombreProfesional: 'Dr. García' }))
      .toBe('Recordatorio: tu turno con Dr. García es mañana');
  });

  test('caso normal: asunto de notificación al admin por nueva reserva', () => {
    expect(generarAsunto('nueva_reserva_admin', {
      nombreInvitado: 'María Gómez', fecha: '14/05', hora: '10:30',
    })).toBe('Nueva reserva — María Gómez — 14/05 10:30');
  });

  test('caso de error: tipo de notificación inexistente lanza excepción', () => {
    expect(() => generarAsunto('tipo_inventado', {})).toThrow('Tipo de notificación desconocido');
  });

  test('caso de error: faltan datos obligatorios lanza excepción', () => {
    expect(() => generarAsunto('confirmacion', {})).toThrow('Falta nombreProfesional');
  });
});

// ============================================================
// Responsable: Aguiar Josefina — función: calcularEsPorDefecto / puedeQuitarPorDefecto
// (asistido con IA — ver prompt/output en el informe, Tarea C)
// ============================================================
describe('calcularEsPorDefecto', () => {
  test('caso normal: primera plantilla del tipo queda por defecto aunque el tick esté apagado', () => {
    const resultado = calcularEsPorDefecto({ existeOtraPlantillaDelTipo: false, tickActivado: false });
    expect(resultado).toBe(true);
  });

  test('caso normal: nueva plantilla con tick activado desplaza a la anterior', () => {
    const resultado = calcularEsPorDefecto({ existeOtraPlantillaDelTipo: true, tickActivado: true });
    expect(resultado).toBe(true);
  });

  test('caso normal: nueva plantilla sin tick activado queda como alternativa', () => {
    const resultado = calcularEsPorDefecto({ existeOtraPlantillaDelTipo: true, tickActivado: false });
    expect(resultado).toBe(false);
  });

  test('caso borde: al editar, la plantilla que ya era por defecto conserva el estado', () => {
    const resultado = calcularEsPorDefecto({
      existeOtraPlantillaDelTipo: true, tickActivado: true, yaEraPorDefecto: true,
    });
    expect(resultado).toBe(true);
  });
});

describe('puedeQuitarPorDefecto', () => {
  test('caso de error: no se puede quitar el tick si es la única plantilla del tipo', () => {
    expect(puedeQuitarPorDefecto({ esUnicaPlantillaDelTipo: true })).toBe(false);
  });

  test('caso normal: se puede quitar el tick si existe otra plantilla del tipo', () => {
    expect(puedeQuitarPorDefecto({ esUnicaPlantillaDelTipo: false })).toBe(true);
  });
});

// ============================================================
// Responsable: Bataller Paulina — función: construirCuerpoEmail
// (asistido con IA — ver prompt/output en el informe, Tarea C)
// ============================================================
describe('construirCuerpoEmail', () => {
  test('caso normal: reemplaza todas las variables presentes', () => {
    const plantilla = 'Hola {nombre_invitado}, tu turno es el {fecha_turno}.';
    const { cuerpo, variablesFaltantes } = construirCuerpoEmail(plantilla, {
      nombre_invitado: 'María García',
      fecha_turno: 'lunes 23 de junio de 2025',
    });
    expect(cuerpo).toBe('Hola María García, tu turno es el lunes 23 de junio de 2025.');
    expect(variablesFaltantes).toEqual([]);
  });

  test('caso de error: detecta variables faltantes y las deja como placeholder', () => {
    const plantilla = 'Hola {nombre_invitado}, tu turno es el {fecha_turno}.';
    const { cuerpo, variablesFaltantes } = construirCuerpoEmail(plantilla, {
      nombre_invitado: 'María García',
    });
    expect(variablesFaltantes).toEqual(['fecha_turno']);
    expect(cuerpo).toContain('{fecha_turno}');
  });

  test('caso borde: plantilla sin variables retorna el mismo texto', () => {
    const plantilla = 'Este es un texto fijo sin variables.';
    const { cuerpo, tieneVariables } = construirCuerpoEmail(plantilla, {});
    expect(cuerpo).toBe(plantilla);
    expect(tieneVariables).toBe(false);
  });
});

// ============================================================
// Responsable: Santibañez Lucia — función: puedeEliminarPlantilla
// (asistido con IA — ver prompt/output en el informe, Tarea C)
// ============================================================
describe('puedeEliminarPlantilla', () => {
  test('caso de error: bloquea si es la única plantilla del tipo', () => {
    const resultado = puedeEliminarPlantilla({ cantidadPlantillasDelTipo: 1, esPorDefecto: false });
    expect(resultado).toEqual({ permitido: false, motivo: 'UNICA_DEL_TIPO' });
  });

  test('caso de error: bloquea si es la por defecto sin reemplazo designado', () => {
    const resultado = puedeEliminarPlantilla({ cantidadPlantillasDelTipo: 2, esPorDefecto: true });
    expect(resultado).toEqual({ permitido: false, motivo: 'ES_POR_DEFECTO_SIN_REEMPLAZO' });
  });

  test('caso normal: permite eliminar una plantilla alternativa cuando hay más de una', () => {
    const resultado = puedeEliminarPlantilla({ cantidadPlantillasDelTipo: 2, esPorDefecto: false });
    expect(resultado).toEqual({ permitido: true, motivo: null });
  });
});

// ============================================================
// Responsable: Lee Maria Luz — función: esElegibleParaRecordatorio
// (asistido con IA — ver prompt/output en el informe, Tarea C)
// ============================================================
describe('esElegibleParaRecordatorio', () => {
  test('caso normal: turno a más de 24hs de la reserva es elegible', () => {
    const reserva = new Date('2026-06-10T10:00:00');
    const turno = new Date('2026-06-12T10:00:00'); // +48hs
    expect(esElegibleParaRecordatorio(turno, reserva)).toBe(true);
  });

  test('caso de error: turno a menos de 24hs (reserva de último momento) no es elegible', () => {
    const reserva = new Date('2026-06-10T10:00:00');
    const turno = new Date('2026-06-10T20:00:00'); // +10hs
    expect(esElegibleParaRecordatorio(turno, reserva)).toBe(false);
  });

  test('caso borde: turno a exactamente 24hs es elegible (límite inclusivo)', () => {
    const reserva = new Date('2026-06-10T10:00:00');
    const turno = new Date('2026-06-11T10:00:00'); // +24hs exactas
    expect(esElegibleParaRecordatorio(turno, reserva)).toBe(true);
  });

  test('caso de error: fecha inválida lanza excepción', () => {
    expect(() => esElegibleParaRecordatorio('fecha-invalida', new Date())).toThrow('Fecha inválida');
  });
});
